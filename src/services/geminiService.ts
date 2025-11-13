import { ToneJsSoundConfig } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';
import { AppError } from '@/utils/errorHandling';

const API_ENDPOINT = '/.netlify/functions/generate-sound';

export const getSoundConfigFromPrompt = async (userPrompt: string, modelName: string = GEMINI_MODEL_NAME): Promise<ToneJsSoundConfig> => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: userPrompt, model: modelName }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new AppError(`HTTP error! status: ${response.status}, body: ${errorBody}`, 'NETWORK_ERROR');
  }

  const soundConfig = await response.json();

  if (!soundConfig || !soundConfig.instrument || typeof soundConfig.options !== 'object' || soundConfig.options === null) {
      throw new AppError('Invalid sound configuration received from API', 'VALIDATION_ERROR');
  }

  return soundConfig;
};
