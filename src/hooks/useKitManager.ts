import { useState, useEffect } from 'react';
import { PadConfig } from '../types';
import { KitService } from '../services/kitService';

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
