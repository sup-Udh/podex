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

import { styles } from "../../styles/libraryStyles";

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
