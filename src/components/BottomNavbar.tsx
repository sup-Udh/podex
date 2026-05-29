import {
    Brain,
    House,
    Library,
    Search,
    User,
} from "lucide-react-native";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const getIconColor = (path: string) => {
    // Exact match or prefix match logic for active states
    if (pathname === path || (pathname.startsWith(path) && path !== "/user")) {
        return "#8b5cf6"; // Active
    }
    return "#8a8a8a"; // Inactive
  };

  const isRouteActive = (path: string) => {
     return pathname === path || (pathname.startsWith(path) && path !== "/user");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.iconContainer, isRouteActive("/user/dahsboard") && styles.activeIconGlow]} 
        onPress={() => router.push("/user/dahsboard" as any)}
      >
        <House size={20} color={getIconColor("/user/dahsboard")} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, isRouteActive("/user/search") && styles.activeIconGlow]} 
        onPress={() => router.push("/user/search" as any)}
      >
        <Search size={20} color={getIconColor("/user/search")} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, isRouteActive("/user/brain") && styles.activeIconGlow]} 
        onPress={() => router.push("/user/brain" as any)}
      >
        <Brain size={20} color={getIconColor("/user/brain")} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, isRouteActive("/user/library") && styles.activeIconGlow]} 
        onPress={() => {}}
      >
        <Library size={20} color={getIconColor("/user/library")} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, isRouteActive("/user/profile") && styles.activeIconGlow]} 
        onPress={() => {}}
      >
        <User size={20} color={getIconColor("/user/profile")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#111",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    // Added shadow to base container to lift it slightly
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 20,
  },
  activeIconGlow: {
    backgroundColor: "rgba(139, 92, 246, 0.15)", // Soft purple background glow
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  }
});