import React from 'react';
import Input from '../components/common/Input';
import RadioGroup from '../components/common/RadioGroup';

const Step2PersonalInfo = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
        <p className="text-slate-500 mt-1">Please provide your basic details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="First Name" name="firstName" placeholder="John" />
        <Input label="Last Name" name="lastName" placeholder="Doe" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Email Address" name="email" type="email" placeholder="john.doe@example.com" />
        <Input label="Phone Number" name="phone" type="tel" placeholder="9876543210" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Date of Birth" name="dob" type="date" />
        <RadioGroup 
          label="Gender" 
          name="gender" 
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]} 
        />
      </div>
    </div>
  );
};

export default Step2PersonalInfo;