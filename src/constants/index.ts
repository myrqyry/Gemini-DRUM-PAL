import { PadConfig } from '../types';

/**
 * @const {PadConfig[]} INITIAL_PADS
 * @description The initial configuration for the drum pads.
 * Each pad is defined with an ID, name, color, sound prompt, and initial state.
 * This configuration is used to set up the drum machine when it first loads.
 */
export const INITIAL_PADS: PadConfig[] = [
  {
    id: 'kick',
    name: 'KICK',
    color: 'bg-red-500',
    soundPrompt: 'A deep, punchy kick drum sound. 808 style.',
    isLoading: false,
    morphValue: 0,
  },
  {
    id: 'snare',
    name: 'SNARE',
    color: 'bg-sky-400',
    soundPrompt: 'A crisp, snappy snare drum with a short burst of white noise.',
    isLoading: false,
    morphValue: 0,
  },
  {
    id: 'hihat_closed',
    name: 'C-HAT',
    color: 'bg-yellow-300',
    soundPrompt: 'A short, metallic, closed hi-hat sound. Very crisp and tight.',
    isLoading: false,
    morphValue: 0,
  },
  {
    id: 'hihat_open',
    name: 'O-HAT',
    color: 'bg-lime-400',
    soundPrompt: 'A shimmering, metallic open hi-hat sound with a medium decay.',
    isLoading: false,
    morphValue: 0,
  },
  {
    id: 'tom1',
    name: 'TOM',
    color: 'bg-orange-400',
    soundPrompt: 'A high-pitched tom drum sound with a quick attack.',
    isLoading: false,
    morphValue: 0,
  },
  {
    id: 'clap',
    name: 'CLAP',
    color: 'bg-fuchsia-500',
    soundPrompt: 'A classic 80s electronic clap sound, layered and punchy.',
    isLoading: false,
    morphValue: 0,
  },
  {
    id: 'cymbal_crash',
    name: 'CRASH',
    color: 'bg-teal-300',
    soundPrompt: 'A bright crash cymbal sound with a long decay, like a 909.',
    isLoading: false,
    morphValue: 0,
  },
  {
    id: 'fx1',
    name: 'FX',
    color: 'bg-indigo-500',
    soundPrompt: 'A glitchy, digital artifact sound, like a broken video game.',
    isLoading: false,
    morphValue: 0,
  },
];

/**
 * @const {object[]} SHELL_COLORS
 * @description An array of objects defining the available shell colors and their associated styles.
 * Each color object includes properties for solid and transparent backgrounds, text color, border color, and a flag for light or dark themes.
 */
export const SHELL_COLORS = [
    { name: 'YELLOW', solidClass: 'bg-yellow-400', transparentRgba: 'rgba(251, 191, 36, 0.4)', textColor: 'text-yellow-300', borderColor: 'border-yellow-300', bgColor: 'bg-yellow-400/20', isLight: true },
    { name: 'RED', solidClass: 'bg-red-500', transparentRgba: 'rgba(239, 68, 68, 0.4)', textColor: 'text-red-400', borderColor: 'border-red-400', bgColor: 'bg-red-500/20', isLight: false },
    { name: 'BLUE', solidClass: 'bg-blue-500', transparentRgba: 'rgba(59, 130, 246, 0.4)', textColor: 'text-blue-400', borderColor: 'border-blue-400', bgColor: 'bg-blue-500/20', isLight: false },
    { name: 'GREEN', solidClass: 'bg-green-500', transparentRgba: 'rgba(34, 197, 94, 0.4)', textColor: 'text-green-400', borderColor: 'border-green-400', bgColor: 'bg-green-500/20', isLight: false },
    { name: 'FUCHSIA', solidClass: 'bg-fuchsia-500', transparentRgba: 'rgba(217, 70, 239, 0.4)', textColor: 'text-fuchsia-400', borderColor: 'border-fuchsia-400', bgColor: 'bg-fuchsia-500/20', isLight: false },
    { name: 'SLATE', solidClass: 'bg-slate-800', transparentRgba: 'rgba(30, 41, 59, 0.5)', textColor: 'text-slate-300', borderColor: 'border-slate-300', bgColor: 'bg-slate-300/20', isLight: false },
    { name: 'STONE', solidClass: 'bg-stone-100', transparentRgba: 'rgba(245, 245, 244, 0.4)', textColor: 'text-stone-400', borderColor: 'border-stone-400', bgColor: 'bg-stone-400/20', isLight: true },
];

/**
 * @const {object} PRESET_STICKERS
 * @description A collection of URLs for preset sticker sets.
 * Each key represents a sticker theme, and the value is the URL to the sticker image.
 */
export const PRESET_STICKERS = {
  TECH: 'https://storage.googleapis.com/gemini-drum-pal/stickers/tech_sticker_set_1.png',
  BIO: 'https://storage.googleapis.com/gemini-drum-pal/stickers/bio_sticker_set_1.png',
  KAWAII: 'https://storage.googleapis.com/gemini-drum-pal/stickers/kawaii_sticker_set_1.png',
};

/**
 * @const {(string|null)[]} PAD_LAYOUT_ORDER
 * @description Defines the visual layout of the drum pads in a 3-column grid.
 * `null` values represent empty spaces in the grid.
 */
export const PAD_LAYOUT_ORDER = [
    null, 'kick', null,
    'snare', 'tom1', 'clap',
    'hihat_closed', 'hihat_open', 'cymbal_crash',
    null, 'fx1', null
];


/**
 * @const {object} PAD_ANIMATION_MAP
 * @description A mapping of pad IDs to their corresponding animation component names.
 * This is used to dynamically render the correct animation when a pad is triggered.
 */
export const PAD_ANIMATION_MAP: { [key: string]: string } = {
    kick: 'Kick',
    snare: 'Snare',
    hihat_closed: 'HihatClosed',
    hihat_open: 'HihatOpen',
    tom1: 'Tom',
    clap: 'Clap',
    cymbal_crash: 'Crash',
    fx1: 'Fx',
};

/** @const {string} GEMINI_MODEL_NAME The default model name for the Gemini API. */
export const GEMINI_MODEL_NAME = 'gemini-1.5-flash';
/** @const {string} GEMINI_MODEL_NAME_EXPERIMENTAL The experimental model name for the Gemini API. */
export const GEMINI_MODEL_NAME_EXPERIMENTAL = 'gemini-1.5-pro';

/** @const {string} WELCOME_MESSAGE The welcome message displayed on the LCD screen. */
export const WELCOME_MESSAGE = 'GEMINI\nDRUM-PAL';

/**
 * @const {object} METRONOME_TICK_CONFIG
 * @description The Tone.js configuration for the metronome tick sound.
 * This defines the synthesizer and envelope used to create the tick sound.
 */
export const METRONOME_TICK_CONFIG = {
  instrument: 'Synth',
  options: {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 }
  },
  duration: '32n',
  note: 'C8'
};