import React from 'react';
import { useToy } from './hooks/useToy';
import { DrumMachineLayout } from './components/DrumMachineLayout';
import { parseKitFromUrl } from './utils/urlHelpers';
import { soundEngine } from './services/audioService';
import { toyConfig } from './config/toy.config';

const App: React.FC = () => {
  const initialPads = parseKitFromUrl() || toyConfig.initialPads;
  const toy = useToy(toyConfig, soundEngine, initialPads);

  return <DrumMachineLayout toy={toy} />;
};

export default App;
