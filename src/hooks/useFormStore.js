// src/hooks/useFormStore.js
import { create } from "zustand";
import { encryptData, decryptData } from "../utils/encryption";

// ── Auto-save key format — PDF Section C3.4
const getDraftKey = (loanType) => `lendswift_draft_${loanType || "personal"}`;
const META_KEY = "lendswift_draft_meta";
const TTL_HOURS = 72;

// ── Save to localStorage with AES-256 encryption — PDF Section C3.4
export const saveDraft = async (formData, currentStep) => {
  try {
    const encrypted = await encryptData(formData);
    const meta = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      step: currentStep,
      loanType: formData.loanType || "personal",
    };
    localStorage.setItem(getDraftKey(formData.loanType), encrypted);
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch (err) {
    console.error("Auto-save failed:", err);
  }
};

// ── Load from localStorage — PDF Section C3.4
export const loadDraft = async () => {
  try {
    const metaRaw = localStorage.getItem(META_KEY);
    if (!metaRaw) return null;

    const meta = JSON.parse(metaRaw);

    // TTL check — 72 hours — PDF Section A1.5
    const savedAt = new Date(meta.timestamp);
    const hoursPassed = (Date.now() - savedAt.getTime()) / (1000 * 60 * 60);
    if (hoursPassed > TTL_HOURS) {
      clearDraft(meta.loanType);
      return null;
    }

    const encrypted = localStorage.getItem(getDraftKey(meta.loanType));
    if (!encrypted) return null;

    const formData = await decryptData(encrypted);
    return { formData, step: meta.step, loanType: meta.loanType };
  } catch (err) {
    // Corrupted data — start fresh — PDF Section E3.1
    console.error("Draft load failed — corrupted data:", err);
    clearAllDrafts();
    return null;
  }
};

// ── Clear draft on submit — PDF Section C3.4
export const clearDraft = (loanType) => {
  localStorage.removeItem(getDraftKey(loanType));
  localStorage.removeItem(META_KEY);
};

export const clearAllDrafts = () => {
  ["personal", "home", "business"].forEach((t) => {
    localStorage.removeItem(getDraftKey(t));
  });
  localStorage.removeItem(META_KEY);
};

// ── Empty form state — all fields matching Step 1-8 components
const EMPTY_FORM = {
  // Step 1 — Loan Details
  loanType: "",
  loanAmount: "",
  loanTenure: "",
  loanPurpose: "",
  referralCode: "",

  // Step 2 — Personal Info
  fullName: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  fatherName: "",
  motherName: "",
  email: "",
  phone: "",
  alternatePhone: "",

  // Step 3 — KYC
  pan: "",
  aadhaar: "",
  aadhaarConsent: false,
  panVerified: false,
  aadhaarVerified: false,
  voterId: "",
  passport: "",

  // Step 4 — Address
  currentAddressLine1: "",
  currentAddressLine2: "",
  pincode: "",
  city: "",
  state: "",
  residenceType: "",
  rentAmount: "",
  yearsAtAddress: "",
  prevAddressLine1: "",
  prevCity: "",
  prevState: "",
  prevPincode: "",
  sameAsPermanent: true,
  permanentAddressLine1: "",
  permanentAddressLine2: "",
  permanentCity: "",
  permanentState: "",
  permanentPincode: "",

  // Step 5 — Employment
  employmentType: "",
  companyName: "",
  designation: "",
  monthlyIncome: "",
  yearsOfExperience: "",
  businessName: "",
  businessType: "",
  annualTurnover: "",
  yearsInBusiness: "",
  selfEmployedMonthlyIncome: "",
  gstNumber: "",
  officeAddressLine1: "",
  officeCity: "",
  officeState: "",
  officePincode: "",

  // Step 6 — Co-Applicant
  coApplicantName: "",
  relationship: "",
  coApplicantPan: "",
  coApplicantIncome: "",
  coApplicantConsent: false,
  coApplicantSignature: null,

  // Step 7 — Documents & Signature
  uploadedFiles: {},
  panCardDoc: null,
  aadhaarFront: null,
  aadhaarBack: null,
  bankStatement: null,
  photograph: null,
  salarySlip1: null,
  salarySlip2: null,
  salarySlip3: null,
  itr1: null,
  itr2: null,
  propertyDoc: null,
  businessRegCert: null,
  gstReturn1: null,
  gstReturn2: null,
  gstReturn3: null,
  gstReturn4: null,
  signature: null,

  // Step 8 — Consents
  consentAccuracy: false,
  consentCibil: false,
  consentTerms: false,
  consentCommunication: false,
  consentHighEmi: false,
};

// ── Zustand store — NO persist middleware (manual encrypted save)
export const useFormStore = create((set, get) => ({
  formData: { ...EMPTY_FORM },
  currentStep: 0,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
    })),

  resetForm: () =>
    set({
      formData: { ...EMPTY_FORM },
      currentStep: 0,
    }),

  // ── Restore from decrypted draft — called from resume modal
  restoreFromDraft: (formData, step) =>
    set({
      formData: { ...EMPTY_FORM, ...formData },
      currentStep: step || 0,
    }),
}));
