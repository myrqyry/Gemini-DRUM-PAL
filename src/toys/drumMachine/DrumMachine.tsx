import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PadConfig } from '../../../types';
import { INITIAL_PADS, SHELL_COLORS, PAD_ANIMATION_MAP, PAD_LAYOUT_ORDER, WELCOME_MESSAGE, METRONOME_TICK_CONFIG, GEMINI_MODEL_NAME, GEMINI_MODEL_NAME_EXPERIMENTAL } from '../../../constants';
import DrumPad from './DrumPad';
import LcdScreen from '../../shared/LcdScreen';
import Metronome from '../../../components/Metronome';
import DrumMachineControls from './controls/DrumMachineControls';
import MetronomeControls from './controls/MetronomeControls';
import KitsModal from '../../../components/KitsModal';
import CircuitBoard from '../../shared/CircuitBoard';
import PowerIcon from '../../../components/icons/PowerIcon';
import SpeakerGrill from '../../shared/SpeakerGrill';
import Sticker from '../../../components/Sticker';
import { getSoundConfigFromPrompt } from '../../../services/geminiService';
import { getAudioContextState } from '../../../services/audioService';
import { useAudioManager } from '../../../core/hooks/useAudioManager';
import { useKitManager } from '../../../core/hooks/useKitManager';
import { useRecording } from '../../../core/hooks/useRecording';
import { SecurityUtils } from '../../../utils/security';
import { getPadIdFromKey } from '../../../utils/keyboardMapping';
import { parseKitFromUrl } from '../../../utils/urlHelpers';
import { KitService } from '../../../services/kitService';
import { AppError, createErrorHandler } from '../../../utils/errorHandling';
import SoundGenerationErrorBoundary from '../../../components/error/SoundGenerationErrorBoundary';
import { useToyState } from '../../../core/hooks/useToyState';
import { ToyProps } from '../../../core/types/toyTypes';

