import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFormStore,
  loadDraft,
  clearAllDrafts,
  saveDraft,
} from "../../hooks/useFormStore";

import ProgressBar from "./ProgressBar";
import StepNavigation from "./StepNavigation";
import StepRenderer from "./StepRenderer";
import SuccessScreen from "./SuccessScreen";

import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
} from "../../schemas/validationSchema";

const Wizard = () => {
  const {
    formData,
    currentStep,
    setFormData,
    setCurrentStep,
    nextStep,
    prevStep,
    resetForm,
    restoreFromDraft, // ✅ new
  } = useFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [draftModal, setDraftModal] = useState(null); // ✅ resume modal
  const [showSavedToast, setShowSavedToast] = useState(false); // ✅ toast

  // ✅ PEHLE useForm
  const methods = useForm({
    defaultValues: formData,
    mode: "onBlur",
  });

  const { watch, reset, getValues, setError, clearErrors } = methods;

  // ✅ watch — tab schemas banega
  const loanType = watch("loanType") || formData.loanType || "personal";
  const loanAmount = watch("loanAmount") || formData.loanAmount || 0;
  const employmentType =
    watch("employmentType") || formData.employmentType || "salaried";
  const panVerified = watch("panVerified") || formData.panVerified || false;

  const effectiveLoanAmount = Number(loanAmount) || 0;

  // ✅ Step 6 visibility — PDF B2.1
  const skipCoApplicant =
    loanType === "home"
      ? false
      : loanType === "business"
        ? effectiveLoanAmount <= 2000000
        : effectiveLoanAmount <= 500000;

  // ✅ schemas — watch ke baad
  const schemas = [
    step1Schema,
    step2Schema,
    step3Schema(loanType),
    step4Schema,
    step5Schema(loanType),
    step6Schema,
    step7Schema(loanType, employmentType, panVerified),
    step8Schema,
  ];

  const currentSchema = schemas[currentStep];

  // ✅ Page load pe draft check karo — PDF Section C3.4
  useEffect(() => {
    const checkDraft = async () => {
      const draft = await loadDraft();
      if (draft) {
        setDraftModal(draft);
      }
    };
    checkDraft();
  }, []);

  // ✅ Auto-save — har 30 seconds — PDF Section C3.4
  useEffect(() => {
    const subscription = watch((value) => {
      const handler = setTimeout(async () => {
        const cleaned = Object.fromEntries(
          Object.entries(value).filter(([_, v]) => v !== undefined),
        );
        setFormData(cleaned);
        // AES-256 encrypted save
        await saveDraft(cleaned, currentStep);
        // Toast dikhao
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 2000);
      }, 30000);
      return () => clearTimeout(handler);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData, currentStep]);

  // Clear errors on step change
  useEffect(() => {
    clearErrors();
  }, [currentStep]);

  // Form reset once on mount
  useEffect(() => {
    reset(formData);
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    setFormData(data);

    const currentLoanType = data.loanType || loanType;
    const currentAmount = Number(data.loanAmount) || 0;

    const shouldSkip =
      currentLoanType === "home"
        ? false
        : currentLoanType === "business"
          ? currentAmount <= 2000000
          : currentAmount <= 500000;

    if (currentStep === schemas.length - 1) {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 2000));
      setIsSubmitting(false);
      setIsSuccess(true);
      // ✅ Clear draft on success — PDF Section C3.4
      clearAllDrafts();
    } else {
      if (currentStep === 4 && shouldSkip) {
        setCurrentStep(6);
      } else {
        nextStep();
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 6 && skipCoApplicant) {
      setCurrentStep(4);
    } else {
      prevStep();
    }
  };

  const handleContinue = async () => {
    // ✅ Step 3 — PAN + Aadhaar verified check
    if (currentStep === 2) {
      const panOk = getValues("panVerified");
      const aadhaarOk = getValues("aadhaarVerified");
      const consentOk = getValues("aadhaarConsent");

      if (!panOk) {
        setError("pan", { message: "PAN must be verified before proceeding" });
        return;
      }
      if (!aadhaarOk) {
        setError("aadhaar", {
          message: "Aadhaar must be verified before proceeding",
        });
        return;
      }
      if (!consentOk) {
        setError("aadhaarConsent", { message: "Aadhaar consent is required" });
        return;
      }
    }

    const resolver = zodResolver(currentSchema);
    const values = getValues();
    const { errors } = await resolver(values, {}, { fields: {} });

    if (Object.keys(errors).length > 0) {
      console.log("Validation Errors:", errors);
      const errorMessages = Object.values(errors)
        .map((err) => err.message)
        .filter(Boolean);

      if (errorMessages.length > 0) {
        alert("Please fix the following errors:\n\n- " + errorMessages.join("\n- "));
      } else {
        alert("Validation Error in fields: " + Object.keys(errors).join(", "));
      }

      Object.keys(errors).forEach((key) => setError(key, errors[key]));
      return;
    }

    await onSubmit(values);
  };

  const handleReset = () => {
    resetForm();
    setIsSuccess(false);
  };

  return (
    <div className="glass-panel p-6 sm:p-10 w-full animate-fade-in relative z-20">
      {/* ✅ Resume Modal — PDF Section C3.4 */}
      {draftModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-lg text-slate-800 mb-2">
              Saved Application Found
            </h3>
            <p className="text-slate-600 text-sm mb-1">
              You have a saved{" "}
              <span className="font-semibold capitalize">
                {draftModal.loanType}
              </span>{" "}
              Loan application.
            </p>
            <p className="text-slate-500 text-xs mb-4">
              Would you like to resume from Step {(draftModal.step || 0) + 1}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  restoreFromDraft(draftModal.formData, draftModal.step);
                  reset(draftModal.formData);
                  setDraftModal(null);
                }}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Resume
              </button>
              <button
                onClick={() => {
                  clearAllDrafts();
                  setDraftModal(null);
                }}
                className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Auto-save toast — PDF Section C3.4 */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white text-sm px-4 py-2 rounded-xl shadow-lg animate-fade-in">
          ✅ Draft saved at{" "}
          {new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}

      {!isSuccess && (
        <ProgressBar
          currentStep={currentStep}
          skipCoApplicant={skipCoApplicant}
        />
      )}

      {isSuccess ? (
        <SuccessScreen resetForm={handleReset} />
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleContinue();
            }}
            className="space-y-6"
          >
            <div className="min-h-[400px]">
              <StepRenderer currentStep={currentStep} />
            </div>

            <StepNavigation
              currentStep={currentStep}
              totalSteps={schemas.length}
              onBack={handleBack}
              onContinue={handleContinue}
              isSubmitting={isSubmitting}
            />
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default Wizard;
