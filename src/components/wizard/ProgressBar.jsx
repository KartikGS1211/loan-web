import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  'Loan Details',
  'Personal',
  'KYC',
  'Address',
  'Employment',
  'Co-applicant',
  'Documents',
  'Review'
];

const ProgressBar = ({ currentStep, skipCoApplicant }) => {
  // We'll calculate percentage based on total active steps
  const totalSteps = skipCoApplicant ? steps.length - 1 : steps.length;
  
  // Helper to map actual step index to visual step index
  const getVisualIndex = (realIndex) => {
    if (!skipCoApplicant) return realIndex;
    return realIndex > 5 ? realIndex - 1 : realIndex;
  };

  // Calculate current visual step index
  const visualCurrentStep = getVisualIndex(currentStep);
  
  const progressPercentage = (visualCurrentStep / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-indigo-700">
          Step {visualCurrentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm font-bold text-slate-700 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
          {Math.round(progressPercentage)}% Completed
        </span>
      </div>
      
      <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Optional: Step dots for desktop */}
      <div className="hidden md:flex justify-between mt-4">
        {steps.map((label, index) => {
          if (skipCoApplicant && index === 5) return null; // Hide co-applicant step completely
          
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const visualIndex = getVisualIndex(index);
          
          return (
            <div key={label} className="flex flex-col items-center relative z-10 w-16">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 shadow-sm border-2 ${
                isCompleted ? 'bg-indigo-600 text-white border-indigo-600' : 
                isCurrent ? 'bg-white text-indigo-600 border-indigo-600 ring-4 ring-indigo-100' : 
                'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                {isCompleted ? <Check size={16} /> : (visualIndex + 1)}
              </div>
              <span className={`text-xs mt-2 font-medium text-center ${
                isCurrent ? 'text-indigo-700' : 
                isCompleted ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
