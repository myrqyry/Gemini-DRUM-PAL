import React from 'react';

import { ToyState } from '../../hooks/useToyState';

/**
 * @interface DrumMachineControlsProps
 * @description Defines the props for the DrumMachineControls component.
 */
interface DrumMachineControlsProps {
  /** The current power state of the toy. */
  power: ToyState['power'];
  /** The current operating mode of the toy. */
  mode: ToyState['mode'];
  /** The current state of the recording feature. */
  recordingState: string;
  /** Callback function for the menu button click. */
  handleMenuButtonClick: () => void;
  /** Callback function for the share kit button click. */
  handleShareKit: () => void;
  /** Callback function to set the visibility of the kits modal. */
  setIsKitsModalOpen: (isOpen: boolean) => void;
  /** Callback function to handle recording. */
  handleRecord: () => void;
  /** Callback function to handle playback. */
  handlePlay: () => void;
  /** Callback function to stop playback. */
  handleStop: () => void;
  /** The sequence of recorded notes. */
  recordedSequence: any[];
  /** Callback function to undo the last action. */
  undo: () => void;
  /** Callback function to redo the last undone action. */
  redo: () => void;
  /** Callback function to toggle the toy mode. */
  toggleToyMode: () => void;
}

/**
 * A React functional component that renders the main controls for the drum machine.
 * This includes buttons for menu, share, kits, record, play, stop, undo, redo and toy mode.
 *
 * @param {DrumMachineControlsProps} props - The props for the component.
 * @returns {React.FC} A component that renders the drum machine controls.
 */
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
  toggleToyMode
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
        <button onClick={toggleToyMode} disabled={!isPoweredOn} className={buttonClasses}>TOY</button>
        <button onClick={handleRecord} disabled={!isPoweredOn || recordingState === 'PLAYING'} className={`w-1/3 text-white rounded-md ${recordingState === 'RECORDING' ? 'bg-red-700 animate-pulse' : 'bg-red-500'}`}>●</button>
        <button onClick={handlePlay} disabled={!isPoweredOn || recordedSequence.length === 0 || recordingState === 'PLAYING' || recordingState === 'RECORDING'} className={`w-1/3 text-white rounded-md ${recordingState === 'PLAYING' ? 'bg-green-700' : 'bg-green-500'}`}>▶</button>
        <button onClick={handleStop} disabled={!isPoweredOn || recordingState !== 'PLAYING'} className="w-1/3 bg-gray-500 text-white rounded-md">■</button>
      </div>
    </div>
  );
});

export default DrumMachineControls;
