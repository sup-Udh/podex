// audio playback in context om n the entire app

import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { Episode } from "../services/episodes";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";
import { requestTranscription, pollTranscription } from "../services/transcription";
import { getEmbeddings } from "../services/ai";

interface PlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  playEpisode: (episode: Episode) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  pausePlayback: () => Promise<void>;
  seekForward: () => Promise<void>;
  seekBackward: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
  closePlayer: () => Promise<void>;
  transcriptStatus: "idle" | "processing" | "completed" | "error";
  transcriptText: string | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const player = useAudioPlayer(audioSource ?? undefined);
  const status = useAudioPlayerStatus(player);

  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [transcriptStatus, setTranscriptStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [transcriptText, setTranscriptText] = useState<string | null>(null);

  // Safely derive state from status — guard against NaN/undefined
  const isPlaying = status.playing ?? false;
  const positionMillis = Number.isFinite(status.currentTime) ? status.currentTime * 1000 : 0;
  const durationMillis = Number.isFinite(status.duration) ? status.duration * 1000 : 0;

  const { session } = useAuth();
  const lastSyncRef = useRef(0);

  // Sync to Supabase every 10 seconds
  useEffect(() => {
    if (session?.user && isPlaying && currentEpisode) {
      const now = Date.now();
      if (now - lastSyncRef.current > 10000) {
        lastSyncRef.current = now;
        syncProgressToDB(session.user.id, currentEpisode, positionMillis, durationMillis);
      }
    }
  }, [isPlaying, positionMillis, durationMillis, currentEpisode, session]);

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

  const chunkAndEmbed = async (userId: string, ep: Episode, words: any[]) => {
    try {
      if (!words || words.length === 0) return;
      const chunks = [];
      let currentChunkText = "";
      let chunkStart = words[0]?.start || 0;
      let wordCount = 0;

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        currentChunkText += word.text + " ";
        wordCount++;

        if (wordCount >= 200 || i === words.length - 1) {
          chunks.push({
            user_id: userId,
            podcast_id: ep.podcastId,
            episode_id: ep.id,
            chunk_text: currentChunkText.trim(),
            start_time: chunkStart,
            end_time: word.end
          });
          currentChunkText = "";
          wordCount = 0;
          chunkStart = words[i + 1]?.start || 0;
        }
      }

      const texts = chunks.map(c => c.chunk_text);
      for (let i = 0; i < texts.length; i += 50) {
        const batchTexts = texts.slice(i, i + 50);
        const batchChunks = chunks.slice(i, i + 50);
        
        const embeddings = await getEmbeddings(batchTexts);
        
        const rowsToInsert = batchChunks.map((chunk, idx) => ({
          ...chunk,
          embedding: embeddings[idx] 
        }));

        await supabase.from("episode_chunks").insert(rowsToInsert);
      }
      console.log("Chunking and embedding completed.");
    } catch (error) {
      console.error("Failed to chunk and embed:", error);
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
        const result = await pollTranscription(transcriptId);
        if (result) {
          await supabase.from("episode_transcripts").update({
            status: "completed",
            transcript_text: result.text,
            updated_at: new Date().toISOString()
          }).eq("user_id", userId).eq("episode_id", ep.id);
          
          if (currentEpisode?.id === ep.id) {
            setTranscriptText(result.text);
            setTranscriptStatus("completed");
          }

          chunkAndEmbed(userId, ep, result.words);
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
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
  }, []);

  const playEpisode = useCallback(async (episode: Episode) => {
    try {
      if (currentEpisode && session?.user) {
        // save previous episode sync
        syncProgressToDB(session.user.id, currentEpisode, positionMillis, durationMillis);
      }
      
      setCurrentEpisode(episode);

      if (session?.user) {
        checkAndTranscribe(session.user.id, episode);
      }

      // Set the audio source — the useAudioPlayer hook will react to this
      setAudioSource(episode.audioUrl);
    } catch (error) {
      console.log("Error playing audio", error);
    }
  }, [currentEpisode, session, positionMillis, durationMillis]);

  // Auto-play when source changes
  useEffect(() => {
    if (audioSource && status.isLoaded && !status.playing) {
      try {
        player.play();
      } catch (e) {
        console.log("Auto-play error:", e);
      }
    }
  }, [audioSource, status.isLoaded]);

  const togglePlayPause = useCallback(async () => {
    try {
      if (isPlaying) {
        player.pause();
        if (session?.user && currentEpisode) {
          syncProgressToDB(session.user.id, currentEpisode, positionMillis, durationMillis);
        }
      } else {
        player.play();
      }
    } catch (e) {
      console.error("togglePlayPause error:", e);
    }
  }, [isPlaying, session, currentEpisode, positionMillis, durationMillis, player]);

  const pausePlayback = useCallback(async () => {
    if (!isPlaying) return;
    try {
      player.pause();
    } catch (e) {
      console.error("pausePlayback error:", e);
    }
  }, [isPlaying, player]);

  const seekForward = useCallback(async () => {
    const dur = Number.isFinite(status.duration) ? status.duration : 0;
    const newPositionSec = (positionMillis + 15000) / 1000;
    player.seekTo(Math.min(newPositionSec, dur));
  }, [positionMillis, status.duration, player]);

  const seekBackward = useCallback(async () => {
    const newPositionSec = (positionMillis - 15000) / 1000;
    player.seekTo(Math.max(newPositionSec, 0));
  }, [positionMillis, player]);

  const seekTo = useCallback(async (millis: number) => {
    player.seekTo(millis / 1000);
  }, [player]);

  const closePlayer = useCallback(async () => {
    if (session?.user && currentEpisode) {
      await syncProgressToDB(session.user.id, currentEpisode, positionMillis, durationMillis);
    }

    player.pause();
    setAudioSource(null);
    setCurrentEpisode(null);
  }, [session, currentEpisode, positionMillis, durationMillis, player]);

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        positionMillis,
        durationMillis,
        playEpisode,
        togglePlayPause,
        pausePlayback,
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
