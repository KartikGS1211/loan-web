import React from 'react';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

const RadioGroup = ({ label, name, options }) => {
  const { register, formState: { errors } } = useFormContext();
  const hasError = !!errors[name];

  return (
    <div className="w-full mb-4">
      <label className="label-text">{label}</label>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex-1 justify-center">
            <input
              type="radio"
              value={opt.value}
              {...register(name)}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="text-slate-700 font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};

export default RadioGroup;
