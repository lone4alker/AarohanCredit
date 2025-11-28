import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-gray-800 h-1.5 rounded-t-2xl">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-t-2xl transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;