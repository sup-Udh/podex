import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
      <Particle delay={1000} startX={80} startY={120} endX={180} endY={150} size={20} opacity={0.2} />
      <Particle delay={1500} startX={250} startY={40} endX={220} endY={100} size={12} opacity={0.35} />
      <Particle delay={200} startX={280} startY={150} endX={200} endY={180} size={18} opacity={0.25} />
      <Particle delay={800} startX={40} startY={200} endX={90} endY={160} size={14} opacity={0.3} />
      {/* Heavy blur to make them look like glowing orbs */}
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};

import { styles } from "../../styles/searchStyles";

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
