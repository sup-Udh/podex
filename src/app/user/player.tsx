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
  
  const { currentEpisode, isPlaying, positionMillis, durationMillis, togglePlayPause, seekForward, seekBackward } = usePlayer();

  const progressPercent = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;
  const remainingMillis = Math.max(durationMillis - positionMillis, 0);

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
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              <View style={[styles.progressThumb, { left: `${progressPercent}%`, marginLeft: -6 }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
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
