import React from 'react';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';

const SuccessScreen = ({ resetForm }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in-up min-h-[400px]">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Application Submitted!</h2>
      <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
        Thank you for choosing SwiftLoan. Your application has been successfully received and is currently under review. 
        Our team will contact you within 24 hours.
      </p>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 w-full max-w-sm mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-500 text-sm">Application ID</span>
          <span className="font-mono font-bold text-slate-800">SL-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-sm">Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            In Review
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={resetForm}
          className="btn-primary flex items-center justify-center gap-2"
        >
          Go to Homepage
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
