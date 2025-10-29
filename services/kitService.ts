import { PadConfig } from '../types';

export class KitService {
  static generateShareableUrl(pads: PadConfig[]): string {
    const kitData = pads.map(pad => ({ id: pad.id, p: pad.soundPrompt }));
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
}
