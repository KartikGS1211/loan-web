// src/steps/Step1LoanDetails.jsx — PURA REPLACE KARO

import React from "react";
import { useFormContext } from "react-hook-form";
import { calculateEMI } from "../utils/emicalculator";

// ✅ value aur label SAME — schema se match karega
const LOAN_PURPOSE_OPTIONS = {
  personal: [
    "Medical",
    "Education",
    "Travel",
    "Wedding",
    "Home Renovation",
    "Other",
  ],
  home: ["Purchase", "Construction", "Renovation", "Plot Purchase"],
  business: [
    "Working Capital",
    "Equipment Purchase",
    "Business Expansion",
    "Other",
  ],
};

const LOAN_LIMITS = {
  personal: {
    minAmount: 50000,
    maxAmount: 1000000,
    minTenure: 12,
    maxTenure: 60,
    rate: 10.5,
    label: "Personal Loan",
  },
  home: {
    minAmount: 50000,
    maxAmount: 10000000,
    minTenure: 60,
    maxTenure: 360,
    rate: 8.5,
    label: "Home Loan",
  },
  business: {
    minAmount: 50000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 120,
    rate: 14,
    label: "Business Loan",
  },
};

const formatINR = (num) => {
  if (!num) return "0";
  return Number(num).toLocaleString("en-IN");
};

const Step1LoanDetails = () => {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const amount = watch("loanAmount");
  const tenure = watch("loanTenure");

  const limits = LOAN_LIMITS[loanType] || null;
  const purposeOptions = LOAN_PURPOSE_OPTIONS[loanType] || [];
  const rate = limits?.rate || 10.5;

  const handleLoanTypeChange = (e) => {
    setValue("loanType", e.target.value);
    setValue("loanAmount", "");
    setValue("loanTenure", "");
    setValue("loanPurpose", ""); // ✅ purpose reset on type change
  };

  const emiPreview =
    amount > 0 && tenure > 0 ? calculateEMI(amount, rate, tenure) : 0;
  const processingFee = amount
    ? Math.min(Math.max(amount * 0.01, 2000), 25000)
    : 0;
  const totalCost = emiPreview > 0 ? emiPreview * tenure : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Loan Details</h2>
        <p className="text-slate-500 mt-1">
          Select your loan type and tell us how much you need.
        </p>
      </div>

      {/* 1. Loan Type */}
      <div>
        <label
          htmlFor="loanType"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Loan Type <span className="text-red-500">*</span>
        </label>
        <select
          id="loanType"
          {...register("loanType")}
          onChange={handleLoanTypeChange}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="">Select Loan Type</option>
          <option value="personal">Personal Loan</option>
          <option value="home">Home Loan</option>
          <option value="business">Business Loan</option>
        </select>
        {errors.loanType && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.loanType.message}
          </p>
        )}
      </div>

      {loanType && limits && (
        <>
          {/* 2. Amount + Tenure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="loanAmount"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Loan Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="loanAmount"
                type="number"
                {...register("loanAmount", { valueAsNumber: true })}
                placeholder={`e.g., ${formatINR(limits.minAmount)}`}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-slate-400 text-xs mt-1">
                Min: ₹{formatINR(limits.minAmount)} | Max: ₹
                {formatINR(limits.maxAmount)}
              </p>
              {errors.loanAmount && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.loanAmount.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="loanTenure"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Tenure (Months) <span className="text-red-500">*</span>
              </label>
              <input
                id="loanTenure"
                type="number"
                {...register("loanTenure", { valueAsNumber: true })}
                placeholder={`${limits.minTenure} to ${limits.maxTenure} months`}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-slate-400 text-xs mt-1">
                Range: {limits.minTenure}–{limits.maxTenure} months
              </p>
              {errors.loanTenure && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.loanTenure.message}
                </p>
              )}
            </div>
          </div>

          {/* 3. Loan Purpose */}
          <div>
            <label
              htmlFor="loanPurpose"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Loan Purpose <span className="text-red-500">*</span>
            </label>
            <select
              id="loanPurpose"
              {...register("loanPurpose")}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">Select Purpose</option>
              {/* ✅ value aur label DONO same string — schema match karega */}
              {purposeOptions.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
            {errors.loanPurpose && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.loanPurpose.message}
              </p>
            )}
          </div>

          {/* 4. Referral Code */}
          <div>
            <label
              htmlFor="referralCode"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Referral Code{" "}
              <span className="text-slate-400 text-xs">(Optional)</span>
            </label>
            <input
              id="referralCode"
              type="text"
              {...register("referralCode")}
              placeholder="6–10 character code"
              maxLength={10}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.referralCode && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.referralCode.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* EMI Preview */}
      {emiPreview > 0 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-indigo-900 font-semibold text-lg">
                EMI Preview
              </h3>
              <p className="text-indigo-600 text-sm">
                Based on {rate}% p.a. ({limits?.label} rate)
              </p>
            </div>
            <div className="text-3xl font-extrabold text-indigo-700">
              ₹{formatINR(Math.round(emiPreview))}
              <span className="text-lg font-medium text-indigo-500"> /mo</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-100">
            <div className="text-center">
              <p className="text-xs text-slate-500">Principal</p>
              <p className="font-semibold text-slate-700">
                ₹{formatINR(Number(amount))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Total Payable</p>
              <p className="font-semibold text-slate-700">
                ₹{formatINR(Math.round(totalCost))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Processing Fee</p>
              <p className="font-semibold text-slate-700">
                ₹{formatINR(Math.round(processingFee))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1LoanDetails;
