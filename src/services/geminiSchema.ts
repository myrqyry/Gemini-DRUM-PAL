import { z } from 'zod';

/**
 * @const {z.ZodObject} ToneJsSoundConfigSchema
 * @description A Zod schema for validating the structure of a Tone.js sound configuration.
 * This schema ensures that the sound configuration object has the correct properties and types
 * before it is used to generate audio.
 *
 * @property {z.ZodEnum} instrument - The type of Tone.js instrument to use.
 * @property {z.ZodRecord} options - A record of options for the instrument.
 * @property {z.ZodArray} [effects] - An optional array of effects to apply to the instrument.
 *   @property {z.ZodString} effects.type - The type of the effect.
 *   @property {z.ZodRecord} effects.options - A record of options for the effect.
 */
export const ToneJsSoundConfigSchema = z.object({
  instrument: z.enum([
    'Synth',
    'AMSynth',
    'FMSynth',
    'MembraneSynth',
    'MetalSynth',
    'NoiseSynth',
    'PluckSynth',
    'PolySynth',
  ]),
  options: z.record(z.any()),
  effects: z
    .array(
      z.object({
        type: z.string(),
        options: z.record(z.any()),
      })
    )
    .optional(),
});

/**
 * @typedef {z.infer<typeof ToneJsSoundConfigSchema>} ToneJsSoundConfig
 * @description The TypeScript type inferred from the `ToneJsSoundConfigSchema`.
 * This provides static type checking for Tone.js sound configuration objects.
 */
export type ToneJsSoundConfig = z.infer<typeof ToneJsSoundConfigSchema>;
