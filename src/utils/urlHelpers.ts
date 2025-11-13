import { PadConfig } from '../types';
import { INITIAL_PADS } from '../constants';

export const isValidBase64 = (str: string): boolean => {
  return /^[A-Za-z0-9+/=]+$/.test(str);
};

export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol) &&
           /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
};

interface ParsedUrlData {
  pads: PadConfig[];
  shellColor: string;
  isTransparent: boolean;
  stickerUrl: string | null;
}

export const parseKitFromUrl = (): ParsedUrlData | null => {
  if (typeof window === 'undefined' || !window.location.hash) {
    return null;
  }

  try {
    const hash = window.location.hash.substring(1);

    if (!isValidBase64(hash)) {
      throw new Error("Invalid base64 string in hash");
    }

    const decoded = atob(hash);
    const parsed = JSON.parse(decoded);

    if (!parsed || typeof parsed !== 'object' || !parsed.pads || !parsed.shell) {
        throw new Error("Invalid kit data structure");
    }

    const { pads: padPrompts, shell } = parsed;

    if (!Array.isArray(padPrompts) || typeof shell.c !== 'string' || typeof shell.t !== 'boolean') {
        throw new Error("Invalid kit data types");
    }

    const padsFromHash = padPrompts.reduce((acc, item) => {
      if (item.id && typeof item.p === 'string') {
        acc[item.id] = item.p;
      }
      return acc;
    }, {} as Record<string, string>);

    const pads = INITIAL_PADS.map(pad => {
      const prompt = padsFromHash[pad.id];
      return prompt
         ? { ...pad, soundPrompt: prompt, toneJsConfig: undefined, isLoading: false, error: undefined }
         : pad;
    });

    return {
        pads,
        shellColor: shell.c,
        isTransparent: shell.t,
        stickerUrl: typeof shell.s === 'string' ? shell.s : null
    }

  } catch (error) {
    console.error("Failed to parse sound kit from URL hash:", error);

    if (window.history?.pushState) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    return null;
  }
};
