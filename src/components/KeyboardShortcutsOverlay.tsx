import React from 'react';

/**
 * @interface KeyboardShortcutsOverlayProps
 * @description Defines the props for the KeyboardShortcutsOverlay component.
 * @property {boolean} isVisible - Determines whether the overlay is visible.
 * @property {() => void} onClose - Function to call when the overlay should be closed.
 */
interface KeyboardShortcutsOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

/**
 * @const {Array<Object>} KEYBOARD_MAP
 * @description An array of objects that maps keyboard keys to their corresponding drum pad names.
 * This is used to display the keyboard shortcuts in the overlay.
 * @property {string} key - The keyboard key.
 * @property {string} pad - The name of the drum pad.
 */
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

/**
 * A React functional component that displays an overlay with keyboard shortcuts.
 *
 * @param {KeyboardShortcutsOverlayProps} props - The props for the component.
 * @returns {React.FC} A component that renders the keyboard shortcuts overlay.
 */
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
