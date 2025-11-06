import { useReducer } from 'react';

interface ToyState {
  power: 'OFF' | 'BOOTING' | 'ON';
  mode: 'IDLE' | 'MENU' | 'EDITING' | 'RECORDING' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';
  ui: {
    lcdMessage: string;
    selectedPadId: string | null;
    activeAnimation: string | null;
  };
  audio: {
    bpm: number;
    isMetronomeOn: boolean;
  };
  customization: {
    shellColorIndex: number;
    isTransparent: boolean;
    stickerUrl: string | null;
  };
}

type ToyAction =
  | { type: 'POWER_ON' }
  | { type: 'POWER_OFF' }
  | { type: 'SET_MODE'; mode: ToyState['mode'] }
  | { type: 'UPDATE_LCD'; message: string }
  | { type: 'SELECT_PAD'; padId: string | null }
  | { type: 'TRIGGER_ANIMATION'; animation: string | null }
  | { type: 'UPDATE_AUDIO_SETTINGS'; settings: Partial<ToyState['audio']> }
  | { type: 'UPDATE_CUSTOMIZATION'; settings: Partial<ToyState['customization']> }
  | { type: 'SET_ERROR'; message: string };

const initialToyState: ToyState = {
  power: 'OFF',
  mode: 'IDLE',
  ui: {
    lcdMessage: '',
    selectedPadId: null,
    activeAnimation: null,
  },
  audio: {
    bpm: 120,
    isMetronomeOn: false,
  },
  customization: {
    shellColorIndex: 0,
    isTransparent: false,
    stickerUrl: null,
  },
};

function toyStateReducer(state: ToyState, action: ToyAction): ToyState {
  switch (action.type) {
    case 'POWER_ON':
      return { ...state, power: 'BOOTING' };
    case 'POWER_OFF':
      return initialToyState;
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'UPDATE_LCD':
      return { ...state, ui: { ...state.ui, lcdMessage: action.message } };
    case 'SELECT_PAD':
      return {
        ...state,
        ui: { ...state.ui, selectedPadId: action.padId },
        mode: action.padId ? 'EDITING' : 'IDLE',
      };
    case 'TRIGGER_ANIMATION':
      return { ...state, ui: { ...state.ui, activeAnimation: action.animation } };
    case 'UPDATE_AUDIO_SETTINGS':
        return { ...state, audio: { ...state.audio, ...action.settings } };
    case 'UPDATE_CUSTOMIZATION':
        return { ...state, customization: { ...state.customization, ...action.settings } };
    case 'SET_ERROR':
        return { ...state, mode: 'ERROR', ui: { ...state.ui, lcdMessage: action.message } };
    default:
      return state;
  }
}

export function useToyState() {
  const [state, dispatch] = useReducer(toyStateReducer, initialToyState);

  return {
    state,
    actions: {
      powerOn: () => dispatch({ type: 'POWER_ON' }),
      powerOff: () => dispatch({ type: 'POWER_OFF' }),
      setMode: (mode: ToyState['mode']) => dispatch({ type: 'SET_MODE', mode }),
      updateLcd: (message: string) => dispatch({ type: 'UPDATE_LCD', message }),
      selectPad: (padId: string | null) => dispatch({ type: 'SELECT_PAD', padId }),
      triggerAnimation: (animation: string | null) => dispatch({ type: 'TRIGGER_ANIMATION', animation }),
      updateAudioSettings: (settings: Partial<ToyState['audio']>) => dispatch({ type: 'UPDATE_AUDIO_SETTINGS', settings }),
      updateCustomization: (settings: Partial<ToyState['customization']>) => dispatch({ type: 'UPDATE_CUSTOMIZATION', settings }),
      setError: (message: string) => dispatch({ type: 'SET_ERROR', message }),
    },
  };
}
