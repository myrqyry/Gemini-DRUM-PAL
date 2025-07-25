
import React from 'react';

interface CogIconProps {
  className?: string;
}

const CogIcon: React.FC<CogIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.948 1.567L9.049 4.63c-.56.126-1.104.33-1.612.599L4.99 4.098a1.875 1.875 0 0 0-2.338 1.168L1.442 7.76a1.875 1.875 0 0 0 .736 2.29l1.458.972a5.248 5.248 0 0 0 0 1.956l-1.458.972a1.875 1.875 0 0 0-.736 2.29l1.21 2.492a1.875 1.875 0 0 0 2.338 1.168l2.448-1.13c.508.27.953.475 1.612.6l.081.823c.249.904 1.03.1.567 1.948h3.844c.917 0 1.699-.663 1.948-1.567l.081-.823c.56-.126 1.104-.33 1.612-.599l2.448 1.13a1.875 1.875 0 0 0 2.338-1.168l1.21-2.492a1.875 1.875 0 0 0-.736-2.29l-1.458-.972a5.248 5.248 0 0 0 0-1.956l1.458-.972a1.875 1.875 0 0 0 .736-2.29l-1.21-2.492a1.875 1.875 0 0 0-2.338-1.168L16.56 4.63c-.508-.27-.953-.475-1.612-.6l-.081-.823C14.61 2.913 13.828 2.25 12.922 2.25H11.078ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" clipRule="evenodd" />
  </svg>
);

export default CogIcon;
