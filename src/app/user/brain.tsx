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

const { width } = Dimensions.get("window");

export default function BrainScreen() {
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

              <TouchableOpacity style={styles.playClipButton} activeOpacity={0.8}>
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

              <TouchableOpacity style={styles.playClipButton} activeOpacity={0.8}>
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

              <TouchableOpacity style={styles.playClipButton} activeOpacity={0.8}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  glowBackground: {
    position: "absolute",
    top: -50,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(139, 92, 246, 0.08)",
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#8b5cf6",
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
    marginBottom: 16,
  },
  statsPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statsPillText: {
    color: "#ccc",
    fontSize: 12,
    fontFamily: "Raleway_600SemiBold",
  },
  searchBoxContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 25, 0.8)",
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
  },
  vaultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  vaultCard: {
    width: (width - 48 - 12) / 2,
    backgroundColor: "rgba(20,20,25,0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  vaultIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  vaultIcon: {
    fontSize: 16,
  },
  vaultInfo: {},
  vaultCount: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    marginBottom: 2,
  },
  vaultTitle: {
    color: "#8a8a8a",
    fontSize: 12,
    fontFamily: "Raleway_600SemiBold",
  },
  fragmentsList: {
    gap: 16,
  },
  fragmentCard: {
    backgroundColor: "rgba(20,20,25,0.6)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  fragmentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  fragmentBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fragmentBadgeText: {
    color: "#34d399",
    fontSize: 10,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 1,
  },
  fragmentSource: {
    color: "#666",
    fontSize: 12,
    fontFamily: "Raleway_600SemiBold",
  },
  fragmentQuote: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway_400Regular",
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: 20,
  },
  playClipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  playClipIcon: {
    color: "#fff",
    fontSize: 10,
    marginRight: 8,
  },
  playClipText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Raleway_700Bold",
  },
});
