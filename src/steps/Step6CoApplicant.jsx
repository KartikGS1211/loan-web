import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Users, CheckCircle, XCircle, Loader } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

// PAN 4th character validation
const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

const Step6CoApplicant = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const loanAmount = watch("loanAmount");
  const maritalStatus = watch("maritalStatus");
  const coApplicantConsent = watch("coApplicantConsent");

  // PAN verification state
  const [panStatus, setPanStatus] = useState("idle");
  const [panError, setPanError] = useState("");

  // Signature ref
  const sigRef = React.useRef(null);

  // Why Step 6 is required — PDF Section B2.1
  const getReason = () => {
    if (loanType === "home") return "Home Loan always requires a co-applicant.";
    if (loanType === "personal")
      return "Personal Loan above ₹5,00,000 requires a co-applicant.";
    if (loanType === "business")
      return "Business Loan above ₹20,00,000 requires a co-applicant.";
    return "";
  };

  // Co-applicant PAN verification simulation
  const handlePanVerify = async (value) => {
    const pan = value.toUpperCase().trim();
    if (!validatePAN(pan)) {
      setPanStatus("failed");
      setPanError("PAN format must be AAAAA9999A");
      setValue("coApplicantPanVerified", false);
      return;
    }
    setPanStatus("verifying");
    setPanError("");
    await new Promise((res) => setTimeout(res, 1500));
    setPanStatus("verified");
    setValue("coApplicantPanVerified", true);
  };

  const StatusBadge = ({ status }) => {
    if (status === "verifying")
      return (
        <span className="flex items-center gap-1 text-amber-600 text-sm">
          <Loader size={14} className="animate-spin" /> Verifying...
        </span>
      );
    if (status === "verified")
      return (
        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <CheckCircle size={14} /> Verified
        </span>
      );
    if (status === "failed")
      return (
        <span className="flex items-center gap-1 text-red-500 text-sm">
          <XCircle size={14} /> Failed
        </span>
      );
    return null;
  };

  // Signature handlers
  const handleSignatureClear = () => {
    sigRef.current?.clear();
    setValue("coApplicantSignature", null);
  };

  const handleSignatureEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.toDataURL("image/png");
      setValue("coApplicantSignature", dataUrl);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Co-Applicant Details
          </h2>
          <p className="text-slate-500 mt-1">{getReason()}</p>
        </div>
        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
          <Users size={28} />
        </div>
      </div>

      {/* Info box */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-sm">
        ℹ️ A co-applicant increases your loan eligibility. Their income will be
        combined with yours for EMI calculation.
      </div>

      {/* Co-Applicant Full Name */}
      <div>
        <label
          htmlFor="coApplicantName"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="coApplicantName"
          type="text"
          {...register("coApplicantName")}
          placeholder="Co-applicant full name"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.coApplicantName && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.coApplicantName.message}
          </p>
        )}
      </div>

      {/* Relationship — PDF Section B2.1 */}
      <div>
        <label
          htmlFor="relationship"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Relationship with Applicant <span className="text-red-500">*</span>
        </label>
        <select
          id="relationship"
          {...register("relationship")}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select Relationship</option>
          {/* If married, Spouse shown first — PDF Section B3 */}
          {maritalStatus === "married" && (
            <option value="spouse">Spouse (Recommended)</option>
          )}
          <option value="parent">Parent</option>
          <option value="sibling">Sibling</option>
          <option value="business-partner">Business Partner</option>
        </select>
        {errors.relationship && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.relationship.message}
          </p>
        )}
      </div>

      {/* Co-Applicant PAN + verification */}
      <div>
        <label
          htmlFor="coApplicantPan"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          PAN Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            id="coApplicantPan"
            type="text"
            {...register("coApplicantPan")}
            placeholder="ABCDE1234F"
            maxLength={10}
            autoComplete="off"
            onChange={(e) => {
              setPanStatus("idle");
              setPanError("");
              setValue("coApplicantPan", e.target.value.toUpperCase());
              setValue("coApplicantPanVerified", false);
            }}
            onBlur={(e) => handlePanVerify(e.target.value)}
            className={`flex-1 border rounded-xl px-4 py-3 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              panStatus === "verified"
                ? "border-green-400 bg-green-50"
                : panStatus === "failed"
                  ? "border-red-400 bg-red-50"
                  : "border-slate-300"
            }`}
          />
          <button
            type="button"
            onClick={() => handlePanVerify(watch("coApplicantPan") || "")}
            disabled={panStatus === "verifying" || panStatus === "verified"}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify
          </button>
        </div>
        <div className="mt-1 flex justify-between">
          <p className="text-slate-400 text-xs">Format: AAAAA9999A</p>
          <StatusBadge status={panStatus} />
        </div>
        {(errors.coApplicantPan || panError) && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {panError || errors.coApplicantPan?.message}
          </p>
        )}
      </div>

      {/* Co-Applicant Monthly Income */}
      <div>
        <label
          htmlFor="coApplicantIncome"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Monthly Income (₹) <span className="text-red-500">*</span>
        </label>
        <input
          id="coApplicantIncome"
          type="number"
          {...register("coApplicantIncome", { valueAsNumber: true })}
          placeholder="e.g., 40000"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <p className="text-slate-400 text-xs mt-1">
          This will be combined with your income for EMI eligibility
          calculation.
        </p>
        {errors.coApplicantIncome && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.coApplicantIncome.message}
          </p>
        )}
      </div>

      {/* Co-Applicant Consent — PDF Section B2.1 */}
      <div
        className={`p-4 rounded-xl border ${
          coApplicantConsent
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("coApplicantConsent")}
            className="mt-1 w-4 h-4 accent-indigo-600"
          />
          <span className="text-sm text-slate-700">
            I, the co-applicant, voluntarily consent to being added to this loan
            application. I authorize LendSwift to verify my identity, check my
            credit score, and use my information for loan processing purposes.
            <span className="text-red-500"> *</span>
          </span>
        </label>
        {errors.coApplicantConsent && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-2 ml-7"
          >
            {errors.coApplicantConsent.message}
          </p>
        )}
      </div>

      {/* Co-Applicant Signature — PDF Section B2.1 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Co-Applicant Signature <span className="text-red-500">*</span>
        </label>
        <p className="text-slate-400 text-xs mb-2">
          Please have the co-applicant draw their signature below.
        </p>
        <div className="border-2 border-slate-300 rounded-xl overflow-hidden bg-white">
          <SignatureCanvas
            ref={sigRef}
            penColor="#1e293b"
            canvasProps={{
              className: "w-full",
              height: 150,
              style: { touchAction: "none" },
            }}
            onEnd={handleSignatureEnd}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-slate-400 text-xs">
            Draw signature using mouse or touch
          </p>
          <button
            type="button"
            onClick={handleSignatureClear}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Clear
          </button>
        </div>
        {errors.coApplicantSignature && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.coApplicantSignature.message}
          </p>
        )}

        {/* Signature preview */}
        {watch("coApplicantSignature") && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Co-applicant signature captured
              successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6CoApplicant;
