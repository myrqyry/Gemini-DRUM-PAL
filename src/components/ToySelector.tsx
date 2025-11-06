import React from 'react';
import { ToyPlugin } from '../core/types/toyTypes';

interface ToySelectorProps {
  availableToys: ToyPlugin[];
  selectedToyId: string;
  onToyChange: (toyId: string) => void;
}

export const ToySelector: React.FC<ToySelectorProps> = ({
  availableToys,
  selectedToyId,
  onToyChange,
}) => {
  return (
    <div className="toy-selector flex gap-2 mb-4">
      {availableToys.map(toy => (
        <button
          key={toy.config.id}
          onClick={() => onToyChange(toy.config.id)}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            selectedToyId === toy.config.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {toy.config.name}
        </button>
      ))}
    </div>
  );
};
