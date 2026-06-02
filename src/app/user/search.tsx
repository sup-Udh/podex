import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import PremiumBackground from "../../components/PremiumBackground";
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

  // Clip Brain State
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagClips, setTagClips] = useState<any[]>([]);
  const [loadingClips, setLoadingClips] = useState(false);

  useEffect(() => {
    if (session?.user) {
      loadTags();
    }
  }, [session]);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from("clip_brain_items")
        .select("tag")
        .eq("user_id", session?.user.id);
      
      if (error) throw error;
      
      // Deduplicate tags
      const uniqueTags = Array.from(new Set(data.map(item => item.tag.toLowerCase())));
      setTags(uniqueTags);
    } catch (e) {
      console.error("Failed to load tags:", e);
    }
  };

  const handleTagPress = async (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setTagClips([]);
      return;
    }
    
    setSelectedTag(tag);
    setLoadingClips(true);
    try {
      const { data, error } = await supabase
        .from("clip_brain_items")
        .select("*")
        .eq("user_id", session?.user.id)
        .eq("tag", tag);
        
      if (error) throw error;
      setTagClips(data);
    } catch (e) {
      console.error("Failed to load clips:", e);
    } finally {
      setLoadingClips(false);
    }
  };

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

    const { data: existing } = await supabase
      .from("user_podcasts")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("collection_id", podcast.collectionId)
      .maybeSingle();

    if (existing) {
      Alert.alert("Already Added", `${podcast.collectionName} is already in your library.`);
      setSavingId(null);
      return;
    }

    const { error } = await supabase.from("user_podcasts").insert([podcastData]);

    if (error) {
      console.error("Insert Error:", error);
      Alert.alert("Error", "Could not save podcast: " + JSON.stringify(error));
    } else {
      // Clear Dashboard Cache so it re-fetches with new podcasts!
      await AsyncStorage.removeItem("dashboard_podcasts");
      await AsyncStorage.removeItem("dashboard_episodes");

      Alert.alert("Added to Library!", `${podcast.collectionName} is now in your library.`, [
        { text: "OK", onPress: () => router.push("/user/library" as any) }
      ]);
    }
    setSavingId(null);
  };

  return (
    <SwipeNavigator>
      <View style={styles.container}>
        <PremiumBackground />

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
                            <Text style={styles.saveButtonText}>+</Text>
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
            // Clip Brain UI
            <>
              {/* Dynamic Tag Cloud */}
              <Animated.View entering={FadeInDown.delay(150).duration(600)} style={styles.filtersContainer}>
                <View style={[styles.sectionHeaderRow, { marginBottom: 12, paddingHorizontal: 24 }]}>
                  <Text style={styles.sectionTitle}>Your Clip Brain</Text>
                </View>
                
                {tags.length > 0 ? (
                  <View style={[styles.filterRow, { flexWrap: "wrap", justifyContent: "flex-start", paddingHorizontal: 24, gap: 10 }]}>
                    {tags.map((tag, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        style={[
                          styles.filterPill, 
                          selectedTag === tag && { backgroundColor: "rgba(139, 92, 246, 0.4)", borderColor: "#8b5cf6" }
                        ]}
                        onPress={() => handleTagPress(tag)}
                      >
                        <Text style={[
                          styles.filterText,
                          selectedTag === tag && { color: "#fff" }
                        ]}>
                          # {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={{ color: "#8a8a8a", paddingHorizontal: 24, fontStyle: "italic" }}>
                    Listen to some podcasts to start building your AI Clip Brain.
                  </Text>
                )}
              </Animated.View>

              {/* Tag Clips */}
              {selectedTag && (
                <Animated.View entering={FadeInDown.duration(400)} style={{ marginTop: 24, paddingHorizontal: 24 }}>
                  <Text style={{ color: "#8b5cf6", fontSize: 16, fontFamily: "Raleway_700Bold", marginBottom: 16 }}>
                    Moments tagged with "{selectedTag}"
                  </Text>
                  
                  {loadingClips ? (
                    <ActivityIndicator size="small" color="#8b5cf6" />
                  ) : tagClips.length > 0 ? (
                    <View style={{ gap: 16 }}>
                      {tagClips.map((clip, idx) => (
                        <TouchableOpacity 
                          key={clip.id || idx} 
                          style={{
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderRadius: 16,
                            padding: 16,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.08)"
                          }}
                          onPress={() => router.push(`/user/podcast/${clip.podcast_id}` as any)}
                        >
                          <Text style={{ color: "#fff", fontSize: 15, fontFamily: "Raleway_600SemiBold", marginBottom: 8 }}>
                            "{clip.content}"
                          </Text>
                          <Text style={{ color: "#a1a1aa", fontSize: 13, fontFamily: "Raleway_400Regular", marginBottom: 12 }}>
                            {clip.context}
                          </Text>
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ color: "#8b5cf6", fontSize: 12, fontFamily: "Raleway_700Bold" }}>
                              ⏱️ {clip.timestamp_approx || "Unknown Time"}
                            </Text>
                            <Text style={{ color: "#666", fontSize: 12, marginLeft: "auto", fontFamily: "Raleway_400Regular" }}>
                              Tap to go to episode
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text style={{ color: "#8a8a8a" }}>No clips found for this tag.</Text>
                  )}
                </Animated.View>
              )}

              {/* Ask Podex AI Area */}
              <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.section, { marginTop: 40 }]}>
                <View style={styles.aiCard}>
                  <View style={styles.aiContent}>
                    <View style={styles.aiHeader}>
                      <Text style={styles.aiIcon}>✨</Text>
                      <Text style={styles.aiTitle}>Ask Podex AI</Text>
                    </View>
                    <Text style={styles.aiDescription}>
                      I've indexed your listening history. You can ask me to summarize topics or recall specific moments.
                    </Text>

                    <View style={styles.promptBubble}>
                      <Text style={styles.promptText}>"Summarize Peter Attia's views on Zone 2 training from last week"</Text>
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
