import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const StepNavigation = ({ currentStep, totalSteps, onBack, onContinue, isSubmitting }) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 0 || isSubmitting}
        className={`flex items-center gap-2 btn-secondary ${currentStep === 0 ? 'invisible' : ''}`}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <button
        type="button"
        onClick={onContinue}
        disabled={isSubmitting}
        className="flex items-center gap-2 btn-primary group"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : currentStep === totalSteps - 1 ? (
          <>
            Submit Application
            <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  );
};

export default StepNavigation;
