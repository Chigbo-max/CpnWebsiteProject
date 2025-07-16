import React from 'react';
import cpnBanner from '../assets/ChristianProfessionalsNetwork.png';

const LoadingSpinner = ({ message = "Loading...", overlay = false }) => {
  return (
    <div className={
      overlay
        ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        : "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    }>
      <div className="flex flex-col items-center justify-center w-full">
        {/* Animated Logo Container */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Pulse Ring Effect */}
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          {/* Logo with Bounce Animation */}
          <div className="relative animate-bounce flex items-center justify-center">
            <img 
              src={cpnBanner} 
              alt="CPN Logo" 
              className="w-40 h-40 object-contain drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(245, 158, 66, 0.3))'
              }}
            />
          </div>
          {/* Rotating Border */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin"></div>
        </div>
        {/* Loading Text */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Christian Professionals Network</h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-400 text-sm mt-4">{message}</p>
        </div>
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 