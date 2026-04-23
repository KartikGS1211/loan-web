import React from 'react';
import Step1LoanDetails from '../../steps/Step1LoanDetails';
import Step2PersonalInfo from '../../steps/Step2PersonalInfo';
import Step3KYC from '../../steps/Step3KYC';
import Step4Address from '../../steps/Step4Address';
import Step5Employment from '../../steps/Step5Employment';
import Step6CoApplicant from '../../steps/Step6CoApplicant';
import Step7Documents from '../../steps/Step7Documents';
import Step8Review from '../../steps/Step8Review';

const StepRenderer = ({ currentStep }) => {
  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1LoanDetails />;
      case 1: return <Step2PersonalInfo />;
      case 2: return <Step3KYC />;
      case 3: return <Step4Address />;
      case 4: return <Step5Employment />;
      case 5: return <Step6CoApplicant />;
      case 6: return <Step7Documents />;
      case 7: return <Step8Review />;
      default: return <Step1LoanDetails />;
    }
  };

  return (
    <div className="animate-fade-in-up">
      {renderStep()}
    </div>
  );
};

export default StepRenderer;
