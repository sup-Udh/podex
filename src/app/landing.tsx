import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const podcasts = [
  {
    image: require("../../assets/podcasts/huberman.jpg"),
    top: 70,
    left: 20,
    rotate: "-8deg",
    width: 92,
    height: 92,
  },
  {
    image: require("../../assets/podcasts/tim.jpg"),
    top: 90,
    right: 55,
    rotate: "10deg",
    width: 98,
    height: 98,
  },
  {
    image: require("../../assets/podcasts/diary.jpg"),
    top: 210,
    left: -5,
    rotate: "-10deg",
    width: 105,
    height: 105,
  },
  {
    image: require("../../assets/podcasts/lex.jpg"),
    top: 185,
    right: -5,
    rotate: "8deg",
    width: 105,
    height: 105,
  },
  {
    image: require("../../assets/podcasts/makingsense.jpg"),
    top: 350,
    left: 15,
    rotate: "-7deg",
    width: 100,
    height: 100,
  },
  {
    image: require("../../assets/podcasts/acquired.jpg"),
    top: 330,
    right: 15,
    rotate: "8deg",
    width: 90,
    height: 90,
  },
  {
    image: require("../../assets/podcasts/richroll.jpg"),
    bottom: 160,
    left: -10,
    rotate: "-8deg",
    width: 95,
    height: 95,
  },
  {
    image: require("../../assets/podcasts/modernwisdom.jpg"),
    bottom: 130,
    right: 5,
    rotate: "9deg",
    width: 95,
    height: 95,
  },
];

export default function Landing() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={["#000000", "#060606", "#000000"]}
        style={styles.absoluteFill}
      />

      {/* Ambient Purple Glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Noise Overlay */}
      <View style={styles.noiseOverlay} />

      {/* Floating Podcast Covers */}
      {podcasts.map((podcast, index) => (
        <Animated.View
          entering={FadeIn.delay(index * 120)}
          key={index}
          style={[
            styles.podcastWrapper,
            {
              position: "absolute",
              top: podcast.top,
              bottom: podcast.bottom,
              left: podcast.left,
              right: podcast.right,
              transform: [{ rotate: podcast.rotate }],
            },
          ]}
        >
          <Image
            source={podcast.image}
            resizeMode="cover"
            style={{
              width: podcast.width,
              height: podcast.height,
              borderRadius: 20,
              opacity: 0.38,
            }}
          />

          {/* Glass Overlay */}
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.03)",
              "rgba(255,255,255,0)",
            ]}
            style={styles.absoluteFill}
          />
        </Animated.View>
      ))}

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Center Ambient Glow */}
        <View style={styles.centerGlow} />

        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(700)}>
          <BlurView
            intensity={40}
            tint="dark"
            style={styles.logoContainer}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.08)",
                "rgba(255,255,255,0.02)",
              ]}
              style={styles.absoluteFill}
            />

            <Text style={styles.logoText}>
              P
            </Text>
          </BlurView>
        </Animated.View>

        {/* Brand */}
        <Animated.Text
          entering={FadeInDown.delay(120).duration(700)}
          style={styles.brandText}
        >
          PODEX
        </Animated.Text>

        {/* Tagline */}
        <Animated.View
          entering={FadeInDown.delay(220).duration(700)}
          style={styles.taglineContainer}
        >
          <Text style={styles.taglineSub}>
            Spotify plays podcasts.
          </Text>

          <Text style={styles.taglineMain}>
            Podex remembers them.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInDown.delay(320).duration(700)}
          style={styles.buttonsContainer}
        >
          {/* Google Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.buttonTouchable}
          >
            <BlurView
              intensity={35}
              tint="dark"
              style={styles.buttonBlur}
            >
              {/* Purple Ambient Glow */}
              <View style={styles.buttonAmbientGlow} />

              {/* Top Highlight */}
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.10)",
                  "rgba(255,255,255,0)",
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.absoluteFill}
              />

              {/* Icon */}
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIconText}>
                  G
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.buttonDivider} />

              {/* Text */}
              <Text style={styles.buttonText}>
                CONTINUE WITH GOOGLE
              </Text>
            </BlurView>
          </TouchableOpacity>

          {/* Email Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/auth/login" as any)}
            style={styles.buttonTouchable}
          >
            <BlurView
              intensity={35}
              tint="dark"
              style={styles.buttonBlur}
            >
              {/* Purple Ambient Glow */}
              <View style={styles.buttonAmbientGlow} />

              {/* Top Highlight */}
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.10)",
                  "rgba(255,255,255,0)",
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.absoluteFill}
              />

              {/* Icon */}
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIconText}>
                  ✉
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.buttonDivider} />

              {/* Text */}
              <Text style={styles.buttonText}>
                CONTINUE WITH EMAIL
              </Text>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.Text
          entering={FadeIn.delay(700)}
          style={styles.footerText}
        >
          By continuing, you agree to our{" "}
          <Text style={styles.footerHighlight}>
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text style={styles.footerHighlight}>
            Privacy Policy
          </Text>
        </Animated.Text>
      </View>
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
    top: -100,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(109, 93, 252, 0.1)",
  },
  glowBottom: {
    position: "absolute",
    bottom: 80,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  noiseOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.01)",
  },
  podcastWrapper: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  centerGlow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  logoContainer: {
    width: 95,
    height: 95,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  logoText: {
    color: "#fff",
    fontSize: 48,
    fontFamily: "Raleway_700Bold",
  },
  brandText: {
    color: "#fff",
    fontSize: 40,
    letterSpacing: 10,
    marginTop: 28,
    fontFamily: "Raleway_700Bold",
  },
  taglineContainer: {
    alignItems: "center",
    marginTop: 28,
  },
  taglineSub: {
    color: "#8e8e8e",
    fontSize: 18,
    fontFamily: "Raleway_400Regular",
  },
  taglineMain: {
    color: "#fff",
    fontSize: 21,
    marginTop: 6,
    fontFamily: "Raleway_700Bold",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 70,
    gap: 18,
  },
  buttonTouchable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonBlur: {
    height: 66,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonAmbientGlow: {
    position: "absolute",
    width: 220,
    height: 90,
    borderRadius: 110,
    backgroundColor: "rgba(139, 92, 246, 0.04)",
  },
  buttonIconContainer: {
    width: 52,
    alignItems: "center",
  },
  buttonIconText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
  },
  buttonDivider: {
    width: 1,
    height: 26,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginRight: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    letterSpacing: 2,
    fontFamily: "Raleway_600SemiBold",
  },
  footerText: {
    position: "absolute",
    bottom: 40,
    color: "#686868",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 18,
    fontFamily: "Raleway_400Regular",
  },
  footerHighlight: {
    color: "#bdbdbd",
  },
});