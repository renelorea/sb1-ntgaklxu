import React from 'react';

interface DominoLogoProps {
  className?: string;
}

export const DominoLogo: React.FC<DominoLogoProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="3"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
        opacity="0.7"
      />
      <rect
        x="13"
        y="3"
        width="9"
        height="18"
        rx="2"
        fill="currentColor"
      />
      <circle cx="4.5" cy="6.5" r="1.5" fill="blue" />
      <circle cx="8.5" cy="10.5" r="1.5" fill="blue" />
      <circle cx="4.5" cy="14.5" r="1.5" fill="blue" />
      <circle cx="15.5" cy="6.5" r="1.5" fill="blue" />
      <circle cx="19.5" cy="10.5" r="1.5" fill="blue" />
      <circle cx="15.5" cy="14.5" r="1.5" fill="blue" />
      <circle cx="19.5" cy="14.5" r="1.5" fill="blue" />
    </svg>
  );
};