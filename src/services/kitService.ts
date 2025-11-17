import { PadConfig, ToneJsSoundConfig } from '../types';

const SOUND_CONFIG_CACHE_PREFIX = 'soundConfig_';

/**
 * @class KitService
 * @description A service class for managing drum kits and sound configurations.
 * This class provides static methods for interacting with localStorage to save, load, and delete kits and sound configs.
 * It also includes utility functions for generating shareable URLs and copying text to the clipboard.
 */
export class KitService {
  /**
   * Saves a sound configuration to localStorage.
   * @param {string} prompt - The prompt used to generate the sound, used as part of the cache key.
   * @param {ToneJsSoundConfig} config - The sound configuration to save.
   */
  static saveSoundConfig(prompt: string, config: ToneJsSoundConfig): void {
    try {
      const key = `${SOUND_CONFIG_CACHE_PREFIX}${prompt}`;
      localStorage.setItem(key, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save sound config to localStorage:', error);
    }
  }

  /**
   * Loads a sound configuration from localStorage.
   * @param {string} prompt - The prompt associated with the sound configuration.
   * @returns {ToneJsSoundConfig | null} The loaded sound configuration, or null if not found or an error occurs.
   */
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

  /**
   * Generates a shareable URL containing the current kit and customization data.
   * @param {PadConfig[]} pads - The current configuration of the drum pads.
   * @param {string} shellColor - The current shell color.
   * @param {boolean} isTransparent - The current transparency setting.
   * @param {string | null} stickerUrl - The URL of the current sticker.
   * @returns {string} The generated shareable URL.
   */
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

  /**
   * Copies a string of text to the user's clipboard.
   * @param {string} text - The text to be copied.
   * @returns {Promise<boolean>} A promise that resolves to true if the copy was successful, and false otherwise.
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Saves a drum kit to localStorage.
   * @param {string} kitName - The name of the kit to save.
   * @param {PadConfig[]} pads - The array of pad configurations to be saved as the kit.
   */
  static saveKit(kitName: string, pads: PadConfig[]): void {
    const kits = KitService.loadKits();
    kits[kitName] = pads;
    localStorage.setItem('kits', JSON.stringify(kits));
  }

  /**
   * Loads all saved kits from localStorage.
   * @returns {Record<string, PadConfig[]>} A record of all saved kits, where the key is the kit name.
   */
  static loadKits(): Record<string, PadConfig[]> {
    const kits = localStorage.getItem('kits');
    return kits ? JSON.parse(kits) : {};
  }

  /**
   * Deletes a kit from localStorage.
   * @param {string} kitName - The name of the kit to delete.
   */
  static deleteKit(kitName: string): void {
    const kits = KitService.loadKits();
    delete kits[kitName];
    localStorage.setItem('kits', JSON.stringify(kits));
  }
}
