import { ToneJsSoundConfig } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

const API_ENDPOINT = '/.netlify/functions/generate-sound';

export const getSoundConfigFromPrompt = async (userPrompt: string, modelName: string = GEMINI_MODEL_NAME): Promise<ToneJsSoundConfig | null> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: userPrompt, model: modelName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const soundConfig = await response.json();

    if (!soundConfig || !soundConfig.instrument || typeof soundConfig.options !== 'object' || soundConfig.options === null) {
        console.error("Parsed config is missing instrument or options:", soundConfig);
        return null;
    }

    return soundConfig;
  } catch (error) {
    console.error("Error calling sound generation API:", error);
    return null;
  }
};
