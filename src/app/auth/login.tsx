import React, { useState } from "react";
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
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState<"email" | "password" | null>(null);

  const handleLogin = () => {
    // Auth login logic placeholder
    console.log("Login with email:", email);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={["#000000", "#060606", "#000000"]}
        style={styles.absoluteFill}
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
                      "rgba(109, 93, 252, 0.2)",
                      "rgba(109, 93, 252, 0.05)"
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
  glowTop: {
    position: "absolute",
    top: -80,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(109, 93, 252, 0.08)",
  },
  glowBottom: {
    position: "absolute",
    bottom: 40,
    left: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(139, 92, 246, 0.06)",
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
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  backButtonBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  },
  subtitleText: {
    color: "#8e8e8e",
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
    lineHeight: 22,
    marginTop: 8,
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
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontFamily: "Raleway_600SemiBold",
    letterSpacing: 1.5,
  },
  forgotPasswordText: {
    color: "rgba(109, 93, 252, 0.8)",
    fontSize: 12,
    fontFamily: "Raleway_600SemiBold",
  },
  inputWrapper: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  inputWrapperFocused: {
    borderColor: "rgba(109, 93, 252, 0.5)",
    backgroundColor: "rgba(255,255,255,0.04)",
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
  },
  submitButton: {
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(109, 93, 252, 0.2)",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Raleway_600SemiBold",
    letterSpacing: 2,
  },
});