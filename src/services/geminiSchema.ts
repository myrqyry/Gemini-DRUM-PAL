import { z } from 'zod';

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

export type ToneJsSoundConfig = z.infer<typeof ToneJsSoundConfigSchema>;
