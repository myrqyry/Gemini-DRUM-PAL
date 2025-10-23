import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ToneJsSoundConfig, GenerateContentResponseParts } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_MODEL_NAME_EXPERIMENTAL } from '../constants';

// API Key is expected to be in process.env.API_KEY
// Ensure this environment variable is set where this code runs.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set in environment variables. App may not function correctly.");
  // alert("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  // In a real app, you might want to disable functionality or show a persistent error.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // The "!" asserts API_KEY is non-null after the check


const SOUND_DESIGN_PROMPT_TEMPLATE = `
You are an expert sound designer creating configurations for Tone.js.
The user wants a drum or FX sound. Generate a single, clean JSON object for Tone.js.

The JSON object MUST have this structure:
{
  "instrument": "MembraneSynth" | "NoiseSynth" | "MetalSynth" | "FMSynth" | "AMSynth" | "Synth" | "PluckSynth",
  "options": { /* Tone.js options for the chosen instrument. See examples below. */ },
  "effects": [ /* Optional array of up to 2 effects. */ ],
  "duration": "16n" | "8n" | number, // Typically short for drums.
  "note": "C2" | "A3" | null // Optional. Null for non-pitched instruments.
}

INSTRUMENT & EFFECT EXAMPLES (Use these as a guide, be creative with values):

1. "MembraneSynth": Good for kicks and toms.
   "options": { "pitchDecay": 0.05, "octaves": 10, "oscillator": { "type": "sine" }, "envelope": { "attack": 0.001, "decay": 0.4, "sustain": 0.01, "release": 1.4, "attackCurve": "exponential" } }

2. "NoiseSynth": Good for snares, hi-hats, and textures.
   "options": { "noise": { "type": "white" }, "envelope": { "attack": 0.001, "decay": 0.1, "sustain": 0 } }

3. "MetalSynth": Good for cymbals, bells, metallic sounds.
   "options": { "frequency": 200, "envelope": { "attack": 0.001, "decay": 1.4, "release": 0.2 }, "harmonicity": 5.1, "modulationIndex": 32, "resonance": 4000, "octaves": 1.5 }

4. "FMSynth" / "AMSynth": Good for complex, weird FX sounds.
   "options": { "harmonicity": 3, "modulationIndex": 10, "envelope": { "attack": 0.01, "decay": 0.2 }, "modulation": { "type": "square" }, "modulationEnvelope": { "attack": 0.5, "decay": 0.01 } }

5. "PluckSynth": Good for percussive string-like sounds.
   "options": { "attackNoise": 1, "dampening": 4000, "resonance": 0.7 }

6. "Synth": A basic, general-purpose synthesizer.
   "options": { "oscillator": { "type": "sawtooth" }, "envelope": { "attack": 0.02, "decay": 0.1, "sustain": 0.3, "release": 1 } }

EFFECTS EXAMPLES:
- { "type": "Distortion", "options": { "distortion": 0.6 } }
- { "type": "Reverb", "options": { "decay": 4, "preDelay": 0.01 } }
- { "type": "BitCrusher", "options": { "bits": 4 } } // Use for "lo-fi", "8-bit", "crunchy" sounds.
- { "type": "Chorus", "options": { "frequency": 1.5, "delayTime": 2.5, "depth": 0.7 } }
- { "type": "Phaser", "options": { "frequency": 0.5, "octaves": 3, "baseFrequency": 350 } }

User's sound description: "{USER_DESCRIPTION}"

CRITICAL GUIDELINES:
- Respond with ONLY the JSON object. No other text, no markdown.
- BE CREATIVE: Do not use the same few values. Explore the parameter ranges.
- Kicks: Use "MembraneSynth". Low "pitchDecay", short "duration".
- Snares: Use "NoiseSynth". Short envelope. Maybe add a Distortion.
- Hi-hats: "MetalSynth" or "NoiseSynth". Very short "duration" for closed, longer for open.
- FX/Weird sounds: Use "FMSynth", "AMSynth". Combine with "Phaser", "BitCrusher", or "Chorus" for interesting textures. A "glitchy" sound might use a "BitCrusher" and a fast "AutoFilter".
- Ensure all option values are numbers, not strings.
`;


export const getSoundConfigFromPrompt = async (userPrompt: string, modelName: string = GEMINI_MODEL_NAME): Promise<ToneJsSoundConfig | null> => {
  const fullPrompt = SOUND_DESIGN_PROMPT_TEMPLATE.replace("{USER_DESCRIPTION}", userPrompt);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config: {
        // Not asking for JSON mime type here because the prompt is very specific about JSON output
        // and sometimes the model wraps it in markdown even with responseMimeType: "application/json"
        // We'll parse it manually.
        temperature: 0.7, // More creative for varied sounds
        topP: 0.95,
        topK: 50,
        // No thinkingConfig, default is fine for this creative task
      }
    });
    
    const responseText = response.text;
    
    let jsonStr = responseText.trim();
    // Remove markdown fences if present
    const fenceRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    // Try to parse the cleaned string
    const parsedConfig = JSON.parse(jsonStr) as ToneJsSoundConfig;

    // Basic validation
    if (!parsedConfig.instrument || !parsedConfig.options) {
        console.error("Parsed config is missing instrument or options:", parsedConfig);
        return null;
    }
    return parsedConfig;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    // Attempt to extract JSON from error message if it's a parsing issue with extra text
    if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        const jsonMatch = error.message.match(/({[\s\S]*})|(\[[\s\S]*\])/);
        if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
            try {
                const salvagedJson = JSON.parse(jsonMatch[1] || jsonMatch[2]);
                if (salvagedJson.instrument && salvagedJson.options) {
                    console.log("Salvaged JSON from error:", salvagedJson);
                    return salvagedJson as ToneJsSoundConfig;
                }
            } catch (e2) {
                // Salvage attempt failed
            }
        }
    }
    return null;
  }
};