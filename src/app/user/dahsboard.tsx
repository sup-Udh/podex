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
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";

import BottomNavbar from "../../components/BottomNavbar";

const { width } = Dimensions.get("window");

// Custom Component: Animated Counter
const AnimatedCounter = ({ endValue, label, delay = 0 }: { endValue: number; label: string; delay?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 1500; // 1.5 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      
      // easeOutExpo
      const easePercent = percent === 1 ? 1 : 1 - Math.pow(2, -10 * percent);
      
      setCount(Math.floor(easePercent * endValue));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [endValue, delay]);

  return (
    <View>
      <Text style={styles.statNumber}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

// Custom Component: Knowledge Orb
const KnowledgeOrb = () => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: interpolate(pulse.value, [1, 1.15], [0.6, 1]),
    };
  });

  return (
    <View style={styles.orbContainer}>
      <Animated.View style={[styles.orbCore, animatedStyle]}>
        <LinearGradient
          colors={["rgba(139, 92, 246, 0.8)", "rgba(109, 93, 252, 0.2)", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <BlurView intensity={40} style={StyleSheet.absoluteFill} />
      </Animated.View>
      
      {/* Orb Details */}
      <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.orbStats}>
        <Text style={styles.orbStatText}>247 Insights Connected</Text>
        <Text style={styles.orbStatText}>18 Books Discovered</Text>
        <Text style={styles.orbStatText}>56 Frameworks Captured</Text>
      </Animated.View>
    </View>
  );
};

// Custom Component: Universal Search
const UniversalSearch = () => {
  const placeholders = [
    "What books did Huberman recommend?",
    "Find every mention of creatine...",
    "What podcasts discussed AGI?",
    "Show contradictions about cold exposure..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.searchContainer}>
      <BlurView intensity={30} tint="dark" style={styles.searchBlur}>
        <View style={styles.searchIcon} />
        <Text style={styles.searchText} key={placeholderIndex}>
          {placeholders[placeholderIndex]}
        </Text>
      </BlurView>
    </Animated.View>
  );
};

