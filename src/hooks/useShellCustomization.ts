import { useState, useMemo } from 'react';
import { SHELL_COLORS } from '../constants';

export const useShellCustomization = () => {
  const [shellColorIndex, setShellColorIndex] = useState(0);
  const [isTransparent, setIsTransparent] = useState(false);

  const currentShell = useMemo(() => SHELL_COLORS[shellColorIndex], [shellColorIndex]);

  const handleCycleColor = () => setShellColorIndex((prev) => (prev + 1) % SHELL_COLORS.length);
  const handleToggleStyle = () => setIsTransparent(prev => !prev);

  return {
    shellColorIndex,
    isTransparent,
    currentShell,
    handleCycleColor,
    handleToggleStyle
  };
};
