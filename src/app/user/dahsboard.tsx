import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter, useFocusEffect } from "expo-router";
import BottomNavbar from "../../components/BottomNavbar";
import SwipeNavigator from "../../components/SwipeNavigator";
import PremiumBackground from "../../components/PremiumBackground";
import { usePlayer } from "../../contexts/PlayerContext";
import { useAuth } from "../../hooks/useAuth";
import { Episode, fetchEpisodesFromFeed } from "../../services/episodes";
import { supabase } from "../../services/supabase";

const { width } = Dimensions.get("window");

import { styles } from "../../styles/dashboardStyles";

export default function Dashboard() {
  const router = useRouter();
  const { session } = useAuth();
  const { playEpisode } = usePlayer();
  
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [listeningHistory, setListeningHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const isNavigating = useRef(false);

  const handleNavigate = (path: any, action?: () => void) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    if (action) action();
    router.push(path);
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  };

  useFocusEffect(
    useCallback(() => {
      if (session?.user) {
        checkCacheAndLoad();
        loadListeningHistory();
      }
    }, [session])
  );

  const loadListeningHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("user_listening_history")
        .select("*")
        .eq("user_id", session?.user.id)
        .order("updated_at", { ascending: false })
        .limit(10);
      if (!error && data) {
        setListeningHistory(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkCacheAndLoad = async () => {
    try {
      const cachedPods = await AsyncStorage.getItem("dashboard_podcasts");
      const cachedEps = await AsyncStorage.getItem("dashboard_episodes");
      
      if (cachedPods && cachedEps) {
        setPodcasts(JSON.parse(cachedPods));
        setEpisodes(JSON.parse(cachedEps));
        setLoading(false);
        // Fetch fresh data silently to get newly posted eps
        setTimeout(() => loadDashboardData(true), 500);
      } else {
        loadDashboardData();
      }
    } catch (e) {
      loadDashboardData();
    }
  };

  const loadDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
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
      for (const pod of data) {
        if (pod.feed_url) {
          // Yield to event loop to prevent JS thread blocking
          await new Promise(resolve => setTimeout(resolve, 50));
          const eps = await fetchEpisodesFromFeed(pod.feed_url, 20); // Fetch 20 from each to build a robust timeline
          // Inject podcast name and image into episode for UI if missing
          const enhancedEps = eps.map((e: any) => ({
            ...e,
            podcastName: e.podcastName || pod.collection_name,
            imageUrl: e.imageUrl || pod.artwork_url,
            podcastId: pod.collection_id
          }));
          allEpisodes = [...allEpisodes, ...enhancedEps];
        }
      }

      // Sort by date
      allEpisodes.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      try {
        await AsyncStorage.setItem("dashboard_podcasts", JSON.stringify(data));
        await AsyncStorage.setItem("dashboard_episodes", JSON.stringify(allEpisodes));
      } catch (e) {
        console.log("Failed to cache dashboard data", e);
      }
      
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
        <PremiumBackground />

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text style={{ color: "#a1a1aa", marginTop: 16, fontSize: 14, fontFamily: "Raleway_600SemiBold" }}>Syncing Second Brain...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}>
            {podcasts.length === 0 ? (
              <Animated.View entering={FadeInDown.delay(200)} style={{ alignItems: "center", marginTop: 80, paddingHorizontal: 40 }}>
                <Text style={{ color: "#fff", fontSize: 24, textAlign: "center", fontFamily: "Raleway_700Bold", marginBottom: 16 }}>Your brain is empty</Text>
                <Text style={{ color: "#8a8a8a", fontSize: 16, textAlign: "center", marginBottom: 32 }}>Start building your second brain by adding some podcasts to your library.</Text>
                <TouchableOpacity 
                  style={{ backgroundColor: "rgba(139, 92, 246, 0.2)", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: "#8b5cf6" }}
                  onPress={() => handleNavigate("/user/search")}
                >
                  <Text style={{ color: "#fff", fontFamily: "Raleway_700Bold" }}>Find Podcasts</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.heroContainer}>
                  <View>
                    <Text style={styles.heroGreeting}>Good Evening,</Text>
                    <Text style={styles.heroGreeting}>Ready to learn?</Text>
                  </View>
                </Animated.View>

                {/* Subscriptions */}
            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.section, { paddingHorizontal: 0 }]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Your Podcasts</Text>
                <TouchableOpacity onPress={() => handleNavigate("/user/library")}>
                  <Text style={styles.viewAllText}>Library</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
                {podcasts.map((sub) => {
                  const historyEntry = listeningHistory.find(item => item.podcast_id === sub.collection_id);
                  let progress = 0;
                  if (historyEntry && historyEntry.duration_millis > 0) {
                    progress = (historyEntry.position_millis / historyEntry.duration_millis) * 100;
                  }

                  return (
                    <TouchableOpacity key={sub.id} style={styles.subCard} onPress={() => handleNavigate(`/user/podcast/${sub.collection_id}`)}>
                      <Image source={{ uri: sub.artwork_url }} style={styles.subImage} contentFit="cover" />
                      <Text style={styles.subTitle} numberOfLines={1}>{sub.collection_name}</Text>
                      {progress > 0 ? (
                        <View style={{ width: "100%", height: 2, backgroundColor: "rgba(255,255,255,0.1)", marginTop: 6, borderRadius: 1 }}>
                          <View style={{ width: `${progress}%`, height: "100%", backgroundColor: "#8b5cf6", borderRadius: 1 }} />
                        </View>
                      ) : (
                        <View style={{ height: 8 }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>

            {/* Continue Listening */}
            {listeningHistory.length > 0 && (
              <Animated.View entering={FadeInDown.delay(150).duration(600)} style={[styles.section, { paddingHorizontal: 0, marginTop: 16 }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Continue Listening</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
                  {listeningHistory.map((item) => {
                    const ep = item.episode_data;
                    const progress = item.duration_millis > 0 ? (item.position_millis / item.duration_millis) * 100 : 0;
                    
                    return (
                      <TouchableOpacity 
                        key={item.id} 
                        style={{ width: 280, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}
                        onPress={() => handleNavigate("/user/player", () => playEpisode(ep))}
                      >
                        <Image source={{ uri: ep.imageUrl }} style={{ width: "100%", height: 140 }} contentFit="cover" />
                        
                        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "rgba(255,255,255,0.1)" }}>
                          <View style={{ width: `${progress}%`, height: "100%", backgroundColor: "#8b5cf6" }} />
                        </View>
                        
                        <View style={{ padding: 12 }}>
                          <Text style={{ color: "#a1a1aa", fontSize: 12, fontFamily: "Raleway_600SemiBold", marginBottom: 4 }} numberOfLines={1}>{ep.podcastName}</Text>
                          <Text style={{ color: "#fff", fontSize: 14, fontFamily: "Raleway_700Bold" }} numberOfLines={2}>{ep.title}</Text>
                        </View>
                        
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </Animated.View>
            )}

            {/* Latest Episodes */}
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Latest Episodes</Text>
              </View>

              {episodes.slice(0, visibleCount).map((ep, idx) => (
                <View key={ep.id + idx} style={[styles.feedCard, { marginBottom: 16, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }]}>
                  <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.0)"]} style={StyleSheet.absoluteFill} />
                  <View style={styles.feedCardHeader}>
                    <Image source={{ uri: ep.imageUrl }} style={styles.feedCardImage} contentFit="cover" />
                    <View style={styles.feedCardTitleContainer}>
                      <Text style={styles.feedCardContext}>{ep.podcastName}</Text>
                      <Text style={styles.feedCardTitle} numberOfLines={2}>{ep.title}</Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.feedCardSnippet, { marginTop: 12, color: "#a1a1aa" }]} numberOfLines={3}>
                    {ep.description.replace(/<[^>]*>?/gm, '').trim()}
                  </Text>
                  
                  <View style={[styles.feedCardFooter, { marginTop: 16 }]}>
                    <View style={styles.footerLeft}>
                      <Text style={styles.footerTime}>{ep.duration ? ep.duration : new Date(ep.pubDate).toLocaleDateString()}</Text>
                    </View>
                    <TouchableOpacity style={styles.playButtonMini} onPress={() => handleNavigate("/user/player", () => playEpisode(ep))}>
                      <LinearGradient colors={["#ec4899", "#8b5cf6"]} style={StyleSheet.absoluteFill} />
                      <Text style={styles.playButtonMiniIcon}>▶</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {visibleCount < episodes.length && (
                <TouchableOpacity 
                  style={{ alignSelf: "center", marginTop: 24, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24, backgroundColor: "rgba(139, 92, 246, 0.2)", borderWidth: 1, borderColor: "#8b5cf6" }}
                  onPress={() => setVisibleCount(prev => prev + 10)}
                >
                  <Text style={{ color: "#fff", fontFamily: "Raleway_700Bold" }}>Load More Episodes</Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Extracted Insights (Dummy Mode) */}
            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Extracted Insights</Text>
              </View>
              <View style={styles.insightsList}>
                {/* Card 1: Huberman */}
                <View style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <Image source={{ uri: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/600x600bb.jpg" }} style={styles.insightAvatar} />
                    <View style={styles.insightAuthorInfo}>
                      <Text style={styles.insightAuthor}>ANDREW HUBERMAN</Text>
                      <Text style={styles.insightSource}>Huberman Lab • 42:15</Text>
                    </View>
                    <Text style={styles.insightMenuIcon}>⋮</Text>
                  </View>
                  <Text style={styles.insightQuote}>
                    "The primary driver of neuroplasticity isn't just repetition, it's the high-intensity focus followed by deep, non-sleep rest."
                  </Text>
                  <View style={styles.insightScrubberContainer}>
                    <View style={styles.scrubberIconPlaceholder}><Text style={{color:"#888"}}>|||</Text></View>
                    <View style={styles.scrubberLine}>
                      <View style={styles.scrubberProgress} />
                      <View style={styles.scrubberHandle} />
                    </View>
                    <Text style={{color:"#8b5cf6", fontSize:18}}>⚙</Text>
                  </View>
                </View>
                
                {/* Card 2: Naval */}
                <View style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <Image source={{ uri: "https://is4-ssl.mzstatic.com/image/thumb/Podcasts113/v4/a5/d8/56/a5d85600-e1df-9d58-9be5-943f9a7d23a4/mza_4826189914781442145.png/600x600bb.jpg" }} style={styles.insightAvatar} />
                    <View style={styles.insightAuthorInfo}>
                      <Text style={styles.insightAuthor}>NAVAL RAVIKANT</Text>
                      <Text style={styles.insightSource}>Joe Rogan Experience • 01:12:04</Text>
                    </View>
                    <Text style={styles.insightMenuIcon}>⋮</Text>
                  </View>
                  <Text style={styles.insightQuote}>
                    "Specific knowledge is the knowledge that you cannot be trained for. If society can train you, it can train someone else, and replace you."
                  </Text>
                  <View style={styles.insightScrubberContainer}>
                    <View style={styles.scrubberIconPlaceholder}><Text style={{color:"#888"}}>|||</Text></View>
                    <View style={styles.scrubberLine}>
                      <View style={[styles.scrubberProgress, {width: "20%"}]} />
                      <View style={[styles.scrubberHandle, {left: "20%"}]} />
                    </View>
                    <Text style={{color:"#8b5cf6", fontSize:16}}>🔗</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Ask Podex AI */}
            <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.aiAskContainer}>
              <LinearGradient colors={["rgba(139, 92, 246, 0.3)", "rgba(20, 20, 25, 0.5)"]} style={StyleSheet.absoluteFill} />
              <View style={styles.aiAskInner}>
                <Text style={styles.aiAskIcon}>✨</Text>
                <TextInput 
                  style={styles.aiAskInput}
                  placeholder="Ask Podex AI about your podcasts..."
                  placeholderTextColor="#a1a1aa"
                />
                <Text style={styles.aiAskMic}>🎙️</Text>
              </View>
            </Animated.View>

            {/* Spacer for bottom navbar */}
            <View style={{ height: 40 }} />
          </>
          )}
        </ScrollView>
      )}

      <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}
