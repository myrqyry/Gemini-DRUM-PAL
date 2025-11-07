import { useState, useEffect } from 'react';
import { PadConfig } from '../types';

export const useKitManager = (initialPads: PadConfig[]) => {
  const [pads, setPads] = useState<PadConfig[]>(initialPads);
  const [savedKits, setSavedKits] = useState<{ name: string; pads: PadConfig[] }[]>([]);

  useEffect(() => {
    const storedKits = localStorage.getItem('savedKits');
    if (storedKits) {
      setSavedKits(JSON.parse(storedKits));
    }
  }, []);

  const handleSaveKit = (name: string) => {
    const newKits = [...savedKits, { name, pads }];
    setSavedKits(newKits);
    localStorage.setItem('savedKits', JSON.stringify(newKits));
  };

  const handleLoadKit = (loadedPads: PadConfig[]) => {
    setPads(loadedPads.map(p => ({ ...p, toneJsConfig: undefined, isLoading: false, error: undefined })));
  };

  const handleDeleteKit = (name: string) => {
    const newKits = savedKits.filter(kit => kit.name !== name);
    setSavedKits(newKits);
    localStorage.setItem('savedKits', JSON.stringify(newKits));
  };

  return { pads, setPads, savedKits, handleSaveKit, handleLoadKit, handleDeleteKit };
};
