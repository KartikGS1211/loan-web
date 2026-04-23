import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { UploadCloud, X } from "lucide-react";
import ErrorMessage from "./ErrorMessage";

const FileUpload = ({ name, label }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const files = watch(name) || [];

  const onDrop = useCallback(
    (acceptedFiles) => {
      // In a real app, you might upload these immediately and store URLs
      // For this demo, we store object URLs or just file names
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      setValue(name, [...files, ...newFiles], { shouldValidate: true });
    },
    [files, setValue, name],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
      "application/pdf": [".pdf"],
    },
  });

  const removeFile = (indexToRemove) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    setValue(name, updated, { shouldValidate: true });
  };

  return (
    <div className="mb-6">
      <label className="label-text">{label}</label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300
        ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
      >
        <input {...getInputProps({ "data-cy": "document-upload" })} />
        <UploadCloud
          className={`mx-auto h-12 w-12 mb-3 ${isDragActive ? "text-indigo-500" : "text-slate-400"}`}
        />
        <p className="text-slate-600 font-medium">
          Drag & drop files here, or click to select
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Supports PDF, JPG, PNG up to 5MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden border border-slate-200 bg-white group shadow-sm"
            >
              {file.type?.includes("image") ? (
                <img
                  src={file.preview}
                  alt="preview"
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="h-24 w-full flex items-center justify-center bg-slate-100 text-slate-500 font-medium text-sm p-2 text-center break-all">
                  {file.name}
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <ErrorMessage name={name} />
    </div>
  );
};

export default FileUpload;
