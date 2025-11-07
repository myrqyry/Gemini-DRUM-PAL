import React from 'react';
import { useAppState } from './hooks/useAppState';
import { useShellCustomization } from './hooks/useShellCustomization';
import { useStickerCustomization } from './hooks/useStickerCustomization';
import { useAudioManager } from './hooks/useAudioManager';
import { useKitManager } from './hooks/useKitManager';
import { usePadInteraction } from './hooks/usePadInteraction';
import { DrumMachineLayout } from './components/DrumMachineLayout';
import { parseKitFromUrl } from './utils/urlHelpers';

const App: React.FC = () => {
  const appState = useAppState();
  const shellCustomization = useShellCustomization();
  const stickerCustomization = useStickerCustomization();
  const audioManager = useAudioManager();
  const kitManager = useKitManager(parseKitFromUrl());
  const padInteraction = usePadInteraction({ appState, audioManager, kitManager });

  return (
    <DrumMachineLayout
      appState={appState}
      shellCustomization={shellCustomization}
      stickerCustomization={stickerCustomization}
      audioManager={audioManager}
      kitManager={kitManager}
      padInteraction={padInteraction}
    />
  );
};

export default App;
