import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const Step2PersonalInfo = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const maritalStatus = watch("maritalStatus");
  const dob = watch("dob");
  const loanTenure = watch("loanTenure");

  // Cross-step dependency — PDF Section B3
  // Age + Tenure must not exceed 65 years
  useEffect(() => {
    if (dob && loanTenure) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age -= 1;
      }
      const maxTenureMonths = (65 - age) * 12;
      if (loanTenure > maxTenureMonths) {
        setValue("loanTenure", maxTenureMonths);
      }
    }
  }, [dob, loanTenure, setValue]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Personal Information
        </h2>
        <p className="text-slate-500 mt-1">
          Please provide your basic details as per PAN card.
        </p>
      </div>

      {/* Full Name — PDF: as per PAN, 2-100 chars */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Full Name (as per PAN) <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          {...register("fullName")}
          placeholder="e.g., Ramesh Kumar Sharma"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.fullName && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* DOB + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="dob"
            type="date"
            {...register("dob")}
            max={
              new Date(new Date().setFullYear(new Date().getFullYear() - 21))
                .toISOString()
                .split("T")[0]
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p className="text-slate-400 text-xs mt-1">
            Age must be between 21–65 years
          </p>
          {errors.dob && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.dob.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 mt-1">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={g}
                  {...register("gender")}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-slate-700 capitalize">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.gender.message}
            </p>
          )}
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label
          htmlFor="maritalStatus"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Marital Status <span className="text-red-500">*</span>
        </label>
        <select
          id="maritalStatus"
          {...register("maritalStatus")}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="">Select Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
        {errors.maritalStatus && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.maritalStatus.message}
          </p>
        )}
      </div>

      {/* Father's Name + Mother's Name — PDF: required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fatherName"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Father's Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fatherName"
            type="text"
            {...register("fatherName")}
            placeholder="e.g., Suresh Kumar Sharma"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.fatherName && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.fatherName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="motherName"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Mother's Name <span className="text-red-500">*</span>
          </label>
          <input
            id="motherName"
            type="text"
            {...register("motherName")}
            placeholder="e.g., Sunita Sharma"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.motherName && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.motherName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email + Primary Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="example@email.com"
            autoComplete="email"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.email && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="10-digit mobile number"
            maxLength={10}
            autoComplete="tel"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p className="text-slate-400 text-xs mt-1">
            Must start with 6, 7, 8, or 9
          </p>
          {errors.phone && (
            <p
              role="alert"
              aria-live="polite"
              className="text-red-500 text-sm mt-1"
            >
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Alternate Mobile — PDF: optional, must differ from primary */}
      <div>
        <label
          htmlFor="alternatePhone"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Alternate Mobile Number{" "}
          <span className="text-slate-400 text-xs">(Optional)</span>
        </label>
        <input
          id="alternatePhone"
          type="tel"
          {...register("alternatePhone")}
          placeholder="Different from primary mobile"
          maxLength={10}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.alternatePhone && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.alternatePhone.message}
          </p>
        )}
      </div>

      {/* Info box — cross-step note */}
      {maritalStatus === "married" && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
          ℹ️ Since you are married, spouse details may be required in the
          Co-Applicant step.
        </div>
      )}
    </div>
  );
};

export default Step2PersonalInfo;
