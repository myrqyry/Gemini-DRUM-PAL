
export interface ToneJsEffectConfig {
  type: string; // e.g., "Distortion", "Reverb"
  options: any; // Effect-specific options
}

export interface ToneJsSoundConfig {
  instrument: string; // e.g., "MembraneSynth", "NoiseSynth"
  options: any; // Instrument-specific options
  effects?: ToneJsEffectConfig[];
  duration?: string | number; // e.g., "8n" or 0.2 (seconds)
  note?: string; // e.g. "C4", mainly for pitched instruments
}

export interface PadConfig {
  id: string;
  name: string;
  color: string; // Tailwind background color class e.g., 'bg-blue-500'
  soundPrompt: string;
  toneJsConfig?: ToneJsSoundConfig;
  isLoading: boolean;
  error?: string;
}

// For Gemini API response parsing for grounding metadata
export interface WebGroundingChunk {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web?: WebGroundingChunk;
  // Other types of grounding chunks can be added here if needed
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields
}
export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Other candidate fields
}
export interface GenerateContentResponseParts {
  candidates?: Candidate[];
  // Other response fields
}
