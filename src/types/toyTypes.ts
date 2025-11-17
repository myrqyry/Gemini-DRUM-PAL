
import { PadConfig, ToneJsSoundConfig } from '.';

/**
 * @interface ToyConfig
 * @description Defines the overall configuration for the toy, including aesthetics and initial content.
 */
export interface ToyConfig {
  /** An array of available shell color configurations. */
  shellColors: {
    name: string;
    solidClass: string;
    transparentRgba: string;
    textColor: string;
    textInsetClass: string;
  }[];
  /** A mapping of pad IDs to animation component names. */
  animationMap: { [key: string]: string };
  /** The initial configuration of the drum pads. */
  initialPads: PadConfig[];
}

/**
 * @interface SoundEngine
 * @description Defines the interface for the sound engine, which is responsible for all audio operations.
 */
export interface SoundEngine {
  /** Initializes the audio context. Must be called after a user gesture. */
  initializeAudio: () => Promise<boolean>;
  /** Plays a sound based on the provided configuration. */
  playSound: (
    soundConfig: ToneJsSoundConfig,
    timeoutsRef?: React.MutableRefObject<Set<NodeJS.Timeout>>
  ) => void;
  /** Gets the current state of the audio context. */
  getAudioContextState: () => AudioContextState | null;
}
