import React from 'react';

/**
 * Renders a single circuit trace.
 * @param {object} props - The component props.
 * @param {string} props.className - The CSS classes to apply to the trace.
 * @returns {React.FC} A Trace component.
 */
const Trace = ({ className }: { className: string }) => <div className={`absolute bg-green-900/40 ${className}`} />;
/**
 * Renders a computer chip.
 * @param {object} props - The component props.
 * @param {string} props.className - The CSS classes to apply to the chip.
 * @param {React.ReactNode} [props.children] - Optional children to render inside the chip.
 * @returns {React.FC} A Chip component.
 */
const Chip = ({ className, children }: { className: string; children?: React.ReactNode }) => <div className={`absolute bg-black/80 border border-gray-900/80 rounded-sm flex items-center justify-center ${className}`}>{children}</div>;
/**
 * Renders a resistor component.
 * @param {object} props - The component props.
 * @param {string} props.className - The CSS classes to apply to the resistor.
 * @returns {React.FC} A Resistor component.
 */
const Resistor = ({ className }: { className: string }) => (
    <div className={`absolute flex items-center justify-around w-4 h-[6px] rounded-sm bg-stone-500/50 ${className}`}>
        <div className="w-[1px] h-full bg-yellow-600/70"></div>
        <div className="w-[1px] h-full bg-red-600/70"></div>
        <div className="w-[1px] h-full bg-blue-600/70"></div>
    </div>
);
/**
 * Renders a capacitor component.
 * @param {object} props - The component props.
 * @param {string} props.className - The CSS classes to apply to the capacitor.
 * @returns {React.FC} A Capacitor component.
 */
const Capacitor = ({ className }: { className: string }) => <div className={`absolute rounded-full bg-orange-700/80 border border-black/50 ${className}`} />;
/**
 * Renders a solder pad.
 * @param {object} props - The component props.
 * @param {string} props.className - The CSS classes to apply to the solder pad.
 * @returns {React.FC} A SolderPad component.
 */
const SolderPad = ({ className }: { className: string }) => <div className={`absolute rounded-full bg-gray-500/50 ${className}`} />;

/**
 * A React functional component that renders a decorative circuit board background.
 * This component is purely for visual effect and does not have any interactive functionality.
 *
 * @returns {React.FC} A component that renders the circuit board.
 */
const CircuitBoard = () => {
  return (
    // Positioned in the lower part of the device
    <div className="absolute left-[8%] right-[8%] bottom-[5%] h-[55%] rounded-lg overflow-hidden -z-10">
      {/* Main Bus Traces */}
      <Trace className="h-[2px] w-full top-10 left-0" />
      <Trace className="h-full w-[2px] top-0 left-12" />
      <Trace className="h-full w-[2px] top-0 right-24" />
      <Trace className="h-[2px] w-3/4 bottom-24 left-1/4" />
      
      {/* Chips */}
      <Chip className="w-16 h-20 top-16 left-20">
        <div className="w-2 h-2 rounded-full border border-gray-600/50"></div>
      </Chip>
      <Chip className="w-12 h-12 bottom-12 right-8" />
      <Chip className="w-10 h-10 top-24 left-8" />

      {/* Components */}
      <Resistor className="top-8 right-12 transform rotate-45" />
      <Resistor className="bottom-16 left-24 transform -rotate-30" />
      <Capacitor className="w-4 h-4 bottom-8 right-32" />
      <Capacitor className="w-3 h-3 top-16 left-8" />

      {/* Fine Traces & Connections */}
      <Trace className="h-[1px] w-20 top-20 left-0" />
      <Trace className="h-12 w-[1px] top-20 left-20" />
      <Trace className="h-[1px] w-16 top-32 right-0" />
      <Trace className="h-24 w-[1px] top-32 right-16" />
      <Trace className="h-16 w-[1px] bottom-10 left-32" />
      <Trace className="h-[1px] w-24 bottom-16 left-0" />
      <Trace className="h-12 w-[1px] bottom-16 left-24" />
      
      {/* Solder Pads (Vias) */}
      <SolderPad className="w-2 h-2 top-10 left-12" />
      <SolderPad className="w-2 h-2 top-10 left-20" />
      <SolderPad className="w-2 h-2 top-36 right-24" />
      <SolderPad className="w-2 h-2 top-48 left-12" />
      <SolderPad className="w-2 h-2 bottom-12 right-1/2" />
      <SolderPad className="w-2 h-2 bottom-24 left-12" />
    </div>
  );
};

export default CircuitBoard;