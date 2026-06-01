import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  interpolateColor,
  Easing,
  cancelAnimation
} from "react-native-reanimated";
import { Mic, Square, X } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import { usePlayer } from "../../contexts/PlayerContext";
import { askPodcast, transcribeVoice, generateSpeech } from "../../services/ai";
import PremiumBackground from "../../components/PremiumBackground";

const { width, height } = Dimensions.get("window");

type VoiceMode = "idle" | "listening" | "processing" | "speaking";

export default function ChatScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { currentEpisode, pausePlayback, isPlaying } = usePlayer();

  const [mode, setMode] = useState<VoiceMode>("idle");
  const [statusLine, setStatusLine] = useState("");
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Auto-pause podcast when entering AI mode
  useEffect(() => {
    if (isPlaying) {
      pausePlayback();
    }
  }, []);

  // Animation shared values
  const orbScale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  // Drive orb animations based on mode
  useEffect(() => {
    cancelAnimation(orbScale);

    switch (mode) {
      case "idle":
        colorProgress.value = withTiming(0, { duration: 400 });
        orbScale.value = withRepeat(
          withSequence(
            withTiming(1.04, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
          ),
          -1, true
        );
        break;
      case "listening":
        colorProgress.value = withTiming(1, { duration: 250 });
        orbScale.value = withRepeat(
          withSequence(
            withTiming(1.15, { duration: 500 }),
            withTiming(1.05, { duration: 500 }),
            withTiming(1.2, { duration: 400 }),
            withTiming(1.08, { duration: 400 })
          ),
          -1, true
        );
        break;
      case "processing":
        colorProgress.value = withTiming(2, { duration: 400 });
        orbScale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 800 }),
            withTiming(0.92, { duration: 800 })
          ),
          -1, true
        );
        break;
      case "speaking":
        colorProgress.value = withTiming(3, { duration: 400 });
        orbScale.value = withRepeat(
          withSequence(
            withTiming(1.25, { duration: 350 }),
            withTiming(1.1, { duration: 250 }),
            withTiming(1.3, { duration: 400 }),
            withTiming(1.05, { duration: 300 })
          ),
          -1, true
        );
        break;
    }
  }, [mode]);

  const animatedOrbStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3],
      [
        "rgba(255, 255, 255, 0.08)",
        "rgba(239, 68, 68, 0.85)",
        "rgba(139, 92, 246, 0.85)",
        "rgba(16, 185, 129, 0.85)",
      ]
    );
    return {
      transform: [{ scale: orbScale.value }],
      backgroundColor,
    };
  });

  // ── Core flow: stop recording → transcribe → ask AI → speak ──
  const processRecording = useCallback(async () => {
    const rec = recordingRef.current;
    if (!rec) {
      setStatusLine("No active recording found.");
      setMode("idle");
      return;
    }

    try {
      setStatusLine("Processing audio...");
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;

      if (!uri) {
        setStatusLine("No audio was captured. Try again.");
        setMode("idle");
        return;
      }

      if (!currentEpisode) {
        setStatusLine("No episode loaded. Play a podcast first.");
        setMode("idle");
        return;
      }

      if (!session?.user) {
        setStatusLine("Not logged in.");
        setMode("idle");
        return;
      }

      // Step 1: Transcribe
      setMode("processing");
      setStatusLine("Transcribing your voice...");
      const textQuery = await transcribeVoice(uri);

      if (!textQuery || textQuery.trim() === "") {
        setStatusLine("Couldn't hear anything. Tap to try again.");
        setMode("idle");
        return;
      }

      setStatusLine(`"${textQuery}"`);

      // Step 2: Ask AI
      setStatusLine("Asking Podex AI...");
      const answer = await askPodcast(textQuery, currentEpisode.id, session.user.id);

      // Step 3: Speak the response
      await playAiSpeech(answer);

    } catch (e: any) {
      console.error("Voice flow error:", e);
      setStatusLine(`Error: ${e.message || "Unknown error"}`);
      setMode("idle");
    }
  }, [currentEpisode, session]);

  const playAiSpeech = async (text: string) => {
    try {
      // Switch audio mode from recording → playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const base64Audio = await generateSpeech(text);
      const { sound } = await Audio.Sound.createAsync({ uri: base64Audio });
      soundRef.current = sound;

      await sound.playAsync();

      let speakingStarted = false;
      return new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.isPlaying && !speakingStarted) {
            speakingStarted = true;
            setMode("speaking");
            setStatusLine("Speaking...");
          }
          if (status.didJustFinish) {
            setStatusLine("Tap to speak again.");
            setMode("idle");
            sound.unloadAsync();
            soundRef.current = null;
            resolve();
          }
        });
      });
    } catch (e: any) {
      console.error("TTS Error:", e);
      setStatusLine(`Speech error: ${e.message}`);
      setMode("idle");
    }
  };

  // ── Tap handler ──
  const handleMicPress = async () => {
    if (mode === "listening") {
      // STOP and process
      processRecording();
      return;
    }

    if (!currentEpisode) {
      Alert.alert("No Episode", "Go back, play a podcast episode, then tap Talk to AI from the player.");
      return;
    }

    // START recording
    try {
      setStatusLine("Starting mic...");
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Denied", "Microphone access is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = newRecording;
      setMode("listening");
      setStatusLine("Listening — tap when done.");

    } catch (err: any) {
      console.error("Mic start error:", err);
      setStatusLine(`Mic error: ${err.message}`);
      setMode("idle");
    }
  };

  const isBusy = mode === "processing" || mode === "speaking";

  const getStatusLabel = () => {
    switch (mode) {
      case "idle": return "Tap to speak";
      case "listening": return "Listening — tap to send";
      case "processing": return "Thinking...";
      case "speaking": return "Speaking...";
    }
  };

  // No episode guard — show helpful message
  if (!currentEpisode) {
    return (
      <View style={styles.container}>
        <PremiumBackground />
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Podex AI</Text>
          <TouchableOpacity 
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/user/dashboard" as any);
            }} 
            style={styles.closeButton}
          >
            <X color="#fff" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerStage}>
          <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: "#71717a", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#71717a", fontSize: 28, fontWeight: "bold" }}>!</Text>
          </View>
          <Text style={styles.noEpisodeTitle}>No Episode Selected</Text>
          <Text style={styles.noEpisodeDesc}>
            Play a podcast episode first, then tap{"\n"}"Talk to AI" from the player screen.
          </Text>
          <TouchableOpacity 
            style={styles.goBackBtn}
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/user/dashboard" as any);
            }}
          >
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PremiumBackground />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Podex AI</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{currentEpisode.title}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/user/dashboard" as any);
          }} 
          style={styles.closeButton}
        >
          <X color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Center Orb */}
      <View style={styles.centerStage}>
        <Animated.View style={[styles.orb, animatedOrbStyle]} />
        {statusLine ? (
          <Text style={styles.statusDetail}>{statusLine}</Text>
        ) : null}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.statusText}>{getStatusLabel()}</Text>
        
        <TouchableOpacity 
          style={[
            styles.micButton, 
            isBusy && styles.micButtonDisabled,
            mode === "listening" && styles.micButtonActive,
          ]} 
          onPress={handleMicPress}
          disabled={isBusy}
          activeOpacity={0.7}
        >
          {mode === "listening" ? (
            <Square color="#fff" size={28} fill="#fff" />
          ) : (
            <Mic color={isBusy ? "rgba(255,255,255,0.3)" : "#fff"} size={32} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  headerSpacer: {
    width: 44,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
  },
  headerSub: {
    color: "#71717a",
    fontSize: 11,
    fontFamily: "Raleway_400Regular",
    marginTop: 2,
    maxWidth: 200,
    textAlign: "center",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  centerStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orb: {
    width: 160,
    height: 160,
    borderRadius: 80,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  statusDetail: {
    color: "#71717a",
    fontSize: 13,
    fontFamily: "Raleway_400Regular",
    marginTop: 30,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 60,
    zIndex: 10,
  },
  statusText: {
    color: "#a1a1aa",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
    letterSpacing: 1,
    marginBottom: 30,
    textTransform: "uppercase",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  micButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.05)",
  },
  micButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
    borderColor: "rgba(239, 68, 68, 0.6)",
  },
  noEpisodeTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    marginTop: 20,
  },
  noEpisodeDesc: {
    color: "#71717a",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 40,
  },
  goBackBtn: {
    marginTop: 30,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
  },
  goBackText: {
    color: "#a855f7",
    fontFamily: "Raleway_700Bold",
    fontSize: 14,
  },
});
