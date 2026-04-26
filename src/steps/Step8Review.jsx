import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useFormStore } from "../hooks/useFormStore";
import { CheckCircle, Edit2, AlertTriangle } from "lucide-react";

// EMI Calculator — PDF Section C3.3
const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (!principal || !annualRate || !tenureMonths) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

// Indian number format — PDF Section C3.3
const formatINR = (num) => {
  if (!num) return "₹0";
  return "₹" + Number(num).toLocaleString("en-IN");
};

// Interest rates per loan type — PDF Section C3.3
const RATES = {
  personal: 10.5,
  home: 8.5,
  business: 14,
};

const Section = ({ title, onEdit, children }) => (
  <div className="mb-5">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">
        {title}
      </h3>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <Edit2 size={12} /> Edit
        </button>
      )}
    </div>
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-sm">
      {children}
    </div>
  </div>
);

const Item = ({ label, value }) => (
  <div>
    <span className="block text-slate-500 text-xs mb-1">{label}</span>
    <span className="block font-medium text-slate-800 break-words">
      {value || "N/A"}
    </span>
  </div>
);

const Step8Review = () => {
  const {
    getValues,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { setCurrentStep } = useFormStore();
  const data = getValues();

  // Consent checkboxes state — PDF Section B2.1
  const consentAccuracy = watch("consentAccuracy");
  const consentCibil = watch("consentCibil");
  const consentTerms = watch("consentTerms");
  const consentCommunication = watch("consentCommunication");
  const allConsentsChecked =
    consentAccuracy && consentCibil && consentTerms && consentCommunication;

  // Co-applicant visibility — PDF Section B2.1
  const loanType = data.loanType;
  const loanAmount = Number(data.loanAmount);
  const showCoApplicant =
    loanType === "home" ||
    (loanType === "personal" && loanAmount > 500000) ||
    (loanType === "business" && loanAmount > 2000000);

  // EMI Calculation — PDF Section C3.3
  const rate = RATES[loanType] || 10.5;
  const emi = calculateEMI(loanAmount, rate, Number(data.loanTenure));
  const totalPayable = emi * Number(data.loanTenure);
  const totalInterest = totalPayable - loanAmount;
  const processingFee = Math.min(Math.max(loanAmount * 0.01, 2000), 25000);

  // Monthly income for EMI ratio check — PDF Section B3
  const monthlyIncome = Number(
    data.monthlyIncome || data.selfEmployedMonthlyIncome || 0,
  );
  const coApplicantIncome = Number(data.coApplicantIncome || 0);
  const combinedIncome =
    monthlyIncome + (showCoApplicant ? coApplicantIncome : 0);
  const emiRatio = combinedIncome > 0 ? (emi / combinedIncome) * 100 : 0;
  const emiTooHigh = emiRatio > 50;

  // Documents count
  const uploadedFiles = data.uploadedFiles || {};
  const totalDocsUploaded = Object.values(uploadedFiles).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Review & Submit</h2>
        <p className="text-slate-500 mt-1">
          Please review all details carefully before submitting your
          application.
        </p>
      </div>

      {/* PRE-APPROVAL SUMMARY CARD — PDF Section B2.1 */}
      <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl text-white shadow-lg">
        <h3 className="font-bold text-lg mb-4">Pre-Approval Summary</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-indigo-200 text-xs">Loan Amount</p>
            <p className="text-2xl font-bold">{formatINR(loanAmount)}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Estimated EMI</p>
            <p className="text-2xl font-bold">
              {formatINR(Math.round(emi))}/mo
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-indigo-500">
          <div>
            <p className="text-indigo-200 text-xs">Tenure</p>
            <p className="font-semibold">{data.loanTenure} months</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Interest Rate</p>
            <p className="font-semibold">{rate}% p.a.</p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Loan Type</p>
            <p className="font-semibold capitalize">{loanType}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-indigo-500 mt-3">
          <div>
            <p className="text-indigo-200 text-xs">Total Payable</p>
            <p className="font-semibold">
              {formatINR(Math.round(totalPayable))}
            </p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Total Interest</p>
            <p className="font-semibold">
              {formatINR(Math.round(totalInterest))}
            </p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Processing Fee</p>
            <p className="font-semibold">
              {formatINR(Math.round(processingFee))}
            </p>
          </div>
        </div>
      </div>

      {/* EMI ratio warning — PDF Section B3 */}
      {emiTooHigh && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-800 font-medium text-sm">
              High EMI-to-Income Ratio
            </p>
            <p className="text-amber-700 text-xs mt-1">
              Your EMI ({formatINR(Math.round(emi))}) is {emiRatio.toFixed(1)}%
              of your combined monthly income ({formatINR(combinedIncome)}). RBI
              guidelines recommend EMI should not exceed 50% of income. You may
              still proceed with additional consent.
            </p>
          </div>
        </div>
      )}

      {/* Scrollable review sections */}
      <div className="max-h-[500px] overflow-y-auto pr-1 space-y-2">
        {/* Loan Details */}
        <Section title="Loan Details" onEdit={() => setCurrentStep(0)}>
          <Item
            label="Loan Type"
            value={<span className="capitalize">{data.loanType} Loan</span>}
          />
          <Item label="Loan Amount" value={formatINR(loanAmount)} />
          <Item label="Tenure" value={`${data.loanTenure} months`} />
          <Item label="Loan Purpose" value={data.loanPurpose} />
          {data.referralCode && (
            <Item label="Referral Code" value={data.referralCode} />
          )}
        </Section>

        {/* Personal Info */}
        <Section title="Personal Information" onEdit={() => setCurrentStep(1)}>
          <Item label="Full Name" value={data.fullName} />
          <Item label="Date of Birth" value={data.dob} />
          <Item
            label="Gender"
            value={<span className="capitalize">{data.gender}</span>}
          />
          <Item
            label="Marital Status"
            value={<span className="capitalize">{data.maritalStatus}</span>}
          />
          <Item label="Father's Name" value={data.fatherName} />
          <Item label="Mother's Name" value={data.motherName} />
          <Item label="Email" value={data.email} />
          <Item label="Mobile" value={data.phone} />
          {data.alternatePhone && (
            <Item label="Alternate Mobile" value={data.alternatePhone} />
          )}
        </Section>

        {/* KYC */}
        <Section title="KYC Verification" onEdit={() => setCurrentStep(2)}>
          <Item
            label="PAN Number"
            value={
              <span className="uppercase">
                {data.pan
                  ? `${data.pan.slice(0, 2)}***${data.pan.slice(-2)}`
                  : "N/A"}
              </span>
            }
          />
          <Item
            label="Aadhaar Number"
            value={data.aadhaar ? `XXXX XXXX ${data.aadhaar.slice(-4)}` : "N/A"}
          />
          <Item
            label="PAN Verified"
            value={data.panVerified ? "✅ Yes" : "❌ No"}
          />
          <Item
            label="Aadhaar Verified"
            value={data.aadhaarVerified ? "✅ Yes" : "❌ No"}
          />
          {data.voterId && <Item label="Voter ID" value={data.voterId} />}
          {data.passport && <Item label="Passport" value={data.passport} />}
        </Section>

        {/* Address */}
        <Section title="Address" onEdit={() => setCurrentStep(3)}>
          <Item
            label="Current Address"
            value={`${data.currentAddressLine1}${data.currentAddressLine2 ? ", " + data.currentAddressLine2 : ""}, ${data.city}, ${data.state} - ${data.pincode}`}
          />
          <Item
            label="Residence Type"
            value={<span className="capitalize">{data.residenceType}</span>}
          />
          {data.residenceType === "rented" && (
            <Item label="Monthly Rent" value={formatINR(data.rentAmount)} />
          )}
          <Item
            label="Years at Address"
            value={`${data.yearsAtAddress} years`}
          />
          <Item
            label="Permanent Address"
            value={
              data.sameAsPermanent
                ? "Same as current address"
                : data.permanentAddressLine1
                  ? `${data.permanentAddressLine1}, ${data.permanentCity}, ${data.permanentState}`
                  : "N/A"
            }
          />
        </Section>

        {/* Employment */}
        <Section title="Employment & Income" onEdit={() => setCurrentStep(4)}>
          <Item
            label="Employment Type"
            value={<span className="capitalize">{data.employmentType}</span>}
          />
          {data.employmentType === "salaried" && (
            <>
              <Item label="Company" value={data.companyName} />
              <Item label="Designation" value={data.designation} />
              <Item
                label="Monthly Income"
                value={formatINR(data.monthlyIncome)}
              />
              <Item
                label="Experience"
                value={`${data.yearsOfExperience} years`}
              />
            </>
          )}
          {(data.employmentType === "self-employed" ||
            data.employmentType === "business-owner") && (
            <>
              <Item label="Business Name" value={data.businessName} />
              <Item label="Business Type" value={data.businessType} />
              <Item
                label="Annual Turnover"
                value={formatINR(data.annualTurnover)}
              />
              <Item
                label="Years in Business"
                value={`${data.yearsInBusiness} years`}
              />
              <Item
                label="Monthly Income"
                value={formatINR(data.selfEmployedMonthlyIncome)}
              />
              {data.gstNumber && (
                <Item label="GST Number" value={data.gstNumber} />
              )}
            </>
          )}
        </Section>

        {/* Co-Applicant */}
        {showCoApplicant && (
          <Section title="Co-Applicant" onEdit={() => setCurrentStep(5)}>
            <Item label="Name" value={data.coApplicantName} />
            <Item
              label="Relationship"
              value={<span className="capitalize">{data.relationship}</span>}
            />
            <Item
              label="PAN"
              value={
                data.coApplicantPan
                  ? `${data.coApplicantPan.slice(0, 2)}***${data.coApplicantPan.slice(-2)}`
                  : "N/A"
              }
            />
            <Item
              label="Monthly Income"
              value={formatINR(data.coApplicantIncome)}
            />
          </Section>
        )}

        {/* Documents & Signature */}
        <Section title="Documents & Signature" onEdit={() => setCurrentStep(6)}>
          <Item
            label="Documents Uploaded"
            value={`${totalDocsUploaded} file(s)`}
          />
          <div className="col-span-2">
            <span className="block text-slate-500 text-xs mb-1">
              E-Signature
            </span>
            {data.signature ? (
              <img
                src={data.signature}
                alt="E-Signature"
                className="h-14 bg-white border border-slate-200 rounded-lg p-1 max-w-[200px]"
              />
            ) : (
              <span className="text-red-500 text-sm">⚠️ Signature missing</span>
            )}
          </div>
          {data.coApplicantSignature && (
            <div className="col-span-2">
              <span className="block text-slate-500 text-xs mb-1">
                Co-Applicant Signature
              </span>
              <img
                src={data.coApplicantSignature}
                alt="Co-Applicant Signature"
                className="h-14 bg-white border border-slate-200 rounded-lg p-1 max-w-[200px]"
              />
            </div>
          )}
        </Section>
      </div>

      {/* RBI Compliance — PDF Section A3.1 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs space-y-1">
        <p className="font-semibold">
          Key Information (As per RBI Digital Lending Guidelines)
        </p>
        <p>
          • Cooling-off Period: You may exit this loan within 3 days of
          disbursement without penalty.
        </p>
        <p>• Grievance Officer: grievance@lendswift.in | 1800-XXX-XXXX</p>
        <p>• RBI Ombudsman: https://cms.rbi.org.in</p>
        <p>• Annual Percentage Rate (APR): {rate}% p.a. (flat rate basis)</p>
      </div>

      {/* 4 Consent Checkboxes — PDF Section B2.1: none pre-ticked */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700">Declarations & Consent</h3>

        {/* Consent 1 */}
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
          <input
            type="checkbox"
            {...register("consentAccuracy")}
            className="mt-0.5 w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-slate-700">
            I confirm that all information provided in this application is true,
            accurate, and complete to the best of my knowledge.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consentAccuracy && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-xs ml-7"
          >
            {errors.consentAccuracy.message}
          </p>
        )}

        {/* Consent 2 */}
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
          <input
            type="checkbox"
            {...register("consentCibil")}
            className="mt-0.5 w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-slate-700">
            I authorize LendSwift to access my credit information from CIBIL,
            Equifax, or other credit bureaus for the purpose of this loan
            application.
            <span className="text-red-500"> *</span>
          </span>
        </label>
        {errors.consentCibil && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-xs ml-7"
          >
            {errors.consentCibil.message}
          </p>
        )}

        {/* Consent 3 */}
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
          <input
            type="checkbox"
            {...register("consentTerms")}
            className="mt-0.5 w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-slate-700">
            I have read and agree to LendSwift's{" "}
            <a href="#" className="text-indigo-600 underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 underline">
              Privacy Policy
            </a>
            .<span className="text-red-500"> *</span>
          </span>
        </label>
        {errors.consentTerms && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-xs ml-7"
          >
            {errors.consentTerms.message}
          </p>
        )}

        {/* Consent 4 */}
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
          <input
            type="checkbox"
            {...register("consentCommunication")}
            className="mt-0.5 w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-slate-700">
            I consent to receive communications (SMS, email, calls) from
            LendSwift regarding this application and related loan products.
            <span className="text-red-500"> *</span>
          </span>
        </label>
        {errors.consentCommunication && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-xs ml-7"
          >
            {errors.consentCommunication.message}
          </p>
        )}

        {/* EMI too high — extra consent */}
        {emiTooHigh && (
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100">
            <input
              type="checkbox"
              {...register("consentHighEmi")}
              className="mt-0.5 w-4 h-4 accent-amber-600"
            />
            <span className="text-sm text-amber-800">
              I understand that my EMI exceeds 50% of my income and I wish to
              proceed with this application at my own discretion.
              <span className="text-red-500"> *</span>
            </span>
          </label>
        )}
      </div>

      {/* Submit disabled info */}
      {!allConsentsChecked && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm text-center">
          ☝️ Please check all required consent boxes above to enable submission.
        </div>
      )}

      {/* All good message */}
      {allConsentsChecked && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle size={16} />
          All consents provided. You can now submit your application.
        </div>
      )}
    </div>
  );
};

export default Step8Review;
