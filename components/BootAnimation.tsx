import React from 'react';
import GeminiLogo from './GeminiLogo';
import PixelText from './PixelText';

const BootAnimation: React.FC = () => {
  return (
    // Added pt-2 to give it some headroom so the logo doesn't clip at the top
    <div className="flex flex-col items-center justify-center space-y-4 pt-2">
      <div className="boot-logo-anim">
        <GeminiLogo />
      </div>
      <div className="flex flex-col items-center space-y-2 mt-2 boot-text-anim">
        <PixelText text="GEMINI" pixelSize={4} />
        <PixelText text="DRUM-PAL" pixelSize={3} />
      </div>
    </div>
  );
};

export default BootAnimation;
