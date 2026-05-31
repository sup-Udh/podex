// audio playback in context om n the entire app

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Episode } from "../services/episodes";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";
import { requestTranscription, pollTranscription } from "../services/transcription";

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
  closePlayer: () => Promise<void>;
  transcriptStatus: "idle" | "processing" | "completed" | "error";
  transcriptText: string | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [transcriptStatus, setTranscriptStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [transcriptText, setTranscriptText] = useState<string | null>(null);

  const { session } = useAuth();
  const lastSyncRef = useRef(0);

  const syncProgressToDB = async (userId: string, ep: Episode, position: number, duration: number) => {
    try {
      await supabase.from("user_listening_history").upsert({
        user_id: userId,
        podcast_id: ep.podcastId,
        episode_id: ep.id,
        episode_data: ep,
        position_millis: position,
        duration_millis: duration,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id, episode_id" });
    } catch (error) {
      console.error("Failed to sync progress", error);
    }
  };

  const checkAndTranscribe = async (userId: string, ep: Episode) => {
    setTranscriptStatus("processing");
    setTranscriptText(null);
    try {
      const { data } = await supabase
        .from("episode_transcripts")
        .select("*")
        .eq("user_id", userId)
        .eq("episode_id", ep.id)
        .maybeSingle();
      
      if (data && data.status === "completed") {
        setTranscriptText(data.transcript_text);
        setTranscriptStatus("completed");
        return;
      }

      await supabase.from("episode_transcripts").upsert({
        user_id: userId,
        podcast_id: ep.podcastId,
        episode_id: ep.id,
        status: "processing",
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id, episode_id" });

      const transcriptId = await requestTranscription(ep.audioUrl);
      if (transcriptId) {
        const text = await pollTranscription(transcriptId);
        if (text) {
          await supabase.from("episode_transcripts").update({
            status: "completed",
            transcript_text: text,
            updated_at: new Date().toISOString()
          }).eq("user_id", userId).eq("episode_id", ep.id);
          
          // Only update UI if we are still listening to the same episode
          setTranscriptText(prev => text);
          setTranscriptStatus(prev => "completed");
        } else {
          setTranscriptStatus("error");
          await supabase.from("episode_transcripts").update({ status: "failed" }).eq("user_id", userId).eq("episode_id", ep.id);
        }
      } else {
         setTranscriptStatus("error");
      }
    } catch (e) {
       console.log(e);
       setTranscriptStatus("error");
    }
  };

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
  }, []);

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

      if (session?.user) {
        checkAndTranscribe(session.user.id, episode);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: episode.audioUrl },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setPositionMillis(status.positionMillis);
            if (status.durationMillis) {
              setDurationMillis(status.durationMillis);
            }

            // Sync to Supabase every 10 seconds
            if (session?.user && status.isPlaying) {
              const now = Date.now();
              if (now - lastSyncRef.current > 10000) {
                lastSyncRef.current = now;
                syncProgressToDB(
                  session.user.id,
                  episode,
                  status.positionMillis,
                  status.durationMillis || 0
                );
              }
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
      // Final sync on pause
      if (session?.user && currentEpisode) {
        syncProgressToDB(session.user.id, currentEpisode, positionMillis, durationMillis);
      }
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

  const closePlayer = async () => {
    // Final sync on close
    if (session?.user && currentEpisode) {
      await syncProgressToDB(session.user.id, currentEpisode, positionMillis, durationMillis);
    }

    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setCurrentEpisode(null);
    setIsPlaying(false);
    setPositionMillis(0);
    setDurationMillis(0);
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
        closePlayer,
        transcriptStatus,
        transcriptText,
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
