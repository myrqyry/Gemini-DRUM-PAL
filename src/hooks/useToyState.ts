import { useReducer } from 'react';
import { PadConfig } from '../types';
import { WELCOME_MESSAGE } from '../../constants';

/**
 * @interface ToyState
 * @description Defines the shape of the toy's state, including power, mode, UI, audio, and customization settings.
 */
interface ToyState {
  /** The power state of the toy. */
  power: {
    level: number; // 0-100
    status: 'OFF' | 'BOOTING' | 'ON';
  };
  /** The current operational mode of the toy. */
  mode: 'IDLE' | 'MENU' | 'EDITING' | 'RECORDING' | 'GENERATING' | 'ERROR' | 'STICKER_PROMPT';
  /** The state of the user interface elements. */
  ui: {
    lcdMessage: string;
    selectedPadId: string | null;
    activeAnimation: string | null;
    isKitsModalOpen: boolean;
    promptInputValue: string;
    stickerUrlInput: string;
  };
  /** The state of the audio settings. */
  audio: {
    bpm: number;
    isMetronomeOn: boolean;
    isToyModeEnabled: boolean;
  };
  /** The state of the customization options. */
  customization: {
    stickerRotation: number;
    stickerScale: number;
    soundModel: 'DEFAULT' | 'EXPERIMENTAL';
    isWellLovedEnabled: boolean;
  };
  /** The history of pad configurations for undo/redo functionality. */
  history: PadConfig[][];
  /** The current index in the history. */
  historyIndex: number;
}

type ToyAction =
  | { type: 'POWER_ON' }
  | { type: 'POWER_OFF' }
  | { type: 'DEPLETE_BATTERY' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'UPDATE_HISTORY'; history: PadConfig[][]; historyIndex: number }
  | { type: 'SET_MODE'; mode: ToyState['mode'] }
  | { type: 'UPDATE_LCD'; message: string }
  | { type: 'SELECT_PAD'; padId: string | null }
  | { type: 'TRIGGER_ANIMATION'; animation: string | null }
  | { type: 'UPDATE_UI'; ui: Partial<ToyState['ui']> }
  | { type: 'UPDATE_AUDIO'; audio: Partial<ToyState['audio']> }
  | { type: 'TOGGLE_TOY_MODE' }
  | { type: 'TOGGLE_WELL_LOVED_MODE' }
  | { type: 'UPDATE_CUSTOMIZATION'; customization: Partial<ToyState['customization']> }
  | { type: 'SET_ERROR'; message: string };

/**
 * @const {ToyState} initialToyState
 * @description The initial state of the toy when the application starts.
 */
const initialToyState: ToyState = {
  power: {
    level: 100,
    status: 'OFF',
  },
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
    isToyModeEnabled: false,
  },
  customization: {
    stickerRotation: 0,
    stickerScale: 1,
    soundModel: 'DEFAULT',
    isWellLovedEnabled: false,
  },
  history: [],
  historyIndex: 0,
};

/**
 * @function toyStateReducer
 * @description A reducer function to manage state transitions for the toy.
 * It takes the current state and an action, and returns the new state.
 *
 * @param {ToyState} state - The current state.
 * @param {ToyAction} action - The action to be performed.
 * @returns {ToyState} The new state.
 */
function toyStateReducer(state: ToyState, action: ToyAction): ToyState {
  switch (action.type) {
    case 'POWER_ON':
      return { ...state, power: { ...state.power, status: 'BOOTING' } };
    case 'POWER_OFF':
      return initialToyState;
    case 'DEPLETE_BATTERY':
      return {
        ...state,
        power: {
          ...state.power,
          level: Math.max(0, state.power.level - 0.1),
        },
      };
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
    case 'TOGGLE_TOY_MODE':
        return { ...state, audio: { ...state.audio, isToyModeEnabled: !state.audio.isToyModeEnabled } };
    case 'TOGGLE_WELL_LOVED_MODE':
        return { ...state, customization: { ...state.customization, isWellLovedEnabled: !state.customization.isWellLovedEnabled } };
    case 'UPDATE_CUSTOMIZATION':
        return { ...state, customization: { ...state.customization, ...action.customization } };
    case 'SET_ERROR':
        return { ...state, mode: 'ERROR', ui: { ...state.ui, lcdMessage: action.message } };
    default:
      return state;
  }
}

/**
 * @function useToyState
 * @description A custom hook that provides a state management solution for the toy using a reducer.
 * It returns the current state and a set of action dispatchers to update the state.
 *
 * @returns {{
 *   state: ToyState,
 *   actions: object
 * }} An object containing the current state and an object with all the action dispatchers.
 */
export function useToyState() {
  const [state, dispatch] = useReducer(toyStateReducer, initialToyState);

  const actions = {
    powerOn: () => dispatch({ type: 'POWER_ON' }),
    powerOff: () => dispatch({ type: 'POWER_OFF' }),
    depleteBattery: () => dispatch({ type: 'DEPLETE_BATTERY' }),
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
    toggleToyMode: () => dispatch({ type: 'TOGGLE_TOY_MODE' }),
    toggleWellLovedMode: () => dispatch({ type: 'TOGGLE_WELL_LOVED_MODE' }),
    updateCustomization: (customization: Partial<ToyState['customization']>) => dispatch({ type: 'UPDATE_CUSTOMIZATION', customization }),
    setError: (message: string) => dispatch({ type: 'SET_ERROR', message }),
  };

  return { state, actions };
}
