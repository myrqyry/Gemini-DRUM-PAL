import React from 'react';
import { PadConfig } from '../types';

interface DrumPadProps {
  padConfig: PadConfig;
  onClick: (id: string) => void;
  isSelected: boolean;
  disabled: boolean;
  isTransparent: boolean;
  textColor: string;
  textInsetClass: string;
}

const DrumPad: React.FC<DrumPadProps> = ({ padConfig, onClick, isSelected, disabled, isTransparent, textColor, textInsetClass }) => {
  const { id, name, color, isLoading, error } = padConfig;

  // Made button smaller to fit within a more compact layout
  const baseClasses = "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-150 transform active:scale-90 shadow-lg border-4 border-black/20 disabled:opacity-60 disabled:cursor-not-allowed";
  const selectedClasses = isSelected ? 'ring-4 ring-offset-2 ring-offset-gray-700 ring-yellow-300' : '';
  const loadingClasses = isLoading ? 'animate-pulse' : '';
  const errorClasses = error ? 'ring-4 ring-red-500' : '';
  
  const labelClasses = `text-xs font-bold uppercase transition-all duration-300 ${isTransparent ? textColor : textInsetClass} ${disabled ? 'opacity-60' : ''}`;

  return (
    // Reduced wrapper height and centered content to prevent vertical overflow
    <div className="flex flex-col items-center h-20 justify-center">
      <button
        onClick={() => onClick(id)}
        aria-label={`Drum pad ${name}`}
        disabled={disabled}
        className={`${baseClasses} ${color} ${selectedClasses} ${loadingClasses} ${errorClasses}`}
      >
        {/* The button is the visual pad */}
      </button>
      <span className={labelClasses}>{name}</span>
    </div>
  );
};

export default DrumPad;