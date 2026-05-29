import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

import { useEffect, useMemo, useState } from "react";

import { getTrendingPodcasts } from "../services/podcast";

const { width, height } = Dimensions.get("window");

import { styles } from "../styles/landingStyles";

export default function Landing() {
  const [podcasts, setPodcasts] = useState<any[]>([]);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      const data = await getTrendingPodcasts();

      const unique = data.filter(
        (podcast: any, index: number, self: any[]) =>
          index ===
          self.findIndex(
            (p) =>
              p.collectionName ===
              podcast.collectionName
          )
      );

      setPodcasts(unique.slice(0, 32));
    } catch (error) {
      console.log(error);
    }
  };

  const floatingCards = useMemo(() => {
    const cols = 4;
    const cellWidth = width / cols;
    const cellHeight = height / 8; // ~32 podcasts = 8 rows

    return podcasts.map((podcast: any, index: number) => {
      const size = 65 + Math.random() * 55;
      
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const baseX = col * cellWidth;
      const baseY = row * cellHeight;
      
      const jitterX = (Math.random() - 0.5) * (cellWidth * 1.2);
      const jitterY = (Math.random() - 0.5) * (cellHeight * 1.2);

      return {
        ...podcast,
        top: baseY + jitterY,
        left: baseX + jitterX - (size / 2) + 40, // center offset tweak
        rotate: Math.random() * 40 - 20,
        size,
        opacity: 0.20 + Math.random() * 0.40,
        blur: Math.random() > 0.8,
      };
    });
  }, [podcasts]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={[
          "#050014",
          "#0a0024",
          "#000000",
        ]}
        style={styles.absoluteFill}
      />

      {/* Ambient Glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={styles.glowCenter} />

      {/* Noise */}
      <View style={styles.noiseOverlay} />

      {/* Floating Podcast Covers */}
      {floatingCards.map(
        (podcast: any, index: number) => (
          <Animated.View
            entering={FadeIn.delay(
              index * 35
            )}
            key={index}
            pointerEvents="none"
            style={[
              styles.podcastWrapper,
              {
                top: podcast.top,
                left: podcast.left,

                transform: [
                  {
                    rotate: `${podcast.rotate}deg`,
                  },
                ],
              },
            ]}
          >
            <Image
              source={
                podcast.artworkUrl600 ||
                podcast.artworkUrl100
              }
              contentFit="cover"
              transition={300}
              style={{
                width: podcast.size,
                height: podcast.size,
                borderRadius: 24,
                opacity:
                  podcast.opacity,
              }}
            />

            {/* Glass Overlay */}
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.04)",
                "rgba(255,255,255,0)",
              ]}
              style={
                styles.absoluteFill
              }
            />
          </Animated.View>
        )
      )}

      {/* Dark Mask for Readability */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)", "#000000"]}
        locations={[0.2, 0.55, 1]}
        style={styles.absoluteFill}
        pointerEvents="none"
      />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Center Glow */}
        <View style={styles.centerGlow} />

        {/* Logo */}
        <Animated.View
          entering={FadeInDown.duration(
            700
          )}
        >
          <BlurView
            intensity={45}
            tint="dark"
            style={styles.logoContainer}
          >
            <View style={styles.logoHighlight} />
            <View style={styles.logoGlow} />

            <Text style={styles.logoText}>
              P
            </Text>
          </BlurView>
        </Animated.View>

        {/* Brand */}
        <Animated.Text
          entering={FadeInDown.delay(
            120
          ).duration(700)}
          style={styles.brandText}
        >
          PODEX
        </Animated.Text>

        {/* Tagline */}
        <Animated.View
          entering={FadeInDown.delay(
            220
          ).duration(700)}
          style={
            styles.taglineContainer
          }
        >
          <Text
            style={styles.taglineSub}
          >
            Spotify plays podcasts.
          </Text>

          <Text
            style={
              styles.taglineMain
            }
          >
            Podex remembers them.
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInDown.delay(
            320
          ).duration(700)}
          style={
            styles.buttonsContainer
          }
        >
          {/* Google */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={
              styles.buttonTouchable
            }
          >
            <BlurView
              intensity={35}
              tint="dark"
              style={styles.buttonBlur}
            >
              {/* Glow */}
              <View
                style={
                  styles.buttonGlow
                }
              />

              {/* Highlight */}
              <View
                style={
                  styles.buttonHighlight
                }
              />

              {/* Icon */}
              <View
                style={
                  styles.buttonIconContainer
                }
              >
                <Text
                  style={
                    styles.buttonIconText
                  }
                >
                  G
                </Text>
              </View>

              {/* Divider */}
              <View
                style={
                  styles.buttonDivider
                }
              />

              {/* Text */}
              <Text
                style={
                  styles.buttonText
                }
              >
                CONTINUE WITH GOOGLE
              </Text>
            </BlurView>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push(
                "/auth/login" as any
              )
            }
            style={
              styles.buttonTouchable
            }
          >
            <BlurView
              intensity={35}
              tint="dark"
              style={styles.buttonBlur}
            >
              {/* Glow */}
              <View
                style={
                  styles.buttonGlow
                }
              />

              {/* Highlight */}
              <View
                style={
                  styles.buttonHighlight
                }
              />

              {/* Icon */}
              <View
                style={
                  styles.buttonIconContainer
                }
              >
                <Text
                  style={
                    styles.buttonIconText
                  }
                >
                  ✉
                </Text>
              </View>

              {/* Divider */}
              <View
                style={
                  styles.buttonDivider
                }
              />

              {/* Text */}
              <Text
                style={
                  styles.buttonText
                }
              >
                CONTINUE WITH EMAIL
              </Text>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.Text
          entering={FadeIn.delay(
            700
          )}
          style={styles.footerText}
        >
          By continuing, you agree
          to our{" "}
          <Text
            style={
              styles.footerHighlight
            }
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            style={
              styles.footerHighlight
            }
          >
            Privacy Policy
          </Text>
        </Animated.Text>
      </View>
    </View>
  );
}
