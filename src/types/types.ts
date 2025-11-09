
export type ToneInstrumentType =
  | 'MembraneSynth'
  | 'NoiseSynth'
  | 'MetalSynth'
  | 'FMSynth'
  | 'AMSynth'
  | 'Synth'
  | 'PluckSynth';

export type ToneEffectType =
  | 'Distortion'
  | 'Reverb'
  | 'Chorus'
  | 'Phaser'
  | 'PingPongDelay'
  | 'FeedbackDelay'
  | 'BitCrusher'
  | 'AutoFilter'
  | 'FrequencyShifter';

export interface ToneJsEffectConfig {
  type: ToneEffectType;
  options: Record<string, unknown>;
}

export interface ToneJsSoundConfig {
  instrument: ToneInstrumentType;
  options: Record<string, unknown>;
  effects?: ToneJsEffectConfig[];
  duration?: string | number;
  note?: string;
}

export interface PadConfig {
  id: string;
  name: string;
  color: string;
  soundPrompt: string;
  toneJsConfig?: ToneJsSoundConfig;
  toneJsConfigB?: ToneJsSoundConfig;
  morphValue: number;
  isLoading: boolean;
  error?: string;
}

export interface WebGroundingChunk {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web?: WebGroundingChunk;
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}
export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}
export interface GenerateContentResponseParts {
  candidates?: Candidate[];
}
