
import React from 'react';

export const Kick = () => (
  <div className="w-12 h-12 bg-green-900 rounded-full kick-anim" />
);

export const Snare = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-1 h-8 bg-green-900 snare-anim-pixel" style={{ animationDelay: '0s' }} />
    <div className="w-1 h-8 bg-green-900 snare-anim-pixel" style={{ animationDelay: '0.05s' }} />
    <div className="w-1 h-8 bg-green-900 snare-anim-pixel" style={{ animationDelay: '0.1s' }} />
  </div>
);

export const HihatClosed = () => (
  <div className="w-10 h-1 bg-green-900 hihat-closed-anim" />
);

export const HihatOpen = () => (
  <div className="w-10 h-1 bg-green-900 hihat-open-anim" />
);

export const Tom = () => (
    <div className="w-8 h-8 border-4 border-green-900 rounded-full tom-anim" />
);

export const Clap = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-8 bg-green-900 rounded-sm clap-anim-left" />
        <div className="w-4 h-8 bg-green-900 rounded-sm clap-anim-right" />
    </div>
);

export const Crash = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-1 h-12 bg-green-900 transform rotate-45 crash-anim-line" />
        <div className="w-1 h-12 bg-green-900 transform -rotate-45 crash-anim-line" style={{animationDelay: '0.1s'}}/>
    </div>
);

export const Fx = () => (
    <div className="w-full h-2 bg-green-900 fx-anim" />
);
