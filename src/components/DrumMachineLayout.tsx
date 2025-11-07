import React, { useState, useEffect } from 'react';
import CircuitBoard from './ui/CircuitBoard';
import Sticker from './ui/Sticker';
import KitsModal from './KitsModal';
import PowerIcon from './icons/PowerIcon';
import LcdScreen from './common/LcdScreen';
import DrumPad from './common/DrumPad';
import DrumMachineControls from './controls/DrumMachineControls';
import MetronomeControls from './controls/MetronomeControls';
import SpeakerGrill from './ui/SpeakerGrill';
import SoundGenerationErrorBoundary from './error/SoundGenerationErrorBoundary';
import { PAD_LAYOUT_ORDER } from '../constants';
import { KeyboardShortcutsOverlay } from './KeyboardShortcutsOverlay';

import { useToy } from '../hooks/useToy';
interface DrumMachineLayoutProps {
  toy: ReturnType<typeof useToy>;
}

export const DrumMachineLayout: React.FC<DrumMachineLayoutProps> = ({ toy }) => {
  const {
    state,
    actions,
    pads,
    hotPads,
    isTicking,
    currentShell,
    handlePowerOn,
    handlePadClick,
    handleMenuButtonClick,
    handleCycleColor,
    handleToggleStyle,
    handleStickerTrigger,
    handleStickerUrlSubmit,
    handleShareKit,
    handleStickerTransformChange,
    recordingState,
    handleRecord,
    handlePlay,
    handleStop,
    recordedSequence,
    savedKits,
    handleSaveKit,
    handleLoadKit,
    handleDeleteKit,
  } = toy;

  const {
    power,
    mode,
    ui,
    audio,
    customization
  } = state;

  const {
    lcdMessage,
    selectedPadId,
    activeAnimation,
    isKitsModalOpen,
    promptInputValue,
    stickerUrlInput,
  } = ui;

  const {
    bpm,
    isMetronomeOn
  } = audio;

  const {
    isTransparent,
    stickerUrl,
    stickerRotation,
    stickerScale,
    soundModel
  } = customization;

  const {
    setBpm,
    setIsMetronomeOn
  } = actions;

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
        isOpen={isKitsModalOpen}
        onClose={() => actions.updateUi({ isKitsModalOpen: false })}
        savedKits={savedKits}
        onSave={handleSaveKit}
        onLoad={handleLoadKit}
        onDelete={handleDeleteKit}
      />

      <div className="absolute top-5 left-6 flex items-center space-x-2">
        <button
          onClick={handlePowerOn}
          disabled={power !== 'OFF'}
          className="text-gray-900/70 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Power on"
        >
          <PowerIcon className="w-5 h-5" />
        </button>
        <div
          className={`w-3 h-3 rounded-full border-2 border-black/30 ${
            power !== 'OFF' ? 'bg-red-600 animate-pulse' : 'bg-gray-700'
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
          appState={mode}
          message={lcdMessage}
          promptValue={promptInputValue}
          onPromptChange={(value) => actions.updateUi({ promptInputValue: value })}
          activeAnimation={activeAnimation}
          selectedPadName={
            pads.find((p) => p.id === selectedPadId)?.name || ''
          }
          onCycleColor={handleCycleColor}
          onToggleStyle={handleToggleStyle}
          currentColorName={currentShell.name}
          isTransparent={isTransparent}
          stickerUrlInput={stickerUrlInput}
          onStickerUrlChange={(value) => actions.updateUi({ stickerUrlInput: value })}
          onStickerUrlSubmit={handleStickerUrlSubmit}
          stickerRotation={stickerRotation}
          stickerScale={stickerScale}
          onStickerTransformChange={handleStickerTransformChange}
          soundModel={soundModel}
          onSoundModelChange={(model) => actions.updateCustomization({ soundModel: model })}
        />
      </div>

      <SoundGenerationErrorBoundary
        onError={(error) =>
          actions.showTemporaryMessage(`ERROR: ${error.message}`, 2000, 'IDLE')
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
                onClick={() => handlePadClick(pad.id)}
                isSelected={selectedPadId === pad.id}
                disabled={power === 'OFF' || mode === 'GENERATING'}
                isTransparent={isTransparent}
                textColor={currentShell.textColor}
                textInsetClass={currentShell.textInsetClass}
                isKeyPressed={!!hotPads[pad.id]}
              />
            );
          })}
        </div>
      </SoundGenerationErrorBoundary>

      <div className="w-full flex justify-between items-end pt-4 border-t-2 border-black/10">
        <DrumMachineControls
          power={power}
          mode={mode}
          recordingState={recordingState}
          handleMenuButtonClick={handleMenuButtonClick}
          handleShareKit={handleShareKit}
          setIsKitsModalOpen={(isOpen) => actions.updateUi({ isKitsModalOpen: isOpen })}
          handleRecord={handleRecord}
          handlePlay={handlePlay}
          handleStop={handleStop}
          recordedSequence={recordedSequence}
        />
        <MetronomeControls
          isPoweredOn={power !== 'OFF'}
          isMetronomeOn={isMetronomeOn}
          bpm={bpm}
          isTicking={isTicking}
          setIsMetronomeOn={setIsMetronomeOn}
          setBpm={setBpm}
        />

        <SpeakerGrill isPoweredOn={power !== 'OFF'} isTransparent={isTransparent} />
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
