import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PadConfig } from './types';
import { INITIAL_PADS, SHELL_COLORS, PAD_ANIMATION_MAP, PAD_LAYOUT_ORDER, WELCOME_MESSAGE, METRONOME_TICK_CONFIG, GEMINI_MODEL_NAME, GEMINI_MODEL_NAME_EXPERIMENTAL } from './constants';
import DrumPad from './components/DrumPad';
import LcdScreen from './components/LcdScreen';
import Metronome from './components/Metronome';
import KitsModal from './components/KitsModal';
import CircuitBoard from './components/CircuitBoard';
import PowerIcon from './components/icons/PowerIcon';
import SpeakerGrill from './components/SpeakerGrill';
import Sticker from './components/Sticker';
import { getSoundConfigFromPrompt } from './services/geminiService';
import { getAudioContextState } from './services/audioService';
import { useAudioManager } from './hooks/useAudioManager';
import { useKitManager } from './hooks/useKitManager';
import { useRecording } from './hooks/useRecording';

type AppState = 'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';

const KEY_TO_PAD_MAP: { [key: string]: string } = {
    'q': 'hihat_closed',
    'w': 'hihat_open',
    'e': 'cymbal_crash',
    'a': 'snare',
    's': 'tom1',
    'd': 'clap',
    'c': 'fx1',
    ' ': 'kick', // Space key
};

const getPadsFromHash = (): PadConfig[] => {
  if (typeof window !== 'undefined' && window.location.hash) {
    try {
      const hash = window.location.hash.substring(1);
      if (!/^[A-Za-z0-9+/=]+$/.test(hash)) {
          throw new Error("Invalid base64 string in hash");
      }
      const decoded = atob(hash);
      const parsed = JSON.parse(decoded) as { id: string; p: string }[];

      if (Array.isArray(parsed)) {
        const padsFromHash: Record<string, string> = parsed.reduce((acc, item) => {
          if (item.id && typeof item.p === 'string') {
            acc[item.id] = item.p;
          }
          return acc;
        }, {} as Record<string, string>);

        return INITIAL_PADS.map(pad => {
          const prompt = padsFromHash[pad.id];
          if (prompt) {
            return { ...pad, soundPrompt: prompt, toneJsConfig: undefined, isLoading: false, error: undefined };
          }
          return pad;
        });
      }
    } catch (error) {
      console.error("Failed to parse sound kit from URL hash:", error);
       if (window.history.pushState) {
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  }
  return INITIAL_PADS;
};

const App: React.FC = () => {
  const { pads, setPads, savedKits, handleSaveKit, handleLoadKit, handleDeleteKit } = useKitManager(getPadsFromHash());
  const { audioInitialized, initializeAudio, playSound } = useAudioManager();
  const [appState, setAppState] = useState<AppState>('OFF');
  const [lcdMessage, setLcdMessage] = useState('');
  const [selectedPadId, setSelectedPadId] = useState<string | null>(null);
  const [promptInputValue, setPromptInputValue] = useState('');
  
  const [shellColorIndex, setShellColorIndex] = useState(0);
  const [isTransparent, setIsTransparent] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  const [hotPads, setHotPads] = useState<Record<string, boolean>>({});
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [stickerClickCount, setStickerClickCount] = useState(0);
  const [stickerUrlInput, setStickerUrlInput] = useState('');

  const [bpm, setBpm] = useState(120);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [isTicking, setIsTicking] = useState(false);

  const [isKitsModalOpen, setIsKitsModalOpen] = useState(false);

  const [stickerRotation, setStickerRotation] = useState(0);
  const [stickerScale, setStickerScale] = useState(1);

  const [soundModel, setSoundModel] = useState('DEFAULT');

  const currentShell = useMemo(() => SHELL_COLORS[shellColorIndex], [shellColorIndex]);

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

    playSound(pad.toneJsConfig, soundTimeoutsRef);
    setPads(prev => prev.map(p => p.id === padId ? { ...p, error: undefined } : p));
    const animationType = PAD_ANIMATION_MAP[pad.id];
    if (animationType) {
        setActiveAnimation(animationType);
        setTimeout(() => setActiveAnimation(null), 700);
    }
    return true; // Indicate success
}, [pads, setPads]);

  const { recordingState, handleRecord, handlePlay, handleStop, recordNote, recordedSequence } = useRecording(triggerPad, bpm);

  useEffect(() => {
    const storedStickerTransform = localStorage.getItem('stickerTransform');
    if (storedStickerTransform) {
      const { rotation, scale } = JSON.parse(storedStickerTransform);
      setStickerRotation(rotation);
      setStickerScale(scale);
    }
  }, []);

  
  const showTemporaryMessage = useCallback((message: string, duration: number = 2000, nextState: AppState = 'IDLE') => {
    setLcdMessage(message);
    setAppState('GENERATING'); // Use a generic state to show the message
    setTimeout(() => {
        setAppState(nextState);
        setLcdMessage(nextState === 'IDLE' ? WELCOME_MESSAGE : 'Click pad to edit');
    }, duration);
  }, []);

  const handlePowerOn = async () => {
    if (appState !== 'OFF') return;
    const success = await initializeAudio();
    if (success) {
      setAppState('BOOTING');
    } else {
      setAppState('ERROR');
      setLcdMessage("AUDIO FAILED\nTO INITIALIZE");
    }
  };
  
  useEffect(() => {
    if (appState === 'BOOTING') {
      const timer = setTimeout(() => {
        setAppState('IDLE');
        setLcdMessage(WELCOME_MESSAGE);
      }, 2500); // Duration of the boot animation
      return () => clearTimeout(timer);
    }
  }, [appState]);

  useEffect(() => {
    if (isMetronomeOn && appState !== 'OFF') {
      const interval = setInterval(() => {
        playSound(METRONOME_TICK_CONFIG);
        setIsTicking(true);
        setTimeout(() => setIsTicking(false), 100);
      }, (60 / bpm) * 1000);
      return () => clearInterval(interval);
    }
  }, [isMetronomeOn, bpm, appState, playSound]);

  const handleGenerateSound = useCallback(async (padId: string, prompt: string, isPreconfig: boolean = false) => {
    if (!isPreconfig) {
        setAppState('GENERATING');
        setLcdMessage(`GENERATING\n${pads.find(p=>p.id === padId)?.name || ''} SOUND...`);
    }
    setPads(prev => prev.map(p => p.id === padId ? { ...p, isLoading: true, error: undefined } : p));
    
    try {
      const model = soundModel === 'EXPERIMENTAL' ? GEMINI_MODEL_NAME_EXPERIMENTAL : GEMINI_MODEL_NAME;
      const newConfig = await getSoundConfigFromPrompt(prompt, model);
      if (newConfig) {
        setPads(prev => prev.map(p => p.id === padId ? { ...p, soundPrompt: prompt, toneJsConfig: newConfig, isLoading: false } : p));
        if (!isPreconfig) showTemporaryMessage("SUCCESS!", 1500, 'IDLE');
      } else {
        throw new Error("Invalid config received");
      }
    } catch (error) {
      console.error("Error generating sound:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setPads(prev => prev.map(p => p.id === padId ? { ...p, isLoading: false, error: errorMessage } : p));
      if (!isPreconfig) {
          showTemporaryMessage(`ERROR: CONFIG\nFAILED`, 2000, 'IDLE');
      }
    } finally {
        if (!isPreconfig) setSelectedPadId(null);
    }
  }, [isApiKeyMissing, pads, showTemporaryMessage, setPads, soundModel]);

  useEffect(() => {
    if (appState !== 'IDLE') return;
    const audioState = getAudioContextState();
    if (audioState !== 'running') return;

    const unconfiguredPads = pads.filter(p => !p.toneJsConfig && !p.isLoading && p.soundPrompt);
    if (unconfiguredPads.length > 0) {
      unconfiguredPads.forEach(padToPreconfigure => {
        handleGenerateSound(padToPreconfigure.id, padToPreconfigure.soundPrompt, true);
      });
    }
  }, [appState, isApiKeyMissing, pads, handleGenerateSound]);

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
              return;
          }

          const key = event.key === ' ' ? ' ' : event.key.toLowerCase();
          const padId = KEY_TO_PAD_MAP[key];

          if (padId && ['IDLE', 'ERROR', 'EDITING_PAD', 'MENU'].includes(appState)) {
              event.preventDefault(); // Prevent space from scrolling etc.
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
  }, [appState, triggerPad]);


  const handlePadClick = async (padId: string) => {
    if (activeAnimation || appState === 'BOOTING' || appState === 'OFF' || appState === 'GENERATING') return;
    
    const pad = pads.find(p => p.id === padId);
    if (!pad) return;

    if (appState === 'MENU') {
      setSelectedPadId(pad.id);
      setPromptInputValue(pad.soundPrompt);
      setAppState('EDITING_PAD');
    } else if (appState === 'EDITING_PAD') {
      if (padId === selectedPadId) {
        handleGenerateSound(padId, promptInputValue);
      } else {
        triggerPad(padId);
      }
    } else if (appState === 'IDLE' || appState === 'ERROR') {
      const success = triggerPad(padId);
      if (!success && !pad.isLoading) {
        setLcdMessage(`${pad.name} NOT READY!`);
        setTimeout(() => setLcdMessage(WELCOME_MESSAGE), 1500);
      }
    }
  };

  const handleMenuButtonClick = () => {
    if (appState === 'IDLE' || appState === 'ERROR' || appState === 'STICKER_PROMPT') {
      setAppState('MENU');
    } else if (appState === 'MENU' || appState === 'EDITING_PAD') {
      setAppState('IDLE');
      setLcdMessage(WELCOME_MESSAGE);
      setSelectedPadId(null);
    }
  };
  
  const handleCycleColor = () => setShellColorIndex((prev) => (prev + 1) % SHELL_COLORS.length);
  const handleToggleStyle = () => setIsTransparent(prev => !prev);
  
  const handleStickerTrigger = () => {
    if (appState === 'OFF' || appState === 'BOOTING' || appState === 'GENERATING') return;
    const newCount = stickerClickCount + 1;
    setStickerClickCount(newCount);
    if (newCount >= 5) {
      setAppState('STICKER_PROMPT');
      setStickerClickCount(0); // Reset count
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['https:', 'http:'].includes(parsed.protocol) &&
             /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(parsed.pathname);
    } catch {
      return false;
    }
  };

  const handleStickerUrlSubmit = () => {
    const trimmedUrl = stickerUrlInput.trim();
    if (trimmedUrl && validateUrl(trimmedUrl)) {
      setStickerUrl(trimmedUrl);
    } else {
      showTemporaryMessage("INVALID URL", 1500, 'IDLE');
    }
    setStickerUrlInput('');
    setAppState('IDLE');
    setLcdMessage(WELCOME_MESSAGE);
  };

  const handleShareKit = () => {
    const kitData = pads.map(p => ({ id: p.id, p: p.soundPrompt }));
    const json = JSON.stringify(kitData);
    const base64 = btoa(json);
    const url = `${window.location.origin}${window.location.pathname}#${base64}`;

    navigator.clipboard.writeText(url).then(() => {
      showTemporaryMessage("LINK COPIED!", 1500, appState);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      showTemporaryMessage("COPY FAILED!", 1500, appState);
    });
  };

  const handleStickerTransformChange = (rotation: number, scale: number) => {
    setStickerRotation(rotation);
    setStickerScale(scale);
    localStorage.setItem('stickerTransform', JSON.stringify({ rotation, scale }));
  };

  const isPoweredOn = appState !== 'OFF';
  const isMenuMode = appState === 'MENU' || appState === 'EDITING_PAD';
  
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
                appState={appState}
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

        <div className="grid grid-cols-3 w-full max-w-xs sm:max-w-sm place-items-center gap-x-2 gap-y-1">
            {PAD_LAYOUT_ORDER.map((padId, index) => {
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
        
        <div className="w-full flex justify-between items-end pt-4 border-t-2 border-black/10">
            <div className="flex flex-col space-y-2 w-1/3">
                <div className="flex space-x-1">
                    <button onClick={handleMenuButtonClick} disabled={!isPoweredOn || appState === 'GENERATING'} className={`${getMenuButtonClasses} w-1/3`}>MENU</button>
                    <button onClick={handleShareKit} disabled={!isPoweredOn || appState === 'GENERATING'} className={`${getMenuButtonClasses} w-1/3`}>SHARE</button>
                    <button onClick={() => setIsKitsModalOpen(true)} disabled={!isPoweredOn || appState === 'GENERATING'} className={`${getMenuButtonClasses} w-1/3`}>KITS</button>
                </div>
                <div className="flex space-x-1">
                  <button onClick={handleRecord} disabled={!isPoweredOn || recordingState === 'PLAYING'} className={`w-1/3 text-white rounded-md ${recordingState === 'RECORDING' ? 'bg-red-700 animate-pulse' : 'bg-red-500'}`}>●</button>
                  <button onClick={handlePlay} disabled={!isPoweredOn || recordedSequence.length === 0 || recordingState === 'PLAYING' || recordingState === 'RECORDING'} className={`w-1/3 text-white rounded-md ${recordingState === 'PLAYING' ? 'bg-green-700' : 'bg-green-500'}`}>▶</button>
                  <button onClick={handleStop} disabled={!isPoweredOn || recordingState !== 'PLAYING'} className="w-1/3 bg-gray-500 text-white rounded-md">■</button>
                </div>
            </div>
            
            <div className="flex flex-col items-center space-y-1 w-1/3">
                <Metronome isTicking={isTicking} bpm={bpm} />
                <button onClick={() => setIsMetronomeOn(!isMetronomeOn)} disabled={!isPoweredOn} className={`w-full text-white rounded-md ${isMetronomeOn ? 'bg-blue-700' : 'bg-blue-500'}`}>METRONOME</button>
                <div className="flex items-center space-x-2">
                    <input type="range" min="60" max="180" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} disabled={!isPoweredOn} className="w-full"/>
                    <span className="text-xs font-bold">{bpm}</span>
                </div>
            </div>

            <SpeakerGrill isPoweredOn={isPoweredOn} isTransparent={isTransparent} />
        </div>
    </div>
  );
};

export default App;
