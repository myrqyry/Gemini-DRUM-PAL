import React from 'react';

interface DeadPixel {
  id: number;
  style: React.CSSProperties;
}

const DeadPixelsOverlay: React.FC = () => {
  const [pixels, setPixels] = React.useState<DeadPixel[]>([]);

  React.useEffect(() => {
    const newPixels: DeadPixel[] = [];
    for (let i = 0; i < 5; i++) {
      newPixels.push({
        id: i,
        style: {
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: '2px',
          height: '2px',
          backgroundColor: '#3f4738',
        },
      });
    }
    setPixels(newPixels);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pixels.map(pixel => (
        <div key={pixel.id} style={pixel.style} />
      ))}
    </div>
  );
};

export default DeadPixelsOverlay;
