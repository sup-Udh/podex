import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import BottomNavbar from "../../components/BottomNavbar";
import GlassCard from "../../components/GlassCard";
import SectionHeader from "../../components/SectionHeader";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>
          Good Evening, Udhay
        </Text>

        <Text style={styles.subtitle}>
          Your second brain for podcasts.
        </Text>

        {/* Knowledge Snapshot */}
        <SectionHeader
          title="Knowledge Snapshot"
        />

        <GlassCard style={{ padding: 20 }}>
          <View style={styles.statsGrid}>
            <View>
              <Text style={styles.statNumber}>
                247
              </Text>
              <Text style={styles.statLabel}>
                Insights
              </Text>
            </View>

            <View>
              <Text style={styles.statNumber}>
                18
              </Text>
              <Text style={styles.statLabel}>
                Books
              </Text>
            </View>

            <View>
              <Text style={styles.statNumber}>
                56
              </Text>
              <Text style={styles.statLabel}>
                Frameworks
              </Text>
            </View>

            <View>
              <Text style={styles.statNumber}>
                14
              </Text>
              <Text style={styles.statLabel}>
                Debates
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Continue Listening */}
        <View style={{ marginTop: 30 }}>
          <SectionHeader
            title="Continue Listening"
          />

          <GlassCard
            style={{
              padding: 24,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontFamily:
                  "Raleway_700Bold",
              }}
            >
              Future of Neural
              Architectures
            </Text>

            <Text
              style={{
                color: "#8a8a8a",
                marginTop: 10,
              }}
            >
              73% completed
            </Text>
          </GlassCard>
        </View>

        {/* Clip Brain */}
        <View style={{ marginTop: 30 }}>
          <SectionHeader
            title="Clip Brain"
            action="View All"
          />

          <GlassCard
            style={{
              padding: 18,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#fff",
              }}
            >
              "Creatine improved
              performance in multiple
              studies."
            </Text>
          </GlassCard>

          <GlassCard
            style={{
              padding: 18,
            }}
          >
            <Text
              style={{
                color: "#fff",
              }}
            >
              "48 Laws of Power was
              recommended by three
              different guests."
            </Text>
          </GlassCard>
        </View>

        {/* Debate Mode */}
        <View style={{ marginTop: 30 }}>
          <SectionHeader
            title="Debate Mode"
          />

          <GlassCard
            style={{
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "#8b5cf6",
                marginBottom: 12,
              }}
            >
              Cold Exposure
            </Text>

            <Text
              style={{
                color: "#fff",
              }}
            >
              Huberman and Peter
              Attia disagree on long
              duration cold exposure.
            </Text>
          </GlassCard>
        </View>
      </ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  greeting: {
    color: "#fff",
    fontSize: 34,
    marginTop: 20,
    fontFamily: "Raleway_700Bold",
  },

  subtitle: {
    color: "#8a8a8a",
    marginTop: 8,
    marginBottom: 40,
    fontSize: 16,
    fontFamily: "Raleway_400Regular",
  },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statNumber: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
  },

  statLabel: {
    color: "#8a8a8a",
    marginTop: 4,
  },
});