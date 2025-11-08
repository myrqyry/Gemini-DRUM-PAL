import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const effectSchema = z.object({
  type: z.string().describe("The type of the effect, e.g., 'Reverb', 'Chorus', 'Distortion'."),
  options: z.object({}).passthrough().describe("The options for the effect."),
});

export const TONE_JS_SOUND_SCHEMA = z.object({
  instrument: z.enum(["MembraneSynth", "NoiseSynth", "MetalSynth", "FMSynth", "AMSynth", "Synth", "PluckSynth"]).describe("The Tone.js instrument to use for the sound."),
  options: z.object({}).passthrough().describe("The options for the instrument."),
  effects: z.array(effectSchema).optional().describe("An optional array of effects to apply to the sound."),
  duration: z.string().optional().describe("The duration of the sound, e.g., '8n', '1m'."),
  note: z.string().optional().describe("The note to play, e.g., 'C4', 'F#2'."),
});

export const TONE_JS_SOUND_JSON_SCHEMA = zodToJsonSchema(TONE_JS_SOUND_SCHEMA);
