import { useState, useRef } from 'react';
import { PadConfig } from '../types';

type RecordingState = 'RECORDING' | 'PLAYING' | 'STOPPED';

export const useRecording = (triggerPad: (padId: string) => boolean, bpm: number) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('STOPPED');
  const [recordedSequence, setRecordedSequence] = useState<any[]>([]);
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
        }, note.time * playbackSpeed);
        playbackTimeoutRef.current.push(timeout);
      });

      const totalDuration = recordedSequence[recordedSequence.length - 1].time * playbackSpeed;
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

  const recordNote = (padId: string) => {
    if (recordingState === 'RECORDING' && startTime) {
      const time = Date.now() - startTime;
      setRecordedSequence(prev => [...prev, { padId, time }]);
    }
  };

  return { recordingState, handleRecord, handlePlay, handleStop, recordNote, recordedSequence };
};
