import React from 'react';
import { FONT_DATA } from './pixelFonts';

interface PixelTextProps {
  text: string;
  pixelSize?: number;
  className?: string;
}

const PixelText: React.FC<PixelTextProps> = ({ text, pixelSize = 3, className = '' }) => {
  const characters = text.toUpperCase().split('');

  return (
    <div className={`flex items-center justify-center gap-x-2 ${className}`}>
      {characters.map((char, charIndex) => {
        const fontGrid = FONT_DATA[char];
        if (!fontGrid || char === ' ') {
          // Render a space (width of a char)
          return <div key={charIndex} style={{ width: `${(5 * pixelSize) + 4}px` }} />; // 5 pixels + 4 1px gaps
        }

        return (
          <div
            key={charIndex}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(5, ${pixelSize}px)`,
              gap: `1px`,
            }}
          >
            {fontGrid.flat().map((pixel, pixelIndex) => (
              <div
                key={pixelIndex}
                className={pixel ? 'lcd-pixel' : ''}
                style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default PixelText;
