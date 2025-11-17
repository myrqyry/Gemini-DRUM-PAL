
import { PRESET_STICKERS } from './constants';

/**
 * @interface Theme
 * @description Defines the structure for a theme object, which includes properties for customizing the appearance of the application shell.
 * Each theme specifies a name, color, transparency, and an optional set of stickers.
 *
 * @property {string} name - The display name of the theme. This is shown to the user in the UI.
 * @property {string} shellColor - The CSS color value for the shell. This can be any valid CSS color string (e.g., hex, rgb).
 * @property {string} shellName - A descriptive name for the shell's color scheme, used internally and for display.
 * @property {boolean} isTransparent - A flag indicating whether the shell should have a transparent effect.
 * @property {keyof typeof PRESET_STICKERS} [stickerSet] - An optional key corresponding to a predefined set of stickers from `PRESET_STICKERS`.
 */
export interface Theme {
  name: string;
  shellColor: string;
  shellName: string;
  isTransparent: boolean;
  stickerSet?: keyof typeof PRESET_STICKERS;
}

/**
 * @const {Theme[]} THEMES
 * @description An array of predefined `Theme` objects that can be applied to the application.
 * This list provides various visual styles for the user to choose from, including different colors, transparency effects, and sticker sets.
 * Each object in the array conforms to the `Theme` interface.
 */
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
