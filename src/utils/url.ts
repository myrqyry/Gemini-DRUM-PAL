
import { PadConfig } from '@/types';

export const parseKitFromUrl = (
  callback: (
    pads: PadConfig[],
    shellColor: string,
    isTransparent: boolean,
    stickerUrl: string | null
  ) => void
) => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    try {
      const json = atob(hash);
      const kitData = JSON.parse(json);
      const pads = kitData.pads.map((pad: any) => ({
        id: pad.id,
        soundPrompt: pad.p,
      }));
      callback(
        pads,
        kitData.shell.c,
        kitData.shell.t,
        kitData.shell.s
      );
    } catch (error) {
      console.error('Failed to parse kit from URL:', error);
    }
  }
};
