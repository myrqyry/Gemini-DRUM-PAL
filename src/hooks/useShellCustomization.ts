import { useState, useMemo, useCallback } from 'react';
import { THEMES } from '../themes';
import { PRESET_STICKERS } from '../constants';

export const useShellCustomization = () => {
  const [themeIndex, setThemeIndex] = useState(0);

  const currentTheme = useMemo(() => THEMES[themeIndex], [themeIndex]);

  const handleCycleTheme = useCallback(() => {
    setThemeIndex(prev => (prev + 1) % THEMES.length);
  }, []);

  const handleSetTheme = useCallback((themeName: string) => {
    const index = THEMES.findIndex(theme => theme.name === themeName);
    if (index !== -1) {
      setThemeIndex(index);
    }
  }, []);

  const shellColor = useMemo(() => {
    return currentTheme.shellColor
  }, [currentTheme]);

  const isTransparent = useMemo(() => {
    return currentTheme.isTransparent
  }, [currentTheme]);

  const stickerUrl = useMemo(() => {
    return currentTheme.stickerSet ? PRESET_STICKERS[currentTheme.stickerSet] : null;
  }, [currentTheme]);


  return {
    shellColor,
    isTransparent,
    stickerUrl,
    handleCycleTheme,
    handleSetTheme,
  };
};
