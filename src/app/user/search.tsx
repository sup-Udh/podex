import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from "react-native-reanimated";

import BottomNavbar from "../../components/BottomNavbar";
import SwipeNavigator from "../../components/SwipeNavigator";

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
        withSequence(ges
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
      <Particle delay={1000} startX={80} startY={120} endX={180} endY={150} size={20} opacity={0.2} />
      <Particle delay={1500} startX={250} startY={40} endX={220} endY={100} size={12} opacity={0.35} />
      <Particle delay={200} startX={280} startY={150} endX={200} endY={180} size={18} opacity={0.25} />
      <Particle delay={800} startX={40} startY={200} endX={90} endY={160} size={14} opacity={0.3} />
      {/* Heavy blur to make them look like glowing orbs */}
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};

export default function SearchScreen() {
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
          <Text style={styles.headerTitle}>Search Everything You've Heard</Text>
          <Text style={styles.headerSubtitle}>Ask your podcast memory anything</Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.searchBoxContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Summary of All-In Podcast..."
              placeholderTextColor="#666"
            />
            <Text style={styles.micIcon}>🎤</Text>
          </View>
        </Animated.View>

        {/* Filter Pills */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterPill}><Text style={styles.filterText}>📚 Books</Text></View>
            <View style={styles.filterPill}><Text style={styles.filterText}>🧠 Frameworks</Text></View>
          </View>
          <View style={styles.filterRow}>
            <View style={styles.filterPill}><Text style={styles.filterText}>💊 Supplements</Text></View>
            <View style={styles.filterPill}><Text style={styles.filterText}>👥 Guests</Text></View>
          </View>
          <View style={styles.filterRow}>
            <View style={[styles.filterPill, styles.filterPillActive]}>
              <Text style={styles.filterTextActive}>📈 Statistics</Text>
            </View>
          </View>
        </Animated.View>

        {/* Metric Cards */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.metricsContainer}>
          {[
            { icon: "📘", title: "Books Mentioned", sub: "Syncing with GoodReads...", count: "124" },
            { icon: "🧩", title: "Frameworks Gained", sub: "Models for better thinking.", count: "42" },
            { icon: "👤", title: "Guests Discovered", sub: "Profiles across episodes.", count: "312" },
            { icon: "📊", title: "Statistics Captured", sub: "Data points & research", count: "89" },
          ].map((item, i) => (
            <View key={i} style={styles.metricCard}>
              <View style={styles.metricIconBox}>
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

        <View style={{ height: 100 }} />
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
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "#8a8a8a",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
  },
  searchBoxContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
  },
  micIcon: {
    fontSize: 16,
    marginLeft: 12,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  filterPill: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  filterPillActive: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
  },
  filterText: {
    color: "#aaa",
    fontSize: 13,
    fontFamily: "Raleway_600SemiBold",
  },
  filterTextActive: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Raleway_600SemiBold",
  },
  metricsContainer: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 40,
  },
  metricCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20,20,25,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  metricIcon: {
    fontSize: 18,
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
    marginBottom: 4,
  },
  metricSub: {
    color: "#777",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
  },
  metricCountBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricCount: {
    color: "#b99eff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    marginRight: 8,
  },
  metricArrow: {
    color: "#444",
    fontSize: 12,
  },
  section: {
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    width: "60%",
    lineHeight: 28,
  },
  viewAllText: {
    color: "#5c8df6",
    fontSize: 12,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 0.5,
  },
  trendingCard: {
    width: 280,
    backgroundColor: "rgba(20,20,25,0.6)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  trendingImagePlaceholder: {
    height: 120,
    width: "100%",
  },
  trendingBadge: {
    position: "absolute",
    top: 90,
    left: 16,
    backgroundColor: "rgba(139, 92, 246, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 1,
  },
  trendingDetails: {
    padding: 16,
    paddingTop: 24,
  },
  trendingTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
    marginBottom: 4,
  },
  trendingSub: {
    color: "#8a8a8a",
    fontSize: 13,
    fontFamily: "Raleway_400Regular",
  },
  aiCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    overflow: "hidden",
    backgroundColor: "rgba(20, 20, 25, 0.8)",
  },
  aiContent: {
    padding: 24,
    zIndex: 2, // ensure content sits above particle background
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aiTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
  },
  aiDescription: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
    lineHeight: 22,
    marginBottom: 24,
  },
  promptBubble: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  promptText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Raleway_400Regular",
    fontStyle: "italic",
    lineHeight: 20,
  },
});
