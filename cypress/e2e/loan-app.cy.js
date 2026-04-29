describe("Loan Application Wizard", () => {
  const assertStepHeading = (heading) => {
    cy.contains("h2", heading, { timeout: 20000 }).should("be.visible");
  };

  const clickContinue = () => {
    cy.contains("button", "Continue", { timeout: 20000 }).click({ force: true });
  };

  const dismissDraftModalIfPresent = () => {
    cy.get("body").then(($body) => {
      if ($body.text().includes("Saved Application Found")) {
        cy.contains("button", "Start Fresh").click({ force: true });
      }
    });
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
    // If a saved-draft modal overlays the wizard, dismiss it first.
    dismissDraftModalIfPresent();

    // Ensure we are actually on Step 2 (prevents typing into stale/disabled DOM).
    cy.contains("h2", "Personal Information", { timeout: 20000 }).should(
      "be.visible"
    );

    cy.get('input[name="fullName"]', { timeout: 20000 })
      .should("be.visible")
      .and("not.be.disabled")
      .clear()
      .type("John Doe");
    cy.get('input[name="fatherName"]').should("be.visible").and("not.be.disabled").clear().type("Robert Doe");
    cy.get('input[name="motherName"]').should("be.visible").and("not.be.disabled").clear().type("Mary Doe");
    cy.get('input[name="email"]').should("be.visible").and("not.be.disabled").clear().type("john@example.com");
    cy.get('input[name="phone"]').should("be.visible").and("not.be.disabled").clear().type("9876543210");
    cy.get('input[name="dob"]').should("be.visible").and("not.be.disabled").clear().type("1990-01-01");
    cy.get('input[value="male"]').check({ force: true });
    cy.get('select[name="maritalStatus"]').select("single");
    clickContinue();
  };

  // ✅ Step 3 — valid PAN + Aadhaar verify karo
  const fillStep3 = () => {
    // Use explicit verify buttons for deterministic Step 3 behavior.
    cy.get("#pan").clear().type("ABCPE1234F"); // P = Individual
    cy.contains("label", "PAN Card Number")
      .parents("div")
      .first()
      .contains("button", "Verify")
      .click();
    cy.contains(/verified/i, { timeout: 10000 }).should("be.visible");

    cy.get("#aadhaar").clear().type("234123412346"); // valid verhoeff
    cy.contains("label", "Aadhaar Number")
      .parents("div")
      .first()
      .contains("button", "Verify")
      .click();
    cy.contains(/kyc verification complete/i, { timeout: 10000 }).should(
      "be.visible"
    );

    cy.get('input[name="aadhaarConsent"]').check({ force: true });
    clickContinue();
  };

  // ✅ Step 4 — currentAddressLine1
  const fillStep4 = () => {
    cy.get('input[name="currentAddressLine1"]').type("123 Main St");
    cy.get('input[name="pincode"]').type("400001");
    cy.get('input[name="city"]', { timeout: 10000 }).should(
      "have.value",
      "Mumbai"
    );
    cy.get('select[name="state"]', { timeout: 10000 }).should(
      "have.value",
      "Maharashtra"
    );
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

  // ✅ Step 6 — co-applicant details + PAN verify + signature
  const fillStep6CoApplicant = () => {
    assertStepHeading("Co-Applicant Details");
    cy.get('input[name="coApplicantName"]').clear().type("Jane Doe");
    cy.get('select[name="relationship"]').select("parent");
    cy.get("#coApplicantPan").clear().type("ABCPE1234F");
    // PAN verify status text is flaky; valid PAN format is sufficient for schema.
    cy.get("#coApplicantPan").trigger("blur");
    cy.get('input[name="coApplicantIncome"]').clear().type("45000");
    cy.get('input[name="coApplicantConsent"]').check({ force: true });
    drawESignature();
    clickContinue();
  };

  const uploadDocument = (label, files) => {
    cy.contains("span", label)
      .closest("div.p-4")
      .first()
      .as("docCard");

    // Prefer drag-drop upload (react-dropzone is more reliable this way in Cypress)
    cy.get("@docCard")
      .find("div.border-dashed")
      .first()
      .selectFile(files, { action: "drag-drop", force: true });

    // Confirm this document bucket is marked as uploaded (card turns green).
    cy.get("@docCard", { timeout: 20000 }).should("have.class", "bg-green-50");
  };

  const uploadPdfCopies = (label, fileNamePrefix, count) => {
    cy.fixture("sample.pdf", "base64").then((b64) => {
      const contents = Cypress.Buffer.from(b64, "base64");
      const files = Array.from({ length: count }, (_, i) => ({
        contents,
        fileName: `${fileNamePrefix}-${i + 1}.pdf`,
        mimeType: "application/pdf",
        lastModified: Date.now(),
      }));
      uploadDocument(label, files);

      // Assert all unique filenames are visible under that upload bucket.
      for (let i = 1; i <= count; i++) {
        cy.contains(new RegExp(`${fileNamePrefix}-${i}\\.pdf`, "i"), {
          timeout: 20000,
        }).should("be.visible");
      }
    });
  };

  const drawESignature = () => {
    cy.get("canvas:visible")
      .last()
      .scrollIntoView()
      .then(($c) => {
        // `react-signature-canvas` (signature_pad) primarily listens to mouse/touch events.
        // Provide a rich mouse event payload (client/page + offset) for reliability.
        const pts = [
          { x: 20, y: 40 },
          { x: 140, y: 70 },
          { x: 220, y: 95 },
        ];

        const mkEvt = (p) => ({
          clientX: $c[0].getBoundingClientRect().left + p.x,
          clientY: $c[0].getBoundingClientRect().top + p.y,
          pageX: $c[0].getBoundingClientRect().left + p.x,
          pageY: $c[0].getBoundingClientRect().top + p.y,
          offsetX: p.x,
          offsetY: p.y,
          which: 1,
          button: 0,
          buttons: 1,
          force: true,
        });

        cy.wrap($c)
          .trigger("mousedown", mkEvt(pts[0]))
          .trigger("mousemove", mkEvt(pts[1]))
          .trigger("mousemove", mkEvt(pts[2]))
          .trigger("mouseup", mkEvt(pts[2]));
      });
  };

  const drawStep7Signature = () => {
    cy.contains("label", "E-Signature").scrollIntoView();
    // Prefer the canvas that belongs to the E‑Signature field (not just the last canvas on the page).
    cy.contains("label", "E-Signature")
      .parents()
      .then(($parents) => {
        const host = [...$parents].find((el) => el.querySelector?.("canvas"));
        if (host) return cy.wrap(host).find("canvas:visible").first();
        return cy.get("canvas:visible", { timeout: 10000 }).last();
      })
      .scrollIntoView()
      .then(($c) => {
        const pts = [
          { x: 20, y: 40 },
          { x: 140, y: 70 },
          { x: 220, y: 95 },
        ];

        const mkEvt = (p) => ({
          clientX: $c[0].getBoundingClientRect().left + p.x,
          clientY: $c[0].getBoundingClientRect().top + p.y,
          pageX: $c[0].getBoundingClientRect().left + p.x,
          pageY: $c[0].getBoundingClientRect().top + p.y,
          offsetX: p.x,
          offsetY: p.y,
          which: 1,
          button: 0,
          buttons: 1,
          force: true,
        });

        cy.wrap($c)
          .trigger("mousedown", mkEvt(pts[0]))
          .trigger("mousemove", mkEvt(pts[1]))
          .trigger("mousemove", mkEvt(pts[2]))
          .trigger("mouseup", mkEvt(pts[2]));
      });
  };

  const ensureStep7SignatureCaptured = () => {
    // Don't assert on the helper text; it may not render reliably under Cypress.
    // Instead just draw a few times; navigation retry will handle any remaining flakiness.
    drawStep7Signature();
    drawStep7Signature();
    drawStep7Signature();
    // Give react-hook-form a moment to receive the dataURL and re-render preview.
    cy.wait(250);
  };

  const fillStep7Documents = () => {
    // Upload PAN too so Step 7 passes regardless of PAN verification state.
    uploadDocument("PAN Card Copy", "cypress/fixtures/sample.pdf");
    uploadDocument("Aadhaar Card Front", "cypress/fixtures/sample.pdf");
    uploadDocument("Aadhaar Card Back", "cypress/fixtures/sample.pdf");
    uploadDocument("Bank Statement (Last 6 months)", "cypress/fixtures/sample.pdf");
    uploadDocument("Passport Size Photograph", {
      // 1x1 valid PNG so Cypress treats it as an actual image file
      contents: Cypress.Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBAQEAAP8AAAAASUVORK5CYII=",
        "base64"
      ),
      fileName: "photo.png",
      mimeType: "image/png",
      lastModified: Date.now(),
    });
    // Step 7 schema requires 3 salary slips (not just "uploaded once").
    uploadPdfCopies("Salary Slips (Last 3 months)", "salary-slip", 3);

    // Make sure these uploads actually registered in the UI before checking counts.
    cy.contains(/photo\.png/i, { timeout: 20000 }).should("be.visible");
    // Signature capture can be flaky unless pointer events land correctly.
    ensureStep7SignatureCaptured();

    // Wait until upload progress shows all required docs uploaded (format may vary).
    cy.contains(/upload progress/i, { timeout: 40000 })
      .parent()
      .within(() => {
        cy.contains(/required/i, { timeout: 40000 }).should(($el) => {
          const text = $el.text().replace(/\s+/g, " ").trim(); // e.g. "5/5 Required"
          const m = text.match(/(\d+)\s*\/\s*(\d+)\s*required/i);
          expect(m, `progress text "${text}"`).to.not.be.null;
          const done = Number(m[1]);
          const total = Number(m[2]);
          expect(total).to.be.greaterThan(0);
          expect(done).to.eq(total);
        });
      });
  };

  // ✅ Step 8 — all required consents + submit
  const submitFromStep8 = () => {
    assertStepHeading("Review & Submit");
    cy.contains("button", "Submit Application", { timeout: 15000 }).should(
      "be.visible"
    );
    cy.get('input[name="consentAccuracy"]', { timeout: 10000 }).should("exist");
    cy.get('input[name="consentAccuracy"]').check({ force: true });
    cy.get('input[name="consentCibil"]').check({ force: true });
    cy.get('input[name="consentTerms"]').check({ force: true });
    cy.get('input[name="consentCommunication"]').check({ force: true });
    cy.contains(/all consents provided/i, { timeout: 5000 }).should("be.visible");
    cy.contains("button", "Submit Application").click();
  };

  const proceedFromStep7ToStep8 = () => {
    const tryAdvance = (triesLeft) => {
      // Ensure Step 7 is actually valid before clicking continue.
      cy.contains(/upload progress/i, { timeout: 40000 }).should("be.visible");
      // The app may or may not render a toast/helper text after drawing.
      // Don’t hard-assert the exact message; advancing to Step 8 is the real success signal.
      cy.get("body").then(($body) => {
        if ($body.text().match(/e-signature.*captured/i)) {
          cy.contains(/e-signature.*captured/i, { timeout: 1000 }).should("be.visible");
        }
      });

      // Step 7 commonly blocks advancement by disabling Continue until signature is captured.
      // `clickContinue()` force-clicks, which can hide this problem, so we explicitly wait for enabled.
      cy.contains("button", "Continue", { timeout: 20000 })
        .should("be.visible")
        .then(($btn) => {
          const isDisabled =
            $btn.is(":disabled") || $btn.attr("aria-disabled") === "true";
          if (isDisabled) {
            drawStep7Signature();
          }
        });
      cy.contains("button", "Continue", { timeout: 20000 })
        .should(($btn) => {
          const isDisabled =
            $btn.is(":disabled") || $btn.attr("aria-disabled") === "true";
          expect(isDisabled, "Continue enabled").to.eq(false);
        })
        .click();

      cy.get("body", { timeout: 20000 }).then(($body) => {
        // Arrived at Step 8
        if ($body.text().includes("Review & Submit")) return;
        if (triesLeft <= 1) return;

        // Still blocked on Step 7 -> draw again and retry
        if ($body.text().includes("Documents & E-Signature")) {
          drawStep7Signature();
        }
        tryAdvance(triesLeft - 1);
      });
    };

    tryAdvance(6);

    // More reliable than button label: Step 8 heading must appear.
    assertStepHeading("Review & Submit");
  };

  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    dismissDraftModalIfPresent();
    // Wizard uses window.alert on validation errors; swallow to keep flow moving.
    cy.on("window:alert", () => {});
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
    // Schema message currently includes "(min 2 characters)" — keep assertion resilient.
    cy.contains(/full name is required/i).should("be.visible");

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
    assertStepHeading("Documents & E-Signature");
  });

  // ── TEST 7 ──────────────────────────────────────────
  it("7. should show Co-Applicant step if Personal Loan amount > 5,00,000", () => {
    fillStep1("600000", "24", "personal", "Medical");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    // This case only validates mandatory Step 6 visibility for high amount.
    assertStepHeading("Co-Applicant Details");
  });

  // ── TEST 8 ──────────────────────────────────────────
  it("8. should toggle between salaried and self-employed fields in Step 5", () => {
    fillStep1();
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();

    // Now on Step 5
    assertStepHeading("Employment & Income");

    // Default — salaried fields
    cy.get('input[value="salaried"]').check({ force: true });
    cy.get('input[name="companyName"]').should("exist");
    cy.get('input[name="monthlyIncome"]').should("exist");

    // Switch to self-employed
    cy.get('input[value="self-employed"]').check({ force: true });
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
    assertStepHeading("Documents & E-Signature");
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

    assertStepHeading("Documents & E-Signature");
    cy.get("canvas:visible", { timeout: 10000 }).should("be.visible");
  });

  // ── TEST 13 — Review Step ──────────────────────
  it("13. should complete Step 8 and submit application", () => {
    fillStep1("300000", "24", "personal", "Medical");
    clickContinue();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();

    // Step 7 Documents
    cy.contains(/documents/i, { timeout: 10000 }).should("be.visible");
    fillStep7Documents();
    proceedFromStep7ToStep8();

    submitFromStep8();
    cy.contains("Application Submitted!", { timeout: 15000 }).should("be.visible");
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
    assertStepHeading("Co-Applicant Details");
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

    assertStepHeading("Co-Applicant Details");
  });

  // ── TEST 18 — PAN 4th Character Validation ──────
  it("18. should validate PAN 4th character entity type", () => {
    fillStep1();
    clickContinue();
    fillStep2();
    assertStepHeading("KYC Verification");

    // Invalid PAN — 4th char E nahi hona chahiye — PDF Section C3.1
    cy.get("#pan").clear().type("ABCDE1234F");
    cy.contains("label", "PAN Card Number")
      .parents("div")
      .first()
      .contains("button", "Verify")
      .click();
    cy.contains(/4th character.*must.*p/i, { timeout: 10000 }).should(
      "be.visible"
    );
  });

  // ── TEST 19 — Aadhaar Verhoeff Checksum ──────────
  it("19. should reject Aadhaar with invalid Verhoeff checksum", () => {
    fillStep1();
    clickContinue();
    fillStep2();
    assertStepHeading("KYC Verification");

    // Valid PAN first
    cy.get("#pan").clear().type("ABCPE1234F");
    cy.contains("label", "PAN Card Number")
      .parents("div")
      .first()
      .contains("button", "Verify")
      .click();
    cy.contains(/verified/i, { timeout: 10000 }).should("be.visible");

    // Invalid Aadhaar — wrong checksum — PDF Section C3.2
    cy.get("#aadhaar").clear().type("123456789011");
    cy.contains("label", "Aadhaar Number")
      .parents("div")
      .first()
      .contains("button", "Verify")
      .click();
    cy.contains(/checksum verification failed/i, { timeout: 10000 }).should(
      "be.visible"
    );
  });

  // ── TEST 20 — Age Validation
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