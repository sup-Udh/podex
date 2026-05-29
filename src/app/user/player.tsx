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
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function PlayerScreen() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
              source={{ uri: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/600x600bb.jpg" }} // Hardcoded Huberman Lab
              style={styles.artwork}
              contentFit="cover"
            />
          </View>

          <View style={styles.metadata}>
            <Text style={styles.episodeTitle} numberOfLines={2}>
              Dr. Peter Attia: Improve Vitality, Emotional & Physical Health
            </Text>
            <Text style={styles.hostName}>Huberman Lab</Text>
          </View>

          {/* Audio Controls */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "45%" }]} />
              <View style={styles.progressThumb} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>34:12</Text>
              <Text style={styles.timeText}>-1:45:20</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIconSmall}>15↺</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
              <LinearGradient colors={["#8b5cf6", "#6d28d9"]} style={StyleSheet.absoluteFill} />
              <Text style={styles.playIcon}>||</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIconSmall}>↻15</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Live AI Engine Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <Animated.View style={[styles.pulseDot, pulsingStyle]} />
            <Text style={styles.aiHeaderText}>PODEX AI IS LISTENING</Text>
          </View>

          <View style={styles.liveFeedContainer}>
            {/* Feed Item 1 */}
            <View style={styles.logItem}>
              <Text style={styles.logText}>
                <Text style={styles.logTimestamp}>[00:00:12]</Text> <Text style={styles.logType}>[EXTRACT_BOOK]</Text> Outlive: The Science and Art of Longevity
              </Text>
            </View>

            {/* Feed Item 2 */}
            <View style={styles.logItem}>
              <Text style={styles.logText}>
                <Text style={styles.logTimestamp}>[00:02:45]</Text> <Text style={styles.logTypeInfo}>[EXTRACT_FRAMEWORK]</Text> Centenarian Decathlon Protocol
              </Text>
            </View>

            {/* Feed Item 3 */}
            <View style={styles.logItem}>
              <Text style={styles.logText}>
                <Text style={styles.logTimestamp}>[00:15:30]</Text> <Text style={styles.logTypeSuccess}>[EXTRACT_SUPPLEMENT]</Text> Omega-3 EPA at 2g/day
              </Text>
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 0.05,
    pointerEvents: "none",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  iconText: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 24,
  },
  logoContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(139, 92, 246, 0.5)",
    shadowColor: "#8b5cf6",
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  mediaContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 40,
  },
  artworkWrapper: {
    width: width - 48,
    height: width - 48,
    marginBottom: 32,
    position: "relative",
  },
  artworkGlow: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: -10,
    backgroundColor: "rgba(139, 92, 246, 0.4)",
    // Note: React Native doesn't support 'filter' out of the box in the same way web does. 
    // We rely on shadow properties for glow, but keeping it as a styled box behind the image works well enough.
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.5,
    shadowRadius: 30,
    borderRadius: 20,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  metadata: {
    width: "100%",
    marginBottom: 32,
  },
  episodeTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
    marginBottom: 8,
    lineHeight: 28,
  },
  hostName: {
    color: "#8b5cf6",
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 32,
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginLeft: -6,
    shadowColor: "#fff",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    color: "#8a8a8a",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
    fontVariant: ["tabular-nums"],
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  controlButton: {
    padding: 10,
  },
  controlIconSmall: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Raleway_600SemiBold",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  playIcon: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 2,
  },
  aiSection: {
    paddingHorizontal: 24,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8b5cf6",
    marginRight: 8,
    shadowColor: "#8b5cf6",
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  aiHeaderText: {
    color: "#b99eff",
    fontSize: 11,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 1.5,
  },
  liveFeedContainer: {
    gap: 8,
    backgroundColor: "rgba(10,10,15,0.8)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  logItem: {
    marginBottom: 4,
  },
  logText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Courier",
    lineHeight: 18,
  },
  logTimestamp: {
    color: "#666",
  },
  logType: {
    color: "#b99eff",
  },
  logTypeInfo: {
    color: "#60a5fa",
  },
  logTypeSuccess: {
    color: "#34d399",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  menuContainer: {
    width: "100%",
    backgroundColor: "rgba(20,20,25,0.95)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  menuTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 28,
    textAlign: "center",
  },
  menuItemText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 4,
  },
});
