import React from 'react';
import Input from '../components/common/Input';
import { ShieldCheck } from 'lucide-react';

const Step3KYC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">KYC Verification</h2>
          <p className="text-slate-500 mt-1">We need this to verify your identity securely.</p>
        </div>
        <div className="bg-green-100 p-3 rounded-full text-green-600">
          <ShieldCheck size={28} />
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-sm text-slate-600">
        Your data is encrypted and securely transmitted to authorized agencies for verification.
      </div>

      <div className="space-y-6 max-w-xl">
        <Input 
          label="PAN Card Number" 
          name="pan" 
          placeholder="ABCDE1234F" 
          style={{ textTransform: 'uppercase' }}
        />
        <Input 
          label="Aadhaar Number (12 digits)" 
          name="aadhaar" 
          type="text" 
          placeholder="1234 5678 9012" 
          maxLength={12}
        />
      </div>
    </div>
  );
};

export default Step3KYC;