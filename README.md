# SwiftLoan - Multi-Step Loan Application

A production-ready, highly interactive multi-step loan application form built with React. Features an elegant glassmorphism UI, real-time validation, dynamic conditional step routing, and auto-save capabilities.

## Features

- **8-Step Dynamic Wizard**: Smooth navigation through Loan Details, Personal Info, KYC, Address, Employment, Co-applicant, Documents, and Review.
- **Auto-Save & Resume**: Powered by Zustand `persist` middleware, it automatically saves progress to `localStorage` in real-time, ensuring no data loss on page reload.
- **Conditional Routing**:
  - Automatically skips the **Co-Applicant** step if the requested loan amount is ≤ ₹5,00,000.
  - Dynamically switches Employment fields depending on whether the user is _Salaried_ or _Self-Employed_.
- **Real-Time Validation**: Centralized, step-by-step schema validation using Zod.
- **Live EMI Preview**: Instantly calculates and displays estimated EMI based on loan amount and tenure inputs.
- **Advanced Form Elements**:
  - File Upload with drag-and-drop and real-time image previews.
  - Interactive E-Signature canvas pad.
- **Premium Aesthetics**: Built with Tailwind CSS, featuring smooth background gradients, interactive hover micro-animations, and glassmorphism component styling.
- **End-to-End Testing**: Includes a comprehensive Cypress testing suite verifying core application logic and conditional behaviors.

## Tech Stack

- **Core**: React 19 (via Vite)
- **State Management**: Zustand (Global State + LocalStorage Sync)
- **Form Handling**: React Hook Form
- **Validation**: Zod & `@hookform/resolvers/zod`
- **Styling**: Tailwind CSS (with custom Tailwind directives)
- **Icons**: Lucide React
- **Advanced Inputs**: `react-dropzone` (Uploads), `react-signature-canvas` (Signatures)
- **Testing**: Cypress

## Project Structure Overview

```text
src/
 ├── App.jsx                       # Premium background wrapper & main entry
 ├── index.css                     # Tailwind classes & glassmorphism utilities
 ├── components/
 │    ├── common/                  # Reusable Inputs, Selects, FileUpload, SignaturePad
 │    └── wizard/                  # Wizard Controller, Navigation, ProgressBar
 ├── hooks/
 │    └── useFormStore.js          # Zustand store for persistent global state
 ├── schemas/
 │    └── validationSchema.js      # Centralized step-wise Zod validation rules
 ├── steps/
 │    ├── Step1LoanDetails.jsx     # EMI preview logic
 │    ├── Step2PersonalInfo.jsx
 │    ├── Step3KYC.jsx             # PAN + Aadhaar validation
 │    ├── Step4Address.jsx
 │    ├── Step5Employment.jsx      # Conditional Salary vs. Business flow
 │    ├── Step6CoApplicant.jsx     # Conditionally skipped logic
 │    ├── Step7Documents.jsx       # Document Upload & Canvas E-Signature
 │    └── Step8Review.jsx          # Comprehensive final review map
 └── utils/
      └── emicalculator.js         # Mathematical calculation formulas
```

## Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed on your machine.

### Installation

1. Clone the repository or extract the project files.
2. Navigate into the project directory:
   ```bash
   cd loan-app
   ```
3. Install all dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will load at `http://localhost:5173/`.

## 🧪 Running Tests

The application includes an automated E2E testing suite built with Cypress.

To open the Cypress UI and run tests interactively:

```bash
npx cypress open
```

To run Cypress tests silently in the terminal:

```bash
npx cypress run
```
