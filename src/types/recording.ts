/**
 * @interface RecordedNote
 * @description Represents a single recorded note, including which pad was triggered and when.
 * @property {string} padId - The ID of the pad that was triggered.
 * @property {number} timestamp - The time offset from the start of the recording, in milliseconds.
 * @property {number} [velocity] - The velocity of the note (0-1), defaults to 1.
 */
export interface RecordedNote {
  padId: string;
  timestamp: number;
  velocity?: number;
}

/**
 * @interface RecordingSequence
 * @description Represents a complete recording, containing a sequence of notes and metadata.
 * @property {RecordedNote[]} notes - An array of the recorded notes.
 * @property {number} bpm - The beats per minute at which the sequence was recorded.
  /** The total duration of the recording in milliseconds. */
  duration: number;
  /** The date and time when the recording was created. */
  createdAt: Date;
}

/**
 * Validates that an unknown object conforms to the RecordedNote interface.
 * This is a type guard function.
 *
 * @param {unknown} note - The object to validate.
 * @returns {note is RecordedNote} True if the object is a valid RecordedNote, false otherwise.
 */
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
