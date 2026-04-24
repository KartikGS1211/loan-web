import { z } from "zod";

export const step1Schema = z.object({
  loanAmount: z
    .number()
    .min(50000, "Minimum loan amount is 50,000")
    .max(5000000, "Maximum loan amount is 50,00,000"),
  loanTenure: z
    .number()
    .min(12, "Minimum tenure is 12 months")
    .max(60, "Maximum tenure is 60 months"),
  loanType: z.enum(["personal", "home", "auto", "education"]),
});

export const step2Schema = z.object({
  firstName: z.string().min(2, "First name is required").max(50),
  lastName: z.string().min(2, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid 10-digit Indian phone number"),
  dob: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, "You must be at least 18 years old"),
  gender: z.enum(["male", "female", "other"]),
});

export const step3Schema = z.object({
  pan: z
    .string()
    .regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, "Invalid PAN format"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
});

export const step4Schema = z.object({
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
});

export const step5Schema = z
  .object({
    employmentType: z.enum(["salaried", "self-employed", "business"]),
    companyName: z.string().optional(),
    monthlyIncome: z.number().optional(),
    businessName: z.string().optional(),
    annualTurnover: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.employmentType === "salaried") {
      if (!data.companyName || data.companyName.trim().length < 2) {
        ctx.addIssue({
          path: ["companyName"],
          message: "Company name is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.monthlyIncome || data.monthlyIncome < 15000) {
        ctx.addIssue({
          path: ["monthlyIncome"],
          message: "Minimum monthly income must be 15,000",
          code: z.ZodIssueCode.custom,
        });
      }
    } else {
      if (!data.businessName || data.businessName.trim().length < 2) {
        ctx.addIssue({
          path: ["businessName"],
          message: "Business name is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.annualTurnover || data.annualTurnover < 200000) {
        ctx.addIssue({
          path: ["annualTurnover"],
          message: "Minimum annual turnover must be 2,00,000",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const step6Schema = z.object({
  coApplicantFirstName: z.string().min(2, "First name is required").max(50),
  coApplicantLastName: z.string().min(2, "Last name is required").max(50),
  coApplicantPan: z
    .string()
    .regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, "Invalid PAN format"),
  coApplicantIncome: z.number().min(1, "Income is required"),
});

export const step7Schema = z.object({
  documents: z.array(z.any()).min(1, "Please upload at least one document"),

  signature: z
    .string()
    .nullable()
    .refine((val) => val && val.length > 50, {
      message: "Signature is required",
    }),
});

export const step8Schema = z.object({});
