import React from 'react';
import { useFormContext } from 'react-hook-form';

const ErrorMessage = ({ name }) => {
  const { formState: { errors } } = useFormContext();
  
  // Handle nested errors if necessary (e.g. nested objects)
  const getErrorMessage = (fieldName, errorsObj) => {
    return fieldName.split('.').reduce((acc, part) => acc && acc[part], errorsObj)?.message;
  };

  const errorMessage = getErrorMessage(name, errors);

  if (!errorMessage) return null;

  return (
    <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">
      {errorMessage}
    </p>
  );
};

export default ErrorMessage;
