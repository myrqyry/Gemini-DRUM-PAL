import { ToyConfig } from '../types/toyTypes';

export const toyConfig: ToyConfig = {
  shellColors: [
    { name: 'SLATE', solidClass: 'bg-gray-600', transparentRgba: 'rgba(75, 85, 99, 0.5)', textColor: 'text-white', textInsetClass: 'text-gray-900' },
    { name: 'RED', solidClass: 'bg-red-500', transparentRgba: 'rgba(239, 68, 68, 0.5)', textColor: 'text-white', textInsetClass: 'text-red-900' },
    { name: 'BLUE', solidClass: 'bg-blue-500', transparentRgba: 'rgba(59, 130, 246, 0.5)', textColor: 'text-white', textInsetClass: 'text-blue-900' },
    { name: 'GREEN', solidClass: 'bg-green-500', transparentRgba: 'rgba(34, 197, 94, 0.5)', textColor: 'text-white', textInsetClass: 'text-green-900' },
    { name: 'YELLOW', solidClass: 'bg-yellow-500', transparentRgba: 'rgba(234, 179, 8, 0.5)', textColor: 'text-black', textInsetClass: 'text-yellow-900' },
    { name: 'VIOLET', solidClass: 'bg-violet-700', transparentRgba: 'rgba(109, 40, 217, 0.5)', textColor: 'text-white', textInsetClass: 'text-violet-900' },
    { name: 'FUCHSIA', solidClass: 'bg-fuchsia-500', transparentRgba: 'rgba(217, 70, 239, 0.5)', textColor: 'text-white', textInsetClass: 'text-fuchsia-900' },
    { name: 'PINK', solidClass: 'bg-pink-400', transparentRgba: 'rgba(244, 114, 182, 0.5)', textColor: 'text-white', textInsetClass: 'text-pink-900' },
  ],
  animationMap: {
    '1': 'Conga',
    '2': 'Conga',
    '3': 'Conga',
    '4': 'Kick',
    '5': 'Kick',
    '6': 'Kick',
    '7': 'Snare',
    '8': 'Snare',
    '9': 'Snare',
  },
  initialPads: [
    { id: '1', name: 'Conga 1', soundPrompt: 'A high-pitched conga drum with a sharp, crisp sound and a short decay.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '2', name: 'Conga 2', soundPrompt: 'A medium-pitched conga drum with a warm, round sound and a medium decay.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '3', name: 'Conga 3', soundPrompt: 'A low-pitched conga drum with a deep, resonant sound and a long decay.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '4', name: 'Kick 1', soundPrompt: 'A classic 808-style kick drum with a deep, booming sound and a long decay.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '5', name: 'Kick 2', soundPrompt: 'A tight, punchy kick drum with a strong attack and a short decay.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '6', name: 'Kick 3', soundPrompt: 'A distorted, industrial kick drum with a gritty, aggressive sound.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '7', name: 'Snare 1', soundPrompt: 'A classic 909-style snare drum with a sharp, cracking sound and a short decay.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '8', name: 'Snare 2', soundPrompt: 'A loose, trashy snare drum with a rattling, noisy sound.', toneJsConfig: null, isLoading: false, error: undefined },
    { id: '9', name: 'Snare 3', soundPrompt: 'A tight, snappy snare drum with a high-pitched, electronic sound.', toneJsConfig: null, isLoading: false, error: undefined },
  ]
};
