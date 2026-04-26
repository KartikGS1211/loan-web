import React, { useCallback, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";
import { UploadCloud, X, CheckCircle, FileText } from "lucide-react";

// Image compression — PDF Section C4
const compressImage = async (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_WIDTH = 1200;
      let { width, height } = img;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const tryCompress = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (blob.size > 2 * 1024 * 1024 && quality > 0.3) {
              tryCompress(quality - 0.1);
            } else {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve({
                file: compressedFile,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                preview: URL.createObjectURL(compressedFile),
              });
            }
          },
          "image/jpeg",
          quality,
        );
      };
      tryCompress(0.7);
    };
    img.src = url;
  });
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Single document upload zone component
const DocumentUploadZone = ({
  docKey,
  label,
  required,
  accept,
  maxSize,
  files,
  error,
  onDrop,
  onRemove,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(docKey, acceptedFiles, maxSize),
    accept: accept,
    maxFiles: 10,
  });

  const uploaded = files[docKey] || [];
  const isUploaded = uploaded.length > 0;

  return (
    <div
      className={`p-4 border rounded-2xl space-y-3 ${isUploaded ? "border-green-300 bg-green-50" : "border-slate-200 bg-white"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isUploaded ? (
            <CheckCircle size={16} className="text-green-600" />
          ) : (
            <FileText size={16} className="text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        {!required && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Optional
          </span>
        )}
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-300 hover:bg-slate-50"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud size={20} className="mx-auto mb-1 text-slate-400" />
        <p className="text-xs text-slate-500">Drop here or click to upload</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Max {formatSize(maxSize)} per file
        </p>
      </div>

      {/* File previews */}
      {uploaded.length > 0 && (
        <div className="space-y-2">
          {uploaded.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-xl"
            >
              {item.preview && item.file?.type?.startsWith("image/") ? (
                <img
                  src={item.preview}
                  alt="preview"
                  className="w-10 h-10 object-cover rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-slate-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {item.file.name}
                </p>
                {item.compressedSize ? (
                  <p className="text-xs text-green-600">
                    {formatSize(item.originalSize)} →{" "}
                    {formatSize(item.compressedSize)} (compressed)
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    {formatSize(item.file.size)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(docKey, idx)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
          ⚠️ {error.message}
        </p>
      )}
    </div>
  );
};

const Step7Documents = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const employmentType = watch("employmentType");
  const panVerified = watch("panVerified");
  const signature = watch("signature");

  const sigRef = useRef(null);

  // Files stored as { [docKey]: [{file, preview, originalSize, compressedSize}] }
  const files = watch("uploadedFiles") || {};

  // Handle file drop with compression — PDF Section C4
  const handleDrop = useCallback(
    async (docKey, acceptedFiles, maxSize) => {
      const processed = [];

      for (const file of acceptedFiles) {
        // File size check
        if (file.size > maxSize) {
          alert(`${file.name} exceeds maximum size of ${formatSize(maxSize)}`);
          continue;
        }

        // File type check
        const fileType = file.type || "";
        const isImage = fileType.startsWith("image/");
        const isPdf = fileType === "application/pdf";

        if (!isImage && !isPdf) {
          alert(
            `${file.name} is not a valid file type. Only PDF, JPG, PNG allowed.`,
          );
          continue;
        }

        if (isImage) {
          // Compress image — PDF Section C4
          const result = await compressImage(file);
          processed.push(result);
        } else {
          // PDF — no compression
          processed.push({
            file,
            originalSize: file.size,
            compressedSize: null,
            preview: null,
          });
        }
      }

      const existing = files[docKey] || [];
      setValue(
        "uploadedFiles",
        {
          ...files,
          [docKey]: [...existing, ...processed],
        },
        { shouldValidate: true },
      );
    },
    [files, setValue],
  );

  const handleRemove = (docKey, idx) => {
    const updated = (files[docKey] || []).filter((_, i) => i !== idx);
    setValue(
      "uploadedFiles",
      { ...files, [docKey]: updated },
      { shouldValidate: true },
    );
  };

  // Signature handlers — PDF Section A1.7
  const handleSignatureEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.toDataURL("image/png");
      setValue("signature", dataUrl, { shouldValidate: true });
    }
  };

  const handleSignatureClear = () => {
    sigRef.current?.clear();
    setValue("signature", null, { shouldValidate: true });
  };

  // Build document list based on loan type + employment — PDF Section B2.1
  const getRequiredDocs = () => {
    const docs = [
      {
        key: "panCard",
        label: "PAN Card Copy",
        required: !panVerified, // optional if PAN verified — PDF Section B3
        accept: {
          "image/*": [".jpg", ".jpeg", ".png"],
          "application/pdf": [".pdf"],
        },
        maxSize: 5 * 1024 * 1024,
      },
      {
        key: "aadhaarFront",
        label: "Aadhaar Card Front",
        required: true,
        accept: {
          "image/*": [".jpg", ".jpeg", ".png"],
          "application/pdf": [".pdf"],
        },
        maxSize: 5 * 1024 * 1024,
      },
      {
        key: "aadhaarBack",
        label: "Aadhaar Card Back",
        required: true,
        accept: {
          "image/*": [".jpg", ".jpeg", ".png"],
          "application/pdf": [".pdf"],
        },
        maxSize: 5 * 1024 * 1024,
      },
      {
        key: "bankStatement",
        label: "Bank Statement (Last 6 months)",
        required: true,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 10 * 1024 * 1024,
      },
      {
        key: "photograph",
        label: "Passport Size Photograph",
        required: true,
        accept: { "image/*": [".jpg", ".jpeg", ".png"] },
        maxSize: 2 * 1024 * 1024,
      },
    ];

    // Salaried — salary slips — PDF Section B2.1
    if (employmentType === "salaried") {
      docs.push({
        key: "salarySlips",
        label: "Salary Slips (Last 3 months)",
        required: true,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 5 * 1024 * 1024,
      });
    }

    // Self-Employed / Business Owner — ITR — PDF Section B2.1
    if (
      employmentType === "self-employed" ||
      employmentType === "business-owner"
    ) {
      docs.push({
        key: "itr",
        label: "ITR (Last 2 years)",
        required: true,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 5 * 1024 * 1024,
      });
    }

    // Home Loan — property docs — PDF Section B2.1
    if (loanType === "home") {
      docs.push({
        key: "propertyDoc",
        label: "Property Documents",
        required: true,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 10 * 1024 * 1024,
      });
    }

    // Business Loan — registration + GST returns — PDF Section B2.1
    if (loanType === "business") {
      docs.push(
        {
          key: "businessRegCert",
          label: "Business Registration Certificate",
          required: true,
          accept: { "application/pdf": [".pdf"] },
          maxSize: 5 * 1024 * 1024,
        },
        {
          key: "gstReturns",
          label: "GST Returns (Last 4 quarters)",
          required: true,
          accept: { "application/pdf": [".pdf"] },
          maxSize: 5 * 1024 * 1024,
        },
      );
    }

    return docs;
  };

  const requiredDocs = getRequiredDocs();
  const uploadedCount = requiredDocs.filter(
    (doc) => doc.required && (files[doc.key] || []).length > 0,
  ).length;
  const totalRequired = requiredDocs.filter((d) => d.required).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Documents & E-Signature
        </h2>
        <p className="text-slate-500 mt-1">
          Upload required documents and sign electronically.
        </p>
      </div>

      {/* Progress bar for uploads */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600 font-medium">Upload Progress</span>
          <span className="text-indigo-600 font-medium">
            {uploadedCount}/{totalRequired} Required
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{
              width: `${totalRequired > 0 ? (uploadedCount / totalRequired) * 100 : 0}%`,
            }}
          />
        </div>
        {panVerified && (
          <p className="text-green-600 text-xs mt-2">
            ✅ PAN was verified digitally — PAN card upload is optional.
          </p>
        )}
      </div>

      {/* Document upload zones */}
      <div className="space-y-4">
        {requiredDocs.map((doc) => (
          <DocumentUploadZone
            key={doc.key}
            docKey={doc.key}
            label={doc.label}
            required={doc.required}
            accept={doc.accept}
            maxSize={doc.maxSize}
            files={files}
            error={errors[doc.key]}
            onDrop={handleDrop}
            onRemove={handleRemove}
          />
        ))}
      </div>

      {/* E-Signature — PDF Section A1.7 */}
      <div className="pt-6 border-t border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-700">
            E-Signature <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleSignatureClear}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Clear
          </button>
        </div>

        <p className="text-slate-400 text-xs mb-3">
          Draw your signature using mouse or touch. This will be used as your
          electronic signature.
        </p>

        <div
          className={`border-2 rounded-xl overflow-hidden bg-white ${
            errors.signature
              ? "border-red-400"
              : signature
                ? "border-green-400"
                : "border-slate-300"
          }`}
        >
          <SignatureCanvas
            ref={sigRef}
            penColor="#1e293b"
            canvasProps={{
              className: "w-full",
              height: 160,
              style: { touchAction: "none", cursor: "crosshair" },
            }}
            onEnd={handleSignatureEnd}
          />
        </div>

        {errors.signature && (
          <p
            role="alert"
            aria-live="polite"
            className="text-red-500 text-sm mt-1"
          >
            {errors.signature.message}
          </p>
        )}

        {/* Signature preview */}
        {signature && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-green-700 text-sm">
              E-signature captured successfully.
            </p>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-2">
          By signing above, I confirm all provided information is accurate and
          authorize LendSwift to process my loan application as per IT Act, 2000
          Section 3A.
        </p>
      </div>
    </div>
  );
};

export default Step7Documents;
