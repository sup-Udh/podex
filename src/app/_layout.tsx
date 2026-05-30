import "../global.css";

import {
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
  useFonts,
} from "@expo-google-fonts/raleway";
import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreLogs([
  '"shadow*" style props are deprecated. Use "boxShadow".',
  '"textShadow*" style props are deprecated. Use "textShadow".',
  "AuthApiError: Invalid Refresh Token: Refresh Token Not Found",
]);
import { AuthProvider } from "../contexts/AuthContext";
import { PlayerProvider } from "../contexts/PlayerContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <PlayerProvider>
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
      </PlayerProvider>
    </AuthProvider>
  );
}