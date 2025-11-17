import React from 'react';

/**
 * @interface ToySelectorProps
 * @description Defines the props for the ToySelector component.
 * @property {(toy: string) => void} onSelectToy - Callback function to be invoked when a toy is selected.
 */
interface ToySelectorProps {
  onSelectToy: (toy: string) => void;
}

/**
 * A React functional component that allows the user to select a toy.
 *
 * @param {ToySelectorProps} props - The props for the component.
 * @returns {React.FC} A component that renders the toy selector.
 */
const ToySelector: React.FC<ToySelectorProps> = ({ onSelectToy }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-8">Choose Your Toy</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="p-8 border rounded-lg cursor-pointer hover:bg-gray-800"
          onClick={() => onSelectToy('DrumPal')}
        >
          <h2 className="text-2xl">DrumPal</h2>
          <p>The original 90s drum machine keychain.</p>
        </div>
      </div>
    </div>
  );
};

export default ToySelector;
