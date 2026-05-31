// audio playback in context om n the entire app

import React, { createContext, useContext, useEffect, useState } from "react";
import TrackPlayer, { State, useProgress, usePlaybackState, Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';
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
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();

  const isPlaying = playbackState.state === State.Playing || playbackState.state === State.Buffering;
  const positionMillis = position * 1000;
  const durationMillis = duration * 1000;

  useEffect(() => {
    async function setup() {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.JumpForward,
            Capability.JumpBackward,
            Capability.SeekTo,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
          ],
          forwardJumpInterval: 15,
          backwardJumpInterval: 15,
        });
        setIsPlayerReady(true);
      } catch (e) {
        console.log("Player already initialized");
        setIsPlayerReady(true);
      }
    }
    setup();
  }, []);

  const playEpisode = async (episode: Episode) => {
    if (!isPlayerReady) return;
    try {
      setCurrentEpisode(episode);
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: episode.title || 'episode',
        url: episode.audioUrl,
        title: episode.title,
        artist: episode.podcastName || 'Podex',
        artwork: episode.imageUrl || 'https://via.placeholder.com/150',
      });
      await TrackPlayer.play();
    } catch (error) {
      console.log("Error playing audio", error);
    }
  };

  const togglePlayPause = async () => {
    if (!isPlayerReady) return;
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const seekForward = async () => {
    if (!isPlayerReady) return;
    const currentPos = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPos + 15);
  };

  const seekBackward = async () => {
    if (!isPlayerReady) return;
    const currentPos = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(currentPos - 15, 0));
  };

  const seekTo = async (millis: number) => {
    if (!isPlayerReady) return;
    await TrackPlayer.seekTo(millis / 1000);
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
