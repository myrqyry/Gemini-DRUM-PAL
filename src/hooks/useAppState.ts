import { useState, useCallback } from 'react';
import { WELCOME_MESSAGE } from '@/constants';

/**
 * @typedef {'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT'} AppState
 * @description Represents the various states of the application, controlling UI and behavior.
 */
export type AppState = 'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';

/**
 * @function useAppState
 * @description A custom hook to manage the global state of the application.
 * This hook centralizes the logic for the application's current state (e.g., 'IDLE', 'MENU') and the message displayed on the LCD screen.
 * It also provides a utility function to show temporary messages.
 *
 * @returns {{
 *   appState: AppState,
 *   setAppState: React.Dispatch<React.SetStateAction<AppState>>,
 *   lcdMessage: string,
 *   setLcdMessage: React.Dispatch<React.SetStateAction<string>>,
 *   showTemporaryMessage: (message: string, duration?: number, nextState?: AppState) => void
 * }} An object containing the current state and functions to update it.
 */
export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>('OFF');
  const [lcdMessage, setLcdMessage] = useState('');

  const showTemporaryMessage = useCallback((
    message: string,
    duration: number = 2000,
    nextState: AppState = 'IDLE'
  ) => {
    setLcdMessage(message);
    setAppState('GENERATING');
    setTimeout(() => {
      setAppState(nextState);
      setLcdMessage(nextState === 'IDLE' ? WELCOME_MESSAGE : 'Click pad to edit');
    }, duration);
  }, []);

  return {
    appState,
    setAppState,
    lcdMessage,
    setLcdMessage,
    showTemporaryMessage
  };
};
