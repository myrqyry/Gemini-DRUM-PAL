
import * as Tone from 'tone';
import { MembraneSynth, NoiseSynth, MetalSynth, FMSynth, AMSynth, Synth, PluckSynth } from 'tone';
import { ToneJsSoundConfig, ToneJsEffectConfig } from '../types';

let audioInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

/**
 * Gets the current state of the Tone.js AudioContext.
 * @returns {AudioContextState | null} The state of the AudioContext, or null if it doesn't exist.
 */
export const getAudioContextState = (): AudioContextState | null => {
  return Tone.context?.state || null;
};

/**
 * Initializes the Tone.js AudioContext. This must be called in response to a user gesture.
 * It uses a promise to handle concurrent calls and ensure initialization only happens once.
 * @returns {Promise<boolean>} A promise that resolves to true if the AudioContext is successfully started, and false otherwise.
 */
export const initializeAudio = async (): Promise<boolean> => {
  if (audioInitialized || Tone.context.state === 'running') {
    audioInitialized = true;
    return true;
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        await Tone.start();
        console.log('AudioContext started successfully.');
        audioInitialized = true;
        return true;
      } catch (error) {
        // Do not throw: return false to signal callers that initialization failed.
        // This prevents uncaught promise rejections when initialization is attempted
        // programmatically without a user gesture (common in dev environments).
        console.warn('Failed to start AudioContext:', error);
        audioInitialized = false;
        initializationPromise = null; // Reset for future attempts
        return false;
      }
    })();
  }
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

/**
 * Creates a Tone.js instrument based on the provided configuration.
 * It uses a cache to avoid recreating instruments with the same configuration.
 * @param {ToneJsSoundConfig} config - The configuration for the instrument.
 * @returns {CreatableToneInstrument | null} The created Tone.js instrument, or null if the type is unsupported.
 */
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

/**
 * Creates a Tone.js effect based on the provided configuration.
 * @param {ToneJsEffectConfig} effectConfig - The configuration for the effect.
 * @returns {Tone.ToneAudioNode | null} The created Tone.js effect node, or null if the type is unsupported.
 */
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

/**
 * Creates a special audio effects chain that simulates the sound of a toy speaker.
 * This chain includes a bit crusher, a bandpass filter, distortion, and pink noise to add hiss.
 * @returns {{input: Tone.BitCrusher, output: Tone.Distortion, effects: Tone.ToneAudioNode[]}} An object containing the input and output nodes of the chain, and an array of all effects in the chain.
 */
const createToySpeakerChain = () => {
  const bitCrusher = new Tone.BitCrusher(8);
  const filter = new Tone.Filter({
    type: 'bandpass',
    frequency: 4100,
    Q: 0.7,
  });
  const distortion = new Tone.Distortion(0.1);
  const hiss = new Tone.Noise('pink').start();
  const hissGain = new Tone.Gain(0.1);

  hiss.connect(hissGain);
  hissGain.connect(distortion);

  bitCrusher.connect(filter);
  filter.connect(distortion);

  return {
    input: bitCrusher,
    output: distortion,
    effects: [bitCrusher, filter, distortion, hiss, hissGain],
  };
};

/**
 * Plays a sound based on the provided configuration.
 * It handles instrument and effect creation, audio routing, and sound triggering.
 * It also includes logic for the toy speaker effect and battery level simulation.
 *
 * @param {ToneJsSoundConfig | undefined} soundConfigA - The primary sound configuration.
 * @param {React.MutableRefObject<Set<NodeJS.Timeout>>} timeoutsRef - A ref to a set of timeouts for garbage collection.
 * @param {ToneJsSoundConfig | undefined} [soundConfigB] - An optional second sound configuration for morphing.
 * @param {number} [morphValue=0] - The morphing value between soundConfigA and soundConfigB.
 * @param {boolean} [isToyModeEnabled=false] - A flag to enable the toy speaker effect.
 * @param {number} [batteryLevel=100] - The current battery level, used for sound degradation effects.
 * @returns {Promise<void>} A promise that resolves when the sound has been triggered.
 */
