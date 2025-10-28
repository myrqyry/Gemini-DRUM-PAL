import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';
import { TONE_JS_SOUND_SCHEMA } from '../../services/geminiSchema';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY for Gemini is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { prompt, model } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Prompt is required' }),
      };
    }

    const fullPrompt = `${PROMPT_PREFIX}\n${PROMPT_EXAMPLES}\nGenerate a JSON object for the following sound description:\n${prompt}`;

    const genAI = new GoogleGenAI(API_KEY);
    const geminiModel = genAI.getGenerativeModel({
      model: model,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: TONE_JS_SOUND_SCHEMA,
        temperature: 0.7,
        topP: 0.95,
        topK: 50,
      },
    });

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const soundConfig = JSON.parse(response.text());


    return {
      statusCode: 200,
      body: JSON.stringify(soundConfig),
    };
  } catch (error) {
    console.error('Error generating sound:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating sound' }),
    };
  }
};

export { handler };
