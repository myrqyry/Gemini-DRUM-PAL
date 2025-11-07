import React from 'react';

interface KeyboardShortcutsOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const KEYBOARD_MAP = [
  { key: 'Q', pad: 'KICK' },
  { key: 'W', pad: 'SNARE' },
  { key: 'E', pad: 'C-HAT' },
  { key: 'A', pad: 'O-HAT' },
  { key: 'S', pad: 'TOM' },
  { key: 'D', pad: 'CLAP' },
  { key: 'Z', pad: 'CRASH' },
  { key: 'X', pad: 'FX' },
];

export const KeyboardShortcutsOverlay: React.FC<KeyboardShortcutsOverlayProps> = ({
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 rounded-[40px]"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white p-6 rounded-lg max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-2 gap-3">
          {KEYBOARD_MAP.map(({ key, pad }) => (
            <div
              key={key}
              className="flex items-center justify-between bg-gray-800 p-3 rounded"
            >
              <span className="font-mono font-bold text-lg bg-gray-700 px-3 py-1 rounded">
                {key}
              </span>
              <span className="text-sm ml-3">{pad}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          Press any key to close
        </p>
      </div>
    </div>
  );
};
