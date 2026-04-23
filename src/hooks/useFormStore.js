import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFormStore = create(
  persist(
    (set) => ({
      formData: {
        loanAmount: 800000,
        loanTenure: 12,
        loanType: 'personal',
        
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        
        pan: '',
        aadhaar: '',
        
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        
        employmentType: 'salaried',
        companyName: '',
        monthlyIncome: '',
        businessName: '',
        annualTurnover: '',
        
        coApplicantFirstName: '',
        coApplicantLastName: '',
        coApplicantPan: '',
        coApplicantIncome: '',
        
        documents: [],
        signature: null,
      },
      currentStep: 0,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: state.currentStep > 0 ? state.currentStep - 1 : 0 })),
      resetForm: () => set({ 
        currentStep: 0, 
        formData: {
          loanAmount: 800000,
          loanTenure: 12,
          loanType: 'personal',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dob: '',
          gender: '',
          pan: '',
          aadhaar: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          employmentType: 'salaried',
          companyName: '',
          monthlyIncome: '',
          businessName: '',
          annualTurnover: '',
          coApplicantFirstName: '',
          coApplicantLastName: '',
          coApplicantPan: '',
          coApplicantIncome: '',
          documents: [],
          signature: null,
        } 
      }),
    }),
    {
      name: 'loan-app-storage',
      version: 1, // Bump version to force clear old localStorage cache
    }
  )
);
