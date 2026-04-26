describe("Loan Application Wizard", () => {
  const clickContinue = () => {
    cy.contains("button", "Continue").click();
  };

  // ✅ Step 1 fill — select pehle, phir amount/tenure/purpose
  const fillStep1 = (
    amount = "100000",
    tenure = "24",
    type = "personal",
    purpose = "Medical"
  ) => {
    cy.get('select[name="loanType"]').select(type);
    cy.wait(300); // loan type change ke baad fields render hone do
    cy.get('input[name="loanAmount"]').clear().type(amount);
    cy.get('input[name="loanTenure"]').clear().type(tenure);
    cy.get('select[name="loanPurpose"]').select(purpose);
  };

  // ✅ Step 2 — fullName, fatherName, motherName fields
  const fillStep2 = () => {
    cy.get('input[name="fullName"]').type("John Doe");
    cy.get('input[name="fatherName"]').type("Robert Doe");
    cy.get('input[name="motherName"]').type("Mary Doe");
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="phone"]').type("9876543210");
    cy.get('input[name="dob"]').type("1990-01-01");
    cy.get('input[value="male"]').check({ force: true });
    cy.get('select[name="maritalStatus"]').select("single");
    clickContinue();
  };

  // ✅ Step 3 — valid PAN + Aadhaar verify karo
  const fillStep3 = () => {
    // Step3 verification is triggered on blur as well.
    // Clicking Verify can race with blur and hit disabled-state.
    cy.get('input[name="pan"]').clear().type("ABCPE1234F").blur(); // P = Individual
    cy.contains(/verified/i, { timeout: 5000 }).should("be.visible");

    cy.get('input[name="aadhaar"]').clear().type("234123412346").blur(); // valid verhoeff
    cy.contains(/kyc verification complete/i, { timeout: 5000 }).should(
      "be.visible"
    );

    cy.get('input[name="aadhaarConsent"]').check({ force: true });
    clickContinue();
  };

  // ✅ Step 4 — currentAddressLine1
  const fillStep4 = () => {
    cy.get('input[name="currentAddressLine1"]').type("123 Main St");
    cy.get('input[name="pincode"]').type("400001");
    cy.wait(500);
    cy.get('select[name="residenceType"]').select("owned");
    cy.get('input[name="yearsAtAddress"]').clear().type("5");
    cy.get('input[name="sameAsPermanent"]').check({ force: true });
    clickContinue();
  };

  // ✅ Step 5 — salaried
  const fillStep5Salaried = () => {
    cy.get('input[value="salaried"]').check({ force: true });
    cy.get('input[name="companyName"]').clear().type("TCS");
    cy.get('input[name="designation"]').clear().type("Engineer");
    cy.get('input[name="monthlyIncome"]').clear().type("50000");
    cy.get('input[name="yearsOfExperience"]').clear().type("3");
    clickContinue();
  };

  const uploadDocument = (label, files) => {
    cy.contains("span", label)
      .parents("div.p-4.border.rounded-2xl.space-y-3")
      .first()
      .find('input[type="file"]')
      .selectFile(files, { force: true });
  };

  const drawESignature = () => {
    cy.get("canvas")
      .first()
      .trigger("mousedown", 30, 30, { force: true })
      .trigger("mousemove", 120, 50, { force: true })
      .trigger("mousemove", 180, 80, { force: true })
      .trigger("mouseup", { force: true });
  };

  const fillStep7Documents = () => {
    uploadDocument("Aadhaar Card Front", "cypress/fixtures/sample.pdf");
    uploadDocument("Aadhaar Card Back", "cypress/fixtures/sample.pdf");
    uploadDocument("Bank Statement (Last 6 months)", "cypress/fixtures/sample.pdf");
    uploadDocument("Passport Size Photograph", {
      contents: "cypress/fixtures/sample.pdf",
      fileName: "photo.png",
      mimeType: "image/png",
      lastModified: Date.now(),
    });
    uploadDocument("Salary Slips (Last 3 months)", [
      "cypress/fixtures/sample.pdf",
      "cypress/fixtures/sample.pdf",
      "cypress/fixtures/sample.pdf",
    ]);
    drawESignature();
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
  });

  // ── TEST 1 ──────────────────────────────────────────
  it("1. should load the application and display the first step", () => {
    cy.contains("h2", "Loan Details").should("be.visible");
  });

  // ── TEST 2 ──────────────────────────────────────────
  it("2. should show validation errors on step 1 if required fields are missing", () => {
    cy.get('select[name="loanType"]').select("personal");
    cy.wait(300);
    cy.get('input[name="loanAmount"]').clear().type("10000"); // min 50000
    cy.get('input[name="loanTenure"]').clear().type("24");
    cy.get('select[name="loanPurpose"]').select("Medical");
    clickContinue();
    // ✅ exact schema message
    cy.contains("Minimum loan amount is ₹50,000").should("be.visible");
  });

  // ── TEST 3 ──────────────────────────────────────────
  it("3. should display EMI preview on step 1", () => {
    cy.get('select[name="loanType"]').select("personal");
    cy.wait(300);
    cy.get('input[name="loanAmount"]').clear().type("100000");
    cy.get('input[name="loanTenure"]').clear().type("24");
    cy.contains("EMI Preview").should("be.visible");
  });

  // ── TEST 4 ──────────────────────────────────────────
  it("4. should navigate to Step 2 when Step 1 is valid", () => {
    fillStep1();
    clickContinue();
    cy.contains("h2", "Personal Information").should("be.visible");
  });

  // ── TEST 5 ──────────────────────────────────────────
  it("5. should validate Step 2 Personal Information", () => {
    fillStep1();
    clickContinue();

    // Submit empty Step 2
    clickContinue();
    // ✅ fullName error — not firstName/lastName
    cy.contains("Full name is required").should("be.visible");

    // Invalid email
    cy.get('input[name="email"]').type("invalid-email");
    clickContinue();
    cy.contains("valid email").should("be.visible");
  });

  // ── TEST 6 ──────────────────────────────────────────
  it("6. should skip Co-Applicant step if Personal Loan amount <= 5,00,000", () => {
    fillStep1("400000", "24", "personal", "Medical");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    // Step 6 skip — directly Documents
    cy.contains(/documents/i, { timeout: 10000 }).should("be.visible");
  });

  // ── TEST 7 ──────────────────────────────────────────
  it("7. should show Co-Applicant step if Personal Loan amount > 5,00,000", () => {
    fillStep1("600000", "24", "personal", "Medical");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    // Step 6 show hona chahiye
    cy.contains(/co-?applicant/i, { timeout: 10000 }).should("be.visible");
  });

  // ── TEST 8 ──────────────────────────────────────────
  it("8. should toggle between salaried and self-employed fields in Step 5", () => {
    fillStep1();
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();

    // Now on Step 5
    cy.contains("h2", "Employment & Income").should("be.visible");

    // Default — salaried fields
    cy.get('input[value="salaried"]').check({ force: true });
    cy.get('input[name="companyName"]').should("exist");
    cy.get('input[name="monthlyIncome"]').should("exist");

    // Switch to self-employed
    cy.get('input[value="self-employed"]').click({ force: true });
    cy.get('input[name="businessName"]').should("exist");
    cy.get('input[name="annualTurnover"]').should("exist");
    cy.get('input[name="companyName"]').should("not.exist");
  });

  // ── TEST 9 ──────────────────────────────────────────
  it("9. should persist data on reload via auto-save", () => {
    fillStep1("250000", "36", "home", "Purchase");
    clickContinue();

    // Auto-save wait — test env mein interval kam karo
    cy.wait(31000);

    cy.reload();

    // Resume modal aana chahiye
    cy.contains("Saved Application Found", { timeout: 5000 }).should(
      "be.visible"
    );
    cy.contains("button", "Resume").click();
    cy.get("h2", { timeout: 10000 })
      .invoke("text")
      .then((heading) => {
        const title = heading.trim();
        if (title === "Personal Information") {
          cy.contains("button", "Back").click();
        } else {
          expect(title).to.eq("Loan Details");
        }
      });
    cy.get('input[name="loanAmount"]', { timeout: 10000 }).should(
      "have.value",
      "250000"
    );
  });

  // ── TEST 10 ──────────────────────────────────────────
  it("10. should show progress bar", () => {
    cy.get('select[name="loanType"]').select("personal");
    cy.wait(300);
    cy.get('input[name="loanAmount"]').clear().type("100000");
    cy.get('input[name="loanTenure"]').clear().type("24");
    cy.get('select[name="loanPurpose"]').select("Medical");
    clickContinue();

    // Progress indicator text should be visible
    cy.contains(/step\s+2\s+of/i, { timeout: 5000 }).should("be.visible");
  });

  // ── TEST 11 — Document Upload ──────────────────────
  it("11. should upload document in Step 7", () => {
    fillStep1("300000", "24", "personal", "Medical");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    // Step 7 Documents
    cy.contains(/documents/i, { timeout: 10000 }).should("be.visible");
    uploadDocument("Aadhaar Card Front", "cypress/fixtures/sample.pdf");
    cy.contains(/sample\.pdf/i, { timeout: 5000 }).should("be.visible");
  });

  // ── TEST 12 — Signature Pad ──────────────────────
  it("12. should show signature pad in Step 7", () => {
    fillStep1("300000", "24", "personal", "Medical");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    cy.contains(/documents/i, { timeout: 10000 }).should("be.visible");
    cy.get("canvas", { timeout: 10000 }).first().should("be.visible");
  });

  // ── TEST 13 — Review Step ──────────────────────
  it("13. should reach review step", () => {
    fillStep1("300000", "24", "personal", "Medical");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    // Step 7 Documents
    cy.contains(/documents/i, { timeout: 10000 }).should("be.visible");
    fillStep7Documents();
    clickContinue();

    cy.contains(/review/i, { timeout: 10000 }).should("be.visible");
  });

  // ── TEST 14 — Rapid Clicking ──────────────────────
  it("14. should handle rapid clicking without state corruption", () => {
    fillStep1();
    for (let i = 0; i < 5; i++) {
      cy.contains("button", "Continue").click({ force: true });
    }
    // Validation block karega — sirf Step 2 tak jaana chahiye
    cy.contains("h2", "Personal Information").should("be.visible");
  });

  // ── TEST 15 — No Step Skipping ──────────────────────
  it("15. should not allow skipping steps via URL", () => {
    cy.visit("/?step=5");
    // URL params se step skip nahi hona chahiye
    cy.contains("h2", "Loan Details").should("be.visible");
  });

  // ── TEST 16 — Home Loan Always Co-Applicant ──────
  it("16. should always show Co-Applicant for Home Loan regardless of amount", () => {
    fillStep1("300000", "120", "home", "Purchase");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    // Home Loan = HAMESHA Step 6 — PDF B2.1
    cy.contains(/co-?applicant/i, { timeout: 10000 }).should("be.visible");
  });

  // ── TEST 17 — Business Loan Co-Applicant > 20L ──
  it("17. should show Co-Applicant for Business Loan > 20L", () => {
    fillStep1("2500000", "60", "business", "Working Capital");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();

    // Step 5 — business owner
    cy.get('input[value="business-owner"]').check({ force: true });
    cy.get('input[name="businessName"]').type("My Business");
    cy.get('select[name="businessType"]').select("retail");
    cy.get('input[name="annualTurnover"]').type("500000");
    cy.get('input[name="yearsInBusiness"]').type("3");
    cy.get('input[name="selfEmployedMonthlyIncome"]').type("80000");
    cy.get('input[name="gstNumber"]').type("22AAAAA0000A1Z5");
    cy.get('input[name="officeAddressLine1"]').type("Office 101");
    clickContinue();

    cy.contains(/co-?applicant/i, { timeout: 10000 }).should("be.visible");
  });

  // ── TEST 18 — PAN 4th Character Validation ──────
  it("18. should validate PAN 4th character entity type", () => {
    fillStep1();
    clickContinue();
    fillStep2();

    // Invalid PAN — 4th char E nahi hona chahiye — PDF Section C3.1
    cy.get('input[name="pan"]').clear().type("ABCDE1234F").blur();
    cy.wait(500);
    cy.contains(/4th character/i).should("be.visible");
  });

  // ── TEST 19 — Aadhaar Verhoeff Checksum ──────────
  it("19. should reject Aadhaar with invalid Verhoeff checksum", () => {
    fillStep1();
    clickContinue();
    fillStep2();

    // Valid PAN first
    cy.get('input[name="pan"]').clear().type("ABCPE1234F").blur();
    cy.contains(/verified/i, { timeout: 5000 }).should("be.visible");

    // Invalid Aadhaar — wrong checksum — PDF Section C3.2
    cy.get('input[name="aadhaar"]').clear().type("123456789011").blur();
    cy.wait(500);
    cy.contains(/checksum/i).should("be.visible");
  });

  // ── TEST 20 — Age Validation ──────────────────────
  it("20. should reject applicant below 21 years", () => {
    fillStep1();
    clickContinue();

    // DOB jo 20 saal se kam age banaye
    const youngDob = new Date();
    youngDob.setFullYear(youngDob.getFullYear() - 20);
    const dobStr = youngDob.toISOString().split("T")[0];

    cy.get('input[name="fullName"]').type("Young Person");
    cy.get('input[name="dob"]').type(dobStr);
    cy.get('input[name="fatherName"]').type("Father Name");
    cy.get('input[name="motherName"]').type("Mother Name");
    cy.get('input[name="email"]').type("young@example.com");
    cy.get('input[name="phone"]').type("9876543210");
    cy.get('input[value="male"]').check({ force: true });
    cy.get('select[name="maritalStatus"]').select("single");
    clickContinue();

    cy.contains(/21.*65|age must/i).should("be.visible");
  });
});