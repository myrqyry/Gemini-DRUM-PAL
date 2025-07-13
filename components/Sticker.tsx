import React from 'react';

interface StickerProps {
  imageUrl: string;
}

const Sticker: React.FC<StickerProps> = ({ imageUrl }) => {
  return (
    <div
      className="absolute bottom-24 right-4 w-20 h-20 bg-white p-1 shadow-lg transform -rotate-[15deg] transition-all duration-300 border-2 border-gray-200"
      style={{
        boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      <img
        src={imageUrl}
        alt="User sticker"
        className="w-full h-full object-cover"
        style={{
            filter: 'sepia(0.2) brightness(1.05) contrast(0.95)',
        }}
        // In a real app, you'd want more robust error handling
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
    </div>
  );
};

export default Sticker;