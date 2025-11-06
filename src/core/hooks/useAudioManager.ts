import { useState } from 'react';
import { playSound, initializeAudio } from '../services/audioService';

export const useAudioManager = () => {
  const [audioInitialized, setAudioInitialized] = useState(false);

  const handleInitializeAudio = async () => {
    const success = await initializeAudio();
    setAudioInitialized(success);
    return success;
  };

  return { audioInitialized, initializeAudio: handleInitializeAudio, playSound };
};
