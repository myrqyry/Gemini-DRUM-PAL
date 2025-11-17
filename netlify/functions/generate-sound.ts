import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/genai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ToneJsSoundConfigSchema } from '../../src/services/geminiSchema';

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
           error: 'Server configuration error: GEMINI_API_KEY not set'
         }),
      };
    }

    // Parse request body
    const { prompt, model = 'gemini-2.0-flash-exp' } = JSON.parse(event.body || '{}');

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid or missing prompt' }),
      };
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const generativeModel = genAI.getGenerativeModel({
      model,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchema(ToneJsSoundConfigSchema) as any,
      },
    });

    // System prompt for drum sound generation
    const systemPrompt = `You are an expert at creating drum sounds using Tone.js synthesis parameters. Generate a ToneJsSoundConfig JSON that will produce a convincing ${prompt} drum sound.  Guidelines: - Use appropriate instrument types: MetalSynth for cymbals, MembraneSynth for drums, NoiseSynth for hi-hats - Set realistic frequency ranges: kicks (40-100Hz), snares (150-250Hz), toms (80-200Hz), hi-hats/cymbals (5000-15000Hz) - Configure envelope (attack, decay, sustain, release) for realistic drum hits - Add effects like reverb, distortion, or filtering when appropriate - Keep sounds punchy and percussive`;

    // Generate sound config
    const result = await generativeModel.generateContent(systemPrompt);
    const response = result.response;
    const soundConfig = JSON.parse(response.text());

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(soundConfig),
    };
  } catch (error) {
    console.error('Error generating sound:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
         error: 'Failed to generate sound configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
