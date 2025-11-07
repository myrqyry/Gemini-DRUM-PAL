import { useState, useCallback } from 'react';

export type AppState = 'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';

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
