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

// Custom Component: Dot Grid Background
const GridBackground = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#121214", overflow: "hidden" }]}>
      {/* Create a simple dot pattern */}
      <View style={{ flex: 1, opacity: 0.3 }}>
        {[...Array(40)].map((_, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 30 }}>
            {[...Array(15)].map((_, colIndex) => (
              <View key={colIndex} style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#444" }} />
            ))}
          </View>
        ))}
      </View>
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
        <GridBackground />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: "center", marginBottom: 32 }}>
            <Text style={{ color: "#fff", fontSize: 24, fontFamily: "Raleway_700Bold", marginBottom: 8, textAlign: "center" }}>
              Search Everything You've Heard
            </Text>
            <Text style={{ color: "#5c8df6", fontSize: 14, fontFamily: "Raleway_600SemiBold", textAlign: "center" }}>
              Ask your podcast memory anything.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={{ paddingHorizontal: 24, marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", height: 56, borderRadius: 28, paddingHorizontal: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
              <Text style={{ color: "#8b5cf6", fontSize: 18, marginRight: 12 }}>🔍</Text>
              <TextInput
                style={{ flex: 1, color: "#fff", fontSize: 15, fontFamily: "Raleway_400Regular" }}
                placeholder="Health protocols for long"
                placeholderTextColor="#666"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
              />
              <Text style={{ color: "#666", fontSize: 18, marginLeft: 12 }}>🎙️</Text>
            </View>
          </Animated.View>

          {/* If searching, show results */}
          {query.length > 0 ? (
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ flex: 1 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 40 }} />
              ) : results.length > 0 ? (
                <View style={{ paddingHorizontal: 24, gap: 16 }}>
                  {results.map((item, idx) => (
                    <Animated.View key={item.collectionId + idx} entering={FadeInDown.delay(idx * 100).duration(500)}>
                      <View style={styles.resultCard}>
                        <Image source={{ uri: item.artworkUrl100 }} style={styles.resultImage} />
                        <View style={styles.resultInfo}>
                          <Text style={styles.resultTitle} numberOfLines={2}>{item.collectionName}</Text>
                          <Text style={styles.resultArtist} numberOfLines={1}>{item.artistName}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.saveButton} 
                          onPress={() => handleSubscribe(item)}
                          disabled={savingId === item.collectionId}
                        >
                          {savingId === item.collectionId ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text style={styles.saveButtonText}>Add</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noResultsText}>No podcasts found.</Text>
              )}
            </Animated.View>
          ) : (
            // Default Empty State matching new design
            <>
              {/* Filter Pills */}
              <Animated.View entering={FadeInDown.delay(150).duration(600)} style={styles.filtersContainer}>
                <View style={[styles.filterRow, { flexWrap: "wrap", justifyContent: "center" }]}>
                  {["📚 BOOKS", "🧬 FRAMEWORKS", "💊 SUPPLEMENTS", "👥 GUESTS", "📊 STATISTICS"].map((tag, idx) => (
                    <View key={idx} style={styles.filterPill}>
                      <Text style={styles.filterText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>

              {/* Vertical Metrics Stack */}
              <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: "rgba(255,255,255,0.05)" }]}>
                    <Text style={styles.metricIcon}>📚</Text>
                  </View>
                  <View style={styles.metricInfo}>
                    <Text style={styles.metricTitle}>Books Mentioned</Text>
                    <Text style={styles.metricSub}>Syncing with GoodReads...</Text>
                  </View>
                  <View style={styles.metricCountBox}>
                    <Text style={[styles.metricCount, { color: "#d1d1d1" }]}>124</Text>
                    <Text style={styles.metricArrow}>›</Text>
                  </View>
                </View>

                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: "rgba(139, 92, 246, 0.15)" }]}>
                    <Text style={styles.metricIcon}>🧬</Text>
                  </View>
                  <View style={styles.metricInfo}>
                    <Text style={styles.metricTitle}>Frameworks Saved</Text>
                    <Text style={styles.metricSub}>Models for better thinking</Text>
                  </View>
                  <View style={styles.metricCountBox}>
                    <Text style={[styles.metricCount, { color: "#d1d1d1" }]}>42</Text>
                    <Text style={styles.metricArrow}>›</Text>
                  </View>
                </View>

                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: "rgba(255,255,255,0.05)" }]}>
                    <Text style={styles.metricIcon}>👥</Text>
                  </View>
                  <View style={styles.metricInfo}>
                    <Text style={styles.metricTitle}>Guests Discovered</Text>
                    <Text style={styles.metricSub}>Profiles across episodes</Text>
                  </View>
                  <View style={styles.metricCountBox}>
                    <Text style={[styles.metricCount, { color: "#d1d1d1" }]}>312</Text>
                    <Text style={styles.metricArrow}>›</Text>
                  </View>
                </View>

                <View style={styles.metricCard}>
                  <View style={[styles.metricIconBox, { backgroundColor: "rgba(244, 114, 182, 0.15)" }]}>
                    <Text style={styles.metricIcon}>📊</Text>
                  </View>
                  <View style={styles.metricInfo}>
                    <Text style={styles.metricTitle}>Statistics Captured</Text>
                    <Text style={styles.metricSub}>Data points & research</Text>
                  </View>
                  <View style={styles.metricCountBox}>
                    <Text style={[styles.metricCount, { color: "#f472b6" }]}>89</Text>
                    <Text style={styles.metricArrow}>›</Text>
                  </View>
                </View>
              </Animated.View>

              {/* Trending In Your Library */}
              <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Trending in Your Library</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAllText}>VIEW INSIGHTS</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
                  <View style={styles.trendingCard}>
                    <LinearGradient colors={["#5c1f8a", "#050014"]} style={styles.trendingImagePlaceholder} />
                    <View style={styles.trendingBadge}><Text style={styles.trendingBadgeText}>TOPIC</Text></View>
                    <View style={styles.trendingDetails}>
                      <Text style={styles.trendingTitle}>AGI Evolution</Text>
                      <Text style={styles.trendingSub}>Discussed in 12 episodes this week.</Text>
                    </View>
                  </View>
                  
                  <View style={styles.trendingCard}>
                    <LinearGradient colors={["#1f3a8a", "#050014"]} style={styles.trendingImagePlaceholder} />
                    <View style={[styles.trendingBadge, { backgroundColor: "rgba(59, 130, 246, 0.8)" }]}><Text style={styles.trendingBadgeText}>CONCEPT</Text></View>
                    <View style={styles.trendingDetails}>
                      <Text style={styles.trendingTitle}>Dopamine Detox</Text>
                      <Text style={styles.trendingSub}>Huberman Lab peak mentions.</Text>
                    </View>
                  </View>
                </ScrollView>
              </Animated.View>

              {/* Ask Podex AI Area */}
              <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.section}>
                <View style={styles.aiCard}>
                  <View style={styles.aiContent}>
                    <View style={styles.aiHeader}>
                      <Text style={styles.aiIcon}>✨</Text>
                      <Text style={styles.aiTitle}>Ask Podex AI</Text>
                    </View>
                    <Text style={styles.aiDescription}>
                      I've indexed 400 hours of your listening history. You can ask me to summarize complex topics or recall specific moments.
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
              
              {/* Bottom Nav Extension Filter */}
              <Animated.View entering={FadeInDown.delay(500).duration(600)} style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 12 }}>
                 {["EPISODES", "QUOTES", "BOOKS", "IDEAS"].map((t, i) => (
                    <TouchableOpacity key={i} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: i === 0 ? "rgba(255,255,255,0.1)" : "transparent" }}>
                        <Text style={{ color: i === 0 ? "#fff" : "#666", fontSize: 11, fontFamily: "Raleway_700Bold", letterSpacing: 1 }}>{t}</Text>
                    </TouchableOpacity>
                 ))}
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
