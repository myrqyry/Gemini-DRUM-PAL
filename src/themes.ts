
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
    shellColor: '#6d28d9', // violet-700
    shellName: 'VIOLET',
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
    shellName: 'FUCHSIA',
    isTransparent: false,
    stickerSet: 'KAWAII',
  },
  {
    name: 'Grape',
    shellColor: '#6d28d9', // violet-700
    shellName: 'VIOLET',
    isTransparent: true,
  },
  {
    name: 'Neon Blue',
    shellColor: '#3b82f6', // blue-500
    shellName: 'BLUE',
    isTransparent: true,
  },
  {
    name: 'Neon Pink',
    shellColor: '#f472b6', // pink-400
    shellName: 'PINK',
    isTransparent: true,
  },
];
