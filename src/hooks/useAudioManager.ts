import { useState } from 'react';
import { playSound, initializeAudio } from '../services/audioService';

/**
 * @function useAudioManager
 * @description A custom hook to manage audio-related functionality.
 * This hook abstracts the audio initialization process and provides access to audio playback functions.
 * It tracks the initialization state to ensure that audio operations are only performed when the audio context is ready.
 *
 * @returns {{
 *   audioInitialized: boolean,
 *   initializeAudio: () => Promise<boolean>,
 *   playSound: typeof playSound
 * }} An object containing the audio initialization state, a function to initialize audio, and the playSound function.
 */
export const useAudioManager = () => {
  const [audioInitialized, setAudioInitialized] = useState(false);

  const handleInitializeAudio = async () => {
    const success = await initializeAudio();
    setAudioInitialized(success);
    return success;
  };

  return { audioInitialized, initializeAudio: handleInitializeAudio, playSound };
};
