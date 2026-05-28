import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

import { getTrendingPodcasts } from "../../services/podcast";

const { width } = Dimensions.get("window");

export default function PodcastSelection() {
  const [selected, setSelected] = useState<number[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      const data = await getTrendingPodcasts();

      const unique = data.filter(
        (podcast: any, index: number, self: any[]) =>
          index === self.findIndex((p) => p.collectionName === podcast.collectionName)
      );
      setPodcasts(unique.slice(0, 30));
    } catch (error) {
      console.log(error);
    }
  };

  const togglePodcast = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const isReady = selected.length >= 5;

  const backgroundOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isReady ? 0.75 : 0, { duration: 500 }),
    };
  });

  const buttonGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isReady ? 1 : 0, { duration: 500 }),
    };
  });

  const buttonVisibilityStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isReady ? 1 : 0, { duration: 400 }),
      transform: [
        { translateY: withTiming(isReady ? 0 : 20, { duration: 400 }) }
      ],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Base Background */}
      <LinearGradient
        colors={["#000000", "#050505", "#000000"]}
        style={styles.absoluteFill}
      />

      {/* Ambient Purple Glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Noise Overlay */}
      <View style={styles.noiseOverlay} />

      {/* Floating Particles */}
      <View style={styles.particle1} />
      <View style={styles.particle2} />
      <View style={styles.particle3} />

      {/* Darkening Overlay when ready */}
      <Animated.View
        pointerEvents="none"
        style={[styles.absoluteFill, { backgroundColor: "#000" }, backgroundOverlayStyle]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Heading */}
        <Animated.View
          entering={FadeInDown.duration(700)}
          style={styles.headingContainer}
        >
          <Text style={styles.headingTitle}>
            Choose your{"\n"}favorite podcasts
          </Text>

          <Text style={styles.headingSubtitle}>
            Select at least 5 to personalize{"\n"}your experience
          </Text>
        </Animated.View>

        {/* Grid */}
        <Animated.View
          entering={FadeIn.delay(300)}
          style={styles.gridContainer}
        >
          {podcasts.map((podcast, index) => {
            const isSelected = selected.includes(podcast.collectionId);
            const itemSize = (width - 60) / 2;

            return (
              <TouchableOpacity
                key={podcast.collectionId}
                activeOpacity={0.88}
                onPress={() => togglePodcast(podcast.collectionId)}
                style={styles.gridItemWrapper}
              >
                <Animated.View
                  entering={FadeIn.delay((index % 10) * 70)}
                  style={[
                    styles.gridItem,
                    { width: itemSize, height: itemSize },
                    isSelected ? styles.gridItemSelected : styles.gridItemUnselected
                  ]}
                >
                  {/* Artwork */}
                  <Image
                    source={{ uri: podcast.artworkUrl600 || podcast.artworkUrl100 }}
                    resizeMode="cover"
                    style={styles.artwork}
                  />

                  {/* Selected Glow */}
                  {isSelected && (
                    <>
                      <View style={styles.selectedOverlay} />
                      <View style={styles.selectedBorder} />

                      {/* Check */}
                      <BlurView
                        intensity={50}
                        tint="dark"
                        style={styles.checkContainer}
                      >
                        <Text style={styles.checkText}>✓</Text>
                      </BlurView>
                    </>
                  )}

                  {/* Bottom Gradient */}
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.bottomGradient}
                  />

                  {/* Title */}
                  <View style={styles.titleContainer}>
                    <Text
                      numberOfLines={2}
                      style={styles.titleText}
                    >
                      {podcast.collectionName}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* Bottom Continue */}
      <Animated.View 
        style={[styles.bottomContinueContainer, buttonVisibilityStyle]}
        pointerEvents={isReady ? "auto" : "none"}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={!isReady}
          style={styles.continueButtonWrapper}
        >
          <BlurView
            intensity={40}
            tint="dark"
            style={[
              styles.continueButtonBlur,
              isReady ? styles.continueButtonReady : styles.continueButtonDisabled
            ]}
          >
            {/* Base Inner Glow for disabled */}
            {!isReady && <View style={[styles.continueButtonGlow, styles.glowDisabled]} />}
            
            {/* Animated Super Bright Glow for ready */}
            <Animated.View
              style={[styles.continueButtonGlow, styles.glowReady, buttonGlowStyle]}
            />

            {/* Gradient Mask */}
            <LinearGradient
              colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0)"]}
              style={styles.absoluteFill}
            />

            <Text
              style={[
                styles.continueButtonText,
                isReady ? styles.textReady : styles.textDisabled
              ]}
            >
              Continue
            </Text>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  glowTop: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(109, 93, 252, 0.1)",
  },
  glowBottom: {
    position: "absolute",
    bottom: 100,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  noiseOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.01)",
  },
  particle1: {
    position: "absolute",
    top: 140,
    left: 40,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  particle2: {
    position: "absolute",
    top: 240,
    right: 70,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  particle3: {
    position: "absolute",
    bottom: 220,
    left: 60,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  scrollContent: {
    paddingTop: 110,
    paddingBottom: 140,
    paddingHorizontal: 22,
  },
  headingContainer: {
    alignItems: "center",
  },
  headingTitle: {
    color: "#fff",
    fontSize: 40,
    textAlign: "center",
    lineHeight: 46,
    fontFamily: "Raleway_700Bold",
  },
  headingSubtitle: {
    color: "#8d8d8d",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
    fontFamily: "Raleway_400Regular",
    fontWeight: "bold",

  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 48,
  },
  gridItemWrapper: {
    marginBottom: 20,
  },
  gridItem: {
    position: "relative",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
  },
  gridItemSelected: {
    borderColor: "#8b5cf6",
  },
  gridItemUnselected: {
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  selectedOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  selectedBorder: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#8b5cf6",
    borderRadius: 28,
  },
  checkContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  checkText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  titleContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  titleText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "Raleway_700Bold",
  },
  bottomContinueContainer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
  },
  continueButtonWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  continueButtonBlur: {
    height: 68,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonReady: {
    borderColor: "rgba(139, 92, 246, 0.8)",
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  continueButtonDisabled: {
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  continueButtonGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  glowReady: {
    backgroundColor: "rgba(139, 92, 246, 0.5)",
  },
  glowDisabled: {
    backgroundColor: "transparent",
  },
  continueButtonText: {
    fontSize: 18,
    letterSpacing: 1.5,
    fontFamily: "Raleway_700Bold",
  },
  textReady: {
    color: "#fff",
    textShadowColor: "rgba(139, 92, 246, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  textDisabled: {
    color: "#6f6f6f",
  },
});