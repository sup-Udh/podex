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
import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

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

      {/* BACKGROUND */}
      <LinearGradient
        colors={["#000000", "#060606", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Purple Ambient Glow */}
      <View style={styles.purpleGlowTop} />
      <View style={styles.purpleGlowBottom} />

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
              "rgba(255,255,255,0.02)",
              "rgba(255,255,255,0)",
            ]}
            style={styles.cardOverlay}
          />
        </Animated.View>
      ))}

      {/* CENTER CONTENT */}
      <View style={styles.content}>
        {/* CENTER GLOW */}
        <View style={styles.centerGlow} />

        {/* LOGO */}
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
              style={styles.logoGradient}
            />

            <Text style={styles.logoText}>P</Text>
          </BlurView>
        </Animated.View>

        {/* TITLE */}
        <Animated.Text
          entering={FadeInDown.delay(120).duration(700)}
          style={styles.title}
        >
          PODEX
        </Animated.Text>

        {/* TAGLINE */}
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

        {/* BUTTONS */}
        <Animated.View
          entering={FadeInDown.delay(320).duration(700)}
          style={styles.buttonsContainer}
        >
          {/* GOOGLE */}
          <TouchableOpacity activeOpacity={0.85}>
            <BlurView
              intensity={30}
              tint="dark"
              style={styles.button}
            >
              <View style={styles.buttonInnerGlow} />

              <Text style={styles.buttonIcon}>G</Text>

              <View style={styles.buttonDivider} />

              <Text style={styles.buttonText}>
                CONTINUE WITH GOOGLE
              </Text>
            </BlurView>
          </TouchableOpacity>

          {/* EMAIL */}
          <TouchableOpacity activeOpacity={0.85}>
            <BlurView
              intensity={30}
              tint="dark"
              style={styles.button}
            >
              <View style={styles.buttonInnerGlow} />

              <Text style={styles.buttonIcon}>✉</Text>

              <View style={styles.buttonDivider} />

              <Text style={styles.buttonText}>
                CONTINUE WITH EMAIL
              </Text>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* FOOTER */}
        <Animated.Text
          entering={FadeIn.delay(700)}
          style={styles.footer}
        >
          By continuing, you agree to our{" "}
          <Text style={styles.footerLink}>
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text style={styles.footerLink}>
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

  purpleGlowTop: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "#6d5dfc",
    opacity: 0.12,
    top: -100,
    right: -120,
  },

  purpleGlowBottom: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "#8b5cf6",
    opacity: 0.08,
    bottom: 80,
    left: -100,
  },

  noiseOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.01)",
  },

  podcastWrapper: {
    position: "absolute",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },

  cardOverlay: {
    ...StyleSheet.absoluteFill,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  centerGlow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    opacity: 0.03,
  },

  logoContainer: {
    width: 95,
    height: 95,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  logoGradient: {
    ...StyleSheet.absoluteFill,
  },

  logoText: {
    color: "#fff",
    fontSize: 48,
    fontFamily: "Raleway_700Bold",
  },

  title: {
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

  button: {
    height: 66,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.02)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonInnerGlow: {
    position: "absolute",
    width: 200,
    height: 80,
    backgroundColor: "#8b5cf6",
    opacity: 0.04,
    borderRadius: 999,
  },

  buttonIcon: {
    color: "#fff",
    fontSize: 22,
    width: 50,
    textAlign: "center",
    fontFamily: "Raleway_700Bold",
  },

  buttonDivider: {
    width: 1,
    height: 26,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginRight: 18,
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    letterSpacing: 2,
    fontFamily: "Raleway_600SemiBold",
  },

  footer: {
    position: "absolute",
    bottom: 40,
    color: "#686868",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 18,
    fontFamily: "Raleway_400Regular",
  },

  footerLink: {
    color: "#bdbdbd",
  },
});