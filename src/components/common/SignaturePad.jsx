import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useFormContext } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

const SignaturePad = ({ name, label }) => {
  const sigCanvas = useRef(null);
  const {
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const signatureValue = watch(name);

  // Initialize canvas with existing value if any
  useEffect(() => {
    if (signatureValue && sigCanvas.current && sigCanvas.current.isEmpty()) {
      sigCanvas.current.fromDataURL(signatureValue);
    }
  }, [signatureValue]);

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      try {
        // Avoid getTrimmedCanvas as it can sometimes crash
        const dataUrl = sigCanvas.current.getCanvas().toDataURL("image/png");
        setValue(name, dataUrl, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        clearErrors(name);
      } catch (err) {
        console.error("Signature save error:", err);
      }
    } else {
      // If empty, set to null
      setValue(name, null, { shouldValidate: true });
    }
  };

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setValue(name, null, { shouldValidate: true, shouldDirty: true });
  };

  // Aggressive fallback: constantly check if canvas has ink but form is null
  useEffect(() => {
    const interval = setInterval(() => {
      if (sigCanvas.current && !sigCanvas.current.isEmpty() && !watch(name)) {
        saveSignature();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [name, watch]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="label-text mb-0">{label}</label>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Clear
        </button>
      </div>

      <div
        className={`border-2 rounded-xl overflow-hidden bg-white ${errors[name] ? "border-red-400 ring-2 ring-red-100" : "border-slate-300"}`}
        onMouseUp={saveSignature}
        onTouchEnd={saveSignature}
        onClick={saveSignature}
      >
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={saveSignature}
          penColor="blue"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
            id: "signature-pad",
          }}
        />
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};

export default SignaturePad;
