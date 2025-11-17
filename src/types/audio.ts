
/**
 * @typedef {'MembraneSynth' | 'NoiseSynth' | 'MetalSynth' | 'FMSynth' | 'AMSynth' | 'Synth' | 'PluckSynth'} ToneInstrumentType
 * @description Represents the types of Tone.js instruments that can be used.
 */
export type ToneInstrumentType =
  | 'MembraneSynth'
  | 'NoiseSynth'
  | 'MetalSynth'
  | 'FMSynth'
  | 'AMSynth'
  | 'Synth'
  | 'PluckSynth';

/**
 * @typedef {'Distortion' | 'Reverb' | 'Chorus' | 'Phaser' | 'PingPongDelay' | 'FeedbackDelay' | 'BitCrusher' | 'AutoFilter' | 'FrequencyShifter'} ToneEffectType
 * @description Represents the types of Tone.js effects that can be applied.
 */
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

/**
 * @typedef {Record<string, any>} ToneJsOptions
 * @description Represents a generic options object for Tone.js instruments or effects.
 */
export type ToneJsOptions = Record<string, any>;

/**
 * @interface ToneJsEffectConfig
 * @description Defines the structure for a Tone.js effect configuration.
 * @property {ToneEffectType} type - The type of the effect.
 * @property {ToneJsOptions} options - The options for the effect.
 */
export interface ToneJsEffectConfig {
  type: ToneEffectType;
  options: ToneJsOptions;
}

/**
 * @interface ToneJsSoundConfig
 * @description Defines the complete configuration for a single sound, including the instrument, its options, and any effects.
 * @property {ToneInstrumentType} instrument - The type of the instrument.
 * @property {ToneJsOptions} options - The options for the instrument.
 * @property {ToneJsEffectConfig[]} [effects] - An optional array of effects to apply.
 * @property {string | number} [duration] - The duration of the sound.
 * @property {string} [note] - The musical note to play.
 */
export interface ToneJsSoundConfig {
  instrument: ToneInstrumentType;
  options: ToneJsOptions;
  effects?: ToneJsEffectConfig[];
  duration?: string | number;
  note?: string;
}

/**
 * @interface PadConfig
 * @description Defines the configuration for a single drum pad.
 * @property {string} id - The unique identifier for the pad.
 * @property {string} name - The display name of the pad.
 * @property {string} color - The CSS class for the pad's color.
 * @property {string} soundPrompt - The prompt used to generate the sound for the pad.
 * @property {ToneJsSoundConfig} [toneJsConfig] - The primary Tone.js sound configuration for the pad.
 * @property {ToneJsSoundConfig} [toneJsConfigB] - The secondary Tone.js sound configuration for morphing.
 * @property {number} morphValue - The current morph value between the primary and secondary sounds.
 * @property {boolean} isLoading - A flag indicating if the sound is currently being loaded.
 * @property {string} [error] - An optional error message if sound generation failed.
 */
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

/**
 * @interface WebGroundingChunk
 * @description Represents a chunk of web grounding information.
 */
export interface WebGroundingChunk {
  uri: string;
  title: string;
}
/**
 * @interface GroundingChunk
 * @description Represents a chunk of grounding information.
 */
export interface GroundingChunk {
  web?: WebGroundingChunk;
}
/**
 * @interface GroundingMetadata
 * @description Represents metadata for grounding information.
 */
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}
/**
 * @interface Candidate
 * @description Represents a candidate for content generation.
 */
export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}
/**
 * @interface GenerateContentResponseParts
 * @description Represents parts of a content generation response.
 */
export interface GenerateContentResponseParts {
  candidates?: Candidate[];
}
