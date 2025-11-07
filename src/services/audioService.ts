
import * as Tone from 'tone';
import { MembraneSynth, NoiseSynth, MetalSynth, FMSynth, AMSynth, Synth, PluckSynth } from 'tone';
import { ToneJsSoundConfig, ToneJsEffectConfig } from '../types';

let audioInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

export const getAudioContextState = (): AudioContextState | null => {
  return Tone.context?.state || null;
};

export const initializeAudio = async (): Promise<boolean> => {
  if (audioInitialized || Tone.context.state === 'running') {
    audioInitialized = true;
    return true;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      await Tone.start();
      console.log('AudioContext started successfully.');
      audioInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to start AudioContext:', error);
      audioInitialized = false;
      throw error;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
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

const instrumentCache = new Map<string, CreatableToneInstrument>();

const createInstrument = (config: ToneJsSoundConfig): CreatableToneInstrument | null => {
  const cacheKey = `${config.instrument}_${JSON.stringify(config.options)}`;

  if (instrumentCache.has(cacheKey)) {
    return instrumentCache.get(cacheKey)!;
  }

  let instrument: CreatableToneInstrument | null = null;
  const options = config.options || {};

  switch (config.instrument) {
    case 'MembraneSynth':
      instrument = new Tone.MembraneSynth(options);
      break;
    case 'NoiseSynth':
      instrument = new Tone.NoiseSynth(options);
      break;
    case 'MetalSynth':
      instrument = new Tone.MetalSynth(options);
      break;
    case 'FMSynth':
      instrument = new Tone.FMSynth(options);
      break;
    case 'AMSynth':
      instrument = new Tone.AMSynth(options);
      break;
    case 'Synth':
      instrument = new Tone.Synth(options);
      break;
    case 'PluckSynth':
      instrument = new Tone.PluckSynth(options);
      break;
    default:
      console.warn(`Unsupported instrument type: ${config.instrument}`);
      instrument = new Tone.MembraneSynth(options); // Fallback
  }

  if (instrument && instrumentCache.size < 50) { // Limit cache size
    instrumentCache.set(cacheKey, instrument);
  }

  return instrument;
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

export const playSound = async (
  soundConfig: ToneJsSoundConfig | undefined,
  timeoutsRef?: React.MutableRefObject<Set<NodeJS.Timeout>>
): Promise<void> => {
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

  const timeoutId = setTimeout(() => {
    instrument.dispose();
    effectsChain.forEach(effect => effect.dispose());
    timeoutsRef?.current.delete(timeoutId);
  }, disposeDelay);

  timeoutsRef?.current.add(timeoutId);
};

export const soundEngine = {
  initializeAudio,
  playSound,
  getAudioContextState,
};
