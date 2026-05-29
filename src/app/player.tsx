import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, withRepeat, withSequence, withTiming, useSharedValue, useAnimatedStyle, Easing } from "react-native-reanimated";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function PlayerScreen() {
  const router = useRouter();
  
  // AI Pulse Animation
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseScale.value === 1.5 ? 0.3 : 1
  }));

  // Dummy Podcast Data
  const podcast = {
    title: "Optimizing Sleep & Performance",
    artist: "Huberman Lab",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/95/92/76/959276d4-871d-f8ec-4519-7098e94a5e2a/mza_10332822181755100010.jpg/600x600bb.jpg",
  };

  return (
    <View style={styles.container}>
      {/* Background Artifact Blur */}
      <View style={StyleSheet.absoluteFill}>
        <Image source={{ uri: podcast.artwork }} style={StyleSheet.absoluteFill} blurRadius={100} />
        <View style={styles.blackOverlay} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Text style={styles.iconText}>˅</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow} />
          <Text style={styles.logoText}>P</Text>
        </View>
        
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Artwork */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.artworkContainer}>
        <Image source={{ uri: podcast.artwork }} style={styles.artwork} />
      </Animated.View>

      {/* Info & AI Engine */}
      <View style={styles.bottomSection}>
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{podcast.title}</Text>
              <Text style={styles.artist} numberOfLines={1}>{podcast.artist}</Text>
            </View>
            <TouchableOpacity style={styles.plusButton}>
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Live AI Engine */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.aiEngineContainer}>
          <BlurView intensity={30} tint="dark" style={styles.aiEngineBlur}>
            <View style={styles.aiHeaderRow}>
              <View style={styles.pulseDotContainer}>
                <Animated.View style={[styles.pulseDotOuter, pulseStyle]} />
                <View style={styles.pulseDotInner} />
              </View>
              <Text style={styles.aiStatusText}>Live Extraction Active</Text>
            </View>
            
            <View style={styles.tickerContainer}>
               <Text style={styles.tickerPrefix}>Extracted:</Text>
               <Text style={styles.tickerContent} numberOfLines={1}>Tongkat Ali (400mg) for testosterone support.</Text>
            </View>
          </BlurView>
        </Animated.View>

        {/* Scrubber */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.scrubberContainer}>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <View style={styles.playhead} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>14:32</Text>
            <Text style={styles.timeText}>-1:20:41</Text>
          </View>
        </Animated.View>

        {/* Controls */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.controlsRow}>
          <TouchableOpacity>
            <Text style={styles.controlSecondaryIcon}>1x</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.controlIcon}>↺</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
            <LinearGradient colors={["#fff", "#e0e0e0"]} style={StyleSheet.absoluteFill} />
            <Text style={styles.playIcon}>||</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.controlIcon}>↻</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.controlSecondaryIcon}>☾</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  blackOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.8)" },
  
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  iconButton: { width: 44, height: 44, justifyContent: "center", alignItems: "center" },
  iconText: { color: "#fff", fontSize: 24, fontFamily: "Raleway_400Regular" },
  
  logoContainer: { alignItems: "center", justifyContent: "center", width: 40, height: 40 },
  logoGlow: { position: "absolute", width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(139, 92, 246, 0.5)", shadowColor: "#8b5cf6", shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  logoText: { color: "#fff", fontSize: 22, fontFamily: "Raleway_700Bold", zIndex: 1 },

  artworkContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  artwork: { width: width - 64, aspectRatio: 1, borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.8, shadowRadius: 30, shadowOffset: { width: 0, height: 15 } },

  bottomSection: { paddingHorizontal: 32, paddingBottom: 60 },
  
  infoContainer: { marginBottom: 32 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: 24, fontFamily: "Raleway_700Bold", marginBottom: 6 },
  artist: { color: "rgba(255,255,255,0.6)", fontSize: 18, fontFamily: "Raleway_600SemiBold" },
  plusButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  plusIcon: { color: "#fff", fontSize: 20, lineHeight: 22 },

  aiEngineContainer: { marginBottom: 32, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)" },
  aiEngineBlur: { padding: 16, backgroundColor: "rgba(20,20,25,0.5)" },
  aiHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  pulseDotContainer: { width: 12, height: 12, justifyContent: "center", alignItems: "center", marginRight: 8 },
  pulseDotOuter: { position: "absolute", width: 12, height: 12, borderRadius: 6, backgroundColor: "#8b5cf6" },
  pulseDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#d8b4fe" },
  aiStatusText: { color: "#d8b4fe", fontSize: 13, fontFamily: "Raleway_700Bold", letterSpacing: 1 },
  tickerContainer: { flexDirection: "row", alignItems: "center" },
  tickerPrefix: { color: "#8a8a8a", fontSize: 13, fontFamily: "Raleway_600SemiBold", marginRight: 6 },
  tickerContent: { flex: 1, color: "#fff", fontSize: 13, fontFamily: "Raleway_400Regular" },

  scrubberContainer: { marginBottom: 40 },
  progressTrack: { height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, marginBottom: 12 },
  progressFill: { width: "35%", height: "100%", backgroundColor: "#8b5cf6", borderRadius: 2 },
  playhead: { position: "absolute", left: "35%", top: -4, width: 12, height: 12, borderRadius: 6, backgroundColor: "#fff", shadowColor: "#8b5cf6", shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 } },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Raleway_600SemiBold" },

  controlsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  controlIcon: { color: "#fff", fontSize: 32, fontWeight: "300" },
  controlSecondaryIcon: { color: "rgba(255,255,255,0.6)", fontSize: 18, fontFamily: "Raleway_700Bold" },
  playButton: { width: 72, height: 72, borderRadius: 36, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  playIcon: { color: "#000", fontSize: 24, fontFamily: "Raleway_700Bold", letterSpacing: 2, zIndex: 1 },
});
