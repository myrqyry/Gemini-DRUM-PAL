import React from 'react';

/**
 * @interface SpeakerGrillProps
 * @description Defines the props for the SpeakerGrill component.
 * @property {boolean} isPoweredOn - Indicates whether the device is powered on, which affects the component's opacity.
 * @property {boolean} isTransparent - Indicates whether the transparent theme is active, which affects the color of the grill holes.
 */
interface SpeakerGrillProps {
    isPoweredOn: boolean;
    isTransparent: boolean;
}

/**
 * A React functional component that renders a decorative speaker grill.
 * The appearance of the grill changes based on the power state and theme.
 *
 * @param {SpeakerGrillProps} props - The props for the component.
 * @returns {React.FC} A component that renders the speaker grill.
 */
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