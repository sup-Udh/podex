import { supabase } from "./supabase";

const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";

export const getEmbeddings = async (input: string | string[]): Promise<number[][]> => {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      input,
      model: "text-embedding-3-small",
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  // Return array of embeddings
  return data.data.map((d: any) => d.embedding);
};

export const askPodcast = async (question: string, episodeId: string, userId: string): Promise<string> => {
  // 1. Embed the question
  const [queryEmbedding] = await getEmbeddings(question);

  // 2. Search Supabase for relevant chunks
  const { data: chunks, error } = await supabase.rpc("match_episode_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: 0.3, // Lower threshold to ensure we get results
    match_count: 5,
    p_episode_id: episodeId,
    p_user_id: userId,
  });

  if (error) {
    console.error("Vector search error:", error);
    throw new Error("Failed to search transcript.");
  }

  // 3. Construct the prompt
  const contextText = chunks?.map((c: any) => `[Timestamp: ${formatMillis(c.start_time)} to ${formatMillis(c.end_time)}]\n${c.chunk_text}`).join("\n\n") || "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Podex AI, a helpful voice assistant for a podcast player. Answer the user's question based ONLY on the provided podcast transcript chunks. Keep answers conversational, engaging, and concise (since it may be spoken aloud). If applicable, mention the timestamp of the information.",
        },
        {
          role: "user",
          content: `Transcript Context:\n${contextText}\n\nQuestion: ${question}`,
        },
      ],
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
};

// Helper to format timestamps for the AI prompt
const formatMillis = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const transcribeVoice = async (audioUri: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", {
    uri: audioUri,
    type: "audio/m4a", // expo-audio records in m4a on iOS/Android
    name: "audio.m4a",
  } as any);
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.text;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: "alloy",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Speech generation failed");
  }

  // Convert response to base64 audio string that expo-audio can play
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string); // Returns a data URI: data:audio/mpeg;base64,...
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateTagsFromTranscript = async (transcriptText: string): Promise<string[]> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an AI that generates relevant tags for a podcast transcript. Read the transcript and generate 5 to 10 highly specific, relevant tags based ONLY on what is actually discussed. Return the tags as a JSON object with a single key 'tags' containing an array of strings. Output all tags in lowercase."
        },
        {
          role: "user",
          content: `Transcript: ${transcriptText.slice(0, 15000)}` // Limit input to avoid massive token usage for now
        }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  try {
    const content = JSON.parse(data.choices[0].message.content);
    return content.tags || [];
  } catch (e) {
    console.error("Failed to parse tags JSON", e);
    return [];
  }
};

export const extractTaggedItems = async (transcriptText: string, tags: string[]): Promise<any[]> => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an AI that extracts key moments from a podcast transcript based on provided tags. For each tag provided, extract up to 2 key moments from the transcript. Return a JSON object with a single key 'items' containing an array of objects. Each object MUST have: 'tag' (the tag string), 'content' (the actual insight/quote), 'context' (why it was mentioned), and 'timestamp_approx' (the approximate timestamp string, e.g. '44:20', or 'Unknown' if not specified)."
        },
        {
          role: "user",
          content: `Tags: ${JSON.stringify(tags)}\n\nTranscript: ${transcriptText.slice(0, 15000)}`
        }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  try {
    const content = JSON.parse(data.choices[0].message.content);
    return content.items || [];
  } catch (e) {
    console.error("Failed to parse extracted items JSON", e);
    return [];
  }
};
