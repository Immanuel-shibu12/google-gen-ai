
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md flex-shrink-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white">
          Leg<span className="text-blue-500">AI</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Turn legal jargon into clear, actionable guidance.
        </p>
      </div>
    </header>
  );
};

export default Header;
