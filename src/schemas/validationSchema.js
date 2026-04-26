import { z } from "zod";

// ============================================
// STEP 1 — PDF Section B2.1
// ============================================
const LOAN_PURPOSES = {
  personal: [
    "Medical",
    "Education",
    "Travel",
    "Wedding",
    "Home Renovation",
    "Other",
  ],
  home: ["Purchase", "Construction", "Renovation", "Plot Purchase"],
  business: [
    "Working Capital",
    "Equipment Purchase",
    "Business Expansion",
    "Other",
  ],
};

export const step1Schema = z
  .object({
    loanType: z.enum(["personal", "home", "business"], {
      errorMap: () => ({ message: "Please select a loan type" }),
    }),
    loanAmount: z
      .number({ invalid_type_error: "Please enter a valid amount" })
      .min(50000, "Minimum loan amount is ₹50,000"),
    loanTenure: z
      .number({ invalid_type_error: "Please enter tenure in months" })
      .min(1, "Please select tenure"),
    loanPurpose: z.string().min(1, "Please select a loan purpose"),
    referralCode: z
      .string()
      .regex(
        /^[a-zA-Z0-9]{6,10}$/,
        "Referral code must be 6–10 alphanumeric characters",
      )
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Amount max per type
    const maxAmount = { personal: 1000000, home: 10000000, business: 5000000 };
    const maxLabel = {
      personal: "₹10,00,000",
      home: "₹1,00,00,000",
      business: "₹50,00,000",
    };
    if (data.loanType && data.loanAmount > maxAmount[data.loanType]) {
      ctx.addIssue({
        path: ["loanAmount"],
        code: z.ZodIssueCode.custom,
        message: `${data.loanType.charAt(0).toUpperCase() + data.loanType.slice(1)} Loan max amount is ${maxLabel[data.loanType]}`,
      });
    }

    // Tenure range per type
    const tenureRange = {
      personal: { min: 12, max: 60, label: "12–60 months" },
      home: { min: 60, max: 360, label: "60–360 months" },
      business: { min: 12, max: 120, label: "12–120 months" },
    };
    if (data.loanType) {
      const { min, max, label } = tenureRange[data.loanType];
      if (data.loanTenure < min || data.loanTenure > max) {
        ctx.addIssue({
          path: ["loanTenure"],
          code: z.ZodIssueCode.custom,
          message: `${data.loanType.charAt(0).toUpperCase() + data.loanType.slice(1)} Loan tenure must be ${label}`,
        });
      }
    }

    // Purpose must be valid for loan type
    if (data.loanType && data.loanPurpose) {
      const validPurposes = LOAN_PURPOSES[data.loanType] || [];
      if (!validPurposes.includes(data.loanPurpose)) {
        ctx.addIssue({
          path: ["loanPurpose"],
          code: z.ZodIssueCode.custom,
          message: "Invalid loan purpose for selected loan type",
        });
      }
    }
  });

// Export purposes for use in Step1 component
export { LOAN_PURPOSES };

// ============================================
// STEP 2 — PDF Section B2.1
// ============================================
export const step2Schema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name is required (min 2 characters)")
      .max(100, "Name too long")
      .regex(
        /^[a-zA-Z\s.]+$/,
        "Name can only contain letters, spaces, and periods",
      ),

    dob: z.string().refine((date) => {
      if (!date) return false;
      const today = new Date();
      const birth = new Date(date);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= 21 && age <= 65;
    }, "Age must be between 21 and 65 years"),

    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Please select gender" }),
    }),

    maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
      errorMap: () => ({ message: "Please select marital status" }),
    }),

    fatherName: z
      .string()
      .min(2, "Father's name is required")
      .max(100)
      .regex(
        /^[a-zA-Z\s.]+$/,
        "Name can only contain letters, spaces, and periods",
      ),

    motherName: z
      .string()
      .min(2, "Mother's name is required")
      .max(100)
      .regex(
        /^[a-zA-Z\s.]+$/,
        "Name can only contain letters, spaces, and periods",
      ),

    email: z.string().email("Please enter a valid email address"),

    phone: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        "Enter valid 10-digit mobile number starting with 6–9",
      ),

    alternatePhone: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        "Enter valid 10-digit mobile number starting with 6–9",
      )
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.alternatePhone && data.alternatePhone === data.phone) {
      ctx.addIssue({
        path: ["alternatePhone"],
        code: z.ZodIssueCode.custom,
        message: "Alternate mobile must be different from primary mobile",
      });
    }
  });

// ============================================
// STEP 3 — PDF Section B2.1 + C3.1 + C3.2
// ============================================
const verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
const verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const validateVerhoeff = (num) => {
  let c = 0;
  const arr = num.split("").reverse().map(Number);
  for (let i = 0; i < arr.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][arr[i]]];
  }
  return c === 0;
};

