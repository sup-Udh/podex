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

import { useRouter } from "expo-router";
import { supabase } from "../../services/supabase";
import { styles } from "../../styles/profileStyles";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/landing" as any);
  };

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
            <TouchableOpacity 
              style={styles.logoutButton} 
              activeOpacity={0.8}
              onPress={handleLogout}
            >
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
