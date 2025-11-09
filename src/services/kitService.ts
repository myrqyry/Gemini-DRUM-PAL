import { PadConfig, ToneJsSoundConfig } from '../types';

const SOUND_CONFIG_CACHE_PREFIX = 'soundConfig_';

export class KitService {
  static saveSoundConfig(prompt: string, config: ToneJsSoundConfig): void {
    try {
      const key = `${SOUND_CONFIG_CACHE_PREFIX}${prompt}`;
      localStorage.setItem(key, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save sound config to localStorage:', error);
    }
  }

  static loadSoundConfig(prompt: string): ToneJsSoundConfig | null {
    try {
      const key = `${SOUND_CONFIG_CACHE_PREFIX}${prompt}`;
      const cachedConfig = localStorage.getItem(key);
      return cachedConfig ? JSON.parse(cachedConfig) : null;
    } catch (error) {
      console.error('Failed to load sound config from localStorage:', error);
      return null;
    }
  }

  static generateShareableUrl(
    pads: PadConfig[],
    shellColor: string,
    isTransparent: boolean,
    stickerUrl: string | null
  ): string {
    const kitData = {
      pads: pads.map(pad => ({ id: pad.id, p: pad.soundPrompt })),
      shell: {
        c: shellColor,
        t: isTransparent,
        s: stickerUrl,
      },
    };
    const json = JSON.stringify(kitData);
    const base64 = btoa(json);
    return `${window.location.origin}${window.location.pathname}#${base64}`;
  }

  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  static saveKit(kitName: string, pads: PadConfig[]): void {
    const kits = KitService.loadKits();
    kits[kitName] = pads;
    localStorage.setItem('kits', JSON.stringify(kits));
  }

  static loadKits(): Record<string, PadConfig[]> {
    const kits = localStorage.getItem('kits');
    return kits ? JSON.parse(kits) : {};
  }

  static deleteKit(kitName: string): void {
    const kits = KitService.loadKits();
    delete kits[kitName];
    localStorage.setItem('kits', JSON.stringify(kits));
  }
}
