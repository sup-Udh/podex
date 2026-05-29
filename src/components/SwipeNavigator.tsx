import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useRouter, usePathname } from "expo-router";

const { width } = Dimensions.get("window");

const ROUTES = [
  "/user/dahsboard",
  "/user/search",
  "/user/brain",
  "/user/library",
  "/user/profile",
];

export default function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(20);

  useEffect(() => {
    toastOpacity.value = withTiming(1, { duration: 600 });
    toastTranslateY.value = withTiming(0, { duration: 600 });

    const timer = setTimeout(() => {
      toastOpacity.value = withTiming(0, { duration: 600 });
      toastTranslateY.value = withTiming(20, { duration: 600 });
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const toastStyle = useAnimatedStyle(() => {
    return {
      opacity: toastOpacity.value,
      transform: [{ translateY: toastTranslateY.value }],
    };
  });

  const navigateTo = (direction: "left" | "right") => {
    if (isNavigating) return;
    setIsNavigating(true);
    
    let currentIndex = ROUTES.findIndex(route => pathname === route || (pathname.startsWith(route) && route !== "/user"));
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex = direction === "left" ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex < 0) nextIndex = 0;
    // Cap at library (index 3) since profile isn't built yet
    if (nextIndex > 3) nextIndex = 3;

    if (nextIndex !== currentIndex) {
      router.push(ROUTES[nextIndex] as any);
    }
    
    setTimeout(() => setIsNavigating(false), 500);
  };

  const pan = Gesture.Pan()
    // Don't interfere with vertical scroll
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -80) {
        runOnJS(navigateTo)("left");
      } else if (event.translationX > 80) {
        runOnJS(navigateTo)("right");
      }
      translateX.value = withSpring(0);
    });

  const animatedEdgeStyle = useAnimatedStyle(() => {
    const opacity = Math.min(Math.abs(translateX.value) / 150, 0.5);
    return {
      opacity,
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      shadowOpacity: opacity,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        {children}
        
        {/* Glow Overlay when swiping */}
        <Animated.View pointerEvents="none" style={[styles.glowOverlay, animatedEdgeStyle]} />

        {/* Swipe Instructions Toast */}
        <Animated.View pointerEvents="none" style={[styles.toastContainer, toastStyle]}>
          <Text style={styles.toastText}>Swipe left or right to move between pages</Text>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 4,
    borderColor: "rgba(139, 92, 246, 0.8)",
    shadowColor: "#8b5cf6",
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  toastContainer: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "rgba(20, 20, 25, 0.95)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  toastText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Raleway_600SemiBold",
  }
});
