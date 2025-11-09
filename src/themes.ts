
import { PRESET_STICKERS } from './constants';

export interface Theme {
  name: string;
  shellColor: string;
  shellName: string;
  isTransparent: boolean;
  stickerSet?: keyof typeof PRESET_STICKERS;
}

export const THEMES: Theme[] = [
  {
    name: 'Default',
    shellColor: '#4B5563', // gray-600
    shellName: 'SLATE',
    isTransparent: false,
  },
  {
    name: 'Translucent Purple',
    shellColor: '#a855f7', // purple-500
    shellName: 'FUCHSIA',
    isTransparent: true,
    stickerSet: 'TECH',
  },
  {
    name: 'Atomic Green',
    shellColor: '#84cc16', // lime-500
    shellName: 'GREEN',
    isTransparent: true,
    stickerSet: 'BIO',
  },
  {
    name: 'Hot Pink',
    shellColor: '#ec4899', // pink-500
    shellName: 'RED',
    isTransparent: false,
    stickerSet: 'KAWAII',
  },
];