const DrumMachine: React.FC<ToyProps> = ({ config, soundEngine }) => {
  const { state, actions } = useToyState();
  const { power, mode, ui, audio, customization } = state;
  const { lcdMessage, selectedPadId, activeAnimation } = ui;
  const { bpm, isMetronomeOn } = audio;
  const { shellColorIndex, isTransparent, stickerUrl } = customization;

  const { pads, setPads, savedKits, handleSaveKit, handleLoadKit, handleDeleteKit } = useKitManager(parseKitFromUrl() || INITIAL_PADS);
  const { initializeAudio } = useAudioManager();
  const [promptInputValue, setPromptInputValue] = useState('');

  const [hotPads, setHotPads] = useState<Record<string, boolean>>({});
  const [stickerClickCount, setStickerClickCount] = useState(0);
  const [stickerUrlInput, setStickerUrlInput] = useState('');

  const [isTicking, setIsTicking] = useState(false);

  const [isKitsModalOpen, setIsKitsModalOpen] = useState(false);

  const [stickerRotation, setStickerRotation] = useState(0);
  const [stickerScale, setStickerScale] = useState(1);

  const [soundModel, setSoundModel] = useState('DEFAULT');

  const currentShell = useMemo(() => config.shellColors[shellColorIndex], [shellColorIndex, config.shellColors]);

  const soundTimeoutsRef = React.useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      soundTimeoutsRef.current.forEach(clearTimeout);
      soundTimeoutsRef.current.clear();
    };
  }, []);

  const triggerPad = useCallback((padId: string): boolean => {
    const pad = pads.find(p => p.id === padId);
    if (!pad || !pad.toneJsConfig) {
        return false; // Indicate failure
    }

    recordNote(padId);

    soundEngine.playSound(pad.toneJsConfig, soundTimeoutsRef);
    setPads(prev => prev.map(p => p.id === padId ? { ...p, error: undefined } : p));
    const animationType = config.animationMap[pad.id];
    if (animationType) {
        actions.triggerAnimation(animationType);
        setTimeout(() => actions.triggerAnimation(null), 700);
    }
    return true; // Indicate success
}, [pads, setPads, actions, soundEngine]);

  const { recordingState, handleRecord, handlePlay, handleStop, recordNote, recordedSequence } = useRecording(triggerPad, bpm);

  useEffect(() => {
    const storedStickerTransform = localStorage.getItem('stickerTransform');
    if (storedStickerTransform) {
      const { rotation, scale } = JSON.parse(storedStickerTransform);
      setStickerRotation(rotation);
      setStickerScale(scale);
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
    if (power !== 'OFF') return;
    const success = await initializeAudio();
    if (success) {
      actions.powerOn();
    } else {
      actions.setError("AUDIO FAILED\nTO INITIALIZE");
    }
  };

  useEffect(() => {
    if (power === 'BOOTING') {
      const timer = setTimeout(() => {
        actions.setMode('IDLE');
        actions.updateLcd(WELCOME_MESSAGE);
      }, 2500); // Duration of the boot animation
      return () => clearTimeout(timer);
    }
  }, [power, actions]);

  useEffect(() => {
    if (isMetronomeOn && power !== 'OFF') {
      const interval = setInterval(() => {
        soundEngine.playSound(METRONOME_TICK_CONFIG);
        setIsTicking(true);
        setTimeout(() => setIsTicking(false), 100);
      }, (60 / bpm) * 1000);
      return () => clearInterval(interval);
    }
  }, [isMetronomeOn, bpm, power, soundEngine]);

  const handleGenerateSound = useCallback(async (padId: string, prompt: string, isPreconfig: boolean = false) => {
    const handleError = createErrorHandler('sound generation');

    try {
      if (!prompt.trim()) {
        throw new AppError('Sound prompt cannot be empty', 'VALIDATION_ERROR');
      }

      setPads(prev => prev.map(p =>
        p.id === padId ? { ...p, isLoading: true, error: undefined } : p
      ));

      const model = soundModel === 'EXPERIMENTAL' ? GEMINI_MODEL_NAME_EXPERIMENTAL : GEMINI_MODEL_NAME;
      const newConfig = await getSoundConfigFromPrompt(prompt, model);

      if (!newConfig) {
        throw new AppError('Failed to generate sound configuration', 'CONFIG_GENERATION_ERROR');
      }

      setPads(prev => prev.map(p =>
        p.id === padId ? {
          ...p,
          soundPrompt: prompt,
          toneJsConfig: newConfig,
          isLoading: false,
          error: undefined
        } : p
      ));

      if (!isPreconfig) {
        showTemporaryMessage("SUCCESS!", 1500, 'IDLE');
      }

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
  }, [pads, showTemporaryMessage, setPads, soundModel]);

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
    if (activeAnimation || power === 'BOOTING' || power === 'OFF' || mode === 'GENERATING') return;

    const pad = pads.find(p => p.id === padId);
    if (!pad) return;

    if (mode === 'MENU') {
      actions.selectPad(pad.id);
      setPromptInputValue(pad.soundPrompt);
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

  const handleCycleColor = () => actions.updateCustomization({ shellColorIndex: (shellColorIndex + 1) % SHELL_COLORS.length });
  const handleToggleStyle = () => actions.updateCustomization({ isTransparent: !isTransparent });

  const handleStickerTrigger = () => {
    if (power === 'OFF' || power === 'BOOTING' || mode === 'GENERATING') return;
    const newCount = stickerClickCount + 1;
    setStickerClickCount(newCount);
    if (newCount >= 5) {
      actions.setMode('STICKER_PROMPT');
      setStickerClickCount(0); // Reset count
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

    setStickerUrlInput('');
    actions.setMode('IDLE');
    actions.updateLcd(WELCOME_MESSAGE);
  }, [stickerUrlInput, showTemporaryMessage, actions]);

  const handleShareKit = async () => {
    const url = KitService.generateShareableUrl(pads);
    const success = await KitService.copyToClipboard(url);
    if (success) {
      showTemporaryMessage("LINK COPIED!", 1500, mode);
    } else {
      showTemporaryMessage("COPY FAILED!", 1500, mode);
    }
  };

  const handleStickerTransformChange = (rotation: number, scale: number) => {
    setStickerRotation(rotation);
    setStickerScale(scale);
    localStorage.setItem('stickerTransform', JSON.stringify({ rotation, scale }));
  };

  const isPoweredOn = power !== 'OFF';
  const isMenuMode = mode === 'MENU' || mode === 'EDITING';

  const keychainClasses = `keychain-body relative w-[340px] h-[560px] sm:w-[360px] sm:h-[600px] rounded-[40px] p-4 sm:p-6 shadow-2xl transition-all duration-300 border-4 border-black/30 flex flex-col items-center justify-between ${isTransparent ? 'transparent-mode' : currentShell.solidClass}`;
  const keychainStyle = isTransparent ? { backgroundColor: currentShell.transparentRgba } : {};
  const textInsetClass = currentShell.isLight ? 'text-inset-dark' : 'text-inset-light';

  const getMenuButtonClasses = useMemo(() => {
    const base = 'w-full text-center px-3 py-1 text-sm font-bold rounded-lg shadow-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed';

    if (isTransparent) {
        const { textColor, borderColor, bgColor } = currentShell;
        return `${base} ${textColor} ${borderColor} ${bgColor} border-opacity-50 bg-opacity-70`;
    }

    const solidBase = `${base} border-black/20`;
    return `${solidBase} ${isMenuMode ? `bg-yellow-300 text-black ${textInsetClass}` : `bg-gray-600 text-white ${textInsetClass}`}`;
  }, [isTransparent, currentShell, isMenuMode, textInsetClass]);

  return (
    <div className={keychainClasses} style={keychainStyle}>
        {isTransparent && <CircuitBoard />}
        {stickerUrl && <Sticker imageUrl={stickerUrl} rotation={stickerRotation} scale={stickerScale} />}

        <KitsModal
            isOpen={isKitsModalOpen}
            onClose={() => setIsKitsModalOpen(false)}
            savedKits={savedKits}
            onSave={handleSaveKit}
            onLoad={handleLoadKit}
            onDelete={handleDeleteKit}
        />

        <div className="absolute top-5 left-6 flex items-center space-x-2">
            <button onClick={handlePowerOn} disabled={isPoweredOn} className="text-gray-900/70 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Power on">
                <PowerIcon className="w-5 h-5"/>
            </button>
            <div className={`w-3 h-3 rounded-full border-2 border-black/30 ${isPoweredOn ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}></div>
        </div>
        <div onClick={handleStickerTrigger} className="absolute top-5 right-10 text-black/50 font-bold text-xs transform -rotate-12 cursor-pointer select-none transition-transform active:scale-90">MODEL-G</div>

        <div className="w-full flex flex-col items-center mt-10">
            <LcdScreen
                appState={mode}
                message={lcdMessage}
                promptValue={promptInputValue}
                onPromptChange={setPromptInputValue}
                activeAnimation={activeAnimation}
                selectedPadName={pads.find(p => p.id === selectedPadId)?.name || ''}
                onCycleColor={handleCycleColor}
                onToggleStyle={handleToggleStyle}
                currentColorName={currentShell.name}
                isTransparent={isTransparent}
                stickerUrlInput={stickerUrlInput}
                onStickerUrlChange={setStickerUrlInput}
                onStickerUrlSubmit={handleStickerUrlSubmit}
                stickerRotation={stickerRotation}
                stickerScale={stickerScale}
                onStickerTransformChange={handleStickerTransformChange}
                soundModel={soundModel}
                onSoundModelChange={setSoundModel}
            />
        </div>

        <SoundGenerationErrorBoundary onError={(error) => showTemporaryMessage(`ERROR: ${error.message}`, 2000, 'IDLE')}>
          <div className="grid grid-cols-3 w-full max-w-xs sm:max-w-sm place-items-center gap-x-2 gap-y-1">
              {config.layoutOrder.map((padId, index) => {
                if (!padId) return <div key={`empty-${index}`} className="w-16 h-16 sm:w-20 sm:h-20" />;
                const pad = pads.find(p => p.id === padId);
                if (!pad) return null;

                return (
                    <DrumPad
                        key={pad.id}
                        padConfig={pad}
                        onClick={handlePadClick}
                        isSelected={selectedPadId === pad.id}
                        disabled={!isPoweredOn}
                        isTransparent={isTransparent}
                        textColor={currentShell.textColor}
                        textInsetClass={textInsetClass}
                        isKeyPressed={!!hotPads[pad.id]}
                    />
                );
              })}
          </div>
        </SoundGenerationErrorBoundary>

        <div className="w-full flex justify-between items-end pt-4 border-t-2 border-black/10">
          <DrumMachineControls
            isPoweredOn={isPoweredOn}
            isMenuMode={isMenuMode}
            appState={mode}
            recordingState={recordingState}
            getMenuButtonClasses={getMenuButtonClasses}
            handleMenuButtonClick={handleMenuButtonClick}
            handleShareKit={handleShareKit}
            setIsKitsModalOpen={setIsKitsModalOpen}
            handleRecord={handleRecord}
            handlePlay={handlePlay}
            handleStop={handleStop}
            recordedSequence={recordedSequence}
          />
          <MetronomeControls
            isPoweredOn={isPoweredOn}
            isMetronomeOn={isMetronomeOn}
            bpm={bpm}
            isTicking={isTicking}
            setIsMetronomeOn={(value) => actions.updateAudioSettings({ isMetronomeOn: value })}
            setBpm={(value) => actions.updateAudioSettings({ bpm: value })}
          />

            <SpeakerGrill isPoweredOn={isPoweredOn} isTransparent={isTransparent} />
        </div>
    </div>
  );
};

export default DrumMachine;
