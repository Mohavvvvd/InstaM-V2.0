// src/components/ChatIcon.js
import React from 'react';

const ChatIcon = ({ size = 24, color = "#3498db" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Speech bubble */}
    <path 
      d="M85 15H15C10 15 5 20 5 25V85L25 65H85C90 65 95 60 95 55V25C95 20 90 15 85 15Z" 
      fill={color}
    />
    
    {/* Text lines */}
    <path 
      d="M30 35H70M30 45H50" 
      stroke="white" 
      strokeWidth="5" 
      strokeLinecap="round"
    />
    
    {/* Lightning bolt */}
    <path 
      d="M65 15L35 55H50L45 85L75 45H60L65 15Z" 
      fill="#FFD700"
    />
  </svg>
);

export default ChatIcon;