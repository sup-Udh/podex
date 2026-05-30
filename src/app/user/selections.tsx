import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabase";

const { width } = Dimensions.get("window");

const CREATORS = [
  { id: "1", name: "Lex Fridman", image: "https://lexfridman.com/wordpress/wp-content/uploads/2023/02/lex_fridman_podcast_cover_art.jpg" },
  { id: "2", name: "Joe Rogan", image: "https://upload.wikimedia.org/wikipedia/en/2/23/The_Joe_Rogan_Experience.jpg" },
  { id: "3", name: "Huberman Lab", image: "https://m.media-amazon.com/images/I/41Jk33P4xOL._SL500_.jpg" },
  { id: "4", name: "My First Million", image: "https://m.media-amazon.com/images/M/MV5BNWE1ZGY5MjMtNDdmMy00MGMwLWI4ODctYTMyZTk2NzcwMGE4XkEyXkFqcGc@._V1_.jpg" },
  { id: "5", name: "Acquired", image: "https://m.media-amazon.com/images/I/41-UuNnO4aL.jpg" },
  { id: "6", name: "All-In", image: "https://i.scdn.co/image/ab6765630000ba8a7eef1df5d45d654ed9ef3f19" },
];

export default function SelectionsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCreator = (id: string) => {
    if (selectedCreators.includes(id)) {
      setSelectedCreators((prev) => prev.filter((t) => t !== id));
    } else {
      setSelectedCreators((prev) => [...prev, id]);
    }
  };

  const handleFinish = async () => {
    if (!session?.user) return;
    setLoading(true);
    
    // Finalize onboarding in database
    await supabase
      .from("profiles")
      .update({ has_onboarded: true })
      .eq("id", session.user.id);

    setLoading(false);
    router.replace("/user/dahsboard" as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#050014", "#0a0020", "#000000"]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 0.8, 1]}
      />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Animated.Text
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.greeting}
        >
          Almost done
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.title}
        >
          Select a few podcasts to seed your brain.
        </Animated.Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            style={styles.gridContainer}
          >
            {CREATORS.map((creator) => {
              const isSelected = selectedCreators.includes(creator.id);
              return (
                <TouchableOpacity
                  key={creator.id}
                  activeOpacity={0.8}
                  onPress={() => toggleCreator(creator.id)}
                  style={[
                    styles.creatorCard,
                    isSelected && styles.creatorCardSelected,
                  ]}
                >
                  <Image source={creator.image} style={styles.creatorImage} contentFit="cover" />
                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.creatorName} numberOfLines={1}>{creator.name}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </ScrollView>

        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.footer}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedCreators.length === 0 && styles.continueButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleFinish}
            disabled={loading || selectedCreators.length === 0}
          >
            {selectedCreators.length > 0 && (
              <LinearGradient
                colors={["#8b5cf6", "#6d28d9"]}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text
              style={[
                styles.continueText,
                selectedCreators.length === 0 && styles.continueTextDisabled,
              ]}
            >
              {loading ? "Finalizing Setup..." : "Complete Setup"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 22,
  },
  greeting: {
    color: "#8b5cf6",
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    lineHeight: 36,
    marginBottom: 32,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  creatorCard: {
    width: (width - 48 - 16) / 2,
    backgroundColor: "rgba(20,20,25,0.6)",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  creatorCardSelected: {
    borderColor: "#8b5cf6",
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  creatorImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_700Bold",
  },
  creatorName: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 24,
    right: 24,
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  continueTextDisabled: {
    color: "#666",
  },
});
