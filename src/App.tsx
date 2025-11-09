import React, { useState } from 'react';
import { DrumPal } from './toys/DrumPal/DrumPal';
import ToySelector from './components/ToySelector';

const App: React.FC = () => {
  const [selectedToy, setSelectedToy] = useState<string | null>(null);

  if (!selectedToy) {
    return <ToySelector onSelectToy={setSelectedToy} />;
  }

  return <DrumPal />;
};

export default App;
