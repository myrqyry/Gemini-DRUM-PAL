import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useShellCustomization } from './hooks/useShellCustomization';
import { useStickerCustomization } from './hooks/useStickerCustomization';
import { useAudioManager } from './hooks/useAudioManager';
import { useKitManager } from './hooks/useKitManager';
import { usePadInteraction } from './hooks/usePadInteraction';
import CircuitBoard from './components/ui/CircuitBoard';
import Sticker from './components/ui/Sticker';
import KitsModal from './components/KitsModal';
import PowerIcon from './components/icons/PowerIcon';
import LcdScreen from './components/common/LcdScreen';
import DrumPad from './components/common/DrumPad';
import DrumMachineControls from './components/controls/DrumMachineControls';
import MetronomeControls from './components/controls/MetronomeControls';
import SpeakerGrill from './components/ui/SpeakerGrill';
import SoundGenerationErrorBoundary from '../components/error/SoundGenerationErrorBoundary';
import { PAD_LAYOUT_ORDER } from '../constants';
import { KeyboardShortcutsOverlay } from './KeyboardShortcutsOverlay';

interface DrumMachineLayoutProps {
  appState: ReturnType<typeof useAppState>;
  shellCustomization: ReturnType<typeof useShellCustomization>;
  stickerCustomization: ReturnType<typeof useStickerCustomization>;
  audioManager: ReturnType<typeof useAudioManager>;
  kitManager: ReturnType<typeof useKitManager>;
  padInteraction: ReturnType<typeof usePadInteraction>;
}

