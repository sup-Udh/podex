import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import BottomNavbar from "../../components/BottomNavbar";
import SwipeNavigator from "../../components/SwipeNavigator";
import { getTrendingPodcasts } from "../../services/podcast";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function LibraryScreen() {
  const router = useRouter();
  const [podcasts, setPodcasts] = useState<any[]>([]);

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        const data = await getTrendingPodcasts();
        const unique = data.filter(
          (podcast: any, index: number, self: any[]) =>
            index === self.findIndex((p) => p.collectionName === podcast.collectionName)
        );
        setPodcasts(unique.slice(0, 16));
      } catch (error) {
        console.log(error);
      }
    };
    loadPodcasts();
  }, []);

  const activeListening = podcasts.slice(0, 2);
  const knowledgeQueue = podcasts.slice(2, 5);
  const subscriptions = podcasts.slice(5, 16);

  return (
    <SwipeNavigator>
      <View style={styles.container}>
        <LinearGradient
          colors={["#000000", "#050014", "#000000"]}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <Text style={styles.headerTitle}>Your Library</Text>
            <Text style={styles.headerSubtitle}>Manage your audio ecosystem.</Text>
          </Animated.View>

          {/* Section A: Active Listening */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Active Listening</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
              {activeListening.map((podcast, i) => (
                <View key={i} style={styles.activeCard}>
                  <Image source={{ uri: podcast.artworkUrl600 }} style={styles.activeImage} />
                  <View style={styles.activeContent}>
                    <Text style={styles.activePodcastName} numberOfLines={1}>{podcast.collectionName}</Text>
                    <Text style={styles.activeEpisodeTitle} numberOfLines={2}>#142 - The Future of Human Evolution</Text>
                    
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: i === 0 ? "65%" : "30%" }]} />
                    </View>
                    <Text style={styles.progressText}>{i === 0 ? "45 mins left" : "1 hr 12 mins left"}</Text>

                    <TouchableOpacity style={styles.resumeButton} activeOpacity={0.8} onPress={() => router.push("/user/player" as any)}>
                      <Text style={styles.resumeButtonText}>▶ Resume</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Section B: The Knowledge Queue */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>The Knowledge Queue</Text>
              <Text style={styles.aiCuratedBadge}>AI CURATED</Text>
            </View>

            <View style={styles.queueContainer}>
              {knowledgeQueue.map((podcast, i) => (
                <View key={i} style={styles.queueItem}>
                  <Image source={{ uri: podcast.artworkUrl100 }} style={styles.queueImage} />
                  <View style={styles.queueInfo}>
                    <Text style={styles.queueEpisode} numberOfLines={1}>Optimizing Sleep & Performance</Text>
                    <Text style={styles.queueReason}>Queued because you searched "Dopamine"</Text>
                  </View>
                  <TouchableOpacity style={styles.queuePlayButton} onPress={() => router.push("/user/player" as any)}>
                    <Text style={styles.queuePlayIcon}>▶</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Section C: Subscriptions */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.section, { marginBottom: 100 }]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Subscriptions</Text>
              <TouchableOpacity style={styles.addSubscriptionButton}>
                <Text style={styles.addSubscriptionIcon}>+</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.listContainer}>
              {subscriptions.map((podcast, i) => (
                <View key={i} style={styles.listItem}>
                  <Image source={{ uri: podcast.artworkUrl100 }} style={styles.listImage} />
                  <View style={styles.listInfo}>
                    <Text style={styles.listTitle} numberOfLines={1}>{podcast.collectionName}</Text>
                    <Text style={styles.listSub} numberOfLines={1}>{podcast.artistName}</Text>
                  </View>
                  <TouchableOpacity style={styles.listOptionsButton}>
                    <Text style={styles.listOptionsIcon}>⋮</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Animated.View>

        </ScrollView>

        <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContent: { paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 32 },
  headerTitle: { color: "#fff", fontSize: 28, fontFamily: "Raleway_700Bold", marginBottom: 4 },
  headerSubtitle: { color: "#8a8a8a", fontSize: 16, fontFamily: "Raleway_400Regular" },
  section: { paddingHorizontal: 24, marginBottom: 40 },
  sectionTitle: { color: "#fff", fontSize: 20, fontFamily: "Raleway_700Bold", marginBottom: 16 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  
  // Active Listening
  activeCard: { width: 280, backgroundColor: "rgba(20,20,25,0.6)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", flexDirection: "row", gap: 16 },
  activeImage: { width: 80, height: 80, borderRadius: 12 },
  activeContent: { flex: 1, justifyContent: "center" },
  activePodcastName: { color: "#8b5cf6", fontSize: 12, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  activeEpisodeTitle: { color: "#fff", fontSize: 14, fontFamily: "Raleway_700Bold", marginBottom: 12 },
  progressContainer: { height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 6 },
  progressBar: { height: "100%", backgroundColor: "#8b5cf6", borderRadius: 2 },
  progressText: { color: "#8a8a8a", fontSize: 10, fontFamily: "Raleway_400Regular", marginBottom: 12 },
  resumeButton: { backgroundColor: "rgba(139, 92, 246, 0.15)", paddingVertical: 8, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)" },
  resumeButtonText: { color: "#fff", fontSize: 12, fontFamily: "Raleway_700Bold" },

  // Knowledge Queue
  aiCuratedBadge: { color: "#8b5cf6", fontSize: 10, fontFamily: "Raleway_700Bold", letterSpacing: 1, backgroundColor: "rgba(139, 92, 246, 0.1)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  queueContainer: { gap: 12 },
  queueItem: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  queueImage: { width: 50, height: 50, borderRadius: 10, marginRight: 16 },
  queueInfo: { flex: 1 },
  queueEpisode: { color: "#fff", fontSize: 14, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  queueReason: { color: "#8a8a8a", fontSize: 11, fontFamily: "Raleway_400Regular" },
  queuePlayButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
  queuePlayIcon: { color: "#fff", fontSize: 12 },

  // Subscriptions List
  listContainer: { gap: 12 },
  listItem: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  listImage: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  listInfo: { flex: 1 },
  listTitle: { color: "#fff", fontSize: 15, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  listSub: { color: "#8a8a8a", fontSize: 13, fontFamily: "Raleway_400Regular" },
  listOptionsButton: { paddingHorizontal: 12, paddingVertical: 8 },
  listOptionsIcon: { color: "#666", fontSize: 18, fontWeight: "bold" },
  addSubscriptionButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(139, 92, 246, 0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.4)" },
  addSubscriptionIcon: { color: "#b99eff", fontSize: 18, lineHeight: 20 },
});
