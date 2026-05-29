import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { getTrendingPodcasts } from "../../services/podcast";

const { width, height } = Dimensions.get("window");
const ITEM_SIZE = width / 3;

// Custom Animated Scrolling Column Component
const ScrollingColumn = ({ data, duration, reverse = false }: any) => {
  // To create a seamless loop, we'll translate up by exactly half the total height (one full set of data).
  const halfHeight = ITEM_SIZE * data.length;
  const translateY = useSharedValue(reverse ? -halfHeight : 0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(reverse ? 0 : -halfHeight, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Duplicate data to make the loop seamless
  const renderData = [...data, ...data];

  return (
    <Animated.View style={[{ width: ITEM_SIZE, alignItems: "center" }, animatedStyle]}>
      {renderData.map((item: any, i: number) => (
        <Image
          key={i}
          source={{ uri: item.artworkUrl600 || item.artworkUrl100 }}
          style={styles.podcastImage}
        />
      ))}
    </Animated.View>
  );
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState<"email" | "password" | null>(null);
  
  const [podcasts, setPodcasts] = useState<any[]>([]);

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        const data = await getTrendingPodcasts();
        const unique = data.filter(
          (podcast: any, index: number, self: any[]) =>
            index === self.findIndex((p) => p.collectionName === podcast.collectionName)
        );
        // We need about 30 unique podcasts to create 3 columns of 10
        setPodcasts(unique.slice(0, 30));
      } catch (error) {
        console.log(error);
      }
    };
    loadPodcasts();
  }, []);

  const handleLogin = () => {
    console.log("Login with email:", email);
    router.push("/onboarding/selection");
  };

  const col1 = podcasts.slice(0, 10);
  const col2 = podcasts.slice(10, 20);
  const col3 = podcasts.slice(20, 30);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Underlay */}
      <View style={[styles.absoluteFill, { backgroundColor: "#000" }]} />

      {/* Scrolling Columns Background */}
      {podcasts.length > 0 && (
        <View style={styles.scrollingBackgroundContainer}>
          <ScrollingColumn data={col1} duration={45000} reverse={false} />
          <ScrollingColumn data={col2} duration={55000} reverse={true} />
          <ScrollingColumn data={col3} duration={40000} reverse={false} />
        </View>
      )}

      {/* Deep Gradient Mask to ensure form readability */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.4)", 
          "rgba(0,0,0,0.85)", 
          "#000000"
        ]}
        locations={[0, 0.4, 1]}
        style={styles.absoluteFill}
        pointerEvents="none"
      />

      {/* Ambient purple/blue glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* Header Bar */}
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={styles.headerBar}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <BlurView intensity={20} tint="dark" style={styles.backButtonBlur}>
                <Text style={styles.backIcon}>←</Text>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.contentContainer}>
            {/* Title Section */}
            <Animated.View entering={FadeInDown.duration(600).delay(100)}>
              <Text style={styles.titleText}>Welcome back</Text>
              <Text style={styles.subtitleText}>
                Enter your credentials to access your audio memory.
              </Text>
            </Animated.View>

            {/* Form Fields */}
            <Animated.View 
              entering={FadeInDown.duration(600).delay(200)}
              style={styles.formContainer}
            >
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View 
                  style={[
                    styles.inputWrapper,
                    focusField === "email" && styles.inputWrapperFocused
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="name@example.com"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusField("email")}
                    onBlur={() => setFocusField(null)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.inputLabel}>PASSWORD</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordText}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View 
                  style={[
                    styles.inputWrapper,
                    focusField === "password" && styles.inputWrapperFocused
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    secureTextEntry
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusField("password")}
                    onBlur={() => setFocusField(null)}
                  />
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.88}
                style={styles.submitButtonContainer}
              >
                <BlurView intensity={35} tint="dark" style={styles.submitButton}>
                  <LinearGradient
                    colors={[
                      "rgba(109, 93, 252, 0.4)",
                      "rgba(109, 93, 252, 0.1)"
                    ]}
                    style={styles.absoluteFill}
                  />
                  <Text style={styles.submitButtonText}>SIGN IN</Text>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  absoluteFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollingBackgroundContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -50,
    bottom: -50,
    flexDirection: "row",
    justifyContent: "space-between",
    opacity: 0.8, // Slightly fade the entire background 
  },
  podcastImage: {
    width: ITEM_SIZE - 16,
    height: ITEM_SIZE - 16,
    borderRadius: 16,
    marginBottom: 16,
    opacity: 0.4, // Keep individual images dim so they don't overpower text
  },
  glowTop: {
    position: "absolute",
    top: -80,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(109, 93, 252, 0.15)",
  },
  glowBottom: {
    position: "absolute",
    bottom: 40,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  headerBar: {
    height: 56,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  backButtonBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  backIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  titleText: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitleText: {
    color: "#ccc",
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
    lineHeight: 22,
    marginTop: 8,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: {
    marginTop: 40,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontFamily: "Raleway_600SemiBold",
    letterSpacing: 1.5,
  },
  forgotPasswordText: {
    color: "rgba(139, 92, 246, 0.9)",
    fontSize: 12,
    fontFamily: "Raleway_600SemiBold",
  },
  inputWrapper: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "rgba(20,20,25,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  inputWrapperFocused: {
    borderColor: "rgba(139, 92, 246, 0.8)",
    backgroundColor: "rgba(20,20,25,0.8)",
  },
  textInput: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: "Raleway_400Regular",
  },
  submitButtonContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
  },
  submitButton: {
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    letterSpacing: 2,
  },
});