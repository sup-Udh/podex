import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor:
      "rgba(124,58,237,0.15)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -50,
    left: -150,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor:
      "rgba(236,72,153,0.12)",
  },

  glowCenter: {
    position: "absolute",
    top: height / 2 - 150,
    left: width / 2 - 200,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor:
      "rgba(59,130,246,0.1)",
  },

  noiseOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor:
      "rgba(255,255,255,0.01)",
  },

  podcastWrapper: {
    position: "absolute",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.04)",
  },

  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    zIndex: 10,
    elevation: 10,
  },

  centerGlow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor:
      "rgba(255,255,255,0.03)",
  },

  logoContainer: {
    width: 95,
    height: 95,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
    backgroundColor:
      "rgba(255,255,255,0.03)",
  },

  logoHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor:
      "rgba(255,255,255,0.1)",
  },

  logoGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(139, 92, 246, 0.25)",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },

  logoText: {
    color: "#fff",
    fontSize: 48,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 2,
    zIndex: 1,
  },

  brandText: {
    color: "#fff",
    fontSize: 42,
    letterSpacing: 12,
    marginTop: 28,
    fontFamily:
      "Raleway_700Bold",
    textShadowColor: "rgba(139,92,246,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  taglineContainer: {
    alignItems: "center",
    marginTop: 28,
  },

  taglineSub: {
    color: "#8e8e8e",
    fontSize: 18,
    fontFamily:
      "Raleway_400Regular",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  taglineMain: {
    color: "#fff",
    fontSize: 21,
    marginTop: 6,
    fontFamily:
      "Raleway_700Bold",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },

  buttonsContainer: {
    width: "100%",
    marginTop: 70,
    gap: 18,
  },

  buttonTouchable: {
    borderRadius: 33,
    overflow: "hidden",
  },

  buttonBlur: {
    height: 66,
    borderRadius: 33,
    overflow: "hidden",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.15)",
    backgroundColor:
      "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  buttonGlow: {
    position: "absolute",
    width: 200,
    height: 66,
    borderRadius: 999,
    opacity: 0,
    backgroundColor:
      "transparent",
  },

  buttonHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor:
      "rgba(255,255,255,0.05)",
  },

  buttonIconContainer: {
    width: 52,
    alignItems: "center",
  },

  buttonIconText: {
    color: "#fff",
    fontSize: 22,
    fontFamily:
      "Raleway_700Bold",
  },

  buttonDivider: {
    width: 1,
    height: 26,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    marginRight: 18,
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1.5,
    fontFamily:
      "Raleway_600SemiBold",
    flexShrink: 1,
  },

  footerText: {
    position: "absolute",
    bottom: 40,
    color: "#686868",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 18,
    fontFamily:
      "Raleway_400Regular",
  },

  footerHighlight: {
    color: "#bdbdbd",
  },
});

