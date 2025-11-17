import React from 'react';

/**
 * @interface StickerProps
 * @description Defines the props for the Sticker component.
 * @property {string} imageUrl - The URL of the image to be displayed as a sticker.
 * @property {number} rotation - The rotation of the sticker in degrees.
 * @property {number} scale - The scale of the sticker.
 */
interface StickerProps {
  imageUrl: string;
  rotation: number;
  scale: number;
}

/**
 * A React functional component that displays a sticker with a configurable image, rotation, and scale.
 * It includes a vintage photo filter and an error handler to hide the image if it fails to load.
 *
 * @param {StickerProps} props - The props for the component.
 * @returns {React.FC} A component that renders the sticker.
 */
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