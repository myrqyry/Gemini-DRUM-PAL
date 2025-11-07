import React from 'react';

interface StickerProps {
  imageUrl: string;
  rotation: number;
  scale: number;
}

const Sticker: React.FC<StickerProps> = ({ imageUrl, rotation, scale }) => {
  return (
    <div
      className="absolute bottom-24 right-4 w-20 h-20 bg-white p-1 shadow-lg transition-all duration-300 border-2 border-gray-200"
      style={{
        boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      <img
        src={imageUrl}
        alt="User sticker"
        className="w-full h-full object-cover"
        style={{
            filter: 'sepia(0.2) brightness(1.05) contrast(0.95)',
        }}
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
    </div>
  );
};

export default Sticker;