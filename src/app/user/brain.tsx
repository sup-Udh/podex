import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import BottomNavbar from "../../components/BottomNavbar";
import SwipeNavigator from "../../components/SwipeNavigator";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

import { styles } from "../../styles/brainStyles";

export default function BrainScreen() {
  const router = useRouter();

  return (
    <SwipeNavigator>
      <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#050014", "#000000"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowBackground} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Section A: Header & Deep Search */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.headerTitle}>Clip Brain</Text>
          <Text style={styles.headerSubtitle}>Your Audio Memory.</Text>
          
          <View style={styles.statsPill}>
            <Text style={styles.statsPillText}>Indexing 200 hours • 730 Insights Extracted</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.searchBoxContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🧠</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search for testosterone, dopamine, naval..."
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
          </View>
        </Animated.View>

        {/* Section B: Insight Vault (Categories Grid) */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>The Insight Vault</Text>
          
          <View style={styles.vaultGrid}>
            {[
              { icon: "📚", title: "Books Recommended", count: 300, color: "rgba(139, 92, 246, 0.15)" },
              { icon: "💊", title: "Supplements & Health", count: 150, color: "rgba(16, 185, 129, 0.15)" },
              { icon: "🧠", title: "Frameworks & Models", count: 80, color: "rgba(59, 130, 246, 0.15)" },
              { icon: "⚡", title: "Contrarian Takes", count: 200, color: "rgba(239, 68, 68, 0.15)" },
              { icon: "📊", title: "Statistics Cited", count: 95, color: "rgba(245, 158, 11, 0.15)" },
              { icon: "💡", title: "Actionable Tips", count: 412, color: "rgba(236, 72, 153, 0.15)" },
            ].map((cat, i) => (
              <TouchableOpacity key={i} activeOpacity={0.8} style={styles.vaultCard}>
                <View style={[styles.vaultIconBox, { backgroundColor: cat.color }]}>
                  <Text style={styles.vaultIcon}>{cat.icon}</Text>
                </View>
                <View style={styles.vaultInfo}>
                  <Text style={styles.vaultCount}>{cat.count}</Text>
                  <Text style={styles.vaultTitle}>{cat.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Section C: Recent Memory Fragments */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Fragments</Text>
          </View>

          <View style={styles.fragmentsList}>
            {/* Fragment 1 */}
            <View style={styles.fragmentCard}>
              <View style={styles.fragmentTopRow}>
                <View style={styles.fragmentBadge}>
                  <Text style={styles.fragmentBadgeText}>💊 SUPPLEMENT</Text>
                </View>
                <Text style={styles.fragmentSource}>Huberman Lab</Text>
              </View>
              
              <Text style={styles.fragmentQuote}>
                "Tongkat Ali at 400mg per day has been shown to increase free testosterone by reducing sex hormone-binding globulin."
              </Text>

              <TouchableOpacity style={styles.playClipButton} activeOpacity={0.8} onPress={() => router.push("/user/player" as any)}>
                <LinearGradient colors={["rgba(139, 92, 246, 0.4)", "rgba(139, 92, 246, 0.1)"]} style={StyleSheet.absoluteFill} />
                <Text style={styles.playClipIcon}>▶</Text>
                <Text style={styles.playClipText}>Play Clip at 1:14:32</Text>
              </TouchableOpacity>
            </View>

            {/* Fragment 2 */}
            <View style={styles.fragmentCard}>
              <View style={styles.fragmentTopRow}>
                <View style={[styles.fragmentBadge, { backgroundColor: "rgba(59, 130, 246, 0.2)" }]}>
                  <Text style={[styles.fragmentBadgeText, { color: "#60a5fa" }]}>🧠 FRAMEWORK</Text>
                </View>
                <Text style={styles.fragmentSource}>Naval Podcast</Text>
              </View>
              
              <Text style={styles.fragmentQuote}>
                "Play iterated games. All the returns in life, whether in wealth, relationships, or knowledge, come from compound interest."
              </Text>

              <TouchableOpacity style={styles.playClipButton} activeOpacity={0.8} onPress={() => router.push("/user/player" as any)}>
                <LinearGradient colors={["rgba(139, 92, 246, 0.4)", "rgba(139, 92, 246, 0.1)"]} style={StyleSheet.absoluteFill} />
                <Text style={styles.playClipIcon}>▶</Text>
                <Text style={styles.playClipText}>Play Clip at 22:15</Text>
              </TouchableOpacity>
            </View>

            {/* Fragment 3 */}
            <View style={styles.fragmentCard}>
              <View style={styles.fragmentTopRow}>
                <View style={[styles.fragmentBadge, { backgroundColor: "rgba(139, 92, 246, 0.2)" }]}>
                  <Text style={[styles.fragmentBadgeText, { color: "#b99eff" }]}>📚 BOOK REC</Text>
                </View>
                <Text style={styles.fragmentSource}>Lex Fridman</Text>
              </View>
              
              <Text style={styles.fragmentQuote}>
                "If you haven't read 'The Beginning of Infinity' by David Deutsch, it completely changes how you view knowledge creation."
              </Text>

              <TouchableOpacity style={styles.playClipButton} activeOpacity={0.8} onPress={() => router.push("/user/player" as any)}>
                <LinearGradient colors={["rgba(139, 92, 246, 0.4)", "rgba(139, 92, 246, 0.1)"]} style={StyleSheet.absoluteFill} />
                <Text style={styles.playClipIcon}>▶</Text>
                <Text style={styles.playClipText}>Play Clip at 2:03:41</Text>
              </TouchableOpacity>
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
