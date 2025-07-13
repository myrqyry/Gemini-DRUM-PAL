import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';
import * as Animations from './animations';
import WelcomeScreen from './WelcomeScreen';
import BootAnimation from './BootAnimation';
import { WELCOME_MESSAGE } from '../constants';

type AppState = 'OFF' | 'BOOTING' | 'IDLE' | 'MENU' | 'EDITING_PAD' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';

interface LcdScreenProps {
  appState: AppState;
  message: string;
  promptValue: string;
  onPromptChange: (value: string) => void;
  activeAnimation: string | null;
  selectedPadName: string;
  onCycleColor: () => void;
  onToggleStyle: () => void;
  currentColorName: string;
  isTransparent: boolean;
  stickerUrlInput: string;
  onStickerUrlChange: (value: string) => void;
  onStickerUrlSubmit: () => void;
}

const LcdScreen: React.FC<LcdScreenProps> = (props) => {
  const { 
    appState, message, promptValue, onPromptChange, activeAnimation, 
    selectedPadName, onCycleColor, onToggleStyle, currentColorName, isTransparent,
    stickerUrlInput, onStickerUrlChange, onStickerUrlSubmit
  } = props;
  const AnimationComponent = activeAnimation ? Animations[activeAnimation as keyof typeof Animations] : null;

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
                    <button onClick={onCycleColor} className="text-left hover:bg-green-900/10 rounded px-1">
                        COLOR: {currentColorName}
                    </button>
                    <button onClick={onToggleStyle} className="text-right hover:bg-green-900/10 rounded px-1">
                        STYLE: {isTransparent ? 'CLEAR' : 'SOLID'}
                    </button>
                </div>
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