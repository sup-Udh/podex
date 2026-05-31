const ASSEMBLYAI_KEY = process.env.EXPO_PUBLIC_ASSEMBLYAI_KEY || "";

export const requestTranscription = async (audioUrl: string): Promise<string | null> => {
  if (!ASSEMBLYAI_KEY) {
    console.warn("AssemblyAI key missing. Transcription aborted.");
    return null;
  }

  try {
    const response = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: ASSEMBLYAI_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        speech_models: ["universal-2"] // Provide the exact model requested by the API error
      }),
    });

    const data = await response.json();
    if (data.id) {
      return data.id;
    } else {
      console.error("AssemblyAI Error:", data);
      return null;
    }
  } catch (error) {
    console.error("Failed to request transcription:", error);
    return null;
  }
};

export const pollTranscription = async (transcriptId: string): Promise<{ text: string, words: any[] } | null> => {
  return new Promise((resolve) => {
    const poll = setInterval(async () => {
      try {
        const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          method: "GET",
          headers: {
            authorization: ASSEMBLYAI_KEY,
          },
        });

        const data = await response.json();

        if (data.status === "completed") {
          clearInterval(poll);
          resolve({ text: data.text, words: data.words || [] });
        } else if (data.status === "error") {
          clearInterval(poll);
          console.error("Transcription error:", data.error);
          resolve(null);
        }
      } catch (error) {
        clearInterval(poll);
        console.error("Failed to poll transcription:", error);
        resolve(null);
      }
    }, 5000); // Poll every 5 seconds
  });
};
