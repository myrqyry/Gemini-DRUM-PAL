import React from 'react';
import { PadConfig } from '../types';
import Spinner from './Spinner';

interface DrumPadProps {
  padConfig: PadConfig;
  onClick: (padId: string) => void;
  isSelected?: boolean;
  disabled?: boolean;
  isTransparent?: boolean;
  textColor?: string;
  textInsetClass?: string;
  isKeyPressed?: boolean;
}

const DrumPad: React.FC<DrumPadProps> = ({
  padConfig,
  onClick,
  isSelected = false,
  disabled = false,
  isTransparent = false,
  textColor = 'text-white',
  textInsetClass = 'text-inset-light',
  isKeyPressed = false,
}) => {
  if (!padConfig || !onClick) {
    console.error('DrumPad: Missing required props');
    return null;
  }

  const { id, name, color, isLoading, error } = padConfig;

  const baseClasses = "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-150 transform active:scale-90 shadow-lg border-4 border-black/20 disabled:opacity-60 disabled:cursor-not-allowed";
  const selectedClasses = isSelected ? 'ring-4 ring-offset-2 ring-offset-gray-700 ring-yellow-300' : '';
  const loadingClasses = isLoading ? 'bg-gray-500 animate-pulse' : color;
  const errorClasses = error ? 'ring-4 ring-red-500' : '';
  const keyPressedClass = isKeyPressed ? 'scale-90' : '';
  
  const labelClasses = `text-xs font-bold uppercase transition-all duration-300 ${isTransparent ? textColor : textInsetClass} ${disabled ? 'opacity-60' : ''}`;

  return (
    <div className="flex flex-col items-center h-20 justify-center">
      <button
        onClick={() => onClick(id)}
        aria-label={`Drum pad ${name}`}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${selectedClasses} ${loadingClasses} ${errorClasses} ${keyPressedClass}`}
      >
        {isLoading ? <Spinner size="sm" /> : null}
      </button>
      <span className={labelClasses}>{name}</span>
    </div>
  );
};

export default DrumPad;
