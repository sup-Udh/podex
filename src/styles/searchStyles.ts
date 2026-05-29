import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "#8a8a8a",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
  },
  searchBoxContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontFamily: "Raleway_400Regular",
  },
  micIcon: {
    fontSize: 16,
    marginLeft: 12,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  filterPill: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  filterPillActive: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderColor: "#8b5cf6",
  },
  filterText: {
    color: "#aaa",
    fontSize: 13,
    fontFamily: "Raleway_600SemiBold",
  },
  filterTextActive: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Raleway_600SemiBold",
  },
  metricsContainer: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 40,
  },
  metricCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20,20,25,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  metricIcon: {
    fontSize: 18,
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
    marginBottom: 4,
  },
  metricSub: {
    color: "#777",
    fontSize: 12,
    fontFamily: "Raleway_400Regular",
  },
  metricCountBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricCount: {
    color: "#b99eff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    marginRight: 8,
  },
  metricArrow: {
    color: "#444",
    fontSize: 12,
  },
  section: {
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    width: "60%",
    lineHeight: 28,
  },
  viewAllText: {
    color: "#5c8df6",
    fontSize: 12,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 0.5,
  },
  trendingCard: {
    width: 280,
    backgroundColor: "rgba(20,20,25,0.6)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  trendingImagePlaceholder: {
    height: 120,
    width: "100%",
  },
  trendingBadge: {
    position: "absolute",
    top: 90,
    left: 16,
    backgroundColor: "rgba(139, 92, 246, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Raleway_700Bold",
    letterSpacing: 1,
  },
  trendingDetails: {
    padding: 16,
    paddingTop: 24,
  },
  trendingTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
    marginBottom: 4,
  },
  trendingSub: {
    color: "#8a8a8a",
    fontSize: 13,
    fontFamily: "Raleway_400Regular",
  },
  aiCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    overflow: "hidden",
    backgroundColor: "rgba(20, 20, 25, 0.8)",
  },
  aiContent: {
    padding: 24,
    zIndex: 2, // ensure content sits above particle background
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aiTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
  },
  aiDescription: {
    color: "#ccc",
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
    lineHeight: 22,
    marginBottom: 24,
  },
  promptBubble: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  promptText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Raleway_400Regular",
    fontStyle: "italic",
    lineHeight: 20,
  },
});
