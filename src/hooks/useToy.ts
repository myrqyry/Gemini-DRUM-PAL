import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useShellCustomization } from './useShellCustomization';
import { useToyState } from './useToyState';
import { useKitManager } from './useKitManager';
import { useAudioManager } from './useAudioManager';
import { useRecording } from './useRecording';
import { getSoundConfigFromPrompt } from '@/services/geminiService';
import { getAudioContextState } from '@/services/audioService';
import { SecurityUtils } from '@/utils/security';
import { getPadIdFromKey } from '@/utils/keyboardMapping';
import { parseKitFromUrl } from '@/utils/url';
import { KitService } from '@/services/kitService';
import { THEMES } from '@/themes';
import { AppError, createErrorHandler } from '@/utils/errorHandling';
import { WELCOME_MESSAGE, METRONOME_TICK_CONFIG, GEMINI_MODEL_NAME, GEMINI_MODEL_NAME_EXPERIMENTAL } from '@/constants';
import { ToyConfig, SoundEngine } from '@/types/toyTypes';
import { PadConfig } from '@/types';

export const useToy = (config: ToyConfig, soundEngine: SoundEngine, initialPads: PadConfig[]) => {
  const { state, actions } = useToyState();
  const { power, mode, ui, audio, customization } = state;
  const { level: batteryLevel, status: powerStatus } = power;
  const { lcdMessage, selectedPadId, activeAnimation, isKitsModalOpen, promptInputValue, stickerUrlInput } = ui;
  const { bpm, isMetronomeOn, isToyModeEnabled } = audio;
  const { stickerRotation, stickerScale, soundModel, isWellLovedEnabled } = customization;
  const { shellColor, isTransparent: themeIsTransparent, stickerUrl: themeStickerUrl, handleCycleTheme, handleSetTheme } = useShellCustomization();


  const { pads, setPads, savedKits, handleSaveKit, handleLoadKit, handleDeleteKit } = useKitManager(initialPads);
  const { initializeAudio } = useAudioManager();

  const [hotPads, setHotPads] = useState<Record<string, boolean>>({});
  const [stickerClickCount, setStickerClickCount] = useState(0);
  const [isTicking, setIsTicking] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [morphValue, setMorphValue] = useState(0);
  const [editingSound, setEditingSound] = useState<'A' | 'B'>('A');
  const [isLcdFlickering, setIsLcdFlickering] = useState(false);

  useEffect(() => {
    if (batteryLevel < 20) {
      setIsLcdFlickering(true);
    } else {
      setIsLcdFlickering(false);
    }
  }, [batteryLevel]);

  const handleToggleEditingSound = () => {
    setEditingSound(prev => (prev === 'A' ? 'B' : 'A'));
  };

  const handleMorphChange = (value: number) => {
    setMorphValue(value);
    if (selectedPadId) {
      setPads(
        pads.map(p =>
          p.id === selectedPadId ? { ...p, morphValue: value } : p
        )
      );
    }
  };

  const currentShell = useMemo(() => {
    const theme = THEMES.find(t => t.shellColor === shellColor);
    const shell = config.shellColors.find(c => c.name === theme?.shellName);
    return shell || config.shellColors[0];
  }, [shellColor, config.shellColors]);

  const soundTimeoutsRef = React.useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    return () => {
      soundTimeoutsRef.current.forEach(clearTimeout);
      soundTimeoutsRef.current.clear();
    };
  }, []);

  const triggerPad = useCallback((padId: string): boolean => {
    const pad = pads.find(p => p.id === padId);
    if (!pad || !pad.toneJsConfig) {
        return false;
    }

    const trigger = () => {
        recordNote(padId);

        actions.depleteBattery();
    soundEngine.playSound(pad.toneJsConfig, soundTimeoutsRef, pad.toneJsConfigB, pad.morphValue, isToyModeEnabled, batteryLevel);
    setPads(prev => prev.map(p => p.id === padId ? { ...p, error: undefined } : p));
    const animationType = config.animationMap[pad.id];
    if (animationType) {
        actions.triggerAnimation(animationType);
        setTimeout(() => actions.triggerAnimation(null), 700);
    }
    };

    if (isWellLovedEnabled && Math.random() < 0.2) {
      setTimeout(trigger, Math.random() * 200);
    } else {
      trigger();
    }

    return true;
  }, [pads, setPads, actions, soundEngine, config.animationMap, isWellLovedEnabled, batteryLevel, recordNote, isToyModeEnabled]);

  const { recordingState, handleRecord, handlePlay, handleStop, recordNote, recordedSequence } = useRecording(triggerPad, bpm);

  useEffect(() => {
    const storedStickerTransform = localStorage.getItem('stickerTransform');
    if (storedStickerTransform) {
      const { rotation, scale } = JSON.parse(storedStickerTransform);
      actions.updateCustomization({ stickerRotation: rotation, stickerScale: scale });
    }
  }, []);

  const showTemporaryMessage = useCallback((message: string, duration: number = 2000, nextState: 'IDLE' | 'MENU' | 'EDITING' | 'RECORDING' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT' = 'IDLE') => {
    actions.updateLcd(message);
    actions.setMode('GENERATING');
    setTimeout(() => {
        actions.setMode(nextState);
        actions.updateLcd(nextState === 'IDLE' ? WELCOME_MESSAGE : 'Click pad to edit');
    }, duration);
  }, [actions]);

  const handlePowerOn = async () => {
    if (powerStatus !== 'OFF') return;
    const success = await initializeAudio();
    if (success) {
      actions.powerOn();
    } else {
      actions.setError("AUDIO FAILED\nTO INITIALIZE");
    }
  };

  useEffect(() => {
    if (powerStatus === 'BOOTING') {
      const timer = setTimeout(() => {
        actions.setMode('IDLE');
        actions.updateLcd(WELCOME_MESSAGE);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [powerStatus, actions]);

  useEffect(() => {
    if (isMetronomeOn && powerStatus !== 'OFF') {
      const interval = setInterval(() => {
        actions.depleteBattery();
        soundEngine.playSound(METRONOME_TICK_CONFIG, soundTimeoutsRef, undefined, 0, isToyModeEnabled, batteryLevel);
        setIsTicking(true);
        setTimeout(() => setIsTicking(false), 100);
      }, (60 / bpm) * 1000);
      return () => clearInterval(interval);
    }
  }, [isMetronomeOn, bpm, power, soundEngine]);

  const handleGenerateSound = useCallback(async (padId: string, prompt: string, isPreconfig: boolean = false) => {
    const handleError = createErrorHandler('sound generation');

    if (isApiKeyMissing) {
      showTemporaryMessage("API KEY MISSING", 3000, 'IDLE');
      return;
    }

    try {
      if (!prompt.trim()) {
        throw new AppError('Sound prompt cannot be empty', 'VALIDATION_ERROR');
      }

      setPads(prev => prev.map(p =>
        p.id === padId ? { ...p, isLoading: true, error: undefined } : p
      ));

      const cachedConfig = KitService.loadSoundConfig(prompt);

      if (cachedConfig) {
        setPads(prev => prev.map(p =>
          p.id === padId ? {
            ...p,
            soundPrompt: prompt,
            toneJsConfig: cachedConfig,
            isLoading: false,
            error: undefined
          } : p
        ));
        if (!isPreconfig) {
          showTemporaryMessage("LOADED!", 1500, 'IDLE');
        }
        return;
      }

      const model = soundModel === 'EXPERIMENTAL' ? GEMINI_MODEL_NAME_EXPERIMENTAL : GEMINI_MODEL_NAME;
      const newConfig = await getSoundConfigFromPrompt(prompt, model);

      if (!newConfig) {
        throw new AppError('Failed to generate sound configuration', 'CONFIG_GENERATION_ERROR');
      }

      KitService.saveSoundConfig(prompt, newConfig);

      const newPads = pads.map(p => {
        if (p.id === padId) {
          const newPad = {
            ...p,
            soundPrompt: prompt,
            isLoading: false,
            error: undefined,
          };
          if (editingSound === 'A') {
            newPad.toneJsConfig = newConfig;
          } else {
            newPad.toneJsConfigB = newConfig;
          }
          return newPad;
        }
        return p;
      });
      setPads(newPads);

      if (!isPreconfig) {
        showTemporaryMessage("SUCCESS!", 1500, 'IDLE');
      }

      actions.updateHistory(
        [...state.history.slice(0, state.historyIndex + 1), newPads],
        state.historyIndex + 1
      );
    } catch (error) {
      const appError = handleError(error);
      console.error(`[${appError.code}] ${appError.message}`, error);

      setPads(prev => prev.map(p =>
        p.id === padId ? {
          ...p,
          isLoading: false,
          error: appError.message
        } : p
      ));

      if (!isPreconfig && appError.recoverable) {
        showTemporaryMessage(`ERROR: ${appError.code}`, 2000, 'IDLE');
      }
    }
  }, [pads, showTemporaryMessage, setPads, soundModel, isApiKeyMissing]);

  useEffect(() => {
    if (mode !== 'IDLE') return;
    const audioState = getAudioContextState();
    if (audioState !== 'running') return;

    const unconfiguredPads = pads.filter(p => !p.toneJsConfig && !p.isLoading && p.soundPrompt);
    if (unconfiguredPads.length > 0) {
      unconfiguredPads.forEach(padToPreconfigure => {
        handleGenerateSound(padToPreconfigure.id, padToPreconfigure.soundPrompt, true);
      });
    }
  }, [mode, pads, handleGenerateSound]);

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
              return;
          }

          const padId = getPadIdFromKey(event.key);

          if (padId && ['IDLE', 'ERROR', 'EDITING', 'MENU'].includes(mode)) {
              event.preventDefault();
              const success = triggerPad(padId);
              if (success) {
                  setHotPads(prev => ({ ...prev, [padId]: true }));
                  setTimeout(() => {
                      setHotPads(prev => ({ ...prev, [padId]: false }));
                  }, 150);
              }
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
  }, [mode, triggerPad]);

  const handlePadClick = async (padId: string) => {
    if (activeAnimation || powerStatus === 'BOOTING' || powerStatus === 'OFF' || mode === 'GENERATING') return;

    const pad = pads.find(p => p.id === padId);
    if (!pad) return;

    if (mode === 'MENU') {
      actions.selectPad(pad.id);
      actions.updateUi({ promptInputValue: pad.soundPrompt });
    } else if (mode === 'EDITING') {
      if (padId === selectedPadId) {
        handleGenerateSound(padId, promptInputValue);
      } else {
        triggerPad(padId);
      }
    } else if (mode === 'IDLE' || mode === 'ERROR') {
      const success = triggerPad(padId);
      if (!success && !pad.isLoading) {
        actions.updateLcd(`${pad.name} NOT READY!`);
        setTimeout(() => actions.updateLcd(WELCOME_MESSAGE), 1500);
      }
    }
  };

  const handleMenuButtonClick = () => {
    if (mode === 'IDLE' || mode === 'ERROR' || mode === 'STICKER_PROMPT') {
      actions.setMode('MENU');
    } else if (mode === 'MENU' || mode === 'EDITING') {
      actions.setMode('IDLE');
      actions.updateLcd(WELCOME_MESSAGE);
      actions.selectPad(null);
    }
  };

  const handleStickerTrigger = () => {
    if (powerStatus === 'OFF' || powerStatus === 'BOOTING' || mode === 'GENERATING') return;
    const newCount = stickerClickCount + 1;
    setStickerClickCount(newCount);
    if (newCount >= 5) {
      actions.setMode('STICKER_PROMPT');
      setStickerClickCount(0);
    }
  };

  const handleStickerUrlSubmit = useCallback(() => {
    const sanitizedUrl = SecurityUtils.sanitizeUrl(stickerUrlInput);

    if (sanitizedUrl) {
      actions.updateCustomization({ stickerUrl: sanitizedUrl });
      showTemporaryMessage("STICKER LOADED!", 1500, 'IDLE');
    } else {
      showTemporaryMessage("INVALID URL", 1500, 'IDLE');
    }

    actions.updateUi({ stickerUrlInput: '' });
    actions.setMode('IDLE');
    actions.updateLcd(WELCOME_MESSAGE);
  }, [stickerUrlInput, showTemporaryMessage, actions]);

  const handleShareKit = async () => {
    const url = KitService.generateShareableUrl(
      pads,
      shellColor,
      themeIsTransparent,
      themeStickerUrl
    );
    const success = await KitService.copyToClipboard(url);
    if (success) {
      showTemporaryMessage("LINK COPIED!", 1500, mode);
    } else {
      showTemporaryMessage("COPY FAILED!", 1500, mode);
    }
  };

  const handleStickerTransformChange = (rotation: number, scale: number) => {
    actions.updateCustomization({ stickerRotation: rotation, stickerScale: scale });
    localStorage.setItem('stickerTransform', JSON.stringify({ rotation, scale }));
  };

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch('/.netlify/functions/check-api-key');
        const data = await response.json();
        setIsApiKeyMissing(!data.hasApiKey);
      } catch (error) {
        console.error('Error checking API key:', error);
        setIsApiKeyMissing(true);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    parseKitFromUrl((pads, shellColor, isTransparent, stickerUrl) => {
      setPads(pads);
      const themeName = THEMES.find(theme => theme.shellColor === shellColor)?.name;
      if (themeName) {
        handleSetTheme(themeName);
      }
    });
  }, []);

  useEffect(() => {
    if (state.history.length > 0) {
      setPads(state.history[state.historyIndex]);
    }
  }, [state.historyIndex]);

  return {
    state,
    actions,
    pads,
    hotPads,
    isTicking,
    isLcdFlickering,
    currentShell,
    handlePowerOn,
    handlePadClick,
    handleMenuButtonClick,
    handleCycleTheme,
    handleStickerTrigger,
    handleStickerUrlSubmit,
    handleShareKit,
    handleStickerTransformChange,
    recordingState,
    handleRecord,
    handlePlay,
    handleStop,
    recordedSequence,
    savedKits,
    handleSaveKit,
    handleLoadKit,
    handleDeleteKit,
    toggleToyMode: actions.toggleToyMode,
    toggleWellLovedMode: actions.toggleWellLovedMode,
    undo: actions.undo,
    redo: actions.redo,
    morphValue,
    handleMorphChange,
    editingSound,
    handleToggleEditingSound,
  };
};
