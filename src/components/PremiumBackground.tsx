import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function PremiumBackground() {
  const orb1X = useSharedValue(-100);
  const orb1Y = useSharedValue(-100);
  
  const orb2X = useSharedValue(width);
  const orb2Y = useSharedValue(height / 2);
  
  const orb3X = useSharedValue(width / 2);
  const orb3Y = useSharedValue(height + 100);

  useEffect(() => {
    orb1X.value = withRepeat(withTiming(width - 100, { duration: 15000, easing: Easing.inOut(Easing.ease) }), -1, true);
    orb1Y.value = withRepeat(withTiming(height / 2, { duration: 12000, easing: Easing.inOut(Easing.ease) }), -1, true);
    
    orb2X.value = withRepeat(withTiming(-50, { duration: 18000, easing: Easing.inOut(Easing.ease) }), -1, true);
    orb2Y.value = withRepeat(withTiming(height - 100, { duration: 14000, easing: Easing.inOut(Easing.ease) }), -1, true);
    
    orb3X.value = withRepeat(withTiming(-100, { duration: 20000, easing: Easing.inOut(Easing.ease) }), -1, true);
    orb3Y.value = withRepeat(withTiming(-50, { duration: 16000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb1X.value }, { translateY: orb1Y.value }],
  }));
  const orb2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb2X.value }, { translateY: orb2Y.value }],
  }));
  const orb3Style = useAnimatedStyle(() => ({
    transform: [{ translateX: orb3X.value }, { translateY: orb3Y.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={["#050014", "#0a0320", "#050014"]} style={StyleSheet.absoluteFill} />
      
      {/* Moving Orbs */}
      <Animated.View style={[styles.orb, { backgroundColor: "rgba(139, 92, 246, 0.4)", width: 350, height: 350 }, orb1Style]} />
      <Animated.View style={[styles.orb, { backgroundColor: "rgba(236, 72, 153, 0.25)", width: 300, height: 300 }, orb2Style]} />
      <Animated.View style={[styles.orb, { backgroundColor: "rgba(59, 130, 246, 0.35)", width: 400, height: 400 }, orb3Style]} />

      {/* Massive blur over the orbs to create a smooth mesh gradient effect */}
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 999,
  }
});
