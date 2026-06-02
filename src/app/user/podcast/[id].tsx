import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import BottomNavbar from "../../../components/BottomNavbar";
import SwipeNavigator from "../../../components/SwipeNavigator";
import PremiumBackground from "../../../components/PremiumBackground";
import { usePlayer } from "../../../contexts/PlayerContext";
import { Episode, fetchEpisodesFromFeed } from "../../../services/episodes";
import { supabase } from "../../../services/supabase";

export default function PodcastDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { playEpisode } = usePlayer();

  const [podcast, setPodcast] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const isNavigating = useRef(false);

  const handleNavigate = (path?: any, action?: () => void) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    if (action) action();
    if (path) router.push(path);
    else router.back();
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  };

  useEffect(() => {
    if (id) {
      loadPodcast();
    }
  }, [id]);

  const loadPodcast = async () => {
    try {
      setLoading(true);
      // Fetch podcast details from user_podcasts
      const { data, error } = await supabase
        .from("user_podcasts")
        .select("*")
        .eq("collection_id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setPodcast(data);

      InteractionManager.runAfterInteractions(async () => {
        try {
          // Fetch all episodes
          const eps = await fetchEpisodesFromFeed(data.feed_url, 10000); 
          
          // Sort by date ascending to show from Ep 1 (oldest first)
          eps.sort((a, b) => {
            const tA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const tB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return (isNaN(tA) ? 0 : tA) - (isNaN(tB) ? 0 : tB);
          });

          const enhancedEps = eps.map((e: any) => ({
            ...e,
            podcastName: data.collection_name,
            imageUrl: data.artwork_url,
            podcastId: data.collection_id
          }));

          setEpisodes(enhancedEps);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <SwipeNavigator>
      <View style={styles.container}>
        <PremiumBackground />

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          {loading ? (
            <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
              {/* Skeleton artwork */}
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <View style={{ width: 200, height: 200, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.06)" }} />
              </View>
              {/* Skeleton title */}
              <View style={{ width: "70%", height: 22, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.06)", alignSelf: "center", marginBottom: 10 }} />
              <View style={{ width: "40%", height: 14, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.04)", alignSelf: "center", marginBottom: 30 }} />
              {/* Skeleton episode cards */}
              {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.06)", marginRight: 14 }} />
                  <View style={{ flex: 1 }}>
                    <View style={{ width: "80%", height: 14, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: 8 }} />
                    <View style={{ width: "50%", height: 10, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.04)" }} />
                  </View>
                </View>
              ))}
            </View>
          ) : !podcast ? (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>Podcast not found.</Text>
          ) : (
            <>
              {/* Header */}
              <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                <Image source={{ uri: podcast.artwork_url }} style={styles.coverImage} contentFit="cover" />
                <Text style={styles.title}>{podcast.collection_name}</Text>
                <Text style={styles.author}>{podcast.artist_name}</Text>
              </Animated.View>

              {/* Episodes List */}
              <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.episodesSection}>
                <Text style={styles.sectionTitle}>All Episodes</Text>
                
                {episodes.slice(0, visibleCount).map((ep, idx) => (
                  <View key={ep.id + idx} style={styles.episodeCard}>
                    <View style={styles.episodeInfo}>
                      <Text style={styles.episodeTitle} numberOfLines={2}>{ep.title}</Text>
                      <Text style={styles.episodeDesc} numberOfLines={2}>
                        {String(ep.description || "").replace(/<[^>]*>?/gm, '').trim()}
                      </Text>
                      <Text style={styles.episodeDate}>
                        {ep.duration ? ep.duration : (ep.pubDate ? (isNaN(new Date(ep.pubDate).getTime()) ? "Unknown Date" : new Date(ep.pubDate).toLocaleDateString()) : "Unknown Date")}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.playButton} 
                      onPress={() => handleNavigate("/user/player", () => playEpisode(ep))}
                    >
                      <LinearGradient colors={["#8b5cf6", "#6d28d9"]} style={StyleSheet.absoluteFill} pointerEvents="none" />
                      <Text style={styles.playIcon}>▶</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {visibleCount < episodes.length && (
                  <TouchableOpacity 
                    style={{ alignSelf: "center", marginTop: 24, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24, backgroundColor: "rgba(139, 92, 246, 0.2)", borderWidth: 1, borderColor: "#8b5cf6" }}
                    onPress={() => setVisibleCount(prev => prev + 20)}
                  >
                    <Text style={{ color: "#fff", fontFamily: "Raleway_700Bold" }}>Load More Episodes</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            </>
          )}
        </ScrollView>
        <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: "#fff",
    fontSize: 20,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  author: {
    color: "#8a8a8a",
    fontSize: 16,
    fontFamily: "Raleway_400Regular",
  },
  episodesSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    marginBottom: 20,
  },
  episodeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  episodeInfo: {
    flex: 1,
    marginRight: 16,
  },
  episodeTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
    marginBottom: 6,
  },
  episodeDesc: {
    color: "#8a8a8a",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
    marginBottom: 8,
  },
  episodeDate: {
    color: "#8b5cf6",
    fontSize: 12,
    fontFamily: "Raleway_600SemiBold",
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 4,
  }
});
