import { ToyConfig } from '../../core/types/toyTypes';

export const synthesizerToyConfig: ToyConfig = {
  id: 'retro-synth',
  name: 'RETRO-SYNTH',
  type: 'SYNTHESIZER',
  pads: [
    {
      id: 'bass',
      name: 'BASS',
      color: 'bg-purple-500',
      soundPrompt: 'Deep analog bass synthesizer, Moog-style with low-pass filter sweep',
      isLoading: false,
    },
    {
      id: 'lead',
      name: 'LEAD',
      color: 'bg-cyan-400',
      soundPrompt: 'Bright lead synthesizer with sawtooth wave and resonant filter',
      isLoading: false,
    },
    {
      id: 'pad',
      name: 'PAD',
      color: 'bg-pink-400',
      soundPrompt: 'Lush string pad with chorus and reverb, warm and atmospheric',
      isLoading: false,
    },
    {
      id: 'pluck',
      name: 'PLUCK',
      color: 'bg-green-400',
      soundPrompt: 'Sharp plucked synthesizer with quick decay, staccato style',
      isLoading: false,
    },
    {
      id: 'arp',
      name: 'ARP',
      color: 'bg-yellow-400',
      soundPrompt: 'Arpeggiated sequence, 16th notes, classic 80s style',
      isLoading: false,
    },
    {
      id: 'fx1',
      name: 'SWEEP',
      color: 'bg-red-400',
      soundPrompt: 'Filter sweep effect, rising white noise with resonance',
      isLoading: false,
    },
    {
      id: 'fx2',
      name: 'ZAP',
      color: 'bg-blue-400',
      soundPrompt: 'Laser zap sound effect, FM synthesis with pitch envelope',
      isLoading: false,
    },
    {
      id: 'seq',
      name: 'SEQ',
      color: 'bg-indigo-400',
      soundPrompt: 'Sequenced pattern, acid house style with filter modulation',
      isLoading: false,
    },
  ],
  layoutOrder: [
    null, 'bass', null,
    'lead', 'pad', 'pluck',
    'arp', 'fx1', 'fx2',
    null, 'seq', null
  ],
  animationMap: {
    bass: 'BassWave',
    lead: 'LeadSparkle',
    pad: 'PadGlow',
    pluck: 'PluckPing',
    arp: 'ArpCascade',
    fx1: 'SweepWave',
    fx2: 'ZapFlash',
    seq: 'SeqPulse',
  },
  shellColors: [
    { name: 'NEON', solidClass: 'bg-gradient-to-br from-purple-600 to-pink-600', transparentRgba: 'rgba(147, 51, 234, 0.4)', textColor: 'text-purple-300', borderColor: 'border-purple-300', bgColor: 'bg-purple-600/20', isLight: false },
    { name: 'CHROME', solidClass: 'bg-gradient-to-br from-gray-300 to-gray-600', transparentRgba: 'rgba(156, 163, 175, 0.4)', textColor: 'text-gray-300', borderColor: 'border-gray-300', bgColor: 'bg-gray-300/20', isLight: true },
  ],
  defaultSettings: {
    bpm: 128,
    scale: 'minor',
    baseNote: 'C3'
  }
};
