import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ROUTES = [
  "/user/dahsboard",
  "/user/search",
  "/user/brain",
  "/user/library",
  "/user/profile",
];

let hasShownToast = false;

import { styles } from "../styles/swipeNavigatorStyles";

export default function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(20);

  useEffect(() => {
    if (hasShownToast) return;
    hasShownToast = true;

    toastOpacity.value = withTiming(1, { duration: 600 });
    toastTranslateY.value = withTiming(0, { duration: 600 });

    const timer = setTimeout(() => {
      toastOpacity.value = withTiming(0, { duration: 600 });
      toastTranslateY.value = withTiming(20, { duration: 600 });
    }, 2000);

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
    if (nextIndex > ROUTES.length - 1) nextIndex = ROUTES.length - 1;

    if (nextIndex !== currentIndex) {
      router.push(ROUTES[nextIndex] as any);
    }
    
    setTimeout(() => setIsNavigating(false), 500); // time taken for the spring back animation
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
