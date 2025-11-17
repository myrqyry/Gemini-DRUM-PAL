
import React from 'react';

/**
 * @interface ModalProps
 * @description Defines the props for the Modal component.
 * @property {boolean} isOpen - Controls whether the modal is open or closed.
 * @property {() => void} onClose - Callback function to be invoked when the modal is requested to be closed.
 * @property {string} title - The title of the modal, displayed at the top.
 * @property {React.ReactNode} children - The content to be displayed inside the modal.
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * A React functional component that renders a generic modal dialog.
 * The modal includes a backdrop, a close button, and a title.
 *
 * @param {ModalProps} props - The props for the component.
 * @returns {React.FC | null} A component that renders the modal, or null if the modal is not open.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg relative text-gray-100 transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
