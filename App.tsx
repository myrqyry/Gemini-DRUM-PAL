import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PadConfig } from './types';
import { INITIAL_PADS, SHELL_COLORS, PAD_ANIMATION_MAP, PAD_LAYOUT_ORDER, WELCOME_MESSAGE } from './constants';
import DrumPad from './components/DrumPad';
import LcdScreen from './components/LcdScreen';
import CircuitBoard from './components/CircuitBoard';
import PowerIcon from './components/icons/PowerIcon';
import SpeakerGrill from './components/SpeakerGrill';
import Sticker from './components/Sticker';
import { getSoundConfigFromPrompt } from './services/geminiService';
import { playSound, initializeAudio, getAudioContextState } from './services/audioService';

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

const App: React.FC = () => {
  const [pads, setPads] = useState<PadConfig[]>(INITIAL_PADS);
  const [appState, setAppState] = useState<AppState>('OFF');
  const [lcdMessage, setLcdMessage] = useState('');
  const [selectedPadId, setSelectedPadId] = useState<string | null>(null);
  const [promptInputValue, setPromptInputValue] = useState('');
  
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);

  const [shellColorIndex, setShellColorIndex] = useState(0);
  const [isTransparent, setIsTransparent] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  const [hotPads, setHotPads] = useState<Record<string, boolean>>({});
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [stickerClickCount, setStickerClickCount] = useState(0);
  const [stickerUrlInput, setStickerUrlInput] = useState('');


  const currentShell = useMemo(() => SHELL_COLORS[shellColorIndex], [shellColorIndex]);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setLcdMessage("ERROR: API KEY\nMISSING");
      setAppState('ERROR');
      setIsApiKeyMissing(true);
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

  const handleGenerateSound = useCallback(async (padId: string, prompt: string, isPreconfig: boolean = false) => {
    if (isApiKeyMissing) return;

    if (!isPreconfig) {
        setAppState('GENERATING');
        setLcdMessage(`GENERATING\n${pads.find(p=>p.id === padId)?.name || ''} SOUND...`);
    }
    setPads(prev => prev.map(p => p.id === padId ? { ...p, isLoading: true, error: undefined } : p));
    
    try {
      const newConfig = await getSoundConfigFromPrompt(prompt);
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
  }, [isApiKeyMissing, pads, showTemporaryMessage]);

  useEffect(() => {
    if (appState !== 'IDLE' || isApiKeyMissing) return;
    const audioState = getAudioContextState();
    if (audioState !== 'running') return;

    const unconfiguredPads = pads.filter(p => !p.toneJsConfig && !p.isLoading && p.soundPrompt);
    if (unconfiguredPads.length > 0) {
      unconfiguredPads.forEach(padToPreconfigure => {
        handleGenerateSound(padToPreconfigure.id, padToPreconfigure.soundPrompt, true);
      });
    }
  }, [appState, isApiKeyMissing, pads, handleGenerateSound]);
  
  const triggerPad = useCallback((padId: string): boolean => {
      const pad = pads.find(p => p.id === padId);
      if (!pad || !pad.toneJsConfig) {
          return false; // Indicate failure
      }

      playSound(pad.toneJsConfig);
      setPads(prev => prev.map(p => p.id === padId ? { ...p, error: undefined } : p));
      const animationType = PAD_ANIMATION_MAP[pad.id];
      if (animationType) {
          setActiveAnimation(animationType);
          setTimeout(() => setActiveAnimation(null), 700);
      }
      return true; // Indicate success
  }, [pads]);

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

  const handleStickerUrlSubmit = () => {
    if (stickerUrlInput.trim()) {
      setStickerUrl(stickerUrlInput.trim());
    }
    setStickerUrlInput('');
    setAppState('IDLE');
    setLcdMessage(WELCOME_MESSAGE);
  };

  const isPoweredOn = appState !== 'OFF';
  const isMenuMode = appState === 'MENU' || appState === 'EDITING_PAD';
  
  const keychainClasses = `keychain-body relative w-[340px] h-[560px] sm:w-[360px] sm:h-[600px] rounded-[40px] p-4 sm:p-6 shadow-2xl transition-all duration-300 border-4 border-black/30 flex flex-col items-center justify-between ${isTransparent ? 'transparent-mode' : currentShell.solidClass}`;
  const keychainStyle = isTransparent ? { backgroundColor: currentShell.transparentRgba } : {};
  const textInsetClass = currentShell.isLight ? 'text-inset-dark' : 'text-inset-light';

  const getMenuButtonClasses = () => {
    const base = 'w-full text-center px-3 py-1 text-sm font-bold rounded-lg shadow-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed';
    
    if (isTransparent) {
        const { textColor, borderColor, bgColor } = currentShell;
        return `${base} ${textColor} ${borderColor} ${bgColor} border-opacity-50 bg-opacity-70`;
    }

    const solidBase = `${base} border-black/20`;
    return `${solidBase} ${isMenuMode ? `bg-yellow-300 text-black ${textInsetClass}` : `bg-gray-600 text-white ${textInsetClass}`}`;
  };

  return (
    <div className={keychainClasses} style={keychainStyle}>
        {isTransparent && <CircuitBoard />}
        {stickerUrl && <Sticker imageUrl={stickerUrl} />}
        
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
            <div className="flex flex-col space-y-2 w-1/4">
                <button onClick={handleMenuButtonClick} disabled={!isPoweredOn || appState === 'GENERATING'} className={getMenuButtonClasses()}>MENU</button>
            </div>
            
            <SpeakerGrill isPoweredOn={isPoweredOn} isTransparent={isTransparent} />
        </div>
    </div>
  );
};

export default App;
