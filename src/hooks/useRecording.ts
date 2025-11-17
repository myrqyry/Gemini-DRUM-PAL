import { useState, useRef, useCallback } from 'react';
import { RecordedNote, RecordingSequence, validateRecordedNote } from '../types/recording';

/**
 * @typedef {'RECORDING' | 'PLAYING' | 'STOPPED'} RecordingState
 * @description Represents the state of the recording functionality.
 */
type RecordingState = 'RECORDING' | 'PLAYING' | 'STOPPED';

/**
 * @function useRecording
 * @description A custom hook to manage recording and playback of pad sequences.
 * This hook provides functionalities to start and stop recording, play back the recorded sequence, and export it.
 *
 * @param {(padId: string) => boolean} triggerPad - A callback function to trigger a pad's sound.
 * @param {number} bpm - The beats per minute, used to calculate playback speed.
 * @returns {{
 *   recordingState: RecordingState,
 *   handleRecord: () => void,
 *   handlePlay: () => void,
 *   handleStop: () => void,
 *   recordNote: (padId: string, velocity?: number) => void,
 *   recordedSequence: RecordedNote[],
 *   exportSequence: () => RecordingSequence | null
 * }} An object containing the recording state and functions to control recording and playback.
 */
export const useRecording = (triggerPad: (padId: string) => boolean, bpm: number) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('STOPPED');
  const [recordedSequence, setRecordedSequence] = useState<RecordedNote[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const handleRecord = () => {
    if (recordingState === 'STOPPED') {
      setRecordingState('RECORDING');
      setRecordedSequence([]);
      setStartTime(Date.now());
    } else if (recordingState === 'RECORDING') {
      setRecordingState('STOPPED');
      setStartTime(null);
    }
  };

  const handlePlay = () => {
    if (recordingState === 'STOPPED' && recordedSequence.length > 0) {
      setRecordingState('PLAYING');
      const playbackSpeed = 120 / bpm;
      recordedSequence.forEach(note => {
        const timeout = setTimeout(() => {
          triggerPad(note.padId);
        }, note.timestamp * playbackSpeed);
        playbackTimeoutRef.current.push(timeout);
      });

      const totalDuration = recordedSequence[recordedSequence.length - 1].timestamp * playbackSpeed;
      const stopTimeout = setTimeout(() => {
        setRecordingState('STOPPED');
      }, totalDuration + 500);
      playbackTimeoutRef.current.push(stopTimeout);
    }
  };

  const handleStop = () => {
    playbackTimeoutRef.current.forEach(clearTimeout);
    playbackTimeoutRef.current = [];
    setRecordingState('STOPPED');
  };

  const recordNote = useCallback((padId: string, velocity: number = 1) => {
    if (recordingState !== 'RECORDING' || !startTime) return;

    const timestamp = Date.now() - startTime;
    const note: RecordedNote = { padId, timestamp, velocity };

    if (!validateRecordedNote(note)) {
      console.error('Invalid note data:', note);
      return;
    }

    setRecordedSequence(prev => [...prev, note]);
  }, [recordingState, startTime]);

  const exportSequence = useCallback((): RecordingSequence | null => {
    if (recordedSequence.length === 0) return null;

    return {
      notes: recordedSequence,
      bpm,
      duration: recordedSequence[recordedSequence.length - 1]?.timestamp || 0,
      createdAt: new Date()
    };
  }, [recordedSequence, bpm]);

  return {
    recordingState,
    handleRecord,
    handlePlay,
    handleStop,
    recordNote,
    recordedSequence,
    exportSequence
  };
};
