import React from 'react';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

const Select = ({ label, name, options, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const hasError = !!errors[name];

  return (
    <div className="w-full mb-4">
      <label htmlFor={name} className="label-text">{label}</label>
      <select
        id={name}
        className={`input-field appearance-none cursor-pointer ${hasError ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
        {...register(name)}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorMessage name={name} />
    </div>
  );
};

export default Select;
