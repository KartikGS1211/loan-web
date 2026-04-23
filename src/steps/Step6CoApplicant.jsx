import React from 'react';
import Input from '../components/common/Input';
import { Users } from 'lucide-react';

const Step6CoApplicant = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Co-Applicant Details</h2>
          <p className="text-slate-500 mt-1">Required for loans above ₹5,00,000 to increase approval chances.</p>
        </div>
        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
          <Users size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="First Name" name="coApplicantFirstName" placeholder="Jane" />
        <Input label="Last Name" name="coApplicantLastName" placeholder="Doe" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="PAN Number" 
          name="coApplicantPan" 
          placeholder="ABCDE1234F" 
          style={{ textTransform: 'uppercase' }}
        />
        <Input label="Monthly Income (₹)" name="coApplicantIncome" type="number" placeholder="40000" />
      </div>
    </div>
  );
};

export default Step6CoApplicant;
