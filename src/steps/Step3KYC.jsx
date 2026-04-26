import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ShieldCheck, CheckCircle, XCircle, Loader } from "lucide-react";

// Verhoeff algorithm — PDF Section C3.2
const verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const validateVerhoeff = (num) => {
  let c = 0;
  const arr = num.split("").reverse().map(Number);
  for (let i = 0; i < arr.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][arr[i]]];
  }
  return c === 0;
};

// PAN 4th character validation — PDF Section C3.1
const validatePAN4thChar = (pan, loanType) => {
  const fourthChar = pan.toUpperCase()[3];
  if (loanType === "business") {
    return ["P", "C", "F"].includes(fourthChar);
  }
  return fourthChar === "P";
};

const Step3KYC = () => {
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const loanAmount = Number(watch("loanAmount")) || 0;
  const aadhaarConsent = watch("aadhaarConsent");

  const [panStatus, setPanStatus] = useState("idle");
  const [aadhaarStatus, setAadhaarStatus] = useState("idle");
  const [panError, setPanError] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");

  // PAN verification — PDF Section A3.2
  const handlePanVerify = async (value) => {
    const pan = (value || "").toUpperCase().trim();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!pan) {
      setPanStatus("failed");
      setPanError("Please enter PAN number");
      setValue("panVerified", false);
      return;
    }

    if (!panRegex.test(pan)) {
      setPanStatus("failed");
      setPanError(
        "PAN format must be AAAAA9999A (5 letters, 4 digits, 1 letter)",
      );
      setValue("panVerified", false);
      return;
    }

    if (!validatePAN4thChar(pan, loanType)) {
      setPanStatus("failed");
      setPanError(
        loanType === "business"
          ? "PAN 4th character must be P (Individual), C (Company), or F (Firm) for Business Loan"
          : "PAN 4th character must be P — only Individual PAN accepted for this loan type",
      );
      setValue("panVerified", false);
      return;
    }

    // Simulate 1.5s API call — PDF Section A3.2
    setPanStatus("verifying");
    setPanError("");
    clearErrors("pan");
    await new Promise((res) => setTimeout(res, 1500));
    setPanStatus("verified");
    setValue("panVerified", true);
  };

  // Aadhaar verification — PDF Section A3.2
  const handleAadhaarVerify = async (value) => {
    const aadhaar = (value || "").replace(/\D/g, "").trim();

    if (!aadhaar) {
      setAadhaarStatus("failed");
      setAadhaarError("Please enter Aadhaar number");
      setValue("aadhaarVerified", false);
      return;
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      setAadhaarStatus("failed");
      setAadhaarError("Aadhaar must be exactly 12 digits");
      setValue("aadhaarVerified", false);
      return;
    }

    if (!validateVerhoeff(aadhaar)) {
      setAadhaarStatus("failed");
      setAadhaarError("Invalid Aadhaar number — checksum verification failed");
      setValue("aadhaarVerified", false);
      return;
    }

    // Simulate 1.5s API call
    setAadhaarStatus("verifying");
    setAadhaarError("");
    clearErrors("aadhaar");
    await new Promise((res) => setTimeout(res, 1500));
    setAadhaarStatus("verified");
    setValue("aadhaarVerified", true);
  };

  const StatusBadge = ({ status }) => {
    if (status === "verifying")
      return (
        <span className="flex items-center gap-1 text-amber-600 text-sm">
          <Loader size={16} className="animate-spin" /> Verifying...
        </span>
      );
    if (status === "verified")
      return (
        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <CheckCircle size={16} /> Verified ✓
        </span>
      );
    if (status === "failed")
      return (
        <span className="flex items-center gap-1 text-red-500 text-sm">
          <XCircle size={16} /> Failed
        </span>
      );
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            KYC Verification
          </h2>
          <p className="text-slate-500 mt-1">
            We need this to verify your identity securely.
          </p>
        </div>
        <div className="bg-green-100 p-3 rounded-full text-green-600">
          <ShieldCheck size={28} />
        </div>
      </div>

      {/* Security notice */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
        🔒 Your data is encrypted and securely transmitted to authorized
        agencies for verification only.
      </div>

      <div className="space-y-6 max-w-xl">
        {/* ── PAN Number ── PDF Section C3.1 */}
        <div>
          <label
            htmlFor="pan"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            PAN Card Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="pan"
              type="text"
              placeholder="ABCDE1234F"
              maxLength={10}
              autoComplete="off"
              {...register("pan", {
                onChange: (e) => {
                  setPanStatus("idle");
                  setPanError("");
                  setValue("panVerified", false);
                  setValue("pan", e.target.value.toUpperCase());
                },
              })}
              onBlur={(e) => handlePanVerify(e.target.value)}
              className={`flex-1 border rounded-xl px-4 py-3 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors ${
                panStatus === "verified"
                  ? "border-green-400 bg-green-50"
                  : panStatus === "failed"
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300"
              }`}
            />
            <button
              type="button"
              onClick={() => handlePanVerify(watch("pan") || "")}
              disabled={panStatus === "verifying" || panStatus === "verified"}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {panStatus === "verifying" ? "..." : "Verify"}
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-slate-400 text-xs">
              Format: AAAAA9999A (e.g., ABCDE1234F)
            </p>
            <StatusBadge status={panStatus} />
          </div>
          {(panError || errors.pan) && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {panError || errors.pan?.message}
            </p>
          )}
        </div>

        {/* ── Aadhaar Number ── PDF Section C3.2 */}
        <div>
          <label
            htmlFor="aadhaar"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="aadhaar"
              type="text"
              placeholder="Enter 12-digit Aadhaar"
              maxLength={12}
              autoComplete="off"
              {...register("aadhaar", {
                onChange: (e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setValue("aadhaar", digits);
                  setAadhaarStatus("idle");
                  setAadhaarError("");
                  setValue("aadhaarVerified", false);
                },
              })}
              onBlur={(e) => handleAadhaarVerify(e.target.value)}
              className={`flex-1 border rounded-xl px-4 py-3 tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors ${
                aadhaarStatus === "verified"
                  ? "border-green-400 bg-green-50"
                  : aadhaarStatus === "failed"
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300"
              }`}
            />
            <button
              type="button"
              onClick={() => handleAadhaarVerify(watch("aadhaar") || "")}
              disabled={
                aadhaarStatus === "verifying" || aadhaarStatus === "verified"
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {aadhaarStatus === "verifying" ? "..." : "Verify"}
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-slate-400 text-xs">12-digit Aadhaar number</p>
            <StatusBadge status={aadhaarStatus} />
          </div>
          {(aadhaarError || errors.aadhaar) && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {aadhaarError || errors.aadhaar?.message}
            </p>
          )}
        </div>

        {/* ── Aadhaar Consent ── PDF Section A3.1: explicit, not pre-ticked */}
        <div
          className={`p-4 rounded-xl border transition-colors ${
            aadhaarConsent
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("aadhaarConsent")}
              className="mt-1 w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm text-slate-700">
              I voluntarily provide my Aadhaar number and consent to its use for
              KYC verification as per the <strong>Aadhaar Act, 2016</strong>. I
              understand this data will be shared with UIDAI for verification
              purposes only.
              <span className="text-red-500"> *</span>
            </span>
          </label>
          {errors.aadhaarConsent && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-2 ml-7"
            >
              {errors.aadhaarConsent.message}
            </p>
          )}
        </div>

        {/* ── Voter ID ── PDF Section B2.1: optional */}
        <div>
          <label
            htmlFor="voterId"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Voter ID <span className="text-slate-400 text-xs">(Optional)</span>
          </label>
          <input
            id="voterId"
            type="text"
            {...register("voterId", {
              onChange: (e) =>
                setValue("voterId", e.target.value.toUpperCase()),
            })}
            placeholder="e.g., ABC1234567"
            maxLength={10}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p className="text-slate-400 text-xs mt-1">
            Format: 3 uppercase letters + 7 digits
          </p>
          {errors.voterId && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.voterId.message}
            </p>
          )}
        </div>

        {/* ── Passport ── PDF Section B2.1: Home Loan > ₹50L only */}
        {loanType === "home" && loanAmount > 5000000 && (
          <div>
            <label
              htmlFor="passport"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Passport Number{" "}
              <span className="text-slate-400 text-xs">
                (Required for Home Loan &gt; ₹50,00,000)
              </span>
            </label>
            <input
              id="passport"
              type="text"
              {...register("passport", {
                onChange: (e) =>
                  setValue("passport", e.target.value.toUpperCase()),
              })}
              placeholder="e.g., A1234567"
              maxLength={8}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-slate-400 text-xs mt-1">
              Format: 1 uppercase letter + 7 digits
            </p>
            {errors.passport && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 text-sm mt-1"
              >
                {errors.passport.message}
              </p>
            )}
          </div>
        )}

        {/* ── Verification status banner ── */}
        {(panStatus !== "verified" || aadhaarStatus !== "verified") && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-center gap-2">
            ⚠️ Both PAN and Aadhaar must be verified before proceeding.
          </div>
        )}

        {panStatus === "verified" && aadhaarStatus === "verified" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            KYC verification complete! You can proceed to the next step.
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3KYC;
