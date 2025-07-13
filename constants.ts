import { PadConfig } from './types';

export const INITIAL_PADS: PadConfig[] = [
  {
    id: 'kick',
    name: 'KICK',
    color: 'bg-red-500',
    soundPrompt: 'A deep, punchy kick drum sound. 808 style.',
    isLoading: false,
  },
  {
    id: 'snare',
    name: 'SNARE',
    color: 'bg-sky-400',
    soundPrompt: 'A crisp, snappy snare drum with a short burst of white noise.',
    isLoading: false,
  },
  {
    id: 'hihat_closed',
    name: 'C-HAT',
    color: 'bg-yellow-300',
    soundPrompt: 'A short, metallic, closed hi-hat sound. Very crisp and tight.',
    isLoading: false,
  },
  {
    id: 'hihat_open',
    name: 'O-HAT',
    color: 'bg-lime-400',
    soundPrompt: 'A shimmering, metallic open hi-hat sound with a medium decay.',
    isLoading: false,
  },
  {
    id: 'tom1',
    name: 'TOM',
    color: 'bg-orange-400',
    soundPrompt: 'A high-pitched tom drum sound with a quick attack.',
    isLoading: false,
  },
  {
    id: 'clap',
    name: 'CLAP',
    color: 'bg-fuchsia-500',
    soundPrompt: 'A classic 80s electronic clap sound, layered and punchy.',
    isLoading: false,
  },
  {
    id: 'cymbal_crash',
    name: 'CRASH',
    color: 'bg-teal-300',
    soundPrompt: 'A bright crash cymbal sound with a long decay, like a 909.',
    isLoading: false,
  },
  {
    id: 'fx1',
    name: 'FX',
    color: 'bg-indigo-500',
    soundPrompt: 'A glitchy, digital artifact sound, like a broken video game.',
    isLoading: false,
  },
];

export const SHELL_COLORS = [
    { name: 'YELLOW', solidClass: 'bg-yellow-400', transparentRgba: 'rgba(251, 191, 36, 0.4)', textColor: 'text-yellow-300', borderColor: 'border-yellow-300', bgColor: 'bg-yellow-400/20', isLight: true },
    { name: 'RED', solidClass: 'bg-red-500', transparentRgba: 'rgba(239, 68, 68, 0.4)', textColor: 'text-red-400', borderColor: 'border-red-400', bgColor: 'bg-red-500/20', isLight: false },
    { name: 'BLUE', solidClass: 'bg-blue-500', transparentRgba: 'rgba(59, 130, 246, 0.4)', textColor: 'text-blue-400', borderColor: 'border-blue-400', bgColor: 'bg-blue-500/20', isLight: false },
    { name: 'GREEN', solidClass: 'bg-green-500', transparentRgba: 'rgba(34, 197, 94, 0.4)', textColor: 'text-green-400', borderColor: 'border-green-400', bgColor: 'bg-green-500/20', isLight: false },
    { name: 'FUCHSIA', solidClass: 'bg-fuchsia-500', transparentRgba: 'rgba(217, 70, 239, 0.4)', textColor: 'text-fuchsia-400', borderColor: 'border-fuchsia-400', bgColor: 'bg-fuchsia-500/20', isLight: false },
    { name: 'SLATE', solidClass: 'bg-slate-800', transparentRgba: 'rgba(30, 41, 59, 0.5)', textColor: 'text-slate-300', borderColor: 'border-slate-300', bgColor: 'bg-slate-300/20', isLight: false },
    { name: 'STONE', solidClass: 'bg-stone-100', transparentRgba: 'rgba(245, 245, 244, 0.4)', textColor: 'text-stone-400', borderColor: 'border-stone-400', bgColor: 'bg-stone-400/20', isLight: true },
];

// Defines a "cuter" 3-column layout for the pads
export const PAD_LAYOUT_ORDER = [
    null, 'kick', null,
    'snare', 'tom1', 'clap',
    'hihat_closed', 'hihat_open', 'cymbal_crash',
    null, 'fx1', null
];


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


export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

export const WELCOME_MESSAGE = 'GEMINI\nDRUM-PAL';