export const DrumMachineLayout: React.FC<DrumMachineLayoutProps> = ({
  appState,
  shellCustomization,
  stickerCustomization,
  audioManager,
  kitManager,
  padInteraction,
}) => {
  const {
    appState: currentState,
    lcdMessage,
    promptValue,
    onPromptChange,
    handleMenuButtonClick,
    handlePowerOn,
    isPoweredOn,
    isMenuMode,
  } = appState;
  const {
    isTransparent,
    currentShell,
    handleCycleColor,
    handleToggleStyle,
    textInsetClass,
  } = shellCustomization;
  const {
    stickerUrl,
    stickerRotation,
    stickerScale,
    handleStickerTrigger,
    stickerUrlInput,
    onStickerUrlChange,
    onStickerUrlSubmit,
    onStickerTransformChange,
  } = stickerCustomization;
  const { playSound, isTicking, bpm, setBpm, isMetronomeOn, setIsMetronomeOn } =
    audioManager;
  const { pads, savedKits, handleSaveKit, handleLoadKit, handleDeleteKit } =
    kitManager;
  const {
    handlePadClick,
    selectedPadId,
    hotPads,
    recordingState,
    handleRecord,
    handlePlay,
    handleStop,
    recordedSequence,
  } = padInteraction;

  const keychainClasses = `keychain-body relative w-[340px] h-[560px] sm:w-[360px] sm:h-[600px] rounded-[40px] p-4 sm:p-6 shadow-2xl transition-all duration-300 border-4 border-black/30 flex flex-col items-center justify-between ${
    isTransparent ? 'transparent-mode' : currentShell.solidClass
  }`;
  const keychainStyle = isTransparent
    ? { backgroundColor: currentShell.transparentRgba }
    : {};

  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' || event.key === '/') {
        event.preventDefault();
        setShowKeyboardHelp((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={keychainClasses} style={keychainStyle}>
      {isTransparent && <CircuitBoard />}
      {stickerUrl && (
        <Sticker
          imageUrl={stickerUrl}
          rotation={stickerRotation}
          scale={stickerScale}
        />
      )}

      <KeyboardShortcutsOverlay
        isVisible={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />

      <KitsModal
        isOpen={false}
        onClose={() => {}}
        savedKits={savedKits}
        onSave={handleSaveKit}
        onLoad={handleLoadKit}
        onDelete={handleDeleteKit}
      />

      <div className="absolute top-5 left-6 flex items-center space-x-2">
        <button
          onClick={handlePowerOn}
          disabled={isPoweredOn}
          className="text-gray-900/70 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Power on"
        >
          <PowerIcon className="w-5 h-5" />
        </button>
        <div
          className={`w-3 h-3 rounded-full border-2 border-black/30 ${
            isPoweredOn ? 'bg-red-600 animate-pulse' : 'bg-gray-700'
          }`}
        ></div>
      </div>
      <div
        onClick={handleStickerTrigger}
        className="absolute top-5 right-10 text-black/50 font-bold text-xs transform -rotate-12 cursor-pointer select-none transition-transform active:scale-90"
      >
        MODEL-G
      </div>

      <div className="w-full flex flex-col items-center mt-10">
        <LcdScreen
          appState={currentState}
          message={lcdMessage}
          promptValue={promptValue}
          onPromptChange={onPromptChange}
          activeAnimation={null}
          selectedPadName={
            pads.find((p) => p.id === selectedPadId)?.name || ''
          }
          onCycleColor={handleCycleColor}
          onToggleStyle={handleToggleStyle}
          currentColorName={currentShell.name}
          isTransparent={isTransparent}
          stickerUrlInput={stickerUrlInput}
          onStickerUrlChange={onStickerUrlChange}
          onStickerUrlSubmit={onStickerUrlSubmit}
          stickerRotation={stickerRotation}
          stickerScale={stickerScale}
          onStickerTransformChange={onStickerTransformChange}
          soundModel={'DEFAULT'}
          onSoundModelChange={() => {}}
        />
      </div>

      <SoundGenerationErrorBoundary
        onError={(error) =>
          appState.showTemporaryMessage(`ERROR: ${error.message}`, 2000, 'IDLE')
        }
      >
        <div className="grid grid-cols-3 w-full max-w-xs sm:max-w-sm place-items-center gap-x-2 gap-y-1">
          {PAD_LAYOUT_ORDER.map((padId, index) => {
            if (!padId)
              return (
                <div key={`empty-${index}`} className="w-16 h-16 sm:w-20 sm:h-20" />
              );
            const pad = pads.find((p) => p.id === padId);
            if (!pad) return null;

            return (
              <DrumPad
                key={pad.id}
                padConfig={pad}
                onClick={handlePadClick}
                isSelected={selectedPadId === pad.id}
                disabled={!isPoweredOn}
                isTransparent={isTransparent}
                textColor={currentShell.textColor}
                textInsetClass={textInsetClass}
                isKeyPressed={!!hotPads[pad.id]}
              />
            );
          })}
        </div>
      </SoundGenerationErrorBoundary>

      <div className="w-full flex justify-between items-end pt-4 border-t-2 border-black/10">
        <DrumMachineControls
          isPoweredOn={isPoweredOn}
          isMenuMode={isMenuMode}
          appState={currentState}
          recordingState={recordingState}
          getMenuButtonClasses={() => ''}
          handleMenuButtonClick={handleMenuButtonClick}
          handleShareKit={() => {}}
          setIsKitsModalOpen={() => {}}
          handleRecord={handleRecord}
          handlePlay={handlePlay}
          handleStop={handleStop}
          recordedSequence={recordedSequence}
        />
        <MetronomeControls
          isPoweredOn={isPoweredOn}
          isMetronomeOn={isMetronomeOn}
          bpm={bpm}
          isTicking={isTicking}
          setIsMetronomeOn={setIsMetronomeOn}
          setBpm={setBpm}
        />

        <SpeakerGrill isPoweredOn={isPoweredOn} isTransparent={isTransparent} />
      </div>
      <button
        onClick={() => setShowKeyboardHelp(true)}
        className="absolute bottom-5 left-6 text-xs text-gray-600 hover:text-gray-800"
        aria-label="Show keyboard shortcuts"
      >
        Press ? for help
      </button>
    </div>
  );
};
