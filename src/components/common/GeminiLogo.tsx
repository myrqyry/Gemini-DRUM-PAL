import React from 'react';

// A 7x7 pixel-grid representation of the Gemini logo
const LOGO_GRID = [
  [0, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [0, 1, 1, 1, 1, 1, 0],
];

const GeminiLogo = () => {
  return (
    <div className="grid grid-cols-7 gap-[2px]">
      {LOGO_GRID.flat().map((pixel, index) => (
        <div
          key={index}
          className={`w-[5px] h-[5px] ${pixel ? 'lcd-pixel' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
};

export default GeminiLogo;
