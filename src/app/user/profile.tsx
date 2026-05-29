import { LinearGradient } from "expo-linear-gradient";
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

export default function ProfileScreen() {
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
            <Text style={styles.headerTitle}>Account & Settings</Text>
          </Animated.View>

          {/* Section A: User Identity Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.section}>
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarGlow} />
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>U</Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Udhay</Text>
                <Text style={styles.profileEmail}>udhay@podex.ai</Text>
              </View>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PODEX PRO</Text>
              </View>
            </View>
          </Animated.View>

          {/* Section B: Knowledge Base Settings */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Knowledge Base</Text>
            
            <View style={styles.settingsGroup}>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemContent}>
                  <Text style={styles.settingsItemTitle}>AI Curation Preferences</Text>
                  <Text style={styles.settingsItemSub}>Tune your Second Brain models</Text>
                </View>
                <Text style={styles.chevron}>❯</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemContent}>
                  <Text style={styles.settingsItemTitle}>Export Knowledge Base</Text>
                  <Text style={styles.settingsItemSub}>Download as CSV or Markdown</Text>
                </View>
                <Text style={styles.chevron}>❯</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />

            
            </View>
          </Animated.View>

          {/* Section D: Danger Zone */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.section}>
            <Text style={styles.sectionTitleDanger}>Danger Zone</Text>
            
            <View style={styles.dangerGroup}>
              <TouchableOpacity style={styles.dangerItem}>
                <View style={styles.settingsItemContent}>
                  <Text style={styles.dangerItemTitle}>Clear AI Data & History</Text>
                  <Text style={styles.dangerItemSub}>Wipe your search and extraction history</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.dangerDivider} />

              <TouchableOpacity style={styles.dangerItem}>
                <View style={styles.settingsItemContent}>
                  <Text style={styles.dangerItemTitle}>Delete Account</Text>
                  <Text style={styles.dangerItemSub}>Permanently delete your profile and data</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomNavbar />
      </View>
    </SwipeNavigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContent: { paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 32 },
  headerTitle: { color: "#fff", fontSize: 28, fontFamily: "Raleway_700Bold", marginBottom: 4 },
  section: { paddingHorizontal: 24, marginBottom: 40 },
  sectionTitle: { color: "#fff", fontSize: 20, fontFamily: "Raleway_700Bold", marginBottom: 16 },
  sectionTitleDanger: { color: "#ef4444", fontSize: 20, fontFamily: "Raleway_700Bold", marginBottom: 16 },
  
  // User Identity Header
  profileCard: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(20,20,25,0.6)", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)" },
  avatarContainer: { marginRight: 20, justifyContent: "center", alignItems: "center" },
  avatarGlow: { position: "absolute", width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(139, 92, 246, 0.5)", shadowColor: "#8b5cf6", shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  avatarBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#1e1b4b", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#8b5cf6", zIndex: 2 },
  avatarText: { color: "#fff", fontSize: 24, fontFamily: "Raleway_700Bold" },
  profileInfo: { flex: 1 },
  profileName: { color: "#fff", fontSize: 20, fontFamily: "Raleway_700Bold", marginBottom: 4 },
  profileEmail: { color: "#8a8a8a", fontSize: 13, fontFamily: "Raleway_400Regular" },
  proBadge: { backgroundColor: "rgba(139, 92, 246, 0.2)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.5)" },
  proBadgeText: { color: "#b99eff", fontSize: 10, fontFamily: "Raleway_700Bold", letterSpacing: 1 },

  // Settings Group
  settingsGroup: { backgroundColor: "rgba(20,20,25,0.6)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  settingsItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  settingsIcon: { fontSize: 20, marginRight: 16, width: 24, textAlign: "center" },
  settingsItemContent: { flex: 1 },
  settingsItemTitle: { color: "#fff", fontSize: 15, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  settingsItemSub: { color: "#666", fontSize: 12, fontFamily: "Raleway_400Regular" },
  chevron: { color: "#444", fontSize: 14 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginHorizontal: 16 },

  // Danger Group
  dangerGroup: { backgroundColor: "rgba(69, 10, 10, 0.2)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(239, 68, 68, 0.3)", marginBottom: 24 },
  dangerItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  dangerIcon: { fontSize: 20, marginRight: 16, width: 24, textAlign: "center" },
  dangerItemTitle: { color: "#fca5a5", fontSize: 15, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  dangerItemSub: { color: "#991b1b", fontSize: 12, fontFamily: "Raleway_400Regular" },
  dangerDivider: { height: 1, backgroundColor: "rgba(239, 68, 68, 0.1)", marginHorizontal: 16 },

  // Logout
  logoutButton: { backgroundColor: "rgba(255,255,255,0.05)", paddingVertical: 16, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  logoutButtonText: { color: "#fff", fontSize: 15, fontFamily: "Raleway_700Bold" },
});
