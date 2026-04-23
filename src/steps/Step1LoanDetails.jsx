import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { calculateEMI } from '../utils/emicalculator';

const Step1LoanDetails = () => {
  const { watch } = useFormContext();
  const amount = watch('loanAmount');
  const tenure = watch('loanTenure');
  
  // Assuming a standard interest rate of 10.5% for preview
  const emiPreview = calculateEMI(amount, 10.5, tenure);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Loan Details</h2>
        <p className="text-slate-500 mt-1">Tell us how much you need and your preferred timeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Loan Amount (₹)" 
          name="loanAmount" 
          type="number" 
          placeholder="e.g., 500000" 
        />
        <Input 
          label="Tenure (Months)" 
          name="loanTenure" 
          type="number" 
          placeholder="e.g., 24" 
        />
      </div>

      <Select 
        label="Loan Type" 
        name="loanType" 
        options={[
          { value: 'personal', label: 'Personal Loan' },
          { value: 'home', label: 'Home Loan' },
          { value: 'auto', label: 'Auto Loan' },
          { value: 'education', label: 'Education Loan' },
        ]} 
      />

      {amount > 0 && tenure > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-indigo-900 font-semibold text-lg">Estimated EMI</h3>
            <p className="text-indigo-600 text-sm">Based on standard 10.5% p.a.</p>
          </div>
          <div className="text-3xl font-extrabold text-indigo-700">
            ₹{emiPreview.toLocaleString('en-IN')} <span className="text-lg font-medium text-indigo-500">/mo</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1LoanDetails;
