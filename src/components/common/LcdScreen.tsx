import React from 'react';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import * as Animations from './animations';
import WelcomeScreen from '@/components/common/WelcomeScreen';
import BootAnimation from '@/components/common/BootAnimation';
import DeadPixelsOverlay from './DeadPixelsOverlay';
import { WELCOME_MESSAGE } from '@/constants';

/**
 * @typedef {'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT'} AppState
 * @description Represents the various states of the application, controlling what is displayed on the LCD screen.
 */
type AppState = 'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';

/**
 * @interface LcdScreenProps
 * @description Defines the props for the LcdScreen component.
 */
interface LcdScreenProps {
  /** A flag to enable a flickering animation on the screen. */
  isFlickering: boolean;
  /** The current state of the application. */
  appState: AppState;
  /** The message to be displayed on the screen. */
  message: string;
  /** The current value of the prompt input field. */
  promptValue: string;
  /** Callback function for when the prompt value changes. */
  onPromptChange: (value: string) => void;
  /** The name of the currently active animation. */
  activeAnimation: string | null;
  /** The name of the selected drum pad. */
  selectedPadName: string;
  /** Callback function to cycle through available themes. */
  onCycleTheme: () => void;
  /** Callback function to toggle the transparent style. */
  onToggleStyle: () => void;
  /** The name of the current color theme. */
  currentColorName: string;
  /** A flag indicating if the transparent style is enabled. */
  isTransparent: boolean;
  /** The current value of the sticker URL input field. */
  stickerUrlInput: string;
  /** Callback function for when the sticker URL input value changes. */
  onStickerUrlChange: (value: string) => void;
  /** Callback function to submit the sticker URL. */
  onStickerUrlSubmit: () => void;
  /** The rotation value of the sticker. */
  stickerRotation: number;
  /** The scale value of the sticker. */
  stickerScale: number;
  /** Callback function for when the sticker's transform changes. */
  onStickerTransformChange: (rotation: number, scale: number) => void;
  /** The current sound generation model. */
  soundModel: string;
  /** Callback function to change the sound generation model. */
  onSoundModelChange: (model: string) => void;
  /** The current morph value between two sounds. */
  morphValue: number;
  /** Callback function to change the morph value. */
  onMorphChange: (value: number) => void;
  /** The sound ('A' or 'B') currently being edited. */
  editingSound: 'A' | 'B';
  /** Callback function to toggle between editing sound 'A' and 'B'. */
  onToggleEditingSound: () => void;
  /** A flag indicating if the 'well-loved' (vintage) mode is enabled. */
  isWellLovedEnabled: boolean;
  /** Callback function to toggle the 'well-loved' mode. */
  onToggleWellLovedMode: () => void;
  /** The current battery level. */
  batteryLevel: number;
}

/**
 * A React functional component that simulates an LCD screen, displaying different content based on the application state.
 *
 * @param {LcdScreenProps} props - The props for the component.
 * @returns {React.FC} A component that renders the LCD screen.
 */
