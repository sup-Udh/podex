import {
    Brain,
    House,
    Library,
    Search,
    User,
} from "lucide-react-native";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

import { styles } from "../styles/bottomNavbarStyles";

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
        onPress={() => router.push("/user/library" as any)}
      >
        <Library size={20} color={getIconColor("/user/library")} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.iconContainer, isRouteActive("/user/profile") && styles.activeIconGlow]} 
        onPress={() => router.push("/user/profile" as any)}
      >
        <User size={20} color={getIconColor("/user/profile")} />
      </TouchableOpacity>
    </View>
  );
}
