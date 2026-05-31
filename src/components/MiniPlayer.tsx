import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter, usePathname } from "expo-router";
import { usePlayer } from "../contexts/PlayerContext";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

export default function MiniPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentEpisode, isPlaying, togglePlayPause, positionMillis, durationMillis, closePlayer } = usePlayer();

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Do not show mini player if nothing is playing, or if we are already on the full player screen
  if (!currentEpisode || pathname === "/user/player") {
    return null;
  }

  const progressPercent = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown} style={styles.container}>
      <TouchableOpacity 
        style={styles.innerContainer}
        onPress={() => router.push("/user/player" as any)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: currentEpisode.imageUrl || "https://via.placeholder.com/150" }} 
          style={styles.artwork} 
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>{currentEpisode.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.podcastName} numberOfLines={1}>{currentEpisode.podcastName}</Text>
            <Text style={styles.timeText}>
              {" • "}{formatTime(positionMillis)} / {formatTime(durationMillis)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlayPause}>
          <Text style={styles.playPauseIcon}>{isPlaying ? "||" : "▶"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={closePlayer}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Mini Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90, // Just above the BottomNavbar
    left: 16,
    right: 16,
    backgroundColor: "rgba(30, 20, 50, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    overflow: "hidden",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    marginBottom: 2,
  },
  podcastName: {
    color: "#a1a1aa",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
  },
  playPauseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseIcon: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 2,
  },
  closeBtn: {
    width: 32,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  closeIcon: {
    color: "#888",
    fontSize: 18,
  },
  timeText: {
    color: "#8b5cf6",
    fontSize: 10,
    fontFamily: "Raleway_600SemiBold",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
  }
});