const LcdScreen: React.FC<LcdScreenProps> = (props) => {
  const { 
    appState, message, promptValue, onPromptChange, activeAnimation, 
    selectedPadName, onCycleTheme, onToggleStyle, currentColorName, isTransparent,
    stickerUrlInput, onStickerUrlChange, onStickerUrlSubmit,
    stickerRotation, stickerScale, onStickerTransformChange,
    soundModel, onSoundModelChange,
    morphValue, onMorphChange,
    editingSound, onToggleEditingSound,
    isWellLovedEnabled, onToggleWellLovedMode,
    batteryLevel
  } = props;
  const AnimationComponent = activeAnimation ? (Animations[activeAnimation as keyof typeof Animations] || null) : null;

  const flickerClass = props.isFlickering ? 'animate-flicker' : '';

  const renderContent = () => {
    if (appState === 'OFF') {
      return null; // Blank screen
    }
    if (appState === 'BOOTING') {
      return <BootAnimation />;
    }
    if (AnimationComponent) {
      return <AnimationComponent />;
    }
    if (appState === 'STICKER_PROMPT') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-between p-1">
                <p className="text-base">ENTER IMAGE URL:</p>
                <textarea
                  value={stickerUrlInput}
                  onChange={(e) => onStickerUrlChange(e.target.value)}
                  className="flex-grow w-full bg-transparent text-green-900 border-none focus:ring-0 resize-none text-center p-1 text-base my-1"
                  placeholder="http://..."
                  autoFocus
                />
                <div className="flex w-full space-x-2">
                    <input type="range" min="0" max="360" value={stickerRotation} onChange={(e) => onStickerTransformChange(Number(e.target.value), stickerScale)} className="w-1/2"/>
                    <input type="range" min="0.5" max="1.5" step="0.1" value={stickerScale} onChange={(e) => onStickerTransformChange(stickerRotation, Number(e.target.value))} className="w-1/2"/>
                </div>
                <button onClick={onStickerUrlSubmit} className="text-lg hover:bg-green-900/10 rounded px-2 py-1">
                    APPLY STICKER
                </button>
            </div>
        );
    }
    if (appState === 'MENU') {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full space-y-2 text-lg">
                <p>Click a pad to edit sound</p>
                <div className="w-full h-[1px] bg-green-900/20 my-1"></div>
                <div className="grid grid-cols-2 gap-x-4 w-full px-2 text-base">
                    <button onClick={onCycleTheme} className="text-left hover:bg-green-900/10 rounded px-1">
                        THEME: {currentColorName}
                    </button>
                    <button onClick={onToggleStyle} className="text-right hover:bg-green-900/10 rounded px-1">
                        STYLE: {isTransparent ? 'CLEAR' : 'SOLID'}
                    </button>
                </div>
                <button onClick={() => onSoundModelChange(soundModel === 'DEFAULT' ? 'EXPERIMENTAL' : 'DEFAULT')} className="text-center hover:bg-green-900/10 rounded px-1 w-full mt-2">
                    SOUND MODEL: {soundModel}
                </button>
                <button onClick={onToggleWellLovedMode} className="text-center hover:bg-green-900/10 rounded px-1 w-full mt-2">
                    VINTAGE MODE: {isWellLovedEnabled ? 'ON' : 'OFF'}
                </button>
            </div>
        )
    }
    if (appState === 'EDITING_PAD') {
      return (
        <div className="w-full h-full flex flex-col items-center">
            <div className="text-sm">EDIT: {selectedPadName}</div>
            <textarea
              value={promptValue}
              onChange={(e) => onPromptChange(e.target.value)}
              className="flex-grow w-full bg-transparent text-green-900 border-none focus:ring-0 resize-none text-center p-1 text-base"
              placeholder="Describe a sound..."
              aria-label="Sound prompt editor"
              autoFocus
            />
            <div className="text-sm -mt-1">Click pad again to generate</div>
            <div className="w-full flex items-center space-x-2">
              <span>A</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={morphValue}
                onChange={(e) => onMorphChange(Number(e.target.value))}
                className="w-full"
              />
              <span>B</span>
            </div>
            <button onClick={onToggleEditingSound} className="text-sm hover:bg-green-900/10 rounded px-1">
              EDITING SOUND: {editingSound}
            </button>
        </div>
      );
    }
    if (appState === 'IDLE' && message === WELCOME_MESSAGE) {
      return <WelcomeScreen />;
    }
    
    return (
      <div className="flex items-center justify-center space-x-2">
        {appState === 'GENERATING' && <SpinnerIcon className="w-6 h-6 text-green-900" />}
        <p className="whitespace-pre-wrap break-words">{message}</p>
      </div>
    );
  };
  
  const bgClasses = appState === 'OFF' ? 'bg-gray-900/80' : 'bg-gray-800';

  return (
    <div className={`h-40 w-full rounded-md p-2 flex flex-col items-center justify-center font-mono text-xl relative overflow-hidden transition-colors duration-500 ${bgClasses} ${flickerClass}`}>
      <div className="absolute top-2 right-2 text-xs">
        BATT: {Math.round(batteryLevel)}%
      </div>
      {isWellLovedEnabled && <DeadPixelsOverlay />}
      <div className="absolute inset-0 lcd-screen-bg opacity-80"></div>
      <div className="relative z-10 text-center text-green-900 p-2 w-full h-full flex flex-col items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default LcdScreen;