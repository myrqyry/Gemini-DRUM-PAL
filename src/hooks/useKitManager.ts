import { useState, useEffect } from 'react';
import { PadConfig } from '../types';
import { KitService } from '../services/kitService';

/**
 * @function useKitManager
 * @description A custom hook for managing drum kits.
 * This hook handles the state and logic for pads, including saving, loading, and deleting kits.
 * It interacts with `KitService` to persist kit data.
 *
 * @param {PadConfig[]} initialPads - The initial configuration of the drum pads.
 * @returns {{
 *   pads: PadConfig[],
 *   setPads: React.Dispatch<React.SetStateAction<PadConfig[]>>,
 *   savedKits: Record<string, PadConfig[]>,
 *   handleSaveKit: (name: string) => void,
 *   handleLoadKit: (kitName: string) => void,
 *   handleDeleteKit: (name: string) => void
 * }} An object containing the current pads state, functions to manage kits, and the list of saved kits.
 */
export const useKitManager = (initialPads: PadConfig[]) => {
  const [pads, setPads] = useState<PadConfig[]>(initialPads);
  const [savedKits, setSavedKits] = useState<Record<string, PadConfig[]>>({});

  useEffect(() => {
    setSavedKits(KitService.loadKits());
  }, []);

  const handleSaveKit = (name: string) => {
    KitService.saveKit(name, pads);
    setSavedKits(KitService.loadKits());
  };

  const handleLoadKit = (kitName: string) => {
    const kit = savedKits[kitName];
    if (kit) {
      setPads(kit.map(p => ({ ...p, toneJsConfig: undefined, isLoading: false, error: undefined })));
    }
  };

  const handleDeleteKit = (name: string) => {
    KitService.deleteKit(name);
    setSavedKits(KitService.loadKits());
  };

  return { pads, setPads, savedKits, handleSaveKit, handleLoadKit, handleDeleteKit };
};