const validatePAN = (pan, loanType) => {
  const upper = pan.toUpperCase();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(upper)) return false;
  const fourth = upper[3];
  if (loanType === "business") return ["P", "C", "F"].includes(fourth);
  return fourth === "P";
};

export const step3Schema = (loanType, loanAmount = 0) =>
  z.object({
    pan: z
      .string()
      .length(10, "PAN must be exactly 10 characters")
      .refine(
        (val) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val.toUpperCase()),
        "PAN format must be AAAAA9999A (5 letters, 4 digits, 1 letter)",
      )
      .refine(
        (val) => validatePAN(val, loanType),
        loanType === "business"
          ? "PAN 4th character must be P (Individual), C (Company), or F (Firm) for Business Loan"
          : "PAN 4th character must be P — only Individual PAN accepted for this loan type",
      ),

    aadhaar: z
      .string()
      .regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits")
      .refine(
        validateVerhoeff,
        "Invalid Aadhaar number — checksum verification failed",
      ),

    aadhaarConsent: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must provide Aadhaar consent to proceed",
      ),

    voterId: z
      .string()
      .regex(
        /^[A-Z]{3}[0-9]{7}$/,
        "Voter ID format: 3 uppercase letters + 7 digits",
      )
      .optional()
      .or(z.literal("")),

    // Passport: shown only for Home Loan > 50L — PDF Section B2.1
    passport: z
      .string()
      .regex(
        /^[A-Z]{1}[0-9]{7}$/,
        "Passport format: 1 uppercase letter + 7 digits",
      )
      .optional()
      .or(z.literal("")),
  });

// ============================================
// STEP 4 — PDF Section B2.1 + A3.3
// ============================================
export const step4Schema = z
  .object({
    currentAddressLine1: z
      .string()
      .min(5, "Address Line 1 required (min 5 characters)")
      .max(200, "Address too long"),

    currentAddressLine2: z.string().max(200).optional(),

    pincode: z.string().regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),

    city: z.string().min(2, "City is required"),

    state: z.string().min(2, "State is required"),

    residenceType: z.enum(["owned", "rented", "company", "family"], {
      errorMap: () => ({ message: "Please select residence type" }),
    }),

    rentAmount: z.preprocess(
      (val) => (Number.isNaN(val) || val === "" ? undefined : Number(val)),
      z.number().min(0).optional()
    ),

    yearsAtAddress: z
      .number({ invalid_type_error: "Please enter years at this address" })
      .min(0, "Cannot be negative")
      .max(50, "Maximum 50 years"),

    prevAddressLine1: z.string().optional(),
    prevCity: z.string().optional(),
    prevState: z.string().optional(),
    prevPincode: z
      .string()
      .regex(/^\d{6}$/, "Invalid PIN code")
      .optional()
      .or(z.literal("")),

    sameAsPermanent: z.boolean().optional(),

    permanentAddressLine1: z.string().optional(),
    permanentAddressLine2: z.string().optional(),
    permanentCity: z.string().optional(),
    permanentState: z.string().optional(),
    permanentPincode: z
      .string()
      .regex(/^\d{6}$/, "PIN code must be 6 digits")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Rent amount required if rented
    if (
      data.residenceType === "rented" &&
      (!data.rentAmount || data.rentAmount <= 0)
    ) {
      ctx.addIssue({
        path: ["rentAmount"],
        code: z.ZodIssueCode.custom,
        message: "Monthly rent amount is required",
      });
    }

    // Previous address required if < 1 year
    if (data.yearsAtAddress < 1) {
      if (!data.prevAddressLine1 || data.prevAddressLine1.length < 5) {
        ctx.addIssue({
          path: ["prevAddressLine1"],
          code: z.ZodIssueCode.custom,
          message:
            "Previous address required (you've lived here less than 1 year)",
        });
      }
      if (!data.prevCity) {
        ctx.addIssue({
          path: ["prevCity"],
          code: z.ZodIssueCode.custom,
          message: "Previous city is required",
        });
      }
      if (!data.prevState) {
        ctx.addIssue({
          path: ["prevState"],
          code: z.ZodIssueCode.custom,
          message: "Previous state is required",
        });
      }
    }

    // Permanent address required if not same as current
    if (!data.sameAsPermanent) {
      if (
        !data.permanentAddressLine1 ||
        data.permanentAddressLine1.length < 5
      ) {
        ctx.addIssue({
          path: ["permanentAddressLine1"],
          code: z.ZodIssueCode.custom,
          message: "Permanent address Line 1 is required",
        });
      }
      if (!data.permanentCity) {
        ctx.addIssue({
          path: ["permanentCity"],
          code: z.ZodIssueCode.custom,
          message: "Permanent city is required",
        });
      }
      if (!data.permanentState) {
        ctx.addIssue({
          path: ["permanentState"],
          code: z.ZodIssueCode.custom,
          message: "Permanent state is required",
        });
      }
      if (!data.permanentPincode) {
        ctx.addIssue({
          path: ["permanentPincode"],
          code: z.ZodIssueCode.custom,
          message: "Permanent PIN code is required",
        });
      }
    }
  });

// ============================================
// STEP 5 — PDF Section B2.1 + B3
// ============================================
export const step5Schema = (loanType) =>
  z
    .object({
      employmentType: z.enum(["salaried", "self-employed", "business-owner"], {
        errorMap: () => ({ message: "Please select employment type" }),
      }),
      companyName: z.string().optional(),
      designation: z.string().optional(),
      monthlyIncome: z.preprocess(
        (val) => (Number.isNaN(val) || val === "" ? undefined : Number(val)),
        z.number().optional()
      ),
      yearsOfExperience: z.preprocess(
        (val) => (Number.isNaN(val) || val === "" ? undefined : Number(val)),
        z.number().min(0).max(50).optional()
      ),
      businessName: z.string().optional(),
      businessType: z.string().optional(),
      annualTurnover: z.preprocess(
        (val) => (Number.isNaN(val) || val === "" ? undefined : Number(val)),
        z.number().optional()
      ),
      yearsInBusiness: z.preprocess(
        (val) => (Number.isNaN(val) || val === "" ? undefined : Number(val)),
        z.number().optional()
      ),
      // PDF: Monthly income for self-employed — used in EMI ratio
      selfEmployedMonthlyIncome: z.preprocess(
        (val) => (Number.isNaN(val) || val === "" ? undefined : Number(val)),
        z.number().optional()
      ),
      gstNumber: z.string().optional(),
      officeAddressLine1: z.string().optional(),
      officeCity: z.string().optional(),
      officeState: z.string().optional(),
      officePincode: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Business Loan → Salaried blocked
      if (loanType === "business" && data.employmentType === "salaried") {
        ctx.addIssue({
          path: ["employmentType"],
          code: z.ZodIssueCode.custom,
          message:
            "Business Loan applicants must be Self-Employed or Business Owner — not Salaried",
        });
      }

      if (data.employmentType === "salaried") {
        if (!data.companyName?.trim() || data.companyName.trim().length < 2)
          ctx.addIssue({
            path: ["companyName"],
            code: z.ZodIssueCode.custom,
            message: "Company name is required",
          });
        if (!data.designation?.trim() || data.designation.trim().length < 2)
          ctx.addIssue({
            path: ["designation"],
            code: z.ZodIssueCode.custom,
            message: "Designation is required",
          });
        if (!data.monthlyIncome || data.monthlyIncome < 15000)
          ctx.addIssue({
            path: ["monthlyIncome"],
            code: z.ZodIssueCode.custom,
            message: "Minimum monthly income is ₹15,000",
          });
        if (data.yearsOfExperience === undefined || data.yearsOfExperience < 0)
          ctx.addIssue({
            path: ["yearsOfExperience"],
            code: z.ZodIssueCode.custom,
            message: "Years of experience is required",
          });
      }

      if (
        data.employmentType === "self-employed" ||
        data.employmentType === "business-owner"
      ) {
        if (!data.businessName?.trim() || data.businessName.trim().length < 2)
          ctx.addIssue({
            path: ["businessName"],
            code: z.ZodIssueCode.custom,
            message: "Business name is required",
          });
        if (!data.businessType)
          ctx.addIssue({
            path: ["businessType"],
            code: z.ZodIssueCode.custom,
            message: "Business type is required",
          });
        if (!data.annualTurnover || data.annualTurnover < 300000)
          ctx.addIssue({
            path: ["annualTurnover"],
            code: z.ZodIssueCode.custom,
            message: "Minimum annual turnover is ₹3,00,000",
          });
        if (!data.yearsInBusiness || data.yearsInBusiness < 2)
          ctx.addIssue({
            path: ["yearsInBusiness"],
            code: z.ZodIssueCode.custom,
            message: "Minimum 2 years in business required",
          });
        // Self-employed monthly income — required for EMI ratio check
        if (
          !data.selfEmployedMonthlyIncome ||
          data.selfEmployedMonthlyIncome < 1
        )
          ctx.addIssue({
            path: ["selfEmployedMonthlyIncome"],
            code: z.ZodIssueCode.custom,
            message: "Monthly income is required",
          });
        if (!data.officeAddressLine1?.trim())
          ctx.addIssue({
            path: ["officeAddressLine1"],
            code: z.ZodIssueCode.custom,
            message: "Office/Business address is required",
          });
      }

      // GST required for Business Owner only
      if (data.employmentType === "business-owner") {
        const gstRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!data.gstNumber || !gstRegex.test(data.gstNumber)) {
          ctx.addIssue({
            path: ["gstNumber"],
            code: z.ZodIssueCode.custom,
            message:
              "Valid 15-character GST number is required (e.g. 22AAAAA0000A1Z5)",
          });
        }
      }
    });

// ============================================
// STEP 6 — PDF Section B2.1
// ============================================
export const step6Schema = z.object({
  coApplicantName: z
    .string()
    .min(2, "Co-applicant name is required")
    .max(100)
    .regex(
      /^[a-zA-Z\s.]+$/,
      "Name can only contain letters, spaces, and periods",
    ),

  relationship: z.enum(["spouse", "parent", "sibling", "business-partner"], {
    errorMap: () => ({ message: "Please select relationship" }),
  }),

  coApplicantPan: z
    .string()
    .length(10, "PAN must be exactly 10 characters")
    .refine(
      (val) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val.toUpperCase()),
      "PAN format must be AAAAA9999A",
    ),

  coApplicantIncome: z
    .number({ invalid_type_error: "Please enter co-applicant income" })
    .min(1, "Co-applicant income is required"),

  coApplicantConsent: z
    .boolean()
    .refine(
      (val) => val === true,
      "Co-applicant consent is required to proceed",
    ),

  coApplicantSignature: z
    .string()
    .nullable()
    .refine(
      (val) => val && val.length > 50,
      "Co-applicant signature is required",
    ),
});

// ============================================
// STEP 7 — PDF Section B2.1 (Conditional by loan + employment type)
// ============================================
export const step7Schema = (
  loanType = "personal",
  employmentType = "salaried",
  panVerified = false,
) =>
  z
    .object({
      uploadedFiles: z.any().optional(),
      signature: z
        .string()
        .nullable()
        .refine((val) => val && val.length > 50, "E-signature is required"),
    })
    .superRefine((data, ctx) => {
      const files = data.uploadedFiles || {};

      const checkDoc = (key, msg) => {
        if (!files[key] || files[key].length === 0) {
          ctx.addIssue({
            path: [key],
            code: z.ZodIssueCode.custom,
            message: msg,
          });
        }
      };

      // PAN card — optional if PAN verified in Step 3
      if (!panVerified) checkDoc("panCard", "PAN card copy is required (or verify PAN in Step 3)");

      checkDoc("aadhaarFront", "Aadhaar card front is required");
      checkDoc("aadhaarBack", "Aadhaar card back is required");
      checkDoc("bankStatement", "Bank statement (last 6 months) is required");
      checkDoc("photograph", "Passport size photograph is required");

      // Salaried — salary slips
      if (employmentType === "salaried") {
        if (!files.salarySlips || files.salarySlips.length < 3) {
          ctx.addIssue({
            path: ["salarySlips"],
            code: z.ZodIssueCode.custom,
            message: "Salary slips (Last 3 months) are required",
          });
        }
      }

      // Self-Employed / Business Owner — ITR
      if (
        employmentType === "self-employed" ||
        employmentType === "business-owner"
      ) {
        if (!files.itr || files.itr.length < 2) {
          ctx.addIssue({
            path: ["itr"],
            code: z.ZodIssueCode.custom,
            message: "ITR (Last 2 years) is required",
          });
        }
      }

      // Home Loan — property docs
      if (loanType === "home") {
        checkDoc("propertyDoc", "Property documents are required for Home Loan");
      }

      // Business Loan — registration + GST returns
      if (loanType === "business") {
        checkDoc("businessRegCert", "Business Registration Certificate is required");
        if (!files.gstReturns || files.gstReturns.length < 4) {
          ctx.addIssue({
            path: ["gstReturns"],
            code: z.ZodIssueCode.custom,
            message: "GST Returns (Last 4 quarters) are required",
          });
        }
      }
    });

// ============================================
// STEP 8 — PDF Section B2.1 + C3.3
// ============================================
export const step8Schema = z.object({
  // PDF: 4 SEPARATE consent checkboxes — none pre-ticked
  consentAccuracy: z
    .boolean()
    .refine(
      (val) => val === true,
      "Please confirm all information provided is accurate",
    ),

  consentCibil: z
    .boolean()
    .refine(
      (val) => val === true,
      "Please authorise LendSwift to check your credit score via CIBIL/Equifax",
    ),

  consentTerms: z
    .boolean()
    .refine((val) => val === true, "Please agree to the Terms and Conditions"),

  consentCommunication: z
    .boolean()
    .refine(
      (val) => val === true,
      "Please consent to receive communications regarding this application",
    ),
});
