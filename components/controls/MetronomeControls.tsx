import React from 'react';
import Metronome from '../Metronome';

interface MetronomeControlsProps {
  isPoweredOn: boolean;
  isMetronomeOn: boolean;
  bpm: number;
  isTicking: boolean;
  setIsMetronomeOn: (isOn: boolean) => void;
  setBpm: (bpm: number) => void;
}

const MetronomeControls: React.FC<MetronomeControlsProps> = React.memo(({
  isPoweredOn,
  isMetronomeOn,
  bpm,
  isTicking,
  setIsMetronomeOn,
  setBpm,
}) => {
  return (
    <div className="flex flex-col items-center space-y-1 w-1/3">
      <Metronome isTicking={isTicking} bpm={bpm} />
      <button onClick={() => setIsMetronomeOn(!isMetronomeOn)} disabled={!isPoweredOn} className={`w-full text-white rounded-md ${isMetronomeOn ? 'bg-blue-700' : 'bg-blue-500'}`}>METRONOME</button>
      <div className="flex items-center space-x-2">
        <input type="range" min="60" max="180" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} disabled={!isPoweredOn} className="w-full"/>
        <span className="text-xs font-bold">{bpm}</span>
      </div>
    </div>
  );
});

export default MetronomeControls;
