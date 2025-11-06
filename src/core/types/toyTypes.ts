import { PadConfig, ShellColor } from '../../types';

export interface ToyConfig {
  id: string;
  name: string;
  type: 'DRUM_MACHINE' | 'SYNTHESIZER' | 'SAMPLER';
  pads: PadConfig[];
  shellColors: ShellColor[];
  layoutOrder: (string | null)[];
  animationMap: Record<string, string>;
  defaultSettings: Record<string, unknown>;
}

export interface SoundEngine {
    playSound: (config: any, options?: any) => void;
    // Add other sound engine methods as needed
}

export interface ToyProps {
    config: ToyConfig;
    soundEngine: SoundEngine;
}

export interface ToyPlugin {
  config: ToyConfig;
  component: React.ComponentType<ToyProps>;
  soundEngine: SoundEngine;
}
