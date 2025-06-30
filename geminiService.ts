
import { GoogleGenAI } from "@google/genai";
import { LyricsData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getJsonFromResponse = (text: string): LyricsData | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    // Basic validation to check if the parsed data looks like our LyricsData structure
    if (parsedData && parsedData.title && parsedData.artist && Array.isArray(parsedData.lyrics)) {
      return parsedData as LyricsData;
    }
    return null;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    // Try to find JSON within a larger string if initial parsing fails
    const jsonMatch = jsonStr.match(/{[\s\S]*}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as LyricsData;
      } catch (e2) {
        console.error("Failed to parse extracted JSON either:", e2);
        return null;
      }
    }
    return null;
  }
};

export const getLyricsAnalysis = async (query: string): Promise<LyricsData> => {
  const prompt = `
    You are a linguistic analysis expert and API. Your task is to process a song request and return a structured JSON object.
    Do not include any explanatory text before or after the JSON object. The response must be only the JSON.

    The user has requested the song: "${query}". Please identify the song title and artist from this query.

    Your task is to:
    1. Find the original lyrics for this song.
    2. Identify the original language of the lyrics (e.g., "English", "Spanish", "Japanese").
    3. For each line of the original lyrics, provide a line-by-line translation into Brazilian Portuguese.
    4. For each line of the original lyrics, provide a precise line-by-line phonetic transcription using the International Phonetic Alphabet (IPA).

    The final output MUST be a single JSON object with the following structure:
    {
      "title": "The Song Title",
      "artist": "The Artist Name",
      "language": "The Original Language Name",
      "lyrics": [
        {
          "original": "First line of original lyrics",
          "translation": "Primeira linha da tradução em português",
          "ipa": "[fərst laɪn əv ərɪdʒɪnəl lɪrɪks]"
        },
        {
          "original": "Second line of original lyrics",
          "translation": "Segunda linha da tradução em português",
          "ipa": "[sɛkənd laɪn əv ərɪdʒɪnəl lɪrɪks]"
        }
      ]
    }

    Ensure that each object in the 'lyrics' array corresponds to a single line and that the 'original', 'translation', and 'ipa' fields are perfectly aligned. Do not add any extra fields or deviate from this structure. If the song cannot be found, return a JSON object with an error message: { "error": "Song not found" }.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.2,
        }
    });
    
    const parsedData = getJsonFromResponse(response.text);

    if (parsedData) {
      return parsedData;
    } else {
      throw new Error("A resposta da API não continha um JSON válido ou estava mal formatada.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Não foi possível obter a análise da música. Tente novamente.");
  }
};
