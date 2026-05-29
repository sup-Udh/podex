import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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

const { width } = Dimensions.get("window");

import { styles } from "../../styles/dashboardStyles";

export default function Dashboard() {
  return (
    <SwipeNavigator>
      <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#050014", "#000000"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowBackground} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Search Bar */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.searchContainer}>
          <View style={styles.searchPill}>
            <Text style={styles.searchIcon}>✨</Text>
            <Text style={styles.searchText}>Search everything you've ever heard...</Text>
          </View>
        </Animated.View>

        {/* 2. Daily Investigation Hero */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.section}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
              style={StyleSheet.absoluteFill}
            />
            {/* Ambient Background Element */}
            <View style={styles.heroAmbientGlow} />

            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Daily Investigation</Text>
              </View>
              <Text style={styles.heroTimeText}>5m</Text>
            </View>

            <Text style={styles.heroTitle}>
              Summary: The Future of Neural Architectures
            </Text>
            <Text style={styles.heroDescription}>
              Aggregated from 'The AI Podcast' and 'Lex Fridman'. Key takeaway: Transformers are evolving into liquid neural...
            </Text>

            <TouchableOpacity style={styles.heroButton} activeOpacity={0.8}>
              <LinearGradient colors={["#4b4073", "#2c244b"]} style={StyleSheet.absoluteFill} />
              <Text style={styles.heroButtonIcon}>▶</Text>
              <Text style={styles.heroButtonText}>Listen to Summary</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 3. Your Subscriptions */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Subscriptions</Text>
            <Text style={styles.viewAllText}>View All</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {[
              { title: "Tech Deconstructed", img: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/4a/14/83/4a1483ca-3058-294b-1498-38435d8af147/mza_10862024225302636402.jpg/600x600bb.jpg" },
              { title: "Modern Stoic", img: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/80/7e/62/807e627d-7809-5433-8a9d-5a9e7f53f3e7/mza_15509746356708688757.jpg/600x600bb.jpg" },
              { title: "Cosmic Horizon", img: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/71/e0/75/71e075c3-1fc3-6ca2-482f-293e4d943891/mza_4708764955743849931.jpg/600x600bb.jpg" },
            ].map((sub, i) => (
              <View key={i} style={styles.subCard}>
                <Image source={{ uri: sub.img }} style={styles.subImage} />
                <View style={styles.subBadge}>
                  <Text style={styles.subBadgeText}>60m left</Text>
                </View>
                <Text style={styles.subTitle} numberOfLines={1}>{sub.title}</Text>
                <View style={styles.subUnderline} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* 4. Tags */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.section}>
          <View style={styles.tagsContainer}>
            {["Neuroscience", "Philosophy", "AI Systems", "Health"].map((tag, i) => (
              <View key={i} style={styles.tagPill}>
                <View style={styles.tagDot} />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* 5. Extracted Insights */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Extracted Insights</Text>
          <View style={styles.insightsList}>
            {/* Insight 1 */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Image source={{ uri: "https://via.placeholder.com/50/333333/ffffff?text=AH" }} style={styles.insightAvatar} />
                <View style={styles.insightAuthorInfo}>
                  <Text style={styles.insightAuthor}>ANDREW HUBERMAN</Text>
                  <Text style={styles.insightSource}>Huberman Lab • 4m 32s</Text>
                </View>
                <Text style={styles.insightMenuIcon}>⋮</Text>
              </View>
              
              <Text style={styles.insightQuote}>
                "The primary driver of neuroplasticity isn't just repetition, it's the high-intensity focus followed by deep, non-sleep rest."
              </Text>
              
              <View style={styles.insightScrubberContainer}>
                <View style={styles.scrubberIconPlaceholder}><Text style={{color: '#8b5cf6'}}>▶</Text></View>
                <View style={styles.scrubberLine}>
                  <View style={styles.scrubberProgress} />
                  <View style={styles.scrubberHandle} />
                </View>
                <Text style={styles.insightMenuIcon}>➦</Text>
              </View>
            </View>

            {/* Insight 2 */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Image source={{ uri: "https://via.placeholder.com/50/333333/ffffff?text=NR" }} style={styles.insightAvatar} />
                <View style={styles.insightAuthorInfo}>
                  <Text style={styles.insightAuthor}>NAVAL RAVIKANT</Text>
                  <Text style={styles.insightSource}>Joe Rogan Experience • 1h 12m</Text>
                </View>
                <Text style={styles.insightMenuIcon}>⋮</Text>
              </View>
              
              <Text style={styles.insightQuote}>
                "Specific knowledge is the knowledge that you cannot be trained for. If society can train you, it can train someone else, and replace you."
              </Text>
              
              <View style={styles.insightScrubberContainer}>
                <View style={styles.scrubberIconPlaceholder}><Text style={{color: '#8b5cf6'}}>▶</Text></View>
                <View style={styles.scrubberLine}>
                  <View style={[styles.scrubberProgress, {width: "20%"}]} />
                  <View style={styles.scrubberHandle} />
                </View>
                <Text style={styles.insightMenuIcon}>➦</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* 6. Debate Mode */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.section}>
          <View style={{flexDirection: "row", alignItems: "center", marginBottom: 16}}>
            <Text style={{fontSize: 16, marginRight: 8}}>⚔️</Text>
            <Text style={[styles.sectionTitle, {marginBottom: 0}]}>Debate Mode</Text>
          </View>
          
          <View style={styles.debateCard}>
            <Text style={styles.debateTopic}>TOPIC: AUGUST 2024</Text>
            <Text style={styles.debateTitle}>Efficacy of Cold Exposure</Text>

            <View style={styles.debateColumns}>
              <View style={styles.debateSide}>
                <Text style={styles.debateProLabel}>Huberman</Text>
                <Text style={styles.debateText}>
                  Argues it elevates spikes in immune system fortifications through consistent exposure.
                </Text>
              </View>
              <View style={styles.debateDivider} />
              <View style={styles.debateSide}>
                <Text style={styles.debateConLabel}>Attia</Text>
                <Text style={styles.debateText}>
                  Points out data suggests limited recovery benefit if performed too close to hypertrophy training.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Spacer for bottom navbar */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}
