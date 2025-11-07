import { Type } from "@google/genai";

export const TONE_JS_SOUND_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    instrument: {
      type: Type.STRING,
      enum: ["MembraneSynth", "NoiseSynth", "MetalSynth", "FMSynth", "AMSynth", "Synth", "PluckSynth"],
    },
    options: {
      type: Type.OBJECT,
    },
    effects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
          },
          options: {
            type: Type.OBJECT,
          },
        },
      },
    },
    duration: {
      type: Type.STRING,
    },
    note: {
      type: Type.STRING,
    },
  },
};
