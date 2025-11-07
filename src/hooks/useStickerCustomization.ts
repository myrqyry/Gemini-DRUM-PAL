import { useState, useCallback, useEffect } from 'react';
import { SecurityUtils } from '../utils/security';

export const useStickerCustomization = () => {
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [stickerClickCount, setStickerClickCount] = useState(0);
  const [stickerUrlInput, setStickerUrlInput] = useState('');
  const [stickerRotation, setStickerRotation] = useState(0);
  const [stickerScale, setStickerScale] = useState(1);

  useEffect(() => {
    const storedStickerTransform = localStorage.getItem('stickerTransform');
    if (storedStickerTransform) {
      const { rotation, scale } = JSON.parse(storedStickerTransform);
      setStickerRotation(rotation);
      setStickerScale(scale);
    }
  }, []);

  const handleStickerTrigger = useCallback((appState: string) => {
    if (appState === 'OFF' || appState === 'BOOTING' || appState === 'GENERATING') return null;
    const newCount = stickerClickCount + 1;
    setStickerClickCount(newCount);
    return newCount >= 5 ? 'STICKER_PROMPT' : null;
  }, [stickerClickCount]);

  const handleStickerUrlSubmit = useCallback((onSuccess: (msg: string) => void, onError: (msg: string) => void) => {
    const sanitizedUrl = SecurityUtils.sanitizeUrl(stickerUrlInput);
    if (sanitizedUrl) {
      setStickerUrl(sanitizedUrl);
      onSuccess("STICKER LOADED!");
    } else {
      onError("INVALID URL");
    }
    setStickerUrlInput('');
    setStickerClickCount(0);
  }, [stickerUrlInput]);

  const handleStickerTransformChange = useCallback((rotation: number, scale: number) => {
    setStickerRotation(rotation);
    setStickerScale(scale);
    localStorage.setItem('stickerTransform', JSON.stringify({ rotation, scale }));
  }, []);

  return {
    stickerUrl,
    stickerClickCount,
    stickerUrlInput,
    stickerRotation,
    stickerScale,
    setStickerUrlInput,
    handleStickerTrigger,
    handleStickerUrlSubmit,
    handleStickerTransformChange
  };
};
