import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, Platform } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeInUp,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur'; // Will use basic View if blur is not available, but usually works in Expo

const { width, height } = Dimensions.get('window');

const BG_IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpp_5qfmicx7WwDh96cXcUcxZ0y3ey207GjyXCVmXHnzDdMXPMbAsopvOBtSxpGf6BxFlBXxcVTdYKICYwmf1S-7vqhrNlFDyA97Na5rLyTQ-Zj_FfCQ-60DkA0WdJofV3-oM3lgqt2ESN8h83E8C4sjJHUgvTzFxixMWdzJJUyy9xvdyRTfTACbkJJHTBlZA0QuyzYE6K44VpXUQGfBMkKvEU7lfUL-xBDxNAx-FtJvtOpGgyfAZ1UDR1oKmiFkwQXJL-msa1Y5aK';

export default function LoginScreen() {
  const bgScale = useSharedValue(1);
  const nodeGlow = useSharedValue(0.1);
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    bgScale.value = withRepeat(
      withTiming(1.05, { duration: 15000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    nodeGlow.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }],
  }));

  const animatedNodeStyle = useAnimatedStyle(() => ({
    opacity: nodeGlow.value,
    transform: [{ scale: 1 + nodeGlow.value * 0.5 }],
  }));

  return (
    <View style={styles.container}>
      {/* Level 0: Absolute Black is the background of container */}

      {/* Ambient Cinematic Background */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedBgStyle]}>
        <Image source={{ uri: BG_IMAGE_URL }} style={StyleSheet.absoluteFill} contentFit="cover" />
      </Animated.View>

      {/* Deep Void Overlay to ensure absolute black emphasis */}
      <View style={[StyleSheet.absoluteFill, styles.voidOverlay]} />

      {/* Ambient Glows: Soft light source reflecting off matte black */}
      <Animated.View style={[styles.ambientGlow, animatedNodeStyle]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Animated.View entering={FadeInUp.delay(300).duration(1000)} style={styles.memoryNodeContainer}>
            {/* Memory Node (Custom Component): Circular pulsating ambient glow */}
            <View style={styles.memoryNodeCore} />
            <Animated.View style={[styles.memoryNodePulse, animatedNodeStyle]} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(1000)} style={styles.titleContainer}>
            <Text style={styles.title}>PODEX</Text>
            <Text style={styles.subtitle}>Spotify plays podcasts.{'\n'}Podex remembers them.</Text>
          </Animated.View>
        </View>

        {/* Bottom Section - Level 1 Glass Panel */}
        <Animated.View entering={FadeInUp.delay(700).duration(1000)} style={styles.bottomSection}>
          <View style={styles.glassPanel}>
            
            {/* Input Field: Bottom-border only */}
            <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#c7c4d8"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Primary Button: Semi-translucent Indigo fill with white border at 20% opacity */}
            <Pressable style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}>
              <Text style={styles.btnPrimaryText}>Continue</Text>
            </Pressable>
            
            {/* Ghost Button: No fill, white text, 1px border at 10% opacity */}
            <Pressable style={({ pressed }) => [styles.btnGhost, pressed && styles.btnPressed]}>
              <Text style={styles.btnGhostText}>Sign in with Apple</Text>
            </Pressable>

            <View style={styles.secureContainer}>
              <Text style={styles.secureText}>INTELLIGENCE • PRIVACY • DEPTH</Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Level 0: Absolute Black
  },
  voidOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Mutes the image to prioritize void
  },
  ambientGlow: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#4f46e5', // Primary Container color
    opacity: 0.15,
    transform: [{ scale: 1.5 }],
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24, // Gutter
    paddingVertical: 48,   // Stack-lg
  },
  topSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  memoryNodeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    marginBottom: 32, // Container-margin
  },
  memoryNodeCore: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#c3c0ff', // Primary
    shadowColor: '#c3c0ff',
    shadowOpacity: 1,
    shadowRadius: 20,
    zIndex: 2,
  },
  memoryNodePulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(195, 192, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(195, 192, 255, 0.5)',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48, // Display-lg
    fontWeight: '700',
    color: '#ffffff', // High contrast white
    letterSpacing: -1,
    lineHeight: 56,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20, // Title-md
    fontWeight: '400',
    color: '#e5e2e1', // Inverse-surface / On-background
    textAlign: 'center',
    lineHeight: 28,
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  glassPanel: {
    width: '100%',
    maxWidth: 400,
    // Level 1 (Cards): Surface color at 4% white opacity
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    // React Native doesn't support backdrop-filter natively without expo-blur, but we simulate the color
    borderRadius: 16, // Large Elements: 1rem (16px)
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Borders are 1px solid white at 10% opacity
    padding: 24,
    gap: 16,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Bottom-border only
    paddingVertical: 8,
    marginBottom: 16,
  },
  inputFocused: {
    borderBottomColor: '#c3c0ff', // Focus state triggers subtle primary-color glow
    shadowColor: '#c3c0ff',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    color: '#e5e2e1',
    fontSize: 16, // Body-lg
    fontWeight: '400',
  },
  btnPrimary: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(79, 70, 229, 0.2)', // Semi-translucent Indigo fill
    borderRadius: 8, // Standard Elements: 0.5rem (8px)
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // 1px white border at 20% opacity
  },
  btnGhost: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'transparent', // Ghost: No fill
    borderRadius: 8, // Standard Elements: 0.5rem (8px)
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // 1px border at 10% opacity
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  btnGhostText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  btnPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(79, 70, 229, 0.4)', // Hover state increases background opacity
  },
  secureContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureText: {
    color: '#c7c4d8', // On-surface-variant
    fontSize: 12, // Label-caps
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
