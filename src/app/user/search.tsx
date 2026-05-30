import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import BottomNavbar from "../../components/BottomNavbar";
import SwipeNavigator from "../../components/SwipeNavigator";
import { searchPodcasts } from "../../services/podcast";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { styles } from "../../styles/searchStyles";

const { width } = Dimensions.get("window");

// Custom Component: Floating Particle
const Particle = ({ delay, startX, startY, endX, endY, size, opacity }: any) => {
  const translateX = useSharedValue(startX);
  const translateY = useSharedValue(startY);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(endX, { duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(endY, { duration: 5000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#8b5cf6",
          opacity: opacity,
          shadowColor: "#8b5cf6",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: size,
        },
        animatedStyle,
      ]}
    />
  );
};

// Custom Component: Particle Engine Background
const ParticleBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Particle delay={0} startX={20} startY={20} endX={60} endY={80} size={15} opacity={0.3} />
      <Particle delay={500} startX={150} startY={80} endX={100} endY={20} size={10} opacity={0.4} />
      <Particle delay={1000} startX={250} startY={10} endX={280} endY={60} size={12} opacity={0.2} />
      <Particle delay={1500} startX={40} startY={120} endX={10} endY={150} size={8} opacity={0.5} />
      <Particle delay={2000} startX={200} startY={140} endX={240} endY={180} size={18} opacity={0.25} />
      <Particle delay={2500} startX={100} startY={160} endX={130} endY={200} size={14} opacity={0.35} />
    </View>
  );
};

export default function SearchScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const data = await searchPodcasts(query);
    setResults(data);
    setLoading(false);
  };

  const handleSubscribe = async (podcast: any) => {
    if (!session?.user) return;
    setSavingId(podcast.collectionId);

    const podcastData = {
      user_id: session.user.id,
      collection_id: podcast.collectionId,
      collection_name: podcast.collectionName,
      artist_name: podcast.artistName || "",
      artwork_url: podcast.artworkUrl600 || podcast.artworkUrl100 || "",
      feed_url: podcast.feedUrl || ""
    };

    if (!podcastData.feed_url) {
      Alert.alert("Error", "This podcast does not have an open RSS feed.");
      setSavingId(null);
      return;
    }

    const { error } = await supabase.from("user_podcasts").insert([podcastData]);

    if (error && error.code !== "23505") { // Ignore unique constraint errors
      console.error("Insert Error:", error);
      Alert.alert("Error", "Could not save podcast: " + JSON.stringify(error));
    } else {
      Alert.alert("Added to Library!", `${podcast.collectionName} is now in your library.`, [
        { text: "OK", onPress: () => router.push("/user/library" as any) }
      ]);
    }
    setSavingId(null);
  };

  return (
    <SwipeNavigator>
      <View style={styles.container}>
        <LinearGradient colors={["#000000", "#050014", "#000000"]} style={StyleSheet.absoluteFill} />
        <View style={styles.glowBackground} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Animated.View entering={FadeInDown.duration(600)} style={styles.searchHeader}>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>Find new podcasts to build your second brain.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.searchBarContainer}>
            <BlurView intensity={40} tint="dark" style={styles.searchBlur}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search everything you've ever heard..."
                placeholderTextColor="#8e8e8e"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
              />
            </BlurView>
          </Animated.View>

          {/* If searching, show results */}
          {query.length > 0 ? (
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ flex: 1 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 40 }} />
              ) : results.length > 0 ? (
                results.map((pod) => (
                  <View key={pod.collectionId} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
                    <Image source={{ uri: pod.artworkUrl100 }} style={{ width: 60, height: 60, borderRadius: 12 }} />
                    <View style={{ flex: 1, marginLeft: 16, marginRight: 16 }}>
                      <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Raleway_700Bold", marginBottom: 4 }} numberOfLines={1}>{pod.collectionName}</Text>
                      <Text style={{ color: "#8a8a8a", fontSize: 14, fontFamily: "Raleway_400Regular" }} numberOfLines={1}>{pod.artistName}</Text>
                    </View>
                    <TouchableOpacity 
                      style={{ backgroundColor: "rgba(139, 92, 246, 0.3)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#8b5cf6" }}
                      onPress={() => handleSubscribe(pod)}
                      disabled={savingId === pod.collectionId}
                    >
                      {savingId === pod.collectionId ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={{ color: "#fff", fontFamily: "Raleway_700Bold", fontSize: 14 }}>Add</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>No results found.</Text>
              )}
            </Animated.View>
          ) : (
            /* Otherwise, show the classic Search UI design */
            <>
              {/* Search Metrics */}
              <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.metricsContainer}>
                {[
                  { icon: "🎙", title: "Episodes Indexed", count: "12,492", sub: "Global Knowledge" },
                  { icon: "🧠", title: "Concepts Extracted", count: "89,104", sub: "Second Brain" },
                  { icon: "⏱", title: "Hours Processed", count: "4,192", sub: "Total Audio" },
                ].map((item, i) => (
                  <View key={i} style={styles.metricCard}>
                    <View style={styles.metricIconContainer}>
                      <Text style={styles.metricIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.metricInfo}>
                      <Text style={styles.metricTitle}>{item.title}</Text>
                      <Text style={styles.metricSub}>{item.sub}</Text>
                    </View>
                    <View style={styles.metricCountBox}>
                      <Text style={styles.metricCount}>{item.count}</Text>
                      <Text style={styles.metricArrow}>❯</Text>
                    </View>
                  </View>
                ))}
              </Animated.View>

              {/* Trending In Your Library */}
              <Animated.View entering={FadeInDown.delay(400).duration(600)} style={[styles.section, { paddingHorizontal: 0 }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Trending in Your Library</Text>
                  <Text style={styles.viewAllText}>VIEW INSIGHTS</Text>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
                  {[
                    { title: "AGI Evolution", sub: "Discussed in 12 episodes this week.", color1: "#4c1d95", color2: "#000" },
                    { title: "Cold Exposure", sub: "Debated in 4 episodes.", color1: "#0f172a", color2: "#000" },
                  ].map((card, i) => (
                    <View key={i} style={styles.trendingCard}>
                      <LinearGradient colors={[card.color1, card.color2]} style={styles.trendingImagePlaceholder} />
                      <View style={styles.trendingBadge}><Text style={styles.trendingBadgeText}>TOPIC</Text></View>
                      <View style={styles.trendingDetails}>
                        <Text style={styles.trendingTitle}>{card.title}</Text>
                        <Text style={styles.trendingSub}>{card.sub}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </Animated.View>

              {/* Ask Podex AI */}
              <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.section}>
                <View style={styles.aiCard}>
                  {/* Ambient Animated Particles */}
                  <ParticleBackground />
                  
                  <View style={styles.aiContent}>
                    <View style={styles.aiHeader}>
                      <Text style={styles.aiIcon}>💜</Text>
                      <Text style={styles.aiTitle}>Ask Podex AI</Text>
                    </View>
                    <Text style={styles.aiDescription}>
                      I've indexed 432 hours of your listening history. You can ask me to summarize complex topics or recall specific moments.
                    </Text>
                    
                    <View style={styles.promptBubble}>
                      <Text style={styles.promptText}>"Summarize Peter Attia's views on Zone 2 training from last week"</Text>
                    </View>
                    <View style={styles.promptBubble}>
                      <Text style={styles.promptText}>"Find the part where Lex asked about the meaning of life"</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}
