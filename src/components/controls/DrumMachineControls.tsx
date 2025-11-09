import React from 'react';

import { ToyState } from '../../hooks/useToyState';

interface DrumMachineControlsProps {
  power: ToyState['power'];
  mode: ToyState['mode'];
  recordingState: string;
  handleMenuButtonClick: () => void;
  handleShareKit: () => void;
  setIsKitsModalOpen: (isOpen: boolean) => void;
  handleRecord: () => void;
  handlePlay: () => void;
  handleStop: () => void;
  recordedSequence: any[];
  undo: () => void;
  redo: () => void;
}

const DrumMachineControls: React.FC<DrumMachineControlsProps> = React.memo(({
  power,
  mode,
  handleMenuButtonClick,
  handleShareKit,
  setIsKitsModalOpen,
  handleRecord,
  recordingState,
  handlePlay,
  recordedSequence,
  handleStop,
  undo,
  redo,
}) => {
  const isPoweredOn = power !== 'OFF';
  const buttonClasses = "flex-1";
  return (
    <div className="flex flex-col space-y-2 w-1/3">
      <div className="flex space-x-1">
        <button onClick={handleMenuButtonClick} disabled={!isPoweredOn || mode === 'GENERATING'} className={buttonClasses}>MENU</button>
        <button onClick={undo} disabled={!isPoweredOn || mode === 'GENERATING'} className={buttonClasses}>UNDO</button>
        <button onClick={redo} disabled={!isPoweredOn || mode === 'GENERATING'} className={buttonClasses}>REDO</button>
        <button onClick={handleShareKit} disabled={!isPoweredOn || mode === 'GENERATING'} className={buttonClasses}>SHARE</button>
        <button onClick={() => setIsKitsModalOpen(true)} disabled={!isPoweredOn || mode === 'GENERATING'} className={buttonClasses}>KITS</button>
      </div>
      <div className="flex space-x-1">
        <button onClick={handleRecord} disabled={!isPoweredOn || recordingState === 'PLAYING'} className={`w-1/3 text-white rounded-md ${recordingState === 'RECORDING' ? 'bg-red-700 animate-pulse' : 'bg-red-500'}`}>●</button>
        <button onClick={handlePlay} disabled={!isPoweredOn || recordedSequence.length === 0 || recordingState === 'PLAYING' || recordingState === 'RECORDING'} className={`w-1/3 text-white rounded-md ${recordingState === 'PLAYING' ? 'bg-green-700' : 'bg-green-500'}`}>▶</button>
        <button onClick={handleStop} disabled={!isPoweredOn || recordingState !== 'PLAYING'} className="w-1/3 bg-gray-500 text-white rounded-md">■</button>
      </div>
    </div>
  );
});

export default DrumMachineControls;
