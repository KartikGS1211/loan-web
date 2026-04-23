describe("Loan Application Wizard", () => {
  const clickContinue = () => {
    cy.contains("button", "Continue").click();
  };

  const fillStep1 = (amount = "100000", tenure = "24", type = "personal") => {
    cy.get('input[name="loanAmount"]').clear().type(amount);
    cy.get('input[name="loanTenure"]').clear().type(tenure);
    cy.get('select[name="loanType"]').select(type);
  };

  const fillSteps2To5 = () => {
    // Step 2
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="phone"]').type("9876543210");
    cy.get('input[name="dob"]').type("1990-01-01");
    cy.get('input[value="male"]').check({ force: true });
    clickContinue();

    // Step 3
    cy.get('input[name="pan"]').type("ABCDE1234F");
    cy.get('input[name="aadhaar"]').type("123456789012");
    clickContinue();

    // Step 4
    cy.get('input[name="addressLine1"]').type("123 Main St");
    cy.get('input[name="city"]').type("Mumbai");
    cy.get('input[name="state"]').type("MH");
    cy.get('input[name="pincode"]').type("400001");
    clickContinue();

    // Step 5
    cy.get('input[value="salaried"]').check({ force: true });
    cy.get('input[name="companyName"]').clear().type("TCS");
    cy.get('input[name="monthlyIncome"]').clear().type("50000");
    clickContinue();
  };

  function goToDocumentsStep() {
    // Deterministic setup: open wizard directly on Documents step.
    const mockedState = {
      state: {
        currentStep: 6,
        formData: {
          loanAmount: 400000,
          loanTenure: 24,
          loanType: "personal",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "9876543210",
          dob: "1990-01-01",
          gender: "male",
          pan: "ABCDE1234F",
          aadhaar: "123456789012",
          addressLine1: "123 Main St",
          city: "Mumbai",
          state: "MH",
          pincode: "400001",
          employmentType: "salaried",
          companyName: "TCS",
          monthlyIncome: 50000,
          documents: [],
          signature: null,
        },
      },
    };

    cy.window().then((win) => {
      win.localStorage.setItem("loan-app-storage", JSON.stringify(mockedState));
    });
    cy.visit("/");
    cy.get("#signature-pad", { timeout: 15000 }).should("be.visible");
  }

  // ✅ ye already hai — iske niche rehne do
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("1. should load the application and display the first step", () => {
    cy.contains("h1", "SwiftLoan Application").should("be.visible");
    cy.contains("h2", "Loan Details").should("be.visible");
    cy.contains("Step 1 of 8").should("be.visible");
  });

  it("2. should show validation errors on step 1 if required fields are missing or invalid", () => {
    cy.get('input[name="loanAmount"]').clear().type("10000"); // Minimum is 50000
    clickContinue();
    cy.contains("Minimum loan amount is 50,000").should("be.visible");
  });

  it("3. should successfully calculate and display EMI preview on step 1", () => {
    cy.get('input[name="loanAmount"]').clear().type("100000");
    cy.get('input[name="loanTenure"]').clear().type("24");
    cy.contains("Estimated EMI").should("be.visible");
  });

  it("4. should navigate to Step 2 when Step 1 is valid", () => {
    fillStep1();
    clickContinue();

    cy.contains("h2", "Personal Information").should("be.visible");
    // Total steps can be 7 (co-applicant skipped) or 8
    cy.contains(/Step 2 of [78]/).should("be.visible");
  });

  it("5. should validate Step 2 (Personal Information)", () => {
    // Go to step 2
    fillStep1();
    clickContinue();

    // Submit empty Step 2
    clickContinue();
    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");

    // Fill invalid email
    cy.get('input[name="email"]').type("invalid-email");
    clickContinue();
    cy.contains("Invalid email address").should("be.visible");
  });

  it("6. should skip Co-Applicant step (Step 6) if loan amount <= 5,00,000", () => {
    // Fill step 1 (Amount <= 5L)
    fillStep1("400000");
    clickContinue();
    fillSteps2To5();

    cy.contains(/documents/i, { timeout: 10000 }).should("be.visible");
  });

  it("7. should NOT skip Co-Applicant step if loan amount > 5,00,000", () => {
    // Fill step 1 (Amount > 5L)
    fillStep1("600000");
    clickContinue();
    fillSteps2To5();

    // Should be on Step 6 (Co-Applicant)
    cy.contains(/co-?applicant/i, { timeout: 10000 }).should("be.visible");
  });

  it("8. should toggle between salaried and self-employed fields in Step 5", () => {
    // We mock going directly to step 5 by setting localStorage
    const mockedState = {
      state: {
        currentStep: 4,
        formData: {
          loanAmount: 100000,
          loanTenure: 12,
          loanType: "personal",
          employmentType: "salaried",
        },
      },
    };
    cy.window().then((win) => {
      win.localStorage.setItem("loan-app-storage", JSON.stringify(mockedState));
    });
    cy.visit("/");

    cy.contains("h2", "Employment & Income").should("be.visible");

    // Default is salaried
    cy.get('input[name="companyName"]').should("exist");
    cy.get('input[name="monthlyIncome"]').should("exist");

    // Toggle to self-employed
    cy.get('input[value="self-employed"]').click();
    cy.get('input[name="businessName"]').should("exist");
    cy.get('input[name="annualTurnover"]').should("exist");
    cy.get('input[name="companyName"]').should("not.exist");
  });

  it("9. should persist data on reload", () => {
    fillStep1("250000", "36", "home");
    clickContinue();

    // Wait for auto-save (debounce is 2s)
    cy.wait(2500);

    // Reload page
    cy.reload();

    // Should be on Step 2
    cy.contains("h2", "Personal Information").should("be.visible");

    // Go back to Step 1 and check values
    cy.contains("button", "Back").click();
    cy.get('input[name="loanAmount"]').should("have.value", "250000");
    cy.get('input[name="loanTenure"]').should("have.value", "36");
    cy.get('select[name="loanType"]').should("have.value", "home");
  });

  it("10. should show completion percentage accurately", () => {
    // Initial step should start at 0%
    cy.contains("0% Completed").should("be.visible");
    fillStep1("100000", "24", "personal");
    clickContinue();

    // At step 2 with co-applicant skipped, progress should show 17%
    cy.contains("17% Completed").should("be.visible");
  });
  it("should upload document", () => {
    goToDocumentsStep();

    cy.get('[data-cy="document-upload"]', {
      timeout: 15000,
    })
      .should("exist")
      .selectFile("cypress/fixtures/sample.pdf", {
        force: true,
      });
  });
  it("should show signature pad", () => {
    goToDocumentsStep();

    cy.get("#signature-pad", {
      timeout: 15000,
    }).should("exist");
  });
  it("13. should reach review step", () => {
    goToDocumentsStep();

    const mockedStateWithDocsAndSign = {
      state: {
        currentStep: 6,
        formData: {
          loanAmount: 400000,
          loanTenure: 24,
          loanType: "personal",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "9876543210",
          dob: "1990-01-01",
          gender: "male",
          pan: "ABCDE1234F",
          aadhaar: "123456789012",
          addressLine1: "123 Main St",
          city: "Mumbai",
          state: "MH",
          pincode: "400001",
          employmentType: "salaried",
          companyName: "TCS",
          monthlyIncome: 50000,
          documents: [{ name: "sample.pdf", type: "application/pdf" }],
          signature:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
        },
      },
    };

    cy.window().then((win) => {
      win.localStorage.setItem(
        "loan-app-storage",
        JSON.stringify(mockedStateWithDocsAndSign),
      );
    });
    cy.reload();

    cy.contains("h2", "Documents & E-Signature", { timeout: 10000 }).should(
      "be.visible",
    );

    clickContinue();

    cy.contains("h2", "Review Application", { timeout: 10000 }).should(
      "be.visible",
    );
  });

  it("14. should handle rapid clicking", () => {
    fillStep1();
    for (let i = 0; i < 5; i++) {
      cy.contains("button", "Continue").click({ force: true });
    }
    cy.contains("h2", "Personal Information").should("be.visible");
  });

  it("15. should not allow skipping steps", () => {
    cy.visit("/?step=5");
    cy.contains("Loan Details").should("be.visible");
  });
});
