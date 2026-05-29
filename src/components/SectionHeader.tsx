import { Text, View } from "react-native";

export default function SectionHeader({
  title,
  action,
}: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontFamily: "Raleway_700Bold",
        }}
      >
        {title}
      </Text>

      {action && (
        <Text
          style={{
            color: "#8b5cf6",
            fontSize: 13,
            fontFamily: "Raleway_600SemiBold",
          }}
        >
          {action}
        </Text>
      )}
    </View>
  );
}