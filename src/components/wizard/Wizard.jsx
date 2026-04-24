import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "../../hooks/useFormStore";

import ProgressBar from "./ProgressBar";
import StepNavigation from "./StepNavigation";
import StepRenderer from "./StepRenderer";
import SuccessScreen from "./SuccessScreen";

// Import all schemas to dynamically pick based on current step
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

const schemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
];

const Wizard = () => {
  const {
    formData,
    currentStep,
    setFormData,
    setCurrentStep,
    nextStep,
    prevStep,
    resetForm,
  } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm({
    resolver: zodResolver(schemas[currentStep]),
    defaultValues: formData,
    mode: "onChange",
  });

  const { watch, reset, trigger, getValues } = methods;
  // Determine if we should skip co-applicant using latest available amount.
  // Watch value is used first so decisions react immediately to current form edits.
  const watchedLoanAmount = watch("loanAmount");
  const effectiveLoanAmount = Number.isFinite(watchedLoanAmount)
    ? watchedLoanAmount
    : Number(formData.loanAmount);
  const skipCoApplicant = effectiveLoanAmount <= 500000;

  // Auto-save logic (every 2 seconds if changed)
  useEffect(() => {
    const subscription = watch((value) => {
      const handler = setTimeout(() => {
        // Clean undefined values so unmounted fields don't overwrite formData with undefined
        const cleanedValue = Object.fromEntries(
          Object.entries(value).filter(([_, v]) => v !== undefined),
        );
        setFormData(cleanedValue);
      }, 2000);
      return () => clearTimeout(handler);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  // Sync form when global state changes on load
  useEffect(() => {
    reset(formData);
  }, [reset]); // only run on mount and when reset changes

  const onSubmit = async (data) => {
    setFormData(data);
    const shouldSkipCoApplicant = Number(data.loanAmount) <= 500000;

    if (currentStep === schemas.length - 1) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      setIsSuccess(true);
    } else {
      // Handle conditional skip for co-applicant
      if (currentStep === 4 && shouldSkipCoApplicant) {
        setCurrentStep(6); // Skip step 5 (Co-applicant)
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

  const handleReset = () => {
    resetForm();
    setIsSuccess(false);
  };
  const handleContinue = async () => {
    let isValid = false;

    //Step 7 (Documents + Signature)
    if (currentStep === 6) {
      isValid = await trigger(["documents", "signature"]);
    } else {
      isValid = await trigger();
    }

    if (!isValid) return;

    await onSubmit(getValues());
  };

  return (
    <div className="glass-panel p-6 sm:p-10 w-full animate-fade-in relative z-20">
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
            onSubmit={(event) => {
              event.preventDefault();
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
