import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import Animated, { FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useAuth } from "../../hooks/useAuth";
import { usePlayer } from "../../contexts/PlayerContext";
import { askPodcast, transcribeVoice, generateSpeech } from "../../services/ai";
import PremiumBackground from "../../components/PremiumBackground";

const { height } = Dimensions.get("window");

export default function ChatScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { currentEpisode } = usePlayer();

  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation for pulse ring when AI is speaking or listening
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (isAiThinking || isPlayingAudio || recording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1);
    }
  }, [isAiThinking, isPlayingAudio, recording]);

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentEpisode || !session?.user) return;
    setMessages(prev => [...prev, { role: "user", text }]);
    setInputText("");
    setIsAiThinking(true);

    try {
      const answer = await askPodcast(text, currentEpisode.id, session.user.id);
      setMessages(prev => [...prev, { role: "ai", text: answer }]);
      // ALWAYS speak the response as requested
      await playAiSpeech(answer);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't process that. Try again." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const playAiSpeech = async (text: string) => {
    try {
      const base64Audio = await generateSpeech(text);
      const { sound } = await Audio.Sound.createAsync({ uri: base64Audio });
      setIsPlayingAudio(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          setIsPlayingAudio(false);
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.log("TTS Error:", e);
      setIsPlayingAudio(false);
    }
  };

  const toggleRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        if (uri) {
          setIsAiThinking(true);
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

  return (
    <View style={{ flex: 1, backgroundColor: "#09090b" }}>
      <PremiumBackground />
      
      {/* Header */}
      <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", fontFamily: "Raleway_700Bold" }}>Podex AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          style={{ flex: 1, paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        >
          {messages.length === 0 && (
            <Animated.View entering={FadeInUp} style={{ alignItems: "center", marginTop: height * 0.1 }}>
              <Text style={{ color: "#a1a1aa", fontSize: 16, fontFamily: "Raleway_400Regular", textAlign: "center" }}>
                Ask anything about{'\n'}
                <Text style={{ color: "white", fontWeight: "bold", marginTop: 10 }}>{currentEpisode?.title}</Text>
              </Text>
            </Animated.View>
          )}

          {messages.map((m, i) => (
            <Animated.View 
              entering={FadeInDown.delay(100)} 
              key={i} 
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: m.role === "user" ? "#8b5cf6" : "rgba(39, 39, 42, 0.8)",
                padding: 15,
                borderRadius: 20,
                borderBottomRightRadius: m.role === "user" ? 5 : 20,
                borderBottomLeftRadius: m.role === "user" ? 20 : 5,
                marginBottom: 15,
                maxWidth: "85%"
              }}
            >
              <Text style={{ color: "white", fontSize: 15, lineHeight: 22, fontFamily: "Raleway_400Regular" }}>{m.text}</Text>
            </Animated.View>
          ))}

          {isAiThinking && (
            <Animated.View entering={FadeInDown} style={{ alignSelf: "flex-start", backgroundColor: "rgba(39, 39, 42, 0.8)", padding: 15, borderRadius: 20, marginBottom: 15 }}>
              <Text style={{ color: "#a1a1aa" }}>Thinking...</Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Live Voice Orb & Input */}
        <View style={{ padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(9, 9, 11, 0.9)" }}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Animated.View style={[
              {
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: recording ? "#ef4444" : isPlayingAudio ? "#10b981" : "#8b5cf6",
                justifyContent: "center", alignItems: "center",
                shadowColor: recording ? "#ef4444" : isPlayingAudio ? "#10b981" : "#8b5cf6",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 20,
                elevation: 10
              },
              animatedPulse
            ]}>
              <TouchableOpacity onPress={toggleRecording} style={{ width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 32 }}>{recording ? "⏹" : isPlayingAudio ? "🔊" : "🎤"}</Text>
              </TouchableOpacity>
            </Animated.View>
            <Text style={{ color: "#a1a1aa", marginTop: 15, fontSize: 12, fontFamily: "Raleway_400Regular", letterSpacing: 1 }}>
              {recording ? "LISTENING..." : isPlayingAudio ? "SPEAKING..." : "TAP TO TALK"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput 
              style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", color: "white", borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, fontFamily: "Raleway_400Regular" }}
              placeholder="Or type your question..."
              placeholderTextColor="#71717a"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => sendMessage(inputText)}
            />
            <TouchableOpacity onPress={() => sendMessage(inputText)} style={{ backgroundColor: "#8b5cf6", padding: 12, borderRadius: 25, marginLeft: 10 }}>
              <Text style={{ fontSize: 16 }}>↗️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
