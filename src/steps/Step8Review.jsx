import React from 'react';
import { useFormContext } from 'react-hook-form';

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">{title}</h3>
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-sm">
      {children}
    </div>
  </div>
);

const Item = ({ label, value }) => (
  <div>
    <span className="block text-slate-500 text-xs mb-1">{label}</span>
    <span className="block font-medium text-slate-800 break-words">{value || 'N/A'}</span>
  </div>
);

const Step8Review = () => {
  const { getValues } = useFormContext();
  const data = getValues();

  const skipCoApplicant = data.loanAmount <= 500000;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Review Application</h2>
        <p className="text-slate-500 mt-1">Please double-check your details before submitting.</p>
      </div>

      <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <Section title="Loan Details">
          <Item label="Loan Amount" value={`₹${data.loanAmount}`} />
          <Item label="Tenure" value={`${data.loanTenure} months`} />
          <Item label="Loan Type" value={<span className="capitalize">{data.loanType}</span>} />
        </Section>

        <Section title="Personal Info">
          <Item label="Full Name" value={`${data.firstName} ${data.lastName}`} />
          <Item label="Email" value={data.email} />
          <Item label="Phone" value={data.phone} />
          <Item label="Date of Birth" value={data.dob} />
          <Item label="Gender" value={<span className="capitalize">{data.gender}</span>} />
        </Section>

        <Section title="KYC & Address">
          <Item label="PAN Number" value={<span className="uppercase">{data.pan}</span>} />
          <Item label="Aadhaar" value={data.aadhaar} />
          <Item label="Address" value={`${data.addressLine1}, ${data.city}, ${data.state} - ${data.pincode}`} />
        </Section>

        <Section title="Employment">
          <Item label="Type" value={<span className="capitalize">{data.employmentType}</span>} />
          {data.employmentType === 'salaried' ? (
            <>
              <Item label="Company" value={data.companyName} />
              <Item label="Monthly Income" value={`₹${data.monthlyIncome}`} />
            </>
          ) : (
            <>
              <Item label="Business" value={data.businessName} />
              <Item label="Annual Turnover" value={`₹${data.annualTurnover}`} />
            </>
          )}
        </Section>

        {!skipCoApplicant && (
          <Section title="Co-Applicant">
            <Item label="Name" value={`${data.coApplicantFirstName} ${data.coApplicantLastName}`} />
            <Item label="PAN" value={<span className="uppercase">{data.coApplicantPan}</span>} />
            <Item label="Income" value={`₹${data.coApplicantIncome}`} />
          </Section>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">Documents & Signature</h3>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4 items-center">
            <div>
              <span className="block text-slate-500 text-xs mb-1">Uploaded Documents</span>
              <span className="block font-medium text-slate-800">{data.documents?.length || 0} Files</span>
            </div>
            <div>
              <span className="block text-slate-500 text-xs mb-1">Signature</span>
              {data.signature ? (
                <img src={data.signature} alt="Signature" className="h-10 bg-white border border-slate-200 rounded p-1" />
              ) : (
                <span className="text-red-500">Missing</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step8Review;