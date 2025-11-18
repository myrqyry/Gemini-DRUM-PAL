import React from 'react';

interface MetronomeProps {
  isTicking: boolean;
  bpm: number;
}

const Metronome: React.FC<MetronomeProps> = ({ isTicking, bpm }) => {
  // The animation duration is inversely proportional to the BPM.
  const animationDuration = 60 / bpm;

  return (
    <div className="metronome-container">
      <div
        className={`metronome-light ${isTicking ? 'ticking' : ''}`}
        style={{ animationDuration: `${animationDuration}s` }}
      />
      <style>{`
        .metronome-light {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ff0000;
          opacity: 0.2;
        }
        .metronome-light.ticking {
          animation-name: tick;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        @keyframes tick {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default Metronome;
