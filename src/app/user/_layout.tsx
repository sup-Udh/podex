import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { ActivityIndicator, View } from "react-native";
import React from "react";

export default function UserLayout() {
  const { session, initialized } = useAuth();

  if (!initialized) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/landing" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
