import "../global.css";

import {
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
  useFonts,
} from "@expo-google-fonts/raleway";
import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const [loaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#000",
          },
        }}
      />
    </GestureHandlerRootView>
  );
}