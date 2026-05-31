import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useCallback } from "react";
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
import PremiumBackground from "../../components/PremiumBackground";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { usePlayer } from "../../contexts/PlayerContext";
import { supabase } from "../../services/supabase";

const { width } = Dimensions.get("window");

import { styles } from "../../styles/libraryStyles";

export default function LibraryScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { playEpisode } = usePlayer();
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [listeningHistory, setListeningHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (session?.user) {
        loadPodcasts();
      }
    }, [session])
  );

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      const [podsRes, histRes] = await Promise.all([
        supabase.from("user_podcasts").select("*").eq("user_id", session?.user.id).order("created_at", { ascending: false }),
        supabase.from("user_listening_history").select("*").eq("user_id", session?.user.id).order("updated_at", { ascending: false }).limit(30)
      ]);

      if (!podsRes.error && podsRes.data) {
        setPodcasts(podsRes.data);
      }
      if (!histRes.error && histRes.data) {
        setListeningHistory(histRes.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const currentlyListening = listeningHistory.filter(item => {
    if (!item.duration_millis) return true;
    return (item.position_millis / item.duration_millis) < 0.95;
  }).slice(0, 5);

  const previouslyListened = listeningHistory.filter(item => {
    if (!item.duration_millis) return false;
    return (item.position_millis / item.duration_millis) >= 0.95;
  }).slice(0, 5);

  const subscriptions = podcasts;

  return (
    <SwipeNavigator>
      <View style={styles.container}>
        <PremiumBackground />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <Text style={styles.headerTitle}>Your Library</Text>
            <Text style={styles.headerSubtitle}>Manage your audio ecosystem.</Text>
          </Animated.View>

          {loading ? (
             <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 60 }} />
          ) : (
            <>
              {/* Section A: Currently Listening */}
              {currentlyListening.length > 0 && (
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.section}>
                  <Text style={styles.sectionTitle}>Currently Listening</Text>
                  
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                    {currentlyListening.map((item, i) => {
                      const ep = item.episode_data;
                      const progress = item.duration_millis > 0 ? (item.position_millis / item.duration_millis) * 100 : 0;
                      const minsLeft = item.duration_millis > 0 ? Math.round((item.duration_millis - item.position_millis) / 60000) : 0;
                      
                      return (
                        <View key={item.id} style={styles.activeCard}>
                          <Image source={{ uri: ep.imageUrl }} style={styles.activeImage} />
                          <View style={styles.activeContent}>
                            <Text style={styles.activePodcastName} numberOfLines={1}>{ep.podcastName}</Text>
                            <Text style={styles.activeEpisodeTitle} numberOfLines={2}>{ep.title}</Text>
                            
                            <View style={styles.progressContainer}>
                              <View style={[styles.progressBar, { width: `${progress}%` }]} />
                            </View>
                            <Text style={styles.progressText}>{minsLeft > 0 ? `${minsLeft} mins left` : "Listening..."}</Text>

                            <TouchableOpacity 
                              style={styles.resumeButton} 
                              activeOpacity={0.8} 
                              onPress={() => {
                                playEpisode(ep);
                                router.push("/user/player" as any);
                              }}
                            >
                              <Text style={styles.resumeButtonText}>▶ Resume</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </Animated.View>
              )}

              {/* Section B: Previously Listened */}
              {previouslyListened.length > 0 && (
                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Previously Listened</Text>
                  </View>

                  <View style={styles.queueContainer}>
                    {previouslyListened.map((item, i) => {
                      const ep = item.episode_data;
                      return (
                        <View key={item.id} style={styles.queueItem}>
                          <Image source={{ uri: ep.imageUrl }} style={styles.queueImage} />
                          <View style={styles.queueInfo}>
                            <Text style={styles.queueEpisode} numberOfLines={1}>{ep.title}</Text>
                            <Text style={styles.queueReason} numberOfLines={1}>{ep.podcastName}</Text>
                          </View>
                          <TouchableOpacity 
                            style={styles.queuePlayButton} 
                            onPress={() => {
                              playEpisode(ep);
                              router.push("/user/player" as any);
                            }}
                          >
                            <Text style={styles.queuePlayIcon}>▶</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </Animated.View>
              )}

              {/* Section C: Subscriptions */}
              <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.section, { marginBottom: 100 }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Subscriptions</Text>
                  <TouchableOpacity style={styles.addSubscriptionButton} onPress={() => router.push("/user/search" as any)}>
                    <Text style={styles.addSubscriptionIcon}>+</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.listContainer}>
                  {subscriptions.map((podcast, i) => (
                    <View key={i} style={styles.listItem}>
                      <Image source={{ uri: podcast.artwork_url }} style={styles.listImage} />
                      <View style={styles.listInfo}>
                        <Text style={styles.listTitle} numberOfLines={1}>{podcast.collection_name}</Text>
                        <Text style={styles.listSub} numberOfLines={1}>{podcast.artist_name}</Text>
                      </View>
                      <TouchableOpacity style={styles.listOptionsButton}>
                        <Text style={styles.listOptionsIcon}>⋮</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </Animated.View>
            </>
          )}

        </ScrollView>

        <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}
