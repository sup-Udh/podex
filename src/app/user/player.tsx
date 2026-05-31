import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  PanResponder,
  TextInput,
} from "react-native";
import { Audio } from "expo-av";
import { askPodcast, transcribeVoice, generateSpeech } from "../../services/ai";
import { useAuth } from "../../hooks/useAuth";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { usePlayer } from "../../contexts/PlayerContext";

const { width } = Dimensions.get("window");

import { styles } from "../../styles/playerStyles";

const formatTime = (millis: number) => {
  if (!millis) return "0:00";
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function PlayerScreen() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const { currentEpisode, isPlaying, positionMillis, durationMillis, togglePlayPause, seekForward, seekBackward, seekTo, transcriptStatus, transcriptText } = usePlayer();

  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<"transcript" | "chat">("transcript");
  const [chatMessages, setChatMessages] = useState<{ role: "user"|"ai", text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentEpisode || !session?.user) return;
    setChatMessages(prev => [...prev, { role: "user", text }]);
    setInputText("");
    setIsAiTyping(true);

    try {
      const answer = await askPodcast(text, currentEpisode.id, session.user.id);
      setChatMessages(prev => [...prev, { role: "ai", text: answer }]);

      if (isVoiceMode) {
         playAiSpeech(answer);
      }
    } catch (e) {
       setChatMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't process that right now." }]);
    } finally {
      setIsAiTyping(false);
      setIsVoiceMode(false);
    }
  };

  const playAiSpeech = async (text: string) => {
     try {
       const base64Audio = await generateSpeech(text);
       const { sound: ttsSound } = await Audio.Sound.createAsync({ uri: base64Audio });
       setIsPlayingAudio(true);
       await ttsSound.playAsync();
       ttsSound.setOnPlaybackStatusUpdate((status: any) => {
         if (status.didJustFinish) {
            setIsPlayingAudio(false);
            ttsSound.unloadAsync();
         }
       });
     } catch(e) {
       console.log("TTS Error:", e);
     }
  };

  const toggleRecording = async () => {
    try {
      if (recording) {
        setIsVoiceMode(true);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        if (uri) {
          setIsAiTyping(true);
          const transcript = await transcribeVoice(uri);
          sendMessage(transcript);
        }
      } else {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubMillis, setScrubMillis] = useState(0);

  const stateRef = React.useRef({ sliderWidth: 0, durationMillis: 0 });
  stateRef.current.durationMillis = durationMillis;
  
  const initialMillisRef = React.useRef(0);
  const seekToRef = React.useRef(seekTo);
  seekToRef.current = seekTo;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsScrubbing(true);
        const { sliderWidth, durationMillis } = stateRef.current;
        if (sliderWidth > 0 && durationMillis > 0) {
          const tapX = evt.nativeEvent.locationX;
          const initialPercentage = Math.max(0, Math.min(1, tapX / sliderWidth));
          const newMillis = initialPercentage * durationMillis;
          setScrubMillis(newMillis);
          initialMillisRef.current = newMillis;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const { sliderWidth, durationMillis } = stateRef.current;
        if (sliderWidth > 0 && durationMillis > 0) {
          const millisChange = (gestureState.dx / sliderWidth) * durationMillis;
          setScrubMillis(Math.max(0, Math.min(durationMillis, initialMillisRef.current + millisChange)));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsScrubbing(false);
        const { sliderWidth, durationMillis } = stateRef.current;
        if (sliderWidth > 0 && durationMillis > 0) {
          const millisChange = (gestureState.dx / sliderWidth) * durationMillis;
          const finalMillis = Math.max(0, Math.min(durationMillis, initialMillisRef.current + millisChange));
          seekToRef.current(finalMillis);
        }
      },
      onPanResponderTerminate: () => setIsScrubbing(false),
    })
  ).current;

  const displayMillis = isScrubbing ? scrubMillis : positionMillis;
  const progressPercent = durationMillis > 0 ? (displayMillis / durationMillis) * 100 : 0;
  const remainingMillis = Math.max(durationMillis - displayMillis, 0);

  // Pulse animation for the "AI is Listening" indicator
  const pulseAnim = useSharedValue(0.4);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.4, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const pulsingStyle = useAnimatedStyle(() => ({
    opacity: pulseAnim.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#050014", "#0a0020", "#000000"]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 0.8, 1]}
      />

      <View style={styles.noiseOverlay} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Text style={styles.iconText}>˅</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow} />
          <Text style={styles.logoText}>P</Text>
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={() => setIsMenuVisible(true)}>
          <Text style={styles.iconText}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Media & Metadata */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.mediaContainer}>
          <View style={styles.artworkWrapper}>
            {/* Artwork Glow */}
            <View style={styles.artworkGlow} />
            <Image
              source={{ uri: currentEpisode?.imageUrl || "https://via.placeholder.com/600x600/1a1a1a/8b5cf6?text=Podex" }}
              style={styles.artwork}
              contentFit="cover"
            />
          </View>

          <View style={styles.metadata}>
            <Text style={styles.episodeTitle} numberOfLines={2}>
              {currentEpisode?.title || "No episode selected"}
            </Text>
            <Text style={styles.hostName}>{currentEpisode?.podcastName || "Library"}</Text>
          </View>

          {/* Audio Controls */}
          <View style={styles.progressContainer}>
            <View 
              style={{ width: "100%", height: 30, justifyContent: "center" }}
              onLayout={(e) => { stateRef.current.sliderWidth = e.nativeEvent.layout.width; }}
              {...panResponder.panHandlers}
            >
              <View style={styles.progressBarBg} pointerEvents="none">
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                <View style={[styles.progressThumb, { left: `${progressPercent}%`, position: "absolute", marginLeft: -6 }]} />
              </View>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(displayMillis)}</Text>
              <Text style={styles.timeText}>-{formatTime(remainingMillis)}</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton} onPress={seekBackward}>
              <Text style={styles.controlIconSmall}>15↺</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8} onPress={togglePlayPause}>
              <LinearGradient colors={["#8b5cf6", "#6d28d9"]} style={StyleSheet.absoluteFill} />
              <Text style={styles.playIcon}>{isPlaying ? "||" : "▶"}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={seekForward}>
              <Text style={styles.controlIconSmall}>↻15</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Live AI Engine Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.aiSection}>
          <View style={[styles.aiHeader, { justifyContent: "space-between", paddingRight: 15 }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Animated.View style={[styles.pulseDot, pulsingStyle, { backgroundColor: transcriptStatus === "completed" ? "#10b981" : transcriptStatus === "error" ? "#ef4444" : "#8b5cf6" }]} />
              <Text style={styles.aiHeaderText}>
                {transcriptStatus === "completed" ? "TRANSCRIPTION COMPLETE" : transcriptStatus === "error" ? "TRANSCRIPTION FAILED" : "PODEX AI IS TRANSCRIBING"}
              </Text>
            </View>
            {transcriptStatus === "completed" && (
              <View style={{ flexDirection: "row", gap: 15 }}>
                <TouchableOpacity onPress={() => setActiveTab("transcript")}>
                  <Text style={{ color: activeTab === "transcript" ? "#a855f7" : "#71717a", fontWeight: "bold", fontSize: 12 }}>TRANSCRIPT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("chat")}>
                  <Text style={{ color: activeTab === "chat" ? "#a855f7" : "#71717a", fontWeight: "bold", fontSize: 12 }}>CHAT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.liveFeedContainer}>
            {activeTab === "transcript" ? (
              <>
                {transcriptStatus === "processing" && (
                  <View style={styles.logItem}>
                     <Text style={styles.logText}>
                        <Text style={styles.logTimestamp}>[{formatTime(displayMillis)}]</Text> <Text style={styles.logTypeInfo}>[PROCESSING]</Text> Audio is currently being transcribed in the background...
                     </Text>
                  </View>
                )}
                
                {transcriptStatus === "completed" && transcriptText && (
                   <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
                     <Text style={{ color: "#e4e4e7", fontSize: 14, lineHeight: 22, fontFamily: "Raleway_400Regular" }}>
                       {transcriptText}
                     </Text>
                   </ScrollView>
                )}

                {transcriptStatus === "error" && (
                  <View style={styles.logItem}>
                     <Text style={styles.logText}>
                        <Text style={styles.logType}>[ERROR]</Text> Failed to transcribe audio or file size exceeded.
                     </Text>
                  </View>
                )}

                {transcriptStatus === "idle" && (
                  <View style={styles.logItem}>
                     <Text style={styles.logText}>
                        <Text style={styles.logTypeInfo}>[IDLE]</Text> Preparing AI pipeline...
                     </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={{ flex: 1 }}>
                <ScrollView style={{ maxHeight: 250, marginBottom: 10 }}>
                  {chatMessages.length === 0 && (
                    <Text style={{ color: "#71717a", textAlign: "center", marginTop: 20 }}>Ask me anything about this episode!</Text>
                  )}
                  {chatMessages.map((m, i) => (
                    <View key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", backgroundColor: m.role === "user" ? "#8b5cf6" : "#27272a", padding: 10, borderRadius: 10, marginBottom: 10, maxWidth: "85%" }}>
                      <Text style={{ color: "white", fontSize: 13, lineHeight: 18 }}>{m.text}</Text>
                    </View>
                  ))}
                  {isAiTyping && <Text style={{ color: "#a1a1aa", fontSize: 12, marginTop: 5 }}>Podex AI is thinking...</Text>}
                </ScrollView>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput 
                     style={{ flex: 1, backgroundColor: "#27272a", color: "white", borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 14 }}
                     placeholder="Ask about the podcast..."
                     placeholderTextColor="#71717a"
                     value={inputText}
                     onChangeText={setInputText}
                     onSubmitEditing={() => sendMessage(inputText)}
                  />
                  <TouchableOpacity onPress={toggleRecording} style={{ backgroundColor: recording ? "#ef4444" : "#27272a", padding: 12, borderRadius: 20 }}>
                     <Text style={{ fontSize: 16 }}>{recording ? "⏹" : "🎤"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => sendMessage(inputText)} style={{ backgroundColor: "#8b5cf6", padding: 12, borderRadius: 20, marginLeft: 10 }}>
                     <Text style={{ fontSize: 16 }}>↗️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

      </ScrollView>

      {/* Options Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <Text style={styles.menuTitle}>Options</Text>
                
                <TouchableOpacity style={styles.menuItem} onPress={() => setIsMenuVisible(false)}>
                  <Text style={styles.menuIcon}>⚠️</Text>
                  <Text style={styles.menuItemText}>Report Issue</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity style={styles.menuItem} onPress={() => setIsMenuVisible(false)}>
                  <Text style={styles.menuIcon}>📝</Text>
                  <Text style={styles.menuItemText}>View Full Transcript</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity style={styles.menuItem} onPress={() => setIsMenuVisible(false)}>
                  <Text style={styles.menuIcon}>📥</Text>
                  <Text style={styles.menuItemText}>Add to Knowledge Queue</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity style={styles.menuItem} onPress={() => setIsMenuVisible(false)}>
                  <Text style={styles.menuIcon}>📤</Text>
                  <Text style={styles.menuItemText}>Share Snippet</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
