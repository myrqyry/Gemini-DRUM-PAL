import React from 'react';

const SnareAnimation: React.FC = () => (
  <div className="grid grid-cols-5 gap-1">
    {Array.from({ length: 25 }).map((_, i) => (
      <div
        key={i}
        className="w-2 h-2 lcd-pixel snare-anim-pixel"
        style={{ animationDelay: `${Math.random() * 0.1}s` }}
      />
    ))}
  </div>
);

export default SnareAnimation;
