
import { PRESET_STICKERS } from './constants';

export interface Theme {
  name: string;
  shellColor: string;
  isTransparent: boolean;
  stickerSet?: keyof typeof PRESET_STICKERS;
}

export const THEMES: Theme[] = [
  {
    name: 'Default',
    shellColor: '#4B5563', // gray-600
    isTransparent: false,
  },
  {
    name: 'Translucent Purple',
    shellColor: '#a855f7', // purple-500
    isTransparent: true,
    stickerSet: 'TECH',
  },
  {
    name: 'Atomic Green',
    shellColor: '#84cc16', // lime-500
    isTransparent: true,
    stickerSet: 'BIO',
  },
  {
    name: 'Hot Pink',
    shellColor: '#ec4899', // pink-500
    isTransparent: false,
    stickerSet: 'KAWAII',
  },
];
