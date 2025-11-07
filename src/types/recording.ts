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
  return (
    typeof note === 'object' &&
    note !== null &&
    'padId' in note &&
    'timestamp' in note &&
    typeof (note as any).padId === 'string' &&
    typeof (note as any).timestamp === 'number' &&
    (note as any).timestamp >= 0
  );
};
