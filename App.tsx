import React, { useState } from 'react';
import { ToySelector } from './src/components/ToySelector';
import { ToyPlugin } from './src/core/types/toyTypes';
import { drumMachineConfig } from './src/toys/drumMachine/config';
import DrumMachine from './src/toys/drumMachine/DrumMachine';
import { synthesizerToyConfig } from './src/toys/synthesizer/config';
import Synthesizer from './src/toys/synthesizer/Synthesizer';
import { useAudioManager } from './src/core/hooks/useAudioManager';

const App: React.FC = () => {
  const { playSound } = useAudioManager();
  
  const availableToys: ToyPlugin[] = [
    { config: drumMachineConfig, component: DrumMachine, soundEngine: { playSound } },
    { config: synthesizerToyConfig, component: Synthesizer, soundEngine: { playSound } },
  ];

  const [selectedToyId, setSelectedToyId] = useState('drum-machine');
  const currentToy = availableToys.find(toy => toy.config.id === selectedToyId)!;
  const ToyComponent = currentToy.component;

  return (
    <div className="app-container">
      <ToySelector
        availableToys={availableToys}
        selectedToyId={selectedToyId}
        onToyChange={setSelectedToyId}
      />
      <ToyComponent
        config={currentToy.config}
        soundEngine={currentToy.soundEngine}
      />
    </div>
  );
};

export default App;
