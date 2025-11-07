
import { PadConfig, ToneJsSoundConfig } from '.';

export interface ToyConfig {
  shellColors: {
    name: string;
    solidClass: string;
    transparentRgba: string;
    textColor: string;
    textInsetClass: string;
  }[];
  animationMap: { [key: string]: string };
  initialPads: PadConfig[];
}

export interface SoundEngine {
  initializeAudio: () => Promise<boolean>;
  playSound: (
    soundConfig: ToneJsSoundConfig,
    timeoutsRef?: React.MutableRefObject<Set<NodeJS.Timeout>>
  ) => void;
  getAudioContextState: () => AudioContextState | null;
}