export const playSound = async (
  soundConfigA: ToneJsSoundConfig | undefined,
  timeoutsRef: React.MutableRefObject<Set<NodeJS.Timeout>>,
  soundConfigB?: ToneJsSoundConfig | undefined,
  morphValue: number = 0,
  isToyModeEnabled: boolean = false,
  batteryLevel: number = 100
): Promise<void> => {
  if (!soundConfigA) {
    console.warn('No sound configuration provided to playSound.');
    return;
  }

  const soundConfig =
    soundConfigB && morphValue > 0
      ? interpolate(soundConfigA, soundConfigB, morphValue)
      : soundConfigA;

  if (Tone.context.state !== 'running') {
    console.warn('AudioContext not running. Attempting to initialize.');
    let started;
    try {
      started = await initializeAudio();
    } catch (e) {
      started = false;
    }
    if (!started) {
      // Avoid popping up blocking alerts during background operations.
      // Instead, warn and return gracefully — UI should surface a user-facing prompt.
      console.warn('Audio initialization failed; skipping sound playback until user gesture.');
      return;
    }
  }

  const instrument = createInstrument(soundConfig);
  if (!instrument) return;

  if (batteryLevel < 20) {
    const detuneAmount = (1 - batteryLevel / 20) * -200; // Detune up to 200 cents
    instrument.set({ detune: detuneAmount });
  }

  const effectsChain: Tone.ToneAudioNode[] = [];
  if (soundConfig.effects && soundConfig.effects.length > 0) {
    soundConfig.effects.forEach(effectConf => {
      const effect = createEffect(effectConf);
      if (effect) effectsChain.push(effect);
    });
  }

  const toySpeakerChain = isToyModeEnabled ? createToySpeakerChain() : null;

  // Connect instrument to effects, then to destination
  if (effectsChain.length > 0) {
    if (toySpeakerChain) {
      instrument.chain(...effectsChain, toySpeakerChain.input);
      toySpeakerChain.output.toDestination();
    } else {
      instrument.chain(...effectsChain, Tone.Destination);
    }
  } else {
    if (toySpeakerChain) {
      instrument.connect(toySpeakerChain.input);
      toySpeakerChain.output.toDestination();
    } else {
      instrument.toDestination();
    }
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
      if ('triggerAttackRelease' in instrument && typeof instrument.triggerAttackRelease === 'function') {
        instrument.triggerAttackRelease(note, duration, Tone.now());
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
    toySpeakerChain?.effects.forEach(effect => effect.dispose());
    timeoutsRef?.current.delete(timeoutId);
  }, disposeDelay);

  timeoutsRef?.current.add(timeoutId);
};

/**
 * Interpolates between two sound configurations based on a morph value.
 * This is used to create smooth transitions between two different sounds.
 * @param {ToneJsSoundConfig} configA - The first sound configuration.
 * @param {ToneJsSoundConfig} configB - The second sound configuration.
 * @param {number} morphValue - The morph value (0-1), where 0 is 100% configA and 1 is 100% configB.
 * @returns {ToneJsSoundConfig} The interpolated sound configuration.
 */
const interpolate = (
  configA: ToneJsSoundConfig,
  configB: ToneJsSoundConfig,
  morphValue: number
): ToneJsSoundConfig => {
  const interpolatedConfig = JSON.parse(JSON.stringify(configA));

  // Interpolate instrument options
  for (const key in configA.options) {
    if (
      typeof configA.options[key] === 'number' &&
      typeof configB.options[key] === 'number'
    ) {
      interpolatedConfig.options[key] =
        (configA.options[key] as number) * (1 - morphValue) +
        (configB.options[key] as number) * morphValue;
    }
  }

  // Interpolate effects options
  if (configA.effects && configB.effects) {
    interpolatedConfig.effects = configA.effects.map((effectA, i) => {
      const effectB = configB.effects?.[i];
      if (effectA.type === effectB?.type) {
        const interpolatedEffect = JSON.parse(JSON.stringify(effectA));
        for (const key in effectA.options) {
          if (
            typeof effectA.options[key] === 'number' &&
            typeof effectB.options[key] === 'number'
          ) {
            interpolatedEffect.options[key] =
              (effectA.options[key] as number) * (1 - morphValue) +
              (effectB.options[key] as number) * morphValue;
          }
        }
        return interpolatedEffect;
      }
      return effectA;
    });
  }

  return interpolatedConfig;
};

/**
 * @const {object} soundEngine
 * @description An object that encapsulates the main audio service functions.
 * This provides a clean interface for other parts of the application to interact with the audio system.
 *
 * @property {() => Promise<boolean>} initializeAudio - A function to initialize the audio context.
 * @property {typeof playSound} playSound - A function to play sounds.
 * @property {() => AudioContextState | null} getAudioContextState - A function to get the current state of the audio context.
 */
export const soundEngine = {
  initializeAudio,
  playSound,
  getAudioContextState,
};
