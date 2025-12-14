import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { VisualizationData, ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';

// --- Theory Generation Service ---

export const generateTheoryData = async (prompt: string): Promise<VisualizationData> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A short title for the theory concept (e.g. C Major Scale)" },
      description: { type: Type.STRING, description: "A one sentence explanation." },
      type: { type: Type.STRING, enum: ["scale", "chord", "interval"] },
      root: { type: Type.STRING, description: "The root note name (e.g. C, F#)" },
      notes: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "All notes included in this scale or chord. Use sharps (#) instead of flats where possible for consistency." 
      },
      intervals: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "The interval relationship for each note (e.g. R, M3, P5, b7)" 
      },
      instrumentPreference: { type: Type.STRING, enum: ["piano", "guitar"] }
    },
    required: ["title", "description", "type", "root", "notes", "intervals"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate music theory visualization data for the user request: "${prompt}". 
      If the user does not specify an instrument, default to piano. 
      Ensure note names are consistent (use sharps for simplicity if ambiguous).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as VisualizationData;
  } catch (error) {
    console.error("Error generating theory data:", error);
    throw error;
  }
};

// --- Image Generation Service ---

export const generateMusicImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// --- Chat Service ---

let chatSession: Chat | null = null;

export const sendMessageToChat = async (message: string, history: ChatMessage[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });

  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are a helpful and knowledgeable music theory tutor. Explain concepts clearly. You can use markdown for formatting.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat error:", error);
    // Reset session on error to be safe
    chatSession = null;
    throw error;
  }
};
