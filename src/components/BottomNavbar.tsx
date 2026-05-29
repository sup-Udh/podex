import {
    Brain,
    House,
    Library,
    Search,
    User,
} from "lucide-react-native";

import { View } from "react-native";

export default function BottomNavbar() {
  return (
    <View
      style={{
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
        borderColor:
          "rgba(255,255,255,0.06)",
      }}
    >
      <House size={20} color="#8b5cf6" />
      <Search size={20} color="#8a8a8a" />
      <Brain size={20} color="#8a8a8a" />
      <Library size={20} color="#8a8a8a" />
      <User size={20} color="#8a8a8a" />
    </View>
  );
}