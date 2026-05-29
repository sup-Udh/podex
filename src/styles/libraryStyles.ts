import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContent: { paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 32 },
  headerTitle: { color: "#fff", fontSize: 28, fontFamily: "Raleway_700Bold", marginBottom: 4 },
  headerSubtitle: { color: "#8a8a8a", fontSize: 16, fontFamily: "Raleway_400Regular" },
  section: { paddingHorizontal: 24, marginBottom: 40 },
  sectionTitle: { color: "#fff", fontSize: 20, fontFamily: "Raleway_700Bold", marginBottom: 16 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  
  // Active Listening
  activeCard: { width: 280, backgroundColor: "rgba(20,20,25,0.6)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", flexDirection: "row", gap: 16 },
  activeImage: { width: 80, height: 80, borderRadius: 12 },
  activeContent: { flex: 1, justifyContent: "center" },
  activePodcastName: { color: "#8b5cf6", fontSize: 12, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  activeEpisodeTitle: { color: "#fff", fontSize: 14, fontFamily: "Raleway_700Bold", marginBottom: 12 },
  progressContainer: { height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 6 },
  progressBar: { height: "100%", backgroundColor: "#8b5cf6", borderRadius: 2 },
  progressText: { color: "#8a8a8a", fontSize: 10, fontFamily: "Raleway_400Regular", marginBottom: 12 },
  resumeButton: { backgroundColor: "rgba(139, 92, 246, 0.15)", paddingVertical: 8, borderRadius: 8, alignItems: "center", borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.3)" },
  resumeButtonText: { color: "#fff", fontSize: 12, fontFamily: "Raleway_700Bold" },

  // Knowledge Queue
  aiCuratedBadge: { color: "#8b5cf6", fontSize: 10, fontFamily: "Raleway_700Bold", letterSpacing: 1, backgroundColor: "rgba(139, 92, 246, 0.1)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  queueContainer: { gap: 12 },
  queueItem: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  queueImage: { width: 50, height: 50, borderRadius: 10, marginRight: 16 },
  queueInfo: { flex: 1 },
  queueEpisode: { color: "#fff", fontSize: 14, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  queueReason: { color: "#8a8a8a", fontSize: 11, fontFamily: "Raleway_400Regular" },
  queuePlayButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
  queuePlayIcon: { color: "#fff", fontSize: 12 },

  // Subscriptions List
  listContainer: { gap: 12 },
  listItem: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  listImage: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  listInfo: { flex: 1 },
  listTitle: { color: "#fff", fontSize: 15, fontFamily: "Raleway_600SemiBold", marginBottom: 4 },
  listSub: { color: "#8a8a8a", fontSize: 13, fontFamily: "Raleway_400Regular" },
  listOptionsButton: { paddingHorizontal: 12, paddingVertical: 8 },
  listOptionsIcon: { color: "#666", fontSize: 18, fontWeight: "bold" },
  addSubscriptionButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(139, 92, 246, 0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(139, 92, 246, 0.4)" },
  addSubscriptionIcon: { color: "#b99eff", fontSize: 18, lineHeight: 20 },
});
