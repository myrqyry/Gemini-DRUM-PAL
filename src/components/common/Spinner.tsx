import React from 'react';

/**
 * @interface SpinnerProps
 * @description Defines the props for the Spinner component.
 * @property {'sm' | 'md' | 'lg'} [size='md'] - The size of the spinner. Defaults to 'md'.
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A React functional component that displays a spinning loader.
 *
 * @param {SpinnerProps} props - The props for the component.
 * @returns {React.FC} A component that renders a spinner.
 */
const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent border-white`}
    ></div>
  );
};

export default Spinner;
