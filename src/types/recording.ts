export interface RecordedNote {
  padId: string;
  timestamp: number;
  velocity?: number;
}

export interface RecordingSequence {
  notes: RecordedNote[];
  bpm: number;
  duration: number;
  createdAt: Date;
}

export const validateRecordedNote = (note: unknown): note is RecordedNote => {
  const noteAsRecord = note as Record<string, unknown>;
  return (
    typeof note === 'object' &&
    note !== null &&
    'padId' in note &&
    'timestamp' in note &&
    typeof noteAsRecord.padId === 'string' &&
    typeof noteAsRecord.timestamp === 'number' &&
    noteAsRecord.timestamp >= 0
  );
};
