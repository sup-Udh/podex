import { Image } from "expo-image";
import { Text, View } from "react-native";

export default function PodcastCard({
  image,
  title,
}: any) {
  return (
    <View
      style={{
        width: 120,
        marginRight: 16,
      }}
    >
      <Image
        source={image}
        contentFit="cover"
        style={{
          width: 120,
          height: 120,
          borderRadius: 22,
        }}
      />

      <Text
        numberOfLines={2}
        style={{
          color: "#fff",
          marginTop: 10,
          fontSize: 13,
          fontFamily: "Raleway_600SemiBold",
        }}
      >
        {title}
      </Text>
    </View>
  );
}