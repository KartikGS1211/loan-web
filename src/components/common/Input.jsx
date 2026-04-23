import React from 'react';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

const Input = ({ label, name, type = 'text', placeholder, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const hasError = !!errors[name];

  return (
    <div className="w-full mb-4">
      <label htmlFor={name} className="label-text">{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`input-field ${hasError ? 'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50' : ''}`}
        {...register(name, { 
          setValueAs: v => type === 'number' ? (v === '' ? undefined : Number(v)) : v
        })}
        {...props}
      />
      <ErrorMessage name={name} />
    </div>
  );
};

export default Input;