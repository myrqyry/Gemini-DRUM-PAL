
import React from 'react';

/**
 * @component Kick
 * @description A React functional component that renders a kick drum animation.
 * The animation consists of a single circle that expands and fades out.
 * @returns {React.FC} A component that renders the kick animation.
 */
export const Kick = () => (
  <div className="w-12 h-12 bg-green-900 rounded-full kick-anim" />
);

/**
 * @component Snare
 * @description A React functional component that renders a snare drum animation.
 * The animation consists of three vertical bars that quickly appear and disappear.
 * @returns {React.FC} A component that renders the snare animation.
 */
export const Snare = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-1 h-8 bg-green-900 snare-anim-pixel" style={{ animationDelay: '0s' }} />
    <div className="w-1 h-8 bg-green-900 snare-anim-pixel" style={{ animationDelay: '0.05s' }} />
    <div className="w-1 h-8 bg-green-900 snare-anim-pixel" style={{ animationDelay: '0.1s' }} />
  </div>
);

/**
 * @component HihatClosed
 * @description A React functional component that renders a closed hi-hat animation.
 * The animation is a horizontal line that quickly shrinks and disappears.
 * @returns {React.FC} A component that renders the closed hi-hat animation.
 */
export const HihatClosed = () => (
  <div className="w-10 h-1 bg-green-900 hihat-closed-anim" />
);

/**
 * @component HihatOpen
 * @description A React functional component that renders an open hi-hat animation.
 * The animation is a horizontal line that expands and fades.
 * @returns {React.FC} A component that renders the open hi-hat animation.
 */
export const HihatOpen = () => (
  <div className="w-10 h-1 bg-green-900 hihat-open-anim" />
);

/**
 * @component Tom
 * @description A React functional component that renders a tom drum animation.
 * The animation is a circle that implodes.
 * @returns {React.FC} A component that renders the tom animation.
 */
export const Tom = () => (
    <div className="w-8 h-8 border-4 border-green-900 rounded-full tom-anim" />
);

/**
 * @component Clap
 * @description A React functional component that renders a clap animation.
 * The animation consists of two rectangles that move towards each other.
 * @returns {React.FC} A component that renders the clap animation.
 */
export const Clap = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-8 bg-green-900 rounded-sm clap-anim-left" />
        <div className="w-4 h-8 bg-green-900 rounded-sm clap-anim-right" />
    </div>
);

/**
 * @component Crash
 * @description A React functional component that renders a crash cymbal animation.
 * The animation is composed of two intersecting lines that expand outwards.
 * @returns {React.FC} A component that renders the crash animation.
 */
export const Crash = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-1 h-12 bg-green-900 transform rotate-45 crash-anim-line" />
        <div className="w-1 h-12 bg-green-900 transform -rotate-45 crash-anim-line" style={{animationDelay: '0.1s'}}/>
    </div>
);

/**
 * @component Fx
 * @description A React functional component that renders a special effect (FX) animation.
 * The animation is a horizontal bar that wipes across the screen.
 * @returns {React.FC} A component that renders the FX animation.
 */
export const Fx = () => (
    <div className="w-full h-2 bg-green-900 fx-anim" />
);
