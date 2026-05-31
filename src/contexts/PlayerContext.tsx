// audio playback in context om n the entire app

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Episode } from "../services/episodes";

interface PlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  playEpisode: (episode: Episode) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekForward: () => Promise<void>;
  seekBackward: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  useEffect(() => {
    // Configure audio for background playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playEpisode = async (episode: Episode) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      setCurrentEpisode(episode);
      setIsPlaying(true);
      setPositionMillis(0);
      setDurationMillis(0);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: episode.audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setPositionMillis(status.positionMillis);
            if (status.durationMillis) {
              setDurationMillis(status.durationMillis);
            }
          } else if (status.error) {
            console.log("Playback Error: ", status.error);
          }
        }
      );

      setSound(newSound);
    } catch (error) {
      console.log("Error playing audio", error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const seekForward = async () => {
    if (!sound) return;
    const newPosition = positionMillis + 15000;
    await sound.setPositionAsync(Math.min(newPosition, durationMillis));
  };

  const seekBackward = async () => {
    if (!sound) return;
    const newPosition = positionMillis - 15000;
    await sound.setPositionAsync(Math.max(newPosition, 0));
  };

  const seekTo = async (millis: number) => {
    if (!sound) return;
    await sound.setPositionAsync(millis);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        positionMillis,
        durationMillis,
        playEpisode,
        togglePlayPause,
        seekForward,
        seekBackward,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
