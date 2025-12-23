import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VideoMetadata } from "../types";

export const analyzeUrl = async (url: string): Promise<VideoMetadata> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "The actual title of the video found online." },
      platform: { type: Type.STRING, enum: ["YouTube", "Instagram", "Unknown"] },
      author: { type: Type.STRING, description: "The channel name or account handle." },
      duration: { type: Type.STRING, description: "Video duration (e.g., '10:05')." },
      thumbnailUrl: { type: Type.STRING, description: "The direct URL to the video thumbnail image." },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            quality: { type: Type.STRING },
            size: { type: Type.STRING, description: "Estimated file size" },
            format: { type: Type.STRING },
            type: { 
              type: Type.STRING, 
              enum: ['video_audio', 'video_only', 'audio_only'],
              description: "video_audio for normal video, video_only for muted streams, audio_only for music extraction" 
            }
          },
          required: ["quality", "size", "format", "type"]
        }
      }
    },
    required: ["title", "platform", "options", "thumbnailUrl", "author"],
  };

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    I need you to act as a backend service for a media downloader.
    
    1. USE GOOGLE SEARCH to find the ACTUAL details for this specific URL: ${url}
    2. Extract the real Video Title, Channel/Author Name, and Duration.
    3. Find the real Thumbnail URL.
       - If it's YouTube, use the standard maxresdefault format if possible or the one found in search.
       - If it's Instagram, find the image source.
    4. Generate a COMPREHENSIVE list of download options.
       - **CRITICAL**: If the video is high quality (HD), YOU MUST INCLUDE a '2160p (4K)' option in the 'video_audio' list. 
       - Include standard HD options: 1080p, 720p.
       - Include SD/Low Data options: 480p, 360p, 240p.
       - For 'audio_only', include '320kbps (High)' and '128kbps (Standard)'.
       - Estimate realistic file sizes (e.g. 4K is large, 240p is small).
    
    Return ONLY the JSON object matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    const metadata = JSON.parse(text) as VideoMetadata;

    // Fix: Extract grounding chunks as required by guidelines
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      metadata.sources = response.candidates[0].groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web)
        .map((web: any) => ({ uri: web.uri, title: web.title }));
    }
    
    return metadata;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Could not find video details. Please check the URL.");
  }
};