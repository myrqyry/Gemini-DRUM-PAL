import { ToneJsSoundConfig } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';
import { AppError } from '@/utils/errorHandling';

const API_ENDPOINT = '/.netlify/functions/generate-sound';

export const getSoundConfigFromPrompt = async (
  userPrompt: string,
  modelName: string = GEMINI_MODEL_NAME
): Promise<ToneJsSoundConfig> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt, model: modelName }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 404) {
        throw new AppError(
          'Sound generation service not found. Please ensure Netlify functions are deployed.',
          'NETWORK_ERROR'
        );
      }
      throw new AppError(
        `Failed to generate sound (${response.status}): ${errorBody}`,
        'NETWORK_ERROR'
      );
    }

    const soundConfig = await response.json();

    if (!soundConfig?.instrument || typeof soundConfig.options !== 'object') {
      throw new AppError(
        'Received invalid sound configuration from AI',
        'VALIDATION_ERROR'
      );
    }

    return soundConfig;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'NETWORK_ERROR'
    );
  }
};
