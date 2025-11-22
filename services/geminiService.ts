
import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, ASPECT_RATIOS } from "../types";

// Initialize the client
// API Key must be provided via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Maps user selected ratio ID to closest API supported ratio
 */
const mapRatioToApi = (userRatioId: string): string => {
  const ratioObj = ASPECT_RATIOS.find(r => r.id === userRatioId);
  return ratioObj ? ratioObj.apiValue : "16:9";
};

/**
 * Generates a single image based on the prompt.
 */
const generateSingleImage = async (prompt: string, style: string, language: string, ratioId: string, index: number): Promise<GeneratedImage> => {
  try {
    const apiRatio = mapRatioToApi(ratioId);
    const ratioLabel = ASPECT_RATIOS.find(r => r.id === ratioId)?.label || ratioId;

    // Construct a rich prompt based on user inputs
    const fullPrompt = `
      Create a ${style} image.
      Subject/Emotion: "${prompt}".
      Language Context: The user input is in ${language}.
      Composition Requirement: The user wants an aspect ratio/format of ${ratioLabel}. 
      Please compose the subject within the frame to suit this format perfectly.
      Style description: ${getStyleDescription(style)}
      Details: High quality, highly detailed, atmospheric.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: fullPrompt
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: apiRatio,
        }
      }
    });

    let imageUrl = '';
    
    // Iterate through parts to find the image
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data found in response");
    }

    return {
      id: `img-${Date.now()}-${index}`,
      url: imageUrl,
      prompt: prompt,
      isLoading: false,
      ratio: ratioId
    };

  } catch (error) {
    console.error(`Error generating image ${index}:`, error);
    return {
      id: `err-${Date.now()}-${index}`,
      url: '',
      prompt: prompt,
      isLoading: false,
      error: "Failed to generate",
      ratio: ratioId
    };
  }
};

/**
 * Helper to add flavor text to specific styles
 */
const getStyleDescription = (style: string): string => {
  switch (style) {
    case "Mood Dark Ambient": return "Low key lighting, shadowy, mysterious, moody atmosphere, deep blacks.";
    case "Pastel Dream Core": return "Soft pastel colors, dreamy, surreal, ethereal, nostalgic aesthetic.";
    case "Mistic Aura Photography": return "Glowing auras, magical atmosphere, spiritual energy, soft radiance.";
    case "Golden Light Spiritual Style": return "Bathed in golden hour light, divine rays, peaceful, transcendent.";
    case "Zen Minimal Photography": return "Simple composition, negative space, balanced, peaceful, nature-inspired.";
    case "Esoteric Fantasy Style": return "Mystical symbols, magical realism, ancient vibes, other-worldly.";
    default: return `A masterfully executed ${style} visual.`;
  }
};

/**
 * Generates N images in parallel for the given prompt.
 */
export const generateImages = async (prompt: string, style: string, language: string, count: number, ratio: string): Promise<GeneratedImage[]> => {
  // We launch 'count' parallel requests
  const promises = Array.from({ length: count }).map((_, index) => 
    generateSingleImage(prompt, style, language, ratio, index)
  );

  return Promise.all(promises);
};
