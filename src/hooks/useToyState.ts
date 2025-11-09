import { useReducer } from 'react';
import { WELCOME_MESSAGE } from '../../constants';

interface ToyState {
  power: 'OFF' | 'BOOTING' | 'ON';
  mode: 'IDLE' | 'MENU' | 'EDITING' | 'RECORDING' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';
  ui: {
    lcdMessage: string;
    selectedPadId: string | null;
    activeAnimation: string | null;
    isKitsModalOpen: boolean;
    promptInputValue: string;
    stickerUrlInput: string;
  };
  audio: {
    bpm: number;
    isMetronomeOn: boolean;
  };
  customization: {
    stickerRotation: number;
    stickerScale: number;
    soundModel: 'DEFAULT' | 'EXPERIMENTAL';
  };
  history: PadConfig[][];
  historyIndex: number;
}

type ToyAction =
  | { type: 'POWER_ON' }
  | { type: 'POWER_OFF' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'UPDATE_HISTORY'; history: PadConfig[][]; historyIndex: number }
  | { type: 'SET_MODE'; mode: ToyState['mode'] }
  | { type: 'UPDATE_LCD'; message: string }
  | { type: 'SELECT_PAD'; padId: string | null }
  | { type: 'TRIGGER_ANIMATION'; animation: string | null }
  | { type: 'UPDATE_UI'; ui: Partial<ToyState['ui']> }
  | { type: 'UPDATE_AUDIO'; audio: Partial<ToyState['audio']> }
  | { type: 'UPDATE_CUSTOMIZATION'; customization: Partial<ToyState['customization']> }
  | { type: 'SET_ERROR'; message: string };

const initialToyState: ToyState = {
  power: 'OFF',
  mode: 'IDLE',
  ui: {
    lcdMessage: '',
    selectedPadId: null,
    activeAnimation: null,
    isKitsModalOpen: false,
    promptInputValue: '',
    stickerUrlInput: '',
  },
  audio: {
    bpm: 120,
    isMetronomeOn: false,
  },
  customization: {
    stickerRotation: 0,
    stickerScale: 1,
    soundModel: 'DEFAULT',
  },
  history: [],
  historyIndex: 0,
};

function toyStateReducer(state: ToyState, action: ToyAction): ToyState {
  switch (action.type) {
    case 'POWER_ON':
      return { ...state, power: 'BOOTING' };
    case 'POWER_OFF':
      return initialToyState;
    case 'UNDO':
      return {
        ...state,
        historyIndex: Math.max(0, state.historyIndex - 1),
      };
    case 'REDO':
      return {
        ...state,
        historyIndex: Math.min(
          state.history.length - 1,
          state.historyIndex + 1
        ),
      };
    case 'UPDATE_HISTORY':
      return {
        ...state,
        history: action.history,
        historyIndex: action.historyIndex,
      };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'UPDATE_LCD':
      return { ...state, ui: { ...state.ui, lcdMessage: action.message } };
    case 'SELECT_PAD':
      return {
        ...state,
        ui: { ...state.ui, selectedPadId: action.padId },
        mode: 'EDITING',
      };
    case 'TRIGGER_ANIMATION':
      return { ...state, ui: { ...state.ui, activeAnimation: action.animation } };
    case 'UPDATE_UI':
        return { ...state, ui: { ...state.ui, ...action.ui } };
    case 'UPDATE_AUDIO':
        return { ...state, audio: { ...state.audio, ...action.audio } };
    case 'UPDATE_CUSTOMIZATION':
        return { ...state, customization: { ...state.customization, ...action.customization } };
    case 'SET_ERROR':
        return { ...state, mode: 'ERROR', ui: { ...state.ui, lcdMessage: action.message } };
    default:
      return state;
  }
}

export function useToyState() {
  const [state, dispatch] = useReducer(toyStateReducer, initialToyState);

  const actions = {
    powerOn: () => dispatch({ type: 'POWER_ON' }),
    powerOff: () => dispatch({ type: 'POWER_OFF' }),
    undo: () => dispatch({ type: 'UNDO' }),
    redo: () => dispatch({ type: 'REDO' }),
    updateHistory: (history: PadConfig[][], historyIndex: number) =>
      dispatch({ type: 'UPDATE_HISTORY', history, historyIndex }),
    setMode: (mode: ToyState['mode']) => dispatch({ type: 'SET_MODE', mode }),
    updateLcd: (message: string) => dispatch({ type: 'UPDATE_LCD', message }),
    selectPad: (padId: string | null) => dispatch({ type: 'SELECT_PAD', padId }),
    triggerAnimation: (animation: string | null) => dispatch({ type: 'TRIGGER_ANIMATION', animation }),
    updateUi: (ui: Partial<ToyState['ui']>) => dispatch({ type: 'UPDATE_UI', ui }),
    updateAudio: (audio: Partial<ToyState['audio']>) => dispatch({ type: 'UPDATE_AUDIO', audio }),
    updateCustomization: (customization: Partial<ToyState['customization']>) => dispatch({ type: 'UPDATE_CUSTOMIZATION', customization }),
    setError: (message: string) => dispatch({ type: 'SET_ERROR', message }),
  };

  return { state, actions };
}
