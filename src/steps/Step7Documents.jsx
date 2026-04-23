import React from 'react';
import FileUpload from '../components/common/FileUpload';
import SignaturePad from '../components/common/SignaturePad';

const Step7Documents = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Documents & E-Signature</h2>
        <p className="text-slate-500 mt-1">Upload required documents and sign electronically.</p>
      </div>

      <FileUpload 
        name="documents" 
        label="Upload PAN & Aadhaar (PDF or Image)" 
      />

      <div className="mt-8 pt-6 border-t border-slate-100">
        <SignaturePad 
          name="signature" 
          label="E-Signature" 
        />
        <p className="text-xs text-slate-500 mt-2">
          By signing above, I agree to the terms and conditions and authorize SwiftLoan to verify my identity.
        </p>
      </div>
    </div>
  );
};

export default Step7Documents;
