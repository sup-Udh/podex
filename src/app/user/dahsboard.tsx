import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useAuth } from "../../hooks/useAuth";
import { usePlayer } from "../../contexts/PlayerContext";
import { supabase } from "../../services/supabase";
import { fetchEpisodesFromFeed, Episode } from "../../services/episodes";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

import { styles } from "../../styles/dashboardStyles";

export default function Dashboard() {
  const router = useRouter();
  const { session } = useAuth();
  const { playEpisode } = usePlayer();
  
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch user's podcasts
      const { data, error } = await supabase
        .from("user_podcasts")
        .select("*")
        .eq("user_id", session?.user.id)
        .order("created_at", { ascending: false });

      if (error || !data) {
        setLoading(false);
        return;
      }

      setPodcasts(data);

      // 2. Fetch episodes for all feeds
      let allEpisodes: Episode[] = [];
      await Promise.all(
        data.map(async (pod) => {
          if (pod.feed_url) {
            const eps = await fetchEpisodesFromFeed(pod.feed_url, 3); // Get latest 3 from each
            // Inject podcast name and image into episode for UI if missing
            const enhancedEps = eps.map(e => ({
              ...e,
              podcastName: e.podcastName || pod.collection_name,
              imageUrl: e.imageUrl || pod.artwork_url,
              podcastId: pod.collection_id
            }));
            allEpisodes = [...allEpisodes, ...enhancedEps];
          }
        })
      );

      // Sort by date
      allEpisodes.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setEpisodes(allEpisodes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SwipeNavigator>
      <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#050014", "#000000"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowBackground} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.searchContainer}>
          <View style={styles.searchPill}>
            <Text style={styles.searchIcon}>✨</Text>
            <Text style={styles.searchText}>Search everything you've ever heard...</Text>
          </View>
        </Animated.View>

        {loading ? (
          <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 100 }} />
        ) : podcasts.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(200)} style={{ alignItems: "center", marginTop: 80, paddingHorizontal: 40 }}>
            <Text style={{ color: "#fff", fontSize: 24, textAlign: "center", fontFamily: "Raleway_700Bold", marginBottom: 16 }}>
              Your brain is empty
            </Text>
            <Text style={{ color: "#8a8a8a", fontSize: 16, textAlign: "center", marginBottom: 32 }}>
              Start building your second brain by adding some podcasts to your library.
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: "rgba(139, 92, 246, 0.2)", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: "#8b5cf6" }}
              onPress={() => router.push("/user/search" as any)}
            >
              <Text style={{ color: "#fff", fontFamily: "Raleway_700Bold" }}>Find Podcasts</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            {/* Subscriptions */}
            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.section, { paddingHorizontal: 0 }]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Your Podcasts</Text>
                <TouchableOpacity onPress={() => router.push("/user/library" as any)}>
                  <Text style={styles.viewAllText}>Library</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
                {podcasts.map((sub) => (
                  <TouchableOpacity key={sub.id} style={styles.subCard} onPress={() => router.push(`/user/podcast/${sub.collection_id}` as any)}>
                    <Image source={{ uri: sub.artwork_url }} style={styles.subImage} contentFit="cover" />
                    <Text style={styles.subTitle} numberOfLines={1}>{sub.collection_name}</Text>
                    <View style={styles.subUnderline} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Latest Episodes */}
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Latest Episodes</Text>
              </View>

              {episodes.map((ep, idx) => (
                <View key={ep.id + idx} style={[styles.feedCard, { marginBottom: 16 }]}>
                  <LinearGradient colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.0)"]} style={StyleSheet.absoluteFill} />
                  <View style={styles.feedCardHeader}>
                    <Image source={{ uri: ep.imageUrl }} style={styles.feedCardImage} contentFit="cover" />
                    <View style={styles.feedCardTitleContainer}>
                      <Text style={styles.feedCardContext}>{ep.podcastName}</Text>
                      <Text style={styles.feedCardTitle} numberOfLines={2}>{ep.title}</Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.feedCardSnippet, { marginTop: 12 }]} numberOfLines={3}>
                    {ep.description.replace(/<[^>]*>?/gm, '').trim()}
                  </Text>
                  
                  <View style={[styles.feedCardFooter, { marginTop: 16 }]}>
                    <View style={styles.footerLeft}>
                      <Text style={styles.footerTime}>{ep.duration ? ep.duration : new Date(ep.pubDate).toLocaleDateString()}</Text>
                    </View>
                    <TouchableOpacity style={styles.playButtonMini} onPress={() => {
                      playEpisode(ep);
                      router.push("/user/player" as any);
                    }}>
                      <LinearGradient colors={["#4b4073", "#2c244b"]} style={StyleSheet.absoluteFill} />
                      <Text style={styles.playButtonMiniIcon}>▶</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </Animated.View>
          </>
        )}

        {/* Spacer for bottom navbar */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}
