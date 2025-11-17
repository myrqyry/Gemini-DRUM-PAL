import React from 'react';
import Metronome from '@/components/common/Metronome';

/**
 * @interface MetronomeControlsProps
 * @description Defines the props for the MetronomeControls component.
 * @property {boolean} isPoweredOn - Indicates if the main device is powered on.
 * @property {boolean} isMetronomeOn - Indicates if the metronome is currently active.
 * @property {number} bpm - The current beats per minute setting of the metronome.
 * @property {boolean} isTicking - Indicates if the metronome is currently producing a tick sound.
 * @property {(isOn: boolean) => void} setIsMetronomeOn - Callback to toggle the metronome on or off.
 * @property {(bpm: number) => void} setBpm - Callback to set the metronome's beats per minute.
 */
interface MetronomeControlsProps {
  isPoweredOn: boolean;
  isMetronomeOn: boolean;
  bpm: number;
  isTicking: boolean;
  setIsMetronomeOn: (isOn: boolean) => void;
  setBpm: (bpm: number) => void;
}

/**
 * A React functional component that provides controls for the metronome.
 * It includes a toggle button, a BPM slider, and a visual indicator for the metronome's tick.
 *
 * @param {MetronomeControlsProps} props - The props for the component.
 * @returns {React.FC} A component that renders the metronome controls.
 */
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
