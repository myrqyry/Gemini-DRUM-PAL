
import * as Tone from 'tone';
import { MembraneSynth, NoiseSynth, MetalSynth, FMSynth, AMSynth, Synth, PluckSynth } from 'tone';
import { ToneJsSoundConfig, ToneJsEffectConfig } from '../types';

let audioInitialized = false;
let isInitializing = false;

export const getAudioContextState = (): AudioContextState | null => {
  return Tone.context?.state || null;
};

export const initializeAudio = async (): Promise<boolean> => {
  if (audioInitialized || Tone.context.state === 'running') {
    audioInitialized = true;
    return true;
  }
  if (isInitializing) {
    // Wait for ongoing initialization
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (audioInitialized) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  }
  isInitializing = true;
  try {
    await Tone.start();
    console.log('AudioContext started successfully.');
    audioInitialized = true;
    isInitializing = false;
    return true;
  } catch (error) {
    console.error('Failed to start AudioContext:', error);
    audioInitialized = false;
    isInitializing = false;
    return false;
  }
};

// Define the union type for creatable instruments
type CreatableToneInstrument =
  | MembraneSynth
  | NoiseSynth
  | MetalSynth
  | FMSynth
  | AMSynth
  | Synth
  | PluckSynth;

const createInstrument = (config: ToneJsSoundConfig): CreatableToneInstrument | null => {
  const options = config.options || {};
  switch (config.instrument) {
    case 'MembraneSynth':
      return new Tone.MembraneSynth(options);
    case 'NoiseSynth':
      return new Tone.NoiseSynth(options);
    case 'MetalSynth':
      return new Tone.MetalSynth(options);
    case 'FMSynth':
      return new Tone.FMSynth(options);
    case 'AMSynth':
      return new Tone.AMSynth(options);
    case 'Synth':
      return new Tone.Synth(options);
    case 'PluckSynth':
      return new Tone.PluckSynth(options);
    default:
      console.warn(`Unsupported instrument type: ${config.instrument}`);
      return new Tone.MembraneSynth(options); // Fallback
  }
};

const createEffect = (effectConfig: ToneJsEffectConfig): Tone.ToneAudioNode | null => {
  const options = effectConfig.options || {};
  switch (effectConfig.type) {
    case 'Distortion':
      return new Tone.Distortion(options);
    case 'Reverb':
      return new Tone.Reverb(options);
    case 'Chorus':
      return new Tone.Chorus(options);
    case 'Phaser':
      return new Tone.Phaser(options);
    case 'PingPongDelay':
      return new Tone.PingPongDelay(options);
    case 'FeedbackDelay':
      return new Tone.FeedbackDelay(options);
    case 'BitCrusher':
      return new Tone.BitCrusher(options);
    case 'AutoFilter':
      return new Tone.AutoFilter(options).start();
    case 'FrequencyShifter':
        return new Tone.FrequencyShifter(options);
    default:
      console.warn(`Unsupported effect type: ${effectConfig.type}`);
      return null;
  }
};

export const playSound = async (soundConfig: ToneJsSoundConfig | undefined): Promise<void> => {
  if (!soundConfig) {
    console.warn('No sound configuration provided to playSound.');
    return;
  }

  if (Tone.context.state !== 'running') {
    console.warn('AudioContext not running. Attempting to initialize.');
    const started = await initializeAudio();
    if (!started) {
        alert('Could not initialize audio. Please ensure your browser allows audio playback and try interacting with the page again (e.g. click "Enable Audio").');
        return;
    }
  }

  const instrument = createInstrument(soundConfig);
  if (!instrument) return;

  const effectsChain: Tone.ToneAudioNode[] = [];
  if (soundConfig.effects && soundConfig.effects.length > 0) {
    soundConfig.effects.forEach(effectConf => {
      const effect = createEffect(effectConf);
      if (effect) effectsChain.push(effect);
    });
  }

  // Connect instrument to effects, then to destination
  if (effectsChain.length > 0) {
    instrument.chain(...effectsChain, Tone.Destination);
  } else {
    instrument.toDestination();
  }
  
  const duration = soundConfig.duration || 0.2; // Default duration if not specified
  const note = soundConfig.note; // Can be undefined

  try {
    if (instrument instanceof Tone.MembraneSynth) {
      instrument.triggerAttackRelease(note || 'C2', duration, Tone.now());
    } else if (instrument instanceof Tone.NoiseSynth) {
      instrument.triggerAttackRelease(duration, Tone.now());
    } else if (instrument instanceof Tone.MetalSynth) {
      instrument.triggerAttackRelease(duration, Tone.now());
    } else if (instrument instanceof Tone.PluckSynth && note) {
        // PluckSynth often uses triggerAttack and might not always have triggerAttackRelease with duration in the same way
        // However, as it extends Monophonic, triggerAttackRelease is available.
        instrument.triggerAttackRelease(note, Tone.now()); // Duration might not be directly applicable or handled by its envelope
    } else if (instrument instanceof Tone.Synth || instrument instanceof Tone.FMSynth || instrument instanceof Tone.AMSynth) {
      instrument.triggerAttackRelease(note || 'C4', duration, Tone.now());
    } else {
      // Generic fallback for other potential instruments not explicitly handled or if note isn't relevant
      // @ts-ignore Check if triggerAttackRelease is a function before calling it
      if (typeof (instrument as any).triggerAttackRelease === 'function') {
         // @ts-ignore
        (instrument as any).triggerAttackRelease(note, duration, Tone.now());
      } else {
        console.warn(`Instrument type ${soundConfig.instrument} might not support triggerAttackRelease in this way, or requires a note.`);
      }
    }
  } catch (e) {
    console.error("Error triggering sound: ", e);
  }


  // Dispose after a delay to ensure sound plays out
  // The duration for disposal should be longer than the sound's actual release time.
  // This is a simplified approach. For complex sounds with long releases, this needs to be smarter.
  const soundActualDuration = typeof duration === 'number' ? duration : Tone.Time(duration).toSeconds();
  const maxReleaseTime = 2; // Assume max 2s release for effects like reverb
  const disposeDelay = (soundActualDuration + maxReleaseTime) * 1000;

  setTimeout(() => {
    instrument.dispose();
    effectsChain.forEach(effect => effect.dispose());
  }, disposeDelay);
};
