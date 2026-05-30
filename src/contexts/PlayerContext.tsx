import React, { createContext, useState, useEffect, useContext } from "react";
import { Audio } from "expo-av";
import { Episode } from "../services/episodes";

interface PlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  playEpisode: (episode: Episode) => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Enable audio playback in silent mode on iOS
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
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

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: episode.audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
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

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        playEpisode,
        togglePlayPause,
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
