import React from 'react';
import GeminiLogo from './GeminiLogo';
import PixelText from './PixelText';

const WelcomeScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <GeminiLogo />
            <div className="flex flex-col items-center space-y-2 mt-2">
                <PixelText text="GEMINI" pixelSize={4} />
                <PixelText text="DRUM-PAL" pixelSize={3} />
            </div>
        </div>
    );
};

export default WelcomeScreen;
