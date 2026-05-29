import { BlurView } from "expo-blur";
import { View } from "react-native";

export default function GlassCard({
  children,
  style,
}: any) {
  return (
    <BlurView
      intensity={30}
      tint="dark"
      style={[
        {
          borderRadius: 24,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.06)",
          backgroundColor: "rgba(255,255,255,0.03)",
        },
        style,
      ]}
    >
      <View>{children}</View>
    </BlurView>
  );
}