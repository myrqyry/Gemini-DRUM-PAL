import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ToneJsSoundConfig } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_MODEL_NAME_EXPERIMENTAL } from '../constants';
import { TONE_JS_SOUND_SCHEMA } from './geminiSchema';

// API Key is expected to be in process.env.API_KEY
// Ensure this environment variable is set where this code runs.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set in environment variables. App may not function correctly.");
  // alert("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  // In a real app, you might want to disable functionality or show a persistent error.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // The "!" asserts API_KEY is non-null after the check

const PROMPT_PREFIX = `
You are an expert sound designer creating configurations for Tone.js for a drum machine.
`;

const PROMPT_EXAMPLES = `
Here are some examples:

User prompt: A deep, punchy kick drum sound. 808 style.
{
  "instrument": "MembraneSynth",
  "options": {
    "pitchDecay": 0.05,
    "octaves": 10,
    "oscillator": { "type": "sine" },
    "envelope": { "attack": 0.001, "decay": 0.4, "sustain": 0.01, "release": 1.4, "attackCurve": "exponential" }
  }
}

User prompt: A crisp, snappy snare drum with a short burst of white noise.
{
  "instrument": "NoiseSynth",
  "options": {
    "noise": { "type": "white" },
    "envelope": { "attack": 0.001, "decay": 0.1, "sustain": 0 }
  }
}
`;

export const getSoundConfigFromPrompt = async (userPrompt: string, modelName: string = GEMINI_MODEL_NAME): Promise<ToneJsSoundConfig | null> => {
  const fullPrompt = `${PROMPT_PREFIX}\n${PROMPT_EXAMPLES}\nGenerate a JSON object for the following sound description:\n${userPrompt}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: TONE_JS_SOUND_SCHEMA,
        temperature: 0.7,
        topP: 0.95,
        topK: 50,
      }
    });
    
    const parsedConfig = response.parsed as ToneJsSoundConfig;

    if (!parsedConfig || !parsedConfig.instrument || typeof parsedConfig.options !== 'object' || parsedConfig.options === null) {
        console.error("Parsed config is missing instrument or options:", parsedConfig);
        return null;
    }
    return parsedConfig;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    return null;
  }
};