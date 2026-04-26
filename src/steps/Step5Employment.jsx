import React from "react";
import { useFormContext } from "react-hook-form";

const Step5Employment = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const employmentType = watch("employmentType");
  const loanType = watch("loanType");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Employment & Income
        </h2>
        <p className="text-slate-500 mt-1">
          Tell us about your source of income.
        </p>
      </div>

      {/* Employment Type — PDF Section B2.1 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Employment Type <span className="text-red-500">*</span>
        </label>

        {/* Business Loan restriction warning — PDF Section B3 */}
        {loanType === "business" && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
            ⚠️ Business Loan applicants must be Self-Employed or Business Owner.
            Salaried option is not available for Business Loans.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Salaried — disabled for Business Loan */}
          <label
            className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer flex-1 transition-all ${
              employmentType === "salaried"
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-200 hover:border-indigo-300"
            } ${loanType === "business" ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              value="salaried"
              {...register("employmentType")}
              disabled={loanType === "business"}
              className="accent-indigo-600 w-4 h-4"
            />
            <div>
              <p className="font-medium text-slate-800">Salaried</p>
              <p className="text-xs text-slate-500">Working for a company</p>
            </div>
          </label>

          {/* Self Employed */}
          <label
            className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer flex-1 transition-all ${
              employmentType === "self-employed"
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-200 hover:border-indigo-300"
            }`}
          >
            <input
              type="radio"
              value="self-employed"
              {...register("employmentType")}
              className="accent-indigo-600 w-4 h-4"
            />
            <div>
              <p className="font-medium text-slate-800">Self Employed</p>
              <p className="text-xs text-slate-500">
                Freelancer / Professional
              </p>
            </div>
          </label>

          {/* Business Owner */}
          <label
            className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer flex-1 transition-all ${
              employmentType === "business-owner"
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-200 hover:border-indigo-300"
            }`}
          >
            <input
              type="radio"
              value="business-owner"
              {...register("employmentType")}
              className="accent-indigo-600 w-4 h-4"
            />
            <div>
              <p className="font-medium text-slate-800">Business Owner</p>
              <p className="text-xs text-slate-500">
                Own a registered business
              </p>
            </div>
          </label>
        </div>

        {errors.employmentType && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-2"
          >
            {errors.employmentType.message}
          </p>
        )}
      </div>

      {/* ── SALARIED SUB-FORM ── */}
      {employmentType === "salaried" && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
          <h3 className="font-semibold text-slate-700">Salaried Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                {...register("companyName")}
                placeholder="e.g., TCS, Infosys, Wipro"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.companyName && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                id="designation"
                type="text"
                {...register("designation")}
                placeholder="e.g., Software Engineer, Manager"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.designation && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.designation.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Income */}
            <div>
              <label
                htmlFor="monthlyIncome"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Net Monthly Salary (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="monthlyIncome"
                type="number"
                {...register("monthlyIncome", { valueAsNumber: true })}
                placeholder="e.g., 50000"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-slate-400 text-xs mt-1">
                Minimum ₹15,000 required
              </p>
              {errors.monthlyIncome && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.monthlyIncome.message}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label
                htmlFor="yearsOfExperience"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                id="yearsOfExperience"
                type="number"
                {...register("yearsOfExperience", { valueAsNumber: true })}
                placeholder="e.g., 5"
                min={0}
                max={50}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.yearsOfExperience && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.yearsOfExperience.message}
                </p>
              )}
            </div>
          </div>

          {/* Office Address */}
          <div>
            <label
              htmlFor="officeAddressLine1"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Office Address{" "}
              <span className="text-slate-400 text-xs">(Optional)</span>
            </label>
            <input
              id="officeAddressLine1"
              type="text"
              {...register("officeAddressLine1")}
              placeholder="Office address"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      )}

      {/* ── SELF EMPLOYED SUB-FORM ── */}
      {employmentType === "self-employed" && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
          <h3 className="font-semibold text-slate-700">
            Self Employment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Business / Profession Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="businessName"
                type="text"
                {...register("businessName")}
                placeholder="e.g., John Doe Consulting"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.businessName && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.businessName.message}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                id="businessType"
                {...register("businessType")}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Type</option>
                <option value="doctor">Doctor / Medical</option>
                <option value="lawyer">Lawyer / Legal</option>
                <option value="ca">Chartered Accountant</option>
                <option value="architect">Architect</option>
                <option value="consultant">Consultant</option>
                <option value="freelancer">Freelancer</option>
                <option value="trader">Trader</option>
                <option value="other">Other</option>
              </select>
              {errors.businessType && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.businessType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Income */}
            <div>
              <label
                htmlFor="selfEmployedMonthlyIncome"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Monthly Income (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="selfEmployedMonthlyIncome"
                type="number"
                {...register("selfEmployedMonthlyIncome", {
                  valueAsNumber: true,
                })}
                placeholder="e.g., 80000"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.selfEmployedMonthlyIncome && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.selfEmployedMonthlyIncome.message}
                </p>
              )}
            </div>

            {/* Annual Turnover */}
            <div>
              <label
                htmlFor="annualTurnover"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Annual Turnover (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="annualTurnover"
                type="number"
                {...register("annualTurnover", { valueAsNumber: true })}
                placeholder="Minimum ₹3,00,000"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-slate-400 text-xs mt-1">
                Minimum ₹3,00,000 required
              </p>
              {errors.annualTurnover && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.annualTurnover.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Years in Business */}
            <div>
              <label
                htmlFor="yearsInBusiness"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Years in Business <span className="text-red-500">*</span>
              </label>
              <input
                id="yearsInBusiness"
                type="number"
                {...register("yearsInBusiness", { valueAsNumber: true })}
                placeholder="Minimum 2 years"
                min={0}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-slate-400 text-xs mt-1">
                Minimum 2 years required
              </p>
              {errors.yearsInBusiness && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.yearsInBusiness.message}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label
                htmlFor="yearsOfExperience"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                id="yearsOfExperience"
                type="number"
                {...register("yearsOfExperience", { valueAsNumber: true })}
                placeholder="e.g., 5"
                min={0}
                max={50}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.yearsOfExperience && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.yearsOfExperience.message}
                </p>
              )}
            </div>
          </div>

          {/* Office Address */}
          <div>
            <label
              htmlFor="officeAddressLine1"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Office / Business Address <span className="text-red-500">*</span>
            </label>
            <input
              id="officeAddressLine1"
              type="text"
              {...register("officeAddressLine1")}
              placeholder="Office address"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.officeAddressLine1 && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.officeAddressLine1.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── BUSINESS OWNER SUB-FORM ── */}
      {employmentType === "business-owner" && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
          <h3 className="font-semibold text-slate-700">
            Business Owner Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                id="businessName"
                type="text"
                {...register("businessName")}
                placeholder="e.g., ABC Pvt Ltd"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.businessName && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.businessName.message}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                id="businessType"
                {...register("businessType")}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Type</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="trading">Trading</option>
                <option value="services">Services</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="export_import">Export / Import</option>
                <option value="it">IT / Technology</option>
                <option value="construction">Construction</option>
                <option value="other">Other</option>
              </select>
              {errors.businessType && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.businessType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Annual Turnover */}
            <div>
              <label
                htmlFor="annualTurnover"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Annual Turnover (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="annualTurnover"
                type="number"
                {...register("annualTurnover", { valueAsNumber: true })}
                placeholder="Minimum ₹3,00,000"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-slate-400 text-xs mt-1">
                Minimum ₹3,00,000 required
              </p>
              {errors.annualTurnover && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.annualTurnover.message}
                </p>
              )}
            </div>

            {/* Years in Business */}
            <div>
              <label
                htmlFor="yearsInBusiness"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Years in Business <span className="text-red-500">*</span>
              </label>
              <input
                id="yearsInBusiness"
                type="number"
                {...register("yearsInBusiness", { valueAsNumber: true })}
                placeholder="Minimum 2 years"
                min={0}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-slate-400 text-xs mt-1">
                Minimum 2 years required
              </p>
              {errors.yearsInBusiness && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.yearsInBusiness.message}
                </p>
              )}
            </div>
          </div>

          {/* GST Number — PDF Section B2.1: required for Business Owner */}
          <div>
            <label
              htmlFor="gstNumber"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              GST Number <span className="text-red-500">*</span>
            </label>
            <input
              id="gstNumber"
              type="text"
              {...register("gstNumber")}
              placeholder="e.g., 27AAPFU0939F1ZV"
              maxLength={15}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-slate-400 text-xs mt-1">
              15-character GST number (e.g., 27AAPFU0939F1ZV)
            </p>
            {errors.gstNumber && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.gstNumber.message}
              </p>
            )}
          </div>

          {/* Monthly Income */}
          <div>
            <label
              htmlFor="selfEmployedMonthlyIncome"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Monthly Income (₹) <span className="text-red-500">*</span>
            </label>
            <input
              id="selfEmployedMonthlyIncome"
              type="number"
              {...register("selfEmployedMonthlyIncome", {
                valueAsNumber: true,
              })}
              placeholder="e.g., 1,00,000"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.selfEmployedMonthlyIncome && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.selfEmployedMonthlyIncome.message}
              </p>
            )}
          </div>

          {/* Office Address */}
          <div>
            <label
              htmlFor="officeAddressLine1"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Office / Business Address <span className="text-red-500">*</span>
            </label>
            <input
              id="officeAddressLine1"
              type="text"
              {...register("officeAddressLine1")}
              placeholder="Registered business address"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.officeAddressLine1 && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.officeAddressLine1.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* EMI affordability info — PDF Section B3 */}
      {(watch("monthlyIncome") > 0 ||
        watch("selfEmployedMonthlyIncome") > 0) && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
          ℹ️ Your EMI will be checked against your income in the final step. EMI
          must not exceed 50% of your monthly income as per RBI guidelines.
        </div>
      )}
    </div>
  );
};

export default Step5Employment;
