import React from 'react';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import * as Animations from './animations';
import WelcomeScreen from '@/components/common/WelcomeScreen';
import BootAnimation from '@/components/common/BootAnimation';
import { WELCOME_MESSAGE } from '@/constants';

type AppState = 'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';

interface LcdScreenProps {
  appState: AppState;
  message: string;
  promptValue: string;
  onPromptChange: (value: string) => void;
  activeAnimation: string | null;
  selectedPadName: string;
  onCycleTheme: () => void;
  onToggleStyle: () => void;
  currentColorName: string;
  isTransparent: boolean;
  stickerUrlInput: string;
  onStickerUrlChange: (value: string) => void;
  onStickerUrlSubmit: () => void;
  stickerRotation: number;
  stickerScale: number;
  onStickerTransformChange: (rotation: number, scale: number) => void;
  soundModel: string;
  onSoundModelChange: (model: string) => void;
  morphValue: number;
  onMorphChange: (value: number) => void;
  editingSound: 'A' | 'B';
  onToggleEditingSound: () => void;
}

const LcdScreen: React.FC<LcdScreenProps> = (props) => {
  const { 
    appState, message, promptValue, onPromptChange, activeAnimation, 
    selectedPadName, onCycleTheme, onToggleStyle, currentColorName, isTransparent,
    stickerUrlInput, onStickerUrlChange, onStickerUrlSubmit,
    stickerRotation, stickerScale, onStickerTransformChange,
    soundModel, onSoundModelChange,
    morphValue, onMorphChange,
    editingSound, onToggleEditingSound
  } = props;
  const AnimationComponent = activeAnimation ? (Animations[activeAnimation as keyof typeof Animations] || null) : null;

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
    <div className={`h-40 w-full rounded-md p-2 flex flex-col items-center justify-center font-mono text-xl relative overflow-hidden transition-colors duration-500 ${bgClasses}`}>
      <div className="absolute inset-0 lcd-screen-bg opacity-80"></div>
      <div className="relative z-10 text-center text-green-900 p-2 w-full h-full flex flex-col items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default LcdScreen;