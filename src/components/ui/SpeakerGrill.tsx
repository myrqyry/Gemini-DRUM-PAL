import React from 'react';

interface SpeakerGrillProps {
    isPoweredOn: boolean;
    isTransparent: boolean;
}

const SpeakerGrill: React.FC<SpeakerGrillProps> = ({ isPoweredOn, isTransparent }) => {
    const holeClasses = `w-2 h-2 rounded-full ${isTransparent ? 'bg-black/50' : 'bg-black/20'}`;
    const containerClasses = `grid grid-cols-6 gap-1 p-2 rounded-lg transition-opacity duration-300 ${isPoweredOn ? 'opacity-100' : 'opacity-50'}`;
    
    return (
        <div className={containerClasses}>
            {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className={holeClasses} />
            ))}
        </div>
    );
};

export default SpeakerGrill;