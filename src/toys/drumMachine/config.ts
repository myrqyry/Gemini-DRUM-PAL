import { ToyConfig } from '../../core/types/toyTypes';
import { INITIAL_PADS, SHELL_COLORS, PAD_LAYOUT_ORDER, PAD_ANIMATION_MAP } from '../../../constants';

export const drumMachineConfig: ToyConfig = {
  id: 'drum-machine',
  name: 'DRUM-PAL',
  type: 'DRUM_MACHINE',
  pads: INITIAL_PADS,
  shellColors: SHELL_COLORS,
  layoutOrder: PAD_LAYOUT_ORDER,
  animationMap: PAD_ANIMATION_MAP,
  defaultSettings: {
    bpm: 120,
  },
};
