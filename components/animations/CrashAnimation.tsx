import React from 'react';

const CrashAnimation: React.FC = () => (
  <div className="relative w-20 h-20 flex items-center justify-center">
    {[0, 45, 90, 135].map(deg => (
      <div
        key={deg}
        className="absolute w-full h-1 crash-anim-line lcd-pixel"
        style={{ transform: `rotate(${deg}deg)` }}
      />
    ))}
  </div>
);

export default CrashAnimation;
