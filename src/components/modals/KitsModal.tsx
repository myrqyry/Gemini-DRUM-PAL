import React from 'react';
import { PadConfig } from '@/types';

interface KitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedKits: Record<string, PadConfig[]>;
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

const KitsModal: React.FC<KitsModalProps> = ({ isOpen, onClose, savedKits, onSave, onLoad, onDelete }) => {
  if (!isOpen) return null;

  const [kitName, setKitName] = React.useState('');

  const handleSave = () => {
    if (kitName.trim()) {
      onSave(kitName);
      setKitName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Manage Kits</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={kitName}
            onChange={(e) => setKitName(e.target.value)}
            placeholder="New kit name"
            className="border p-2 rounded-l-md"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-r-md">Save Current Kit</button>
        </div>
        <div className="space-y-2">
          {Object.keys(savedKits).map(name => (
            <div key={name} className="flex justify-between items-center p-2 border rounded-md">
              <span>{name}</span>
              <div>
                <button onClick={() => onLoad(name)} className="bg-green-500 text-white p-1 rounded-md mr-2">Load</button>
                <button onClick={() => onDelete(name)} className="bg-red-500 text-white p-1 rounded-md">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white p-2 rounded-md">Close</button>
      </div>
    </div>
  );
};

export default KitsModal;
