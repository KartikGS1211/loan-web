import React from 'react';
import Input from '../components/common/Input';

const Step4Address = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Current Address</h2>
        <p className="text-slate-500 mt-1">Where do you currently reside?</p>
      </div>

      <Input label="Address Line 1" name="addressLine1" placeholder="House/Flat No., Building Name" />
      <Input label="Address Line 2 (Optional)" name="addressLine2" placeholder="Street, Area, Landmark" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="City" name="city" placeholder="Mumbai" />
        <Input label="State" name="state" placeholder="Maharashtra" />
        <Input label="Pincode" name="pincode" type="text" placeholder="400001" maxLength={6} />
      </div>
    </div>
  );
};

export default Step4Address;
