import React from 'react';

const ClapAnimation: React.FC = () => (
  <div className="relative w-24 h-12 overflow-hidden flex items-center justify-center">
    {/* Left Hand */}
    <div className="absolute w-8 h-10 clap-anim-left">
      <div className="absolute w-8 h-2 top-0 lcd-pixel rounded-t-sm"></div>
      <div className="absolute w-2 h-10 top-0 left-0 lcd-pixel"></div>
      <div className="absolute w-2 h-8 top-2 left-6 lcd-pixel"></div>
    </div>
    {/* Right Hand */}
    <div className="absolute w-8 h-10 clap-anim-right">
      <div className="absolute w-8 h-2 top-0 lcd-pixel rounded-t-sm"></div>
      <div className="absolute w-2 h-10 top-0 right-0 lcd-pixel"></div>
      <div className="absolute w-2 h-8 top-2 right-6 lcd-pixel"></div>
    </div>
  </div>
);

export default ClapAnimation;
