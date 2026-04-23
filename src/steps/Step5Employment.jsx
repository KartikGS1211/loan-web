import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../components/common/Input';
import RadioGroup from '../components/common/RadioGroup';

const Step5Employment = () => {
  const { watch } = useFormContext();
  const employmentType = watch('employmentType');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Employment & Income</h2>
        <p className="text-slate-500 mt-1">Tell us about your source of income.</p>
      </div>

      <RadioGroup 
        label="Employment Type" 
        name="employmentType" 
        options={[
          { value: 'salaried', label: 'Salaried' },
          { value: 'self-employed', label: 'Self Employed' },
          { value: 'business', label: 'Business Owner' }
        ]} 
      />

      <div className="mt-8 pt-6 border-t border-slate-100 animate-fade-in-up">
        {employmentType === 'salaried' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Company Name" name="companyName" placeholder="TCS / Infosys" />
            <Input label="Net Monthly Income (₹)" name="monthlyIncome" type="number" placeholder="50000" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Business/Profession Name" name="businessName" placeholder="John Doe Associates" />
            <Input label="Annual Turnover (₹)" name="annualTurnover" type="number" placeholder="2000000" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5Employment;
