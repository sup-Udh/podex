import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useMemo } from "react";
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
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

import { useRouter } from "expo-router";
import BottomNavbar from "../../components/BottomNavbar";
import SwipeNavigator from "../../components/SwipeNavigator";
import { usePlayer } from "../../contexts/PlayerContext";
import { useAuth } from "../../hooks/useAuth";
import { Episode, fetchEpisodesFromFeed } from "../../services/episodes";
import { supabase } from "../../services/supabase";

const { width } = Dimensions.get("window");

import { styles } from "../../styles/dashboardStyles";

let cachedPodcasts: any[] | null = null;
let cachedEpisodes: Episode[] | null = null;

const DUMMY_COVERS = [
  "https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/600x600bb.jpg",
  "https://is4-ssl.mzstatic.com/image/thumb/Podcasts113/v4/a5/d8/56/a5d85600-e1df-9d58-9be5-943f9a7d23a4/mza_4826189914781442145.png/600x600bb.jpg",
  "https://is2-ssl.mzstatic.com/image/thumb/Podcasts113/v4/b8/b5/02/b8b5020c-c60f-21b2-03e1-3829033328e3/mza_7584102986427306354.jpg/600x600bb.jpg",
  "https://is3-ssl.mzstatic.com/image/thumb/Podcasts123/v4/4a/14/08/4a1408db-fcae-5e1a-ec4b-c72eb82e88a0/mza_10839846387034926584.jpg/600x600bb.jpg",
  "https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/80/7e/61/807e61a4-cd8d-4e20-bfcc-7290eb4ff0ad/mza_9407338023194511210.png/600x600bb.jpg",
];

const DashboardLoader = () => {
  const floatingCards = useMemo(() => {
    const cols = 4;
    const cellWidth = width / cols;
    const cellHeight = 800 / 8;

    return Array.from({ length: 32 }).map((_, index: number) => {
      const size = 65 + Math.random() * 55;
      const col = index % cols;
      const row = Math.floor(index / cols);
      const baseX = col * cellWidth;
      const baseY = row * cellHeight;
      const jitterX = (Math.random() - 0.5) * (cellWidth * 1.2);
      const jitterY = (Math.random() - 0.5) * (cellHeight * 1.2);

      return {
        url: DUMMY_COVERS[index % DUMMY_COVERS.length],
        top: baseY + jitterY,
        left: baseX + jitterX - (size / 2) + 40,
        rotate: Math.random() * 40 - 20,
        size,
        opacity: 0.10 + Math.random() * 0.30,
      };
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
       {floatingCards.map((card, idx) => (
         <Animated.View
            entering={FadeIn.delay(idx * 35)}
            key={idx}
            pointerEvents="none"
            style={{ position: 'absolute', top: card.top, left: card.left, transform: [{ rotate: `${card.rotate}deg` }] }}
         >
            <Image source={{ uri: card.url }} style={{ width: card.size, height: card.size, borderRadius: 24, opacity: card.opacity }} />
         </Animated.View>
       ))}
       <LinearGradient
         colors={["transparent", "rgba(0,0,0,0.85)", "#000000"]}
         locations={[0.2, 0.55, 1]}
         style={StyleSheet.absoluteFill}
         pointerEvents="none"
       />
       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", zIndex: 10 }}>
         <ActivityIndicator size="large" color="#8b5cf6" />
         <Text style={{ color: "#fff", marginTop: 16, fontSize: 16, fontFamily: "Raleway_600SemiBold", letterSpacing: 1 }}>Syncing Second Brain...</Text>
       </View>
    </View>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const { session } = useAuth();
  const { playEpisode } = usePlayer();
  
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (session?.user) {
      if (cachedPodcasts && cachedEpisodes) {
        setPodcasts(cachedPodcasts);
        setEpisodes(cachedEpisodes);
        setLoading(false);
      } else {
        loadDashboardData();
      }
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
            const eps = await fetchEpisodesFromFeed(pod.feed_url, 20); // Fetch 20 from each to build a robust timeline
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
      
      cachedPodcasts = data;
      cachedEpisodes = allEpisodes;
      
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
        colors={["#0f0524", "#13072e", "#050014"]}
        style={StyleSheet.absoluteFill}
      />
      {/* Vibrant Ambient Orbs */}
      <View style={[styles.glowBackground, { backgroundColor: "rgba(139, 92, 246, 0.25)", top: -100, right: -150 }]} />
      <View style={[styles.glowBackground, { backgroundColor: "rgba(236, 72, 153, 0.15)", top: 200, left: -200, width: 400, height: 400 }]} />
      <View style={[styles.glowBackground, { backgroundColor: "rgba(59, 130, 246, 0.15)", bottom: -100, right: -50, width: 300, height: 300 }]} />

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
                    <TouchableOpacity style={styles.playButtonMini} onPress={() => {
                      playEpisode(ep);
                      router.push("/user/player" as any);
                    }}>
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
        </ScrollView>
      )}

      <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}
