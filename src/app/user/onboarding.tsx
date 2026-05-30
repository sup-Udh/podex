import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabase";

const { width } = Dimensions.get("window");

const TOPICS = [
  "Technology",
  "Artificial Intelligence",
  "Startup & Business",
  "Science & Physics",
  "True Crime",
  "History",
  "Comedy",
  "Health & Huberman",
  "Design",
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const userName = useMemo(() => {
    if (!session?.user) return "there";
    
    // Check if Google provided a full name
    const fullName = session.user.user_metadata?.full_name;
    if (fullName) return fullName.split(" ")[0];

    // Otherwise extract from email
    const email = session.user.email;
    if (email) {
      const prefix = email.split("@")[0];
      // remove dots and capitalize
      const cleanName = prefix.split(".")[0];
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
    return "there";
  }, [session]);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics((prev) => prev.filter((t) => t !== topic));
    } else {
      setSelectedTopics((prev) => [...prev, topic]);
    }
  };

  const handleContinue = () => {
    // Save to global state or context if needed, but for now we just move forward
    router.push("/user/selections" as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#050014", "#0a0020", "#000000"]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 0.8, 1]}
      />

      <View style={styles.content}>
        <Animated.Text
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.greeting}
        >
          Hey {userName},
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.title}
        >
          What do you want to build your second brain with?
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.gridContainer}
        >
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic);
            return (
              <TouchableOpacity
                key={topic}
                activeOpacity={0.8}
                onPress={() => toggleTopic(topic)}
                style={[
                  styles.topicPill,
                  isSelected && styles.topicPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.topicText,
                    isSelected && styles.topicTextSelected,
                  ]}
                >
                  {topic}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.footer}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedTopics.length === 0 && styles.continueButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleContinue}
            disabled={loading || selectedTopics.length === 0}
          >
            {selectedTopics.length > 0 && (
              <LinearGradient
                colors={["#8b5cf6", "#6d28d9"]}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text
              style={[
                styles.continueText,
                selectedTopics.length === 0 && styles.continueTextDisabled,
              ]}
            >
              {loading ? "Preparing your Brain..." : "Continue"}
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
    paddingTop: 100,
  },
  greeting: {
    color: "#8b5cf6",
    fontSize: 20,
    fontFamily: "Raleway_600SemiBold",
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Raleway_700Bold",
    lineHeight: 40,
    marginBottom: 40,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  topicPill: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  topicPillSelected: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
  },
  topicText: {
    color: "#8a8a8a",
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
  },
  topicTextSelected: {
    color: "#fff",
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