export default function Dashboard() {
  return (
    <View style={styles.container}>
      {/* Background Gradients */}
      <LinearGradient
        colors={["#000000", "#050014", "#000000"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowTop} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Greeting Section */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.greetingSection}>
          <Text style={styles.greeting}>Good Evening, Udhay</Text>
          <Text style={styles.subtitle}>Your second brain for podcasts.</Text>
        </Animated.View>

        {/* 3. Universal Search (Prominent) */}
        <UniversalSearch />

        {/* 2. Knowledge Orb */}
        <KnowledgeOrb />

        {/* 4. Today's Learning */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Learning</Text>
          <BlurView intensity={20} tint="dark" style={styles.todaysLearningCard}>
            <View style={styles.learningRow}>
              <View style={styles.learningIndicator}>
                <View style={styles.learningDot} />
                <Text style={styles.learningText}>+4 Insights</Text>
              </View>
              <View style={styles.learningIndicator}>
                <View style={styles.learningDot} />
                <Text style={styles.learningText}>+2 Recommendations</Text>
              </View>
            </View>
            <View style={styles.learningRow}>
              <View style={styles.learningIndicator}>
                <View style={styles.learningDot} />
                <Text style={styles.learningText}>+1 Framework</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.listeningTime}>43 minutes listened</Text>
          </BlurView>
        </Animated.View>

        {/* 5. Knowledge Stats */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.section}>
          <View style={styles.statsGrid}>
            <BlurView intensity={15} tint="dark" style={styles.statTile}>
              <AnimatedCounter endValue={247} label="Insights" delay={400} />
            </BlurView>
            <BlurView intensity={15} tint="dark" style={styles.statTile}>
              <AnimatedCounter endValue={18} label="Books" delay={600} />
            </BlurView>
            <BlurView intensity={15} tint="dark" style={styles.statTile}>
              <AnimatedCounter endValue={56} label="Frameworks" delay={800} />
            </BlurView>
            <BlurView intensity={15} tint="dark" style={styles.statTile}>
              <AnimatedCounter endValue={14} label="Debates" delay={1000} />
            </BlurView>
          </View>
        </Animated.View>

        {/* 6. Continue Listening (Hero) */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Listening</Text>
          <TouchableOpacity activeOpacity={0.9}>
            <View style={styles.heroCard}>
              <Image 
                source={{ uri: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/4a/14/83/4a1483ca-3058-294b-1498-38435d8af147/mza_10862024225302636402.jpg/600x600bb.jpg" }} 
                style={StyleSheet.absoluteFill} 
                blurRadius={20}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.heroContent}>
                <Image 
                  source={{ uri: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/4a/14/83/4a1483ca-3058-294b-1498-38435d8af147/mza_10862024225302636402.jpg/600x600bb.jpg" }} 
                  style={styles.heroImage} 
                />
                <View style={styles.heroDetails}>
                  <Text style={styles.heroTitle}>Future of Neural Architectures</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: "73%" }]} />
                  </View>
                  <Text style={styles.progressText}>73% completed</Text>

                  <View style={styles.heroMetaRow}>
                    <Text style={styles.heroMetaText}>23 insights extracted</Text>
                    <Text style={styles.heroMetaText}> • 4 books mentioned</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.resumeButton}>
                <LinearGradient colors={["#8b5cf6", "#6d5dfc"]} style={StyleSheet.absoluteFill} />
                <Text style={styles.resumeButtonText}>Resume Listening →</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* 7. Subscriptions */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={[styles.section, { paddingHorizontal: 0 }]}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>Subscriptions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {[
              { title: "Huberman Lab", img: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/4a/14/83/4a1483ca-3058-294b-1498-38435d8af147/mza_10862024225302636402.jpg/600x600bb.jpg" },
              { title: "Lex Fridman", img: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/80/7e/62/807e627d-7809-5433-8a9d-5a9e7f53f3e7/mza_15509746356708688757.jpg/600x600bb.jpg" },
              { title: "Modern Wisdom", img: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/71/e0/75/71e075c3-1fc3-6ca2-482f-293e4d943891/mza_4708764955743849931.jpg/600x600bb.jpg" },
            ].map((sub, i) => (
              <TouchableOpacity key={i} activeOpacity={0.8}>
                <BlurView intensity={20} tint="dark" style={styles.subCard}>
                  <Image source={{ uri: sub.img }} style={styles.subImage} />
                  <Text style={styles.subTitle} numberOfLines={1}>{sub.title}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* 8. Clip Brain Section */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={[styles.section, { paddingHorizontal: 0 }]}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>Clip Brain</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            
            <BlurView intensity={20} tint="dark" style={styles.clipCard}>
              <View style={styles.clipBadge}>
                <Text style={styles.clipBadgeText}>🔥 Trending Idea</Text>
              </View>
              <Text style={styles.clipQuote}>
                "Cold exposure improves alertness but recovery benefits remain debated."
              </Text>
              <View style={styles.divider} />
              <Text style={styles.clipMetaLabel}>Appears in:</Text>
              <Text style={styles.clipMetaValue}>Huberman Lab, Modern Wisdom, Peter Attia</Text>
            </BlurView>

            <BlurView intensity={20} tint="dark" style={styles.clipCard}>
              <View style={styles.clipBadge}>
                <Text style={styles.clipBadgeText}>📚 Most Mentioned Book</Text>
              </View>
              <Text style={styles.clipQuote}>
                The Psychology of Money
              </Text>
              <View style={styles.divider} />
              <Text style={styles.clipMetaLabel}>Mentioned 11 times across your library.</Text>
            </BlurView>

          </ScrollView>
        </Animated.View>

        {/* 9. Debate Mode */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Debate Mode</Text>
          <BlurView intensity={20} tint="dark" style={styles.debateCard}>
            <View style={styles.debateHeader}>
              <Text style={styles.debateFighter}>Huberman</Text>
              <Text style={styles.debateVS}>VS</Text>
              <Text style={styles.debateFighter}>Attia</Text>
            </View>
            <Text style={styles.debateTopic}>Topic: Cold Exposure</Text>
            
            <View style={styles.debateBody}>
              <View style={styles.debateSide}>
                <Text style={styles.debateSideTitle}>Benefits</Text>
                <Text style={styles.debateSideText}>Dopamine spikes, alertness, metabolic increase.</Text>
              </View>
              <View style={styles.debateDivider} />
              <View style={styles.debateSide}>
                <Text style={styles.debateSideTitle}>Criticisms</Text>
                <Text style={styles.debateSideText}>Blunts hypertrophy if done immediately post-workout.</Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* 10. Recent Discoveries */}
        <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Discoveries</Text>
          <View style={styles.discoveryGrid}>
            {["New Book", "New Framework", "New Idea", "New Guest Mention"].map((item, i) => (
              <BlurView key={i} intensity={25} tint="dark" style={styles.discoveryPill}>
                <Text style={styles.discoveryPillText}>{item}</Text>
              </BlurView>
            ))}
          </View>
        </Animated.View>
        
        {/* Spacer for bottom navbar */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  glowTop: {
    position: "absolute",
    top: -150,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 140,
  },
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Raleway_700Bold",
  },
  subtitle: {
    color: "#8a8a8a",
    fontSize: 16,
    fontFamily: "Raleway_400Regular",
    marginTop: 6,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  searchBlur: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  searchIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#8b5cf6",
    marginRight: 12,
  },
  searchText: {
    color: "#8a8a8a",
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
  },
  orbContainer: {
    alignItems: "center",
    marginBottom: 48,
    marginTop: 10,
  },
  orbCore: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
    overflow: "hidden",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  orbStats: {
    marginTop: 32,
    alignItems: "center",
    gap: 8,
  },
  orbStatText: {
    color: "#e2e2e2",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    marginBottom: 16,
  },
  todaysLearningCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 24,
    overflow: "hidden",
  },
  learningRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  learningIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  learningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8b5cf6",
    marginRight: 8,
  },
  learningText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 16,
  },
  listeningTime: {
    color: "#8a8a8a",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statTile: {
    width: (width - 48 - 12) / 2,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  statNumber: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Raleway_700Bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#8a8a8a",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 20,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  heroDetails: {
    flex: 1,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    marginBottom: 12,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 2,
  },
  progressText: {
    color: "#8b5cf6",
    fontSize: 12,
    fontFamily: "Raleway_600SemiBold",
    marginBottom: 8,
  },
  heroMetaRow: {
    flexDirection: "row",
  },
  heroMetaText: {
    color: "#8a8a8a",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
  },
  resumeButton: {
    marginTop: 20,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  resumeButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
  },
  subCard: {
    width: 140,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 12,
    overflow: "hidden",
  },
  subImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    textAlign: "center",
  },
  clipCard: {
    width: width - 64,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  clipBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  clipBadgeText: {
    color: "#b99eff",
    fontSize: 12,
    fontFamily: "Raleway_700Bold",
  },
  clipQuote: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_600SemiBold",
    lineHeight: 28,
  },
  clipMetaLabel: {
    color: "#8a8a8a",
    fontSize: 13,
    fontFamily: "Raleway_400Regular",
    marginBottom: 4,
  },
  clipMetaValue: {
    color: "#b99eff",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
  },
  debateCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    padding: 24,
    overflow: "hidden",
  },
  debateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 12,
  },
  debateFighter: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
  },
  debateVS: {
    color: "#8b5cf6",
    fontSize: 14,
    fontFamily: "Raleway_700Bold",
  },
  debateTopic: {
    color: "#8a8a8a",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    textAlign: "center",
    marginBottom: 24,
  },
  debateBody: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  debateSide: {
    flex: 1,
  },
  debateSideTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  debateSideText: {
    color: "#8a8a8a",
    fontSize: 13,
    fontFamily: "Raleway_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  debateDivider: {
    width: 2,
    height: "100%",
    backgroundColor: "rgba(139, 92, 246, 0.4)",
    marginHorizontal: 16,
    shadowColor: "#8b5cf6",
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  discoveryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  discoveryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  discoveryPillText: {
    color: "#e2e2e2",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
  },
});