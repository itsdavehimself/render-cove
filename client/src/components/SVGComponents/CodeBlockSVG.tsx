import React from 'react';

const CodeBlockSVG: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      height="1.5rem"
      width="1.5rem"
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="64 32 32 64 64 96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="104 32 136 64 104 96"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M176,48h24a8,8,0,0,1,8,8V200a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V136"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
};

export default CodeBlockSVG;
