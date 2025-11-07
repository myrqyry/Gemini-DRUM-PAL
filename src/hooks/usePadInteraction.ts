import { useState, useCallback } from 'react';
import { useRecording } from './useRecording';
import { useAudioManager } from './useAudioManager';
import { useKitManager } from './useKitManager';
import { useAppState } from './useAppState';
import { getPadIdFromKey } from '../utils/keyboardMapping';

interface PadInteractionProps {
  appState: ReturnType<typeof useAppState>;
  audioManager: ReturnType<typeof useAudioManager>;
  kitManager: ReturnType<typeof useKitManager>;
  handleGenerateSound: (padId: string, prompt: string) => Promise<void>;
}

export const usePadInteraction = ({
  appState,
  audioManager,
  kitManager,
  handleGenerateSound,
}: PadInteractionProps) => {
  const { appState: currentState, setAppState, setLcdMessage } = appState;
  const { playSound } = audioManager;
  const { pads, setPads } = kitManager;

  const [selectedPadId, setSelectedPadId] = useState<string | null>(null);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [hotPads, setHotPads] = useState<Record<string, boolean>>({});

  const triggerPad = useCallback(
    (padId: string): boolean => {
      const pad = pads.find((p) => p.id === padId);
      if (!pad || !pad.toneJsConfig) {
        return false;
      }
      playSound(pad.toneJsConfig);
      setHotPads((prev) => ({ ...prev, [padId]: true }));
      setTimeout(() => {
        setHotPads((prev) => ({ ...prev, [padId]: false }));
      }, 150);
      return true;
    },
    [pads, playSound]
  );

  const {
    recordingState,
    handleRecord,
    handlePlay,
    handleStop,
    recordNote,
    recordedSequence,
  } = useRecording(triggerPad, 120);

  const handlePadClick = useCallback(
    async (padId: string) => {
      if (
        currentState === 'BOOTING' ||
        currentState === 'OFF' ||
        currentState === 'GENERATING'
      )
        return;

      const pad = pads.find((p) => p.id === padId);
      if (!pad) return;

      if (currentState === 'MENU') {
        setSelectedPadId(pad.id);
        setPromptInputValue(pad.soundPrompt);
        setAppState('EDITING_PAD');
      } else if (currentState === 'EDITING_PAD') {
        if (padId === selectedPadId) {
          handleGenerateSound(padId, promptInputValue);
        } else {
          triggerPad(padId);
        }
      } else if (currentState === 'IDLE' || currentState === 'ERROR') {
        const success = triggerPad(padId);
        if (!success && !pad.isLoading) {
          setLcdMessage(`${pad.name} NOT READY!`);
          setTimeout(() => setLcdMessage('GEMINI\nDRUM-PAL'), 1500);
        }
      }
    },
    [
      currentState,
      pads,
      selectedPadId,
      triggerPad,
      setAppState,
      setLcdMessage,
    ]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const padId = getPadIdFromKey(event.key);

      if (
        padId &&
        ['IDLE', 'ERROR', 'EDITING_PAD', 'MENU'].includes(currentState)
      ) {
        event.preventDefault();
        triggerPad(padId);
      }
    },
    [currentState, triggerPad]
  );

  return {
    selectedPadId,
    promptInputValue,
    hotPads,
    handlePadClick,
    handleKeyDown,
    recordingState,
    handleRecord,
    handlePlay,
    handleStop,
    recordNote,
    recordedSequence,
  };
};
