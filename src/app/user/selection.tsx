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

      // Remove duplicates
      const unique = data.filter(
        (podcast: any, index: number, self: any[]) =>
          index ===
          self.findIndex(
            (p) =>
              p.collectionName ===
              podcast.collectionName
          )
      );

      setPodcasts(unique.slice(0, 20));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const togglePodcast = (id: number) => {
    if (selected.includes(id)) {
      setSelected(
        selected.filter((item) => item !== id)
      );
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={["#000000", "#050505", "#000000"]}
        style={styles.absoluteFill}
      />

      {/* Ambient Purple Glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Noise Overlay */}
      <View style={styles.noiseOverlay} />

      {/* Floating Particles */}
      <View style={styles.particle1} />
      <View style={styles.particle2} />
      <View style={styles.particle3} />

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
            Select at least 5 to personalize{"\n"}
            your experience
          </Text>
        </Animated.View>

        {/* Grid */}
        <Animated.View
          entering={FadeIn.delay(300)}
          style={styles.gridContainer}
        >
          {podcasts.map((podcast, index) => {
            const podcastId =
              podcast.collectionId || index;

            const isSelected =
              selected.includes(podcastId);

            const itemSize = (width - 60) / 2;

            return (
              <TouchableOpacity
                key={podcastId}
                activeOpacity={0.88}
                onPress={() =>
                  togglePodcast(podcastId)
                }
                style={styles.gridItemWrapper}
              >
                <Animated.View
                  entering={FadeIn.delay(index * 70)}
                  style={[
                    styles.gridItem,
                    {
                      width: itemSize,
                      height: itemSize,
                    },
                    isSelected
                      ? styles.gridItemSelected
                      : styles.gridItemUnselected,
                  ]}
                >
                  {/* Artwork */}
                  <Image
                    source={
                      podcast.artworkUrl600 ||
                      podcast.artworkUrl100
                    }
                    contentFit="cover"
                    transition={300}
                    style={styles.artwork}
                  />

                  {/* Selected State */}
                  {isSelected && (
                    <>
                      <View
                        style={styles.selectedOverlay}
                      />

                      <View
                        style={styles.selectedBorder}
                      />

                      <BlurView
                        intensity={50}
                        tint="dark"
                        style={styles.checkContainer}
                      >
                        <Text style={styles.checkText}>
                          ✓
                        </Text>
                      </BlurView>
                    </>
                  )}

                  {/* Bottom Gradient */}
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0,0,0,0.88)",
                    ]}
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

                    <Text
                      numberOfLines={1}
                      style={styles.authorText}
                    >
                      {podcast.artistName}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContinueContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={selected.length < 5}
          style={styles.continueButtonWrapper}
        >
          <BlurView
            intensity={45}
            tint="dark"
            style={[
              styles.continueButtonBlur,
              selected.length >= 5
                ? styles.continueButtonReady
                : styles.continueButtonDisabled,
            ]}
          >
            {/* Ambient Glow */}
            <View
              style={[
                styles.continueButtonGlow,
                selected.length >= 5
                  ? styles.glowReady
                  : styles.glowDisabled,
              ]}
            />

            {/* Glass Highlight */}
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.14)",
                "rgba(255,255,255,0)",
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.absoluteFill}
            />

            <Text
              style={[
                styles.continueButtonText,
                selected.length >= 5
                  ? styles.textReady
                  : styles.textDisabled,
              ]}
            >
              Continue
            </Text>
          </BlurView>
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
    backgroundColor:
      "rgba(109,93,252,0.10)",
  },

  glowBottom: {
    position: "absolute",
    bottom: 100,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor:
      "rgba(139,92,246,0.10)",
  },

  noiseOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor:
      "rgba(255,255,255,0.01)",
  },

  particle1: {
    position: "absolute",
    top: 140,
    left: 40,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      "rgba(255,255,255,0.10)",
  },

  particle2: {
    position: "absolute",
    top: 240,
    right: 70,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor:
      "rgba(255,255,255,0.10)",
  },

  particle3: {
    position: "absolute",
    bottom: 220,
    left: 60,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor:
      "rgba(255,255,255,0.10)",
  },

  scrollContent: {
    paddingTop: 110,
    paddingBottom: 180,
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
    backgroundColor: "#121212",
  },

  gridItemSelected: {
    borderColor: "#8b5cf6",
  },

  gridItemUnselected: {
    borderColor:
      "rgba(255,255,255,0.06)",
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
    backgroundColor:
      "rgba(139,92,246,0.16)",
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
    borderColor:
      "rgba(255,255,255,0.10)",
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
    height: 110,
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

  authorText: {
    color: "#a1a1a1",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Raleway_400Regular",
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
  },

  continueButtonBlur: {
    height: 68,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.02)",
  },

  continueButtonReady: {
    borderColor:
      "rgba(255,255,255,0.08)",
  },

  continueButtonDisabled: {
    borderColor:
      "rgba(255,255,255,0.04)",
  },

  continueButtonGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.9,
  },

  glowReady: {
    backgroundColor:
      "rgba(139,92,246,0.06)",
  },

  glowDisabled: {
    backgroundColor: "transparent",
  },

  continueButtonText: {
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: "Raleway_700Bold",
  },

  textReady: {
    color: "#fff",
  },

  textDisabled: {
    color: "#6f6f6f",
  },
});