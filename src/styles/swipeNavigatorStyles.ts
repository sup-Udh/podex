import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: "rgba(139, 92, 246, 0.8)",
    shadowColor: "#8b5cf6",
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  toastContainer: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "rgba(20, 20, 25, 0.95)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  toastText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Raleway_600SemiBold",
  }
});
