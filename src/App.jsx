import React, { useMemo, useState } from "react";

const PROTOTYPE_PASSWORD = "DTAproof2026";

const ICONS = {
  identity: "ID",
  wages: "Income",
  jobEnd: "Change",
  selfEmployment: "Income",
  statement: "Note",
  socialSecurity: "Benefit",
  unemployment: "Benefit",
  childSupport: "Support",
  pension: "Benefit",
  veterans: "Benefit",
  rentalIncome: "Income",
  workersComp: "Benefit",
  workStudy: "Student",
  pfml: "Benefit",
  workRules: "Work rules",
  rent: "Housing",
  mortgage: "Housing",
  utilities: "Utilities",
  dependentCare: "Care",
  medical: "Medical"
};

const CARD_EMOJI_BY_RULE_ID = {
  "ID-001": "📝",
  "INC-001": "💵",
  "INC-019": "💵",
  "INC-020": "💵",
  "INC-003": "💵",
  "INC-005": "💵",
  "INC-006": "💵",
  "INC-008": "💵",
  "INC-010": "💵",
  "INC-012": "👶💲",
  "INC-014": "💵",
  "INC-015": "💵",
  "INC-016": "💵",
  "INC-017": "💵",
  "INC-018": "💵",
  "WRK-001": "📝",
  "EXP-001": "🏠",
  "EXP-002": "🏠",
  "EXP-003": "🏠",
  "EXP-004": "🏠",
  "EXP-005": "🏠",
  "EXP-006": "💡",
  "EXP-007": "💡",
  "EXP-008": "💡",
  "EXP-009": "💡",
  "EXP-010": "💡",
  "EXP-011": "👶",
  "EXP-012": "🚗",
  "EXP-015": "🚗",
  "EXP-013": "👶💲",
  "EXP-014": "🩺💊",
  "EXP-016": "🚗",
  "EXP-017": "🩺💊",
  "EXP-018": "🩺💊"
};

const DEFAULT_SETTINGS = {
  suppressInternalData: true,
  includeIdentity: true
};

const EMPTY_APPLICATION = {
  identity: {
    likelyRMVMatch: true
  },
  household: {
    memberCount: 1,
    buysAndPreparesTogether: true,
    anyElderlyMember: false,
    anyFederallyCertifiedDisability: false
  },
  income: {
    wages: { reported: false, changed: false, endedRecently: false },
    selfEmployment: { reported: false, irregular: false, newBusiness: false },
    workStudy: { reported: false },
    ssi: { reported: false, likelySVESAvailable: true },
    rsdi: { reported: false, likelySVESAvailable: true },
    unemployment: { reported: false, likelyStateMatchAvailable: true },
    childSupportReceived: { reported: false, likelyRAPIDAvailable: true },
    pension: { reported: false },
    veteransBenefits: { reported: false },
    rentalIncome: { reported: false },
    workersComp: { reported: false },
    pfml: { reported: false }
  },
  expenses: {
    rent: { reported: false },
    mortgage: { reported: false },
    propertyTaxes: { reported: false },
    homeInsurance: { reported: false },
    condoFees: { reported: false },
    utilities: {
      heat: false,
      acElectricity: false,
      acFee: false,
      electricGas: false,
      phone: false
    },
    dependentCare: {
      reported: false,
      driveToProvider: false,
      paidTransportation: false
    },
    childSupportPaid: { reported: false },
    medical: {
      reported: false,
      elderlyOrDisabled: false,
      person: "",
      otcSupplies: false,
      transportation: false,
      healthInsuranceRelated: false,
      otherMedical: false
    }
  },
  workRules: {
    abawdExemption: false
  }
};

const SAMPLE_APPLICATIONS = {
  freelanceCaregiver: {
    ...EMPTY_APPLICATION,
    label: "Self-employed",
    household: {
      ...EMPTY_APPLICATION.household,
      memberCount: 3,
      anyElderlyMember: true
    },
    income: {
      ...EMPTY_APPLICATION.income,
      selfEmployment: { reported: true, irregular: true, newBusiness: true },
      rsdi: { reported: true, likelySVESAvailable: true },
      childSupportReceived: { reported: true, likelyRAPIDAvailable: true }
    },
    expenses: {
      ...EMPTY_APPLICATION.expenses,
      rent: { reported: true },
      utilities: {
        ...EMPTY_APPLICATION.expenses.utilities,
        heat: true,
        acElectricity: true,
        phone: true
      },
      medical: {
        ...EMPTY_APPLICATION.expenses.medical,
        reported: true,
        elderlyOrDisabled: true,
        person: "Mother",
        otcSupplies: true,
        transportation: true
      }
    }
  },
  jobEnded: {
    ...EMPTY_APPLICATION,
    label: "Job ended + rent and utilities",
    income: {
      ...EMPTY_APPLICATION.income,
      wages: { reported: true, changed: false, endedRecently: true }
    },
    expenses: {
      ...EMPTY_APPLICATION.expenses,
      rent: { reported: true },
      utilities: {
        ...EMPTY_APPLICATION.expenses.utilities,
        electricGas: true,
        phone: true
      }
    }
  },
  simpleWages: {
    ...EMPTY_APPLICATION,
    label: "Wages only, no special deductions",
    income: {
      ...EMPTY_APPLICATION.income,
      wages: { reported: true, changed: false, endedRecently: false }
    },
    expenses: {
      ...EMPTY_APPLICATION.expenses,
      rent: { reported: true },
      utilities: {
        ...EMPTY_APPLICATION.expenses.utilities,
        heat: true,
        phone: true
      }
    }
  }
};

const VERIFICATION_RULES = [
  {
    "id": "ID-001",
    "triggerPath": "identity.likelyRMVMatch",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": null,
    "icon": "identity",
    "section": "Identity / About you",
    "answer": "Applicant identity entered; \nSSN provided",
    "title": "Proof of identity",
    "examples": [
      "Driver license",
      "State ID",
      "Passport",
      "School/work ID"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes —",
    "dtaDataReliability": "Sometimes — depends on match quality, freshness, and case context, RMV / existing DTA identity systems",
    "microcopy": "You probably do not need to submit photo ID unless DTA asks for it.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-001",
    "triggerPath": "income.wages.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "wages",
    "section": "Income & benefits",
    "answer": "Wages selected",
    "title": "Proof of pay or wages",
    "examples": [
      "Recent pay stubs or statements",
      "Payroll app screenshot",
      "Employer statement"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Sometimes -\nThe Work Number may be able to verify if employer shares data with the service and that data is updated frequently",
    "microcopy": "We need proof of any pay you got in the last 30 days. DTA may be able to find this in wage records, but it may help you get benefits sooner if you send what you can now.\n\nMake sure your proof shows the **gross income** amount. **Gross income** is the amount before taxes or benefits are taken out.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-019",
    "triggerPath": "income.wages.changed",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "wages",
    "section": "Income/job change",
    "answer": "Still working at employer but income changed",
    "title": "Proof of changed income from current employer",
    "examples": [
      "Recent pay stubs or statements",
      "Payroll app screenshot",
      "Employer statement",
      "Letter/text/email showing new hours, rate, or schedule"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Sometimes -\nThe Work Number ?",
    "microcopy": "You said someone is still working but their income changed. Send proof that shows the new gross income amount or new schedule.\n\nMake sure any income amounts shows the gross income amount. Gross income is the amount before taxes or benefits are taken out.",
    "source": "Interim report; Recertification",
    "helpText": ""
  },
  {
    "id": "INC-020",
    "triggerPath": "income.wages.endedRecently",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "jobEnd",
    "section": "Income/job change",
    "answer": "No longer working at employer",
    "title": "Proof that a job ended",
    "examples": [
      "Recent paystubs or statements",
      "Letter from employer showing gross income and number of hours worked",
      "A termination notice or layoff letter",
      "Employer letter/text/email"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Rarely ?\nThe Work Number?",
    "microcopy": "You said someone is no longer working at an employer. We need to know how much they got during the last 4 weeks, and any pay they will get after their last day workerd. \n\nMake sure any income amounts shows the gross income amount. Gross income is the amount before taxes or benefits are taken out.",
    "source": "Interim report; Recertification",
    "helpText": ""
  },
  {
    "id": "INC-003",
    "triggerPath": "income.selfEmployment.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "selfEmployment",
    "section": "Income & benefits",
    "answer": "Self-employment selected",
    "title": "Proof of self-employment income",
    "examples": [
      { "type": "heading", "text": "If you filed taxes as self-employed:" },
      "Schedule C from your 1040 IRS form",
      "1099 forms you got",
      { "type": "heading", "text": "If your self employment is new or you don't file taxes:" },
      {
        "segments": [
          "Business records or statements that show income and business-related expenses from the ",
          { "strong": "past 90 days" }
        ]
      },
      "Invoices or contracts",
      "receipts for business expenses",
      "bank deposits or records from payment apps"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "You told us someone is self-employed. Send records that show income and business-related expenses.",
    "source": "All",
    "helpText": "",
    "details": {
      "label": "Show me an example of an income and expense statement for self employment:",
      "content": "I, [Your First and Last name] am self-employed as a [your job or profession]. \n\nIncome\nIn [last month], I worked [number of hours] and made [amount of money] before business-related expenses. \nIn [month before last]. I worked [number of hours] and made [amount of money] before business-related expenses \nIn [month before that] I worked [number of hours] and made [amount of money] before business-related expenses. \n\nExpenses\nMy business-related expenses are [list each business-related cost you have and note how often you pay it]: \nI pay [amount of expense] every [frequency]\n\nSigned: [Your name/signature]\nDate: [Today's date]",
      "italic": true
    }
  },
  {
    "id": "INC-005",
    "triggerPath": "income.workStudy.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "workStudy",
    "section": "Income & benefits",
    "answer": "Work study selected",
    "title": "Proof of work-study income",
    "examples": [
      "Work-study award letter",
      "Campus employment record",
      "Pay stubs or statements showing gross pay"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Sometimes- if its in the work number",
    "microcopy": "Send proof that the income is work-study and how much is paid.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-006",
    "triggerPath": "income.ssi.reported",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.ssi.likelySVESAvailable",
    "icon": "socialSecurity",
    "section": "Income & benefits",
    "answer": "SSI (Supplemental Security Income)",
    "title": "Proof of SSI income",
    "examples": [
      "SSA award letter",
      "Bank record showing SSI deposit"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Sometimes — depends on match quality, freshness, and case context\nSVES federal data match",
    "microcopy": "You probably do not need to submit SSI proof unless DTA asks.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-008",
    "triggerPath": "income.rsdi.reported",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.rsdi.likelySVESAvailable",
    "icon": "socialSecurity",
    "section": "Income & benefits",
    "answer": "RSDI (Retirement, Survivors, and Disability Insurance) selected",
    "title": "Proof of RSDI/Social Security income",
    "examples": [
      "SSA letter",
      "Bank record showing a SSA benefit deposit"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Sometimes — depends on match quality, freshness, and case context\nSVES federal data match",
    "microcopy": "You probably do not need to submit Social Security proof unless DTA asks.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-010",
    "triggerPath": "income.unemployment.reported",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.unemployment.likelyStateMatchAvailable",
    "icon": "unemployment",
    "section": "Income & benefits",
    "answer": "Unemployment selected ",
    "title": "Proof of unemployment income",
    "examples": [
      "Unemployment benefit letter",
      "DUA payment history",
      "bank deposits"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Usually - if unemployment payments are from MA, if out of state DTA will ask for proof.",
    "microcopy": "You probably do not need to submit unemployment proof unless DTA asks.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-012",
    "triggerPath": "income.childSupportReceived.reported",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.childSupportReceived.likelyRAPIDAvailable",
    "icon": "childSupport",
    "section": "Income & benefits",
    "answer": "Child support received ",
    "title": "Proof of child support received",
    "examples": [
      "Bank deposits",
      "Venmo/Cash App screenshots",
      "Copies of support checks"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Sometimes - depends on whether child support is formal and court ordered, or if support is informal.",
    "microcopy": "If the child support you get is court-ordered, you probably do not need to submit proof unless DTA asks. \n\nIf the child support your get is not court-ordered, informal, or in cash, we'll need proof of recent payments, usually from the last 90 days",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-014",
    "triggerPath": "income.pension.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "pension",
    "section": "Income & benefits",
    "answer": "Pension selected",
    "title": "Proof of pension income",
    "examples": [
      "Pension award letter",
      "Benefit statement",
      "Bank record showing pension deposit"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Sometimes - available in the Work Number, but usually will need to provide this.",
    "microcopy": "Send proof of the pension amount and how often it is paid.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-015",
    "triggerPath": "income.veteransBenefits.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "veterans",
    "section": "Income & benefits",
    "answer": "Veterans benefits selected",
    "title": "Proof of veterans benefits",
    "examples": [
      "Proof of the amount, how often it is paid and who it is paid to for example: Benefit or award letter",
      "Check or record of payment",
      "Statement from agency making payments"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of veterans benefits if DTA asks or if you have it ready.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-016",
    "triggerPath": "income.rentalIncome.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "rentalIncome",
    "section": "Income & benefits",
    "answer": "Rental income selected",
    "title": "Proof of rental income",
    "examples": [
      "Schedule E (1040 IRS form)",
      "Records that show how much you get for rent from your tenant or roomer/boarder and how often it is paid. For example:",
      "Lease agreements",
      "Written statements from the tenant"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send records showing rent income you get. \n\nIf your rental income is your business, you can also send business-related expenses",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-017",
    "triggerPath": "income.workersComp.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "workersComp",
    "section": "Income & benefits",
    "answer": "Workers comp selected",
    "title": "Proof of workers compensation",
    "examples": [
      "Workers compensation award letter",
      "Payment history",
      "Bank record showing workers compensation deposit"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of workers compensation payments.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "INC-018",
    "triggerPath": "income.pfml.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "pfml",
    "section": "Income & benefits",
    "answer": "PFML income selected",
    "title": "Proof of paid family and medical leave income",
    "examples": [
      "PFML approval or award notice",
      "Payment history or pay statements",
      "Bank record showing PFML deposits",
      "Employer/agency letter"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof that shows the amount of PFML and how often it is paid.",
    "source": "Interim report; Recertification",
    "helpText": ""
  },
  {
    "id": "WRK-001",
    "triggerPath": "workRules.abawdExemption",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "workRules",
    "section": "Work rules / ABAWD",
    "answer": "ABAWD work-rule exemption (multiple factors)",
    "title": "Proof of work-rule compliance or exemption",
    "examples": [
      "Work or training schedule",
      "Pay stubs or statements",
      "School/training record",
      "Doctor/provider statement",
      "Proof of caring for someone",
      "Pregnancy proof if needed",
      "Benefit/disability record",
      "Other DTA forms"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Some exemptions may be known from age, disability, household, or benefits data; other exemptions require client proof",
    "dtaDataReliability": "Sometimes — confirm with DTA\nProof of work, hours, or pay may be found in the Work number",
    "microcopy": "You answered questions about SNAP work rules. Send proof if you have it, especially if something exempts you from the rules.",
    "source": "Interim report; Recertification",
    "helpText": ""
  },
  {
    "id": "EXP-001",
    "triggerPath": "expenses.rent.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "rent",
    "section": "Housing expenses",
    "answer": "Rent selected",
    "title": "Proof of rent",
    "examples": [
      "Lease",
      "Rent payment receipt",
      "Statement from your landlord",
      "Cancelled or cashed check",
      "Payment app record showing rent payment"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of rent if you can. Rent costs may increase SNAP benefit amount.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-002",
    "triggerPath": "expenses.mortgage.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "mortgage",
    "section": "Housing expenses",
    "answer": "Mortgage selected",
    "title": "Proof of mortgage payment",
    "examples": [
      "Mortgage statement",
      "Lender statement",
      "Payment record saying the exact amount you are supposed to pay"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of mortgage payments if you can. Housing costs may increase your SNAP benefit amount.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-003",
    "triggerPath": "expenses.propertyTaxes.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "mortgage",
    "section": "Housing expenses",
    "answer": "Property taxes selected",
    "title": "Proof of property taxes",
    "examples": [
      "Property tax bill",
      "Municipal tax statement",
      "Escrow statement showing the exact amount you pay"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of property taxes if you can.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-004",
    "triggerPath": "expenses.homeInsurance.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "mortgage",
    "section": "Housing expenses",
    "answer": "Home insurance selected",
    "title": "Proof of home insurance",
    "examples": [
      "Homeowners insurance bill",
      "Policy statement",
      "Escrow statement showing the exact amount you pay"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of home insurance if you can.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-005",
    "triggerPath": "expenses.condoFees.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "mortgage",
    "section": "Housing expenses",
    "answer": "Condo fees selected",
    "title": "Proof of condo fees",
    "examples": [
      "Condo fee bill",
      "HOA statement",
      "Payment record or receipt"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of condo fees if you can.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-006",
    "triggerPath": "expenses.utilities.heat",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "utilities",
    "section": "Utility expenses",
    "answer": "Heat selected",
    "title": "Proof you pay utilities",
    "examples": [
      "Bill for heat, air conditioning, electricity, or gas",
      "Lease showing you pay for utilities",
      "Receipt",
      "Signed and dated letter from landlord or roommate"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof that you pay for heating or cooling costs",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-007",
    "triggerPath": "expenses.utilities.acElectricity",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "utilities",
    "section": "Utility expenses",
    "answer": "Electricity for AC selected",
    "title": "Proof you pay utilities",
    "examples": [
      "Bill for electricity or cooling",
      "Lease showing you pay for utilities",
      "Receipt",
      "Signed and dated letter from landlord or roommate"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof that you pay for heating or cooling costs",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-008",
    "triggerPath": "expenses.utilities.acFee",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "utilities",
    "section": "Utility expenses",
    "answer": "Fee to use AC selected",
    "title": "Proof you pay utilities or AC fee",
    "examples": [
      "Landlord statement",
      "Lease addendum",
      "Receipt",
      "Bill"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof that you pay for heating or cooling costs",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-009",
    "triggerPath": "expenses.utilities.electricGas",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "utilities",
    "section": "Utility expenses",
    "answer": "Electricity/gas not used for heat selected",
    "title": "Proof you pay utilities",
    "examples": [
      "Bill for other utility costs such as coal, wood for heating, garbage collection, water and sewer",
      "Signed and dated letter from landlord or roommate"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof that you pay other utilities",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-010",
    "triggerPath": "expenses.utilities.phone",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "utilities",
    "section": "Utility expenses",
    "answer": "Phone/cell service selected",
    "title": "Proof you pay phone or cell service",
    "examples": [
      "Phone bill",
      "cell phone bill",
      "account screenshot"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof that you pay for phone or cell service if you can.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-011",
    "triggerPath": "expenses.dependentCare.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "dependentCare",
    "section": "Dependent care expenses",
    "answer": "Dependent care selected",
    "title": "Proof of dependent care costs",
    "examples": [
      "Statement or letter from the child or adult care provider showing the amount that you are responsible for",
      "Receipts, canceled check, or money order"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof of child or adult care costs. These costs may increase your SNAP benefit amount.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-012",
    "triggerPath": "expenses.dependentCare.driveToProvider",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "dependentCare",
    "section": "Dependent care expenses",
    "answer": "Drive dependent to and/or from the provider selected Yes",
    "title": "Proof of transportation to dependent care",
    "examples": [
      "Statement or self-declaration stating the address of the provider and how often you drive to and from this provider"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If you drive: Send a signed statement with provider address and how many times per week or month you drive there",
    "source": "All",
    "helpText": "",
    "details": {
      "label": "Show me an example of a travel statement",
      "content": "I, [Your First and Last name] drive to [care provider name], located at [street address, city, state, zip code] every [frequency]. \n\nSigned: [Your name/signature]\nDate: [Today's date]",
      "italic": true
    }
  },
  {
    "id": "EXP-015",
    "triggerPath": "expenses.dependentCare.paidTransportation",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "dependentCare",
    "section": "Dependent care expenses",
    "answer": "Pay for transportation for dependent selected Yes",
    "title": "Proof of other transportation costs",
    "examples": [],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If you pay for parking or tolls or use a transportation service: Receipts from the transportation company (e.g., Lyft, Uber)\n- Receipts for public transportation (e.g., bus, subway, taxi, The RIDE)\n- Receipts for parking or tolls\n\nMake sure to note the frequency of the trips (writing on the receipt is ok)",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-013",
    "triggerPath": "expenses.childSupportPaid.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "childSupport",
    "section": "Child support expenses",
    "answer": "Child support paid selected",
    "title": "Proof of child support you pay",
    "examples": [
      "Court order",
      "Payment history",
      "Wage withholding record",
      "Receipts for child support payments"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If someone in your household pays court-ordered child support to someone outside the home, send proof.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-014",
    "triggerPath": "expenses.medical.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "medical",
    "section": "Medical expenses",
    "answer": "Medical costs selected (health insurance or other medical costs including prescriptions, transportation, over the counter medications, dental or eye care, adult diapers, etc?)  ",
    "title": "Proof of medical expenses",
    "examples": [
      {
        "text": "Bills or receipts for medical costs not covered by MassHealth or other insurance, such as:",
        "children": [
          "health insurance co-pays and premiums",
          "one-time medical bills",
          "prescription medication",
          "over-the-counter medical items",
          "dental care or dentures",
          "eyeglasses",
          "hearing aid batteries",
          "Payments for home health aides or other care you need"
        ]
      }
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Sending proof of medical costs over $35 a month may increase your SNAP benefit amount. Make sure to note the frequency of the expense. (writing on the receipt is ok)",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-016",
    "triggerPath": "expenses.medical.transportation",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "medical",
    "section": "Medical expenses",
    "answer": "Drive to medical appointments or the pharmacy selected",
    "title": "Proof of transportation costs to medical appointments",
    "examples": [],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If you drive: Send a signed statement with the address of the provider/pharmacy and how often you drive there\n\nIf you pay for parking or tolls or use transportation: Receipts from the transportation company (e.g., Lyft, Uber)\n- Receipts for public transportation (e.g., bus, subway, taxi, The RIDE)\n- Receipts for parking or tolls\n\nMake sure to note the frequency of the expense (writing on the receipt is ok)",
    "source": "All",
    "helpText": "",
    "details": {
      "label": "Show me an example of a travel statement",
      "content": "I, [Your First and Last name] drive to [provider or pharmacy address], located at [street address, city, state, zip code] every [frequency]. \n\nSigned: [Your name/signature]\nDate: [Today's date]",
      "italic": true
    }
  },
  {
    "id": "EXP-017",
    "triggerPath": "expenses.medical.healthInsuranceRelated",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "medical",
    "section": "Medical expenses",
    "answer": "Medical expenses related to health insurance added/entered",
    "title": "Proof of health-insurance-related medical expenses",
    "examples": [
      "Copay receipts",
      "Explanation of benefits",
      "Pharmacy printout",
      "Provider bill",
      "Insurer statement",
      "Premium bill"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Sending proof of medical costs over $35 a month may increase your SNAP benefit amount. Make sure to note the frequency of the expense. (writing on the receipt is ok)",
    "source": "Interim report; Recertification",
    "helpText": ""
  },
  {
    "id": "EXP-018",
    "triggerPath": "expenses.medical.otherMedical",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "medical",
    "section": "Medical expenses",
    "answer": "Medical expenses not related to health insurance added/ entered",
    "title": "Proof of other medical expenses",
    "examples": [
      "Bills or receipts for medical costs not covered by MassHealth or other insurance, such as:",
      "Health insurance co-pays and premiums",
      "One-time medical bills",
      "Prescription medication",
      "Over-the-counter medical items",
      "Dental care or dentures",
      "Eyeglasses",
      "Hearing aid batteries",
      "Payments for home health aides or other care you need"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Sending proof of medical costs over $35 a month may increase your SNAP benefit amount. Make sure to note the frequency of the expense. (writing on the receipt is ok)",
    "source": "Interim report; Recertification",
    "helpText": ""
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getPathValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return current[key];
  }, obj);
}

function setPathValue(obj, path, value) {
  const keys = path.split(".");
  let target = obj;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (!target[key] || typeof target[key] !== "object") target[key] = {};
    target = target[key];
  }

  target[keys[keys.length - 1]] = value;
}

function isTriggered(app, rule) {
  if (rule.id === "ID-001") return true;
  if (!getPathValue(app, rule.triggerPath)) return false;
  if (rule.eligiblePath && !getPathValue(app, rule.eligiblePath)) return false;
  if (!passesUtilityPrecedence(app, rule)) return false;
  return true;
}

function passesUtilityPrecedence(app, rule) {
  const heatSelected = Boolean(getPathValue(app, "expenses.utilities.heat"));
  const acElectricitySelected = Boolean(getPathValue(app, "expenses.utilities.acElectricity"));
  const acFeeSelected = Boolean(getPathValue(app, "expenses.utilities.acFee"));
  const highPriorityUtilitySelected = heatSelected || acElectricitySelected || acFeeSelected;
  const otherUtilitySelected = Boolean(getPathValue(app, "expenses.utilities.electricGas"));

  if (rule.id === "EXP-006") return heatSelected;
  if (rule.id === "EXP-007") return !heatSelected && acElectricitySelected;
  if (rule.id === "EXP-008") return !heatSelected && !acElectricitySelected && acFeeSelected;
  if (rule.id === "EXP-009") return !highPriorityUtilitySelected;
  if (rule.id === "EXP-010") return !highPriorityUtilitySelected && !otherUtilitySelected;
  return true;
}

function shouldSuppress(app, rule, settings) {
  if (!settings.suppressInternalData || !rule.suppressible) return false;
  if (rule.id === "ID-001") return Boolean(app.identity?.likelyRMVMatch);
  if (!rule.dataPath) return false;
  return Boolean(getPathValue(app, rule.dataPath));
}

export function recommendVerifications(app, settings = DEFAULT_SETTINGS) {
  const safeApp = app || EMPTY_APPLICATION;
  const safeSettings = { ...DEFAULT_SETTINGS, ...settings };
  const recs = [];
  const suppressed = [];

  VERIFICATION_RULES.forEach((rule) => {
    if (rule.id === "ID-001" && !safeSettings.includeIdentity) return;
    if (!isTriggered(safeApp, rule)) return;

    const item = {
      key: rule.id,
      icon: ICONS[rule.icon] || "Doc",
      emoji: CARD_EMOJI_BY_RULE_ID[rule.id] || "📝",
      title: rule.title,
      why: rule.microcopy || "Send proof if DTA asks or if you have it ready.",
      examples: rule.examples || [],
      helperText: rule.helpText,
      details: rule.details,
      required: rule.required,
      recommended: !rule.required,
      dtaDataAvailable: rule.dtaDataAvailable,
      dtaDataReliability: rule.dtaDataReliability,
      source: rule.source,
      section: rule.section
    };

    if (shouldSuppress(safeApp, rule, safeSettings)) {
      suppressed.push(item);
    } else {
      recs.push({ ...item, priority: item.required ? 1 : 2 });
    }
  });

  return {
    recs: recs.sort((a, b) => a.priority - b.priority),
    suppressed
  };
}

function runPrototypeTests() {
  const freelance = recommendVerifications(SAMPLE_APPLICATIONS.freelanceCaregiver, DEFAULT_SETTINGS);

  console.assert(freelance.recs.some((rec) => rec.key === "INC-003"), "Expected self-employment recommendation");
  console.assert(freelance.recs.some((rec) => rec.key === "EXP-014"), "Expected medical expense recommendation");
  console.assert(freelance.suppressed.some((rec) => rec.key === "INC-008"), "Expected RSDI suppression");
  console.assert(freelance.suppressed.some((rec) => rec.key === "INC-012"), "Expected child support suppression");

  const jobEnded = recommendVerifications(SAMPLE_APPLICATIONS.jobEnded, DEFAULT_SETTINGS);
  console.assert(jobEnded.recs.some((rec) => rec.key === "INC-020"), "Expected job-ended recommendation");

  const medicalOnly = clone(EMPTY_APPLICATION);
  medicalOnly.expenses.medical.reported = true;
  const medicalOnlyResult = recommendVerifications(medicalOnly, DEFAULT_SETTINGS);
  console.assert(medicalOnlyResult.recs.some((rec) => rec.key === "EXP-014"), "Expected medical recommendation from visible medical checkbox");

  const fullIncome = clone(EMPTY_APPLICATION);
  fullIncome.identity.likelyRMVMatch = false;
  fullIncome.income.wages.reported = true;
  fullIncome.income.wages.changed = true;
  fullIncome.income.selfEmployment.reported = true;
  fullIncome.income.workStudy.reported = true;
  fullIncome.income.ssi.reported = true;
  fullIncome.income.ssi.likelySVESAvailable = false;
  fullIncome.income.rsdi.reported = true;
  fullIncome.income.rsdi.likelySVESAvailable = false;
  fullIncome.income.unemployment.reported = true;
  fullIncome.income.unemployment.likelyStateMatchAvailable = false;
  fullIncome.income.childSupportReceived.reported = true;
  fullIncome.income.childSupportReceived.likelyRAPIDAvailable = false;
  fullIncome.income.pension.reported = true;
  fullIncome.income.veteransBenefits.reported = true;
  fullIncome.income.rentalIncome.reported = true;
  fullIncome.income.workersComp.reported = true;
  fullIncome.income.pfml.reported = true;

  const fullIncomeResult = recommendVerifications(fullIncome, { suppressInternalData: false, includeIdentity: true });
  ["ID-001", "INC-001", "INC-019", "INC-003", "INC-005", "INC-006", "INC-008", "INC-010", "INC-012", "INC-014", "INC-015", "INC-016", "INC-017", "INC-018"].forEach((key) => {
    console.assert(fullIncomeResult.recs.some((rec) => rec.key === key), `Expected ${key} recommendation`);
  });

  const fullExpenses = clone(EMPTY_APPLICATION);
  fullExpenses.expenses.rent.reported = true;
  fullExpenses.expenses.mortgage.reported = true;
  fullExpenses.expenses.propertyTaxes.reported = true;
  fullExpenses.expenses.homeInsurance.reported = true;
  fullExpenses.expenses.condoFees.reported = true;
  fullExpenses.expenses.utilities.heat = true;
  fullExpenses.expenses.utilities.acElectricity = true;
  fullExpenses.expenses.utilities.acFee = true;
  fullExpenses.expenses.utilities.electricGas = true;
  fullExpenses.expenses.utilities.phone = true;
  fullExpenses.expenses.dependentCare.reported = true;
  fullExpenses.expenses.dependentCare.driveToProvider = true;
  fullExpenses.expenses.dependentCare.paidTransportation = true;
  fullExpenses.expenses.childSupportPaid.reported = true;
  fullExpenses.expenses.medical.reported = true;
  fullExpenses.expenses.medical.elderlyOrDisabled = true;
  fullExpenses.expenses.medical.transportation = true;
  fullExpenses.expenses.medical.healthInsuranceRelated = true;
  fullExpenses.expenses.medical.otherMedical = true;

  const fullExpensesResult = recommendVerifications(fullExpenses, { suppressInternalData: true, includeIdentity: false });
  ["EXP-001", "EXP-002", "EXP-003", "EXP-004", "EXP-005", "EXP-006", "EXP-011", "EXP-012", "EXP-015", "EXP-013", "EXP-014", "EXP-016", "EXP-017", "EXP-018"].forEach((key) => {
    console.assert(fullExpensesResult.recs.some((rec) => rec.key === key), `Expected ${key} recommendation`);
  });
  ["EXP-007", "EXP-008", "EXP-009", "EXP-010"].forEach((key) => {
    console.assert(!fullExpensesResult.recs.some((rec) => rec.key === key), `Did not expect ${key} when heat/cooling utility proof is already recommended`);
  });

  const acElectricOnly = clone(EMPTY_APPLICATION);
  acElectricOnly.expenses.utilities.acElectricity = true;
  const acElectricOnlyResult = recommendVerifications(acElectricOnly, { suppressInternalData: true, includeIdentity: false });
  console.assert(acElectricOnlyResult.recs.some((rec) => rec.key === "EXP-007"), "Expected EXP-007 when only AC electricity is selected");

  const acFeeOnly = clone(EMPTY_APPLICATION);
  acFeeOnly.expenses.utilities.acFee = true;
  const acFeeOnlyResult = recommendVerifications(acFeeOnly, { suppressInternalData: true, includeIdentity: false });
  console.assert(acFeeOnlyResult.recs.some((rec) => rec.key === "EXP-008"), "Expected EXP-008 when only AC fee is selected");

  const otherUtilityOnly = clone(EMPTY_APPLICATION);
  otherUtilityOnly.expenses.utilities.electricGas = true;
  const otherUtilityOnlyResult = recommendVerifications(otherUtilityOnly, { suppressInternalData: true, includeIdentity: false });
  console.assert(otherUtilityOnlyResult.recs.some((rec) => rec.key === "EXP-009"), "Expected EXP-009 when only other utility is selected");

  const phoneOnly = clone(EMPTY_APPLICATION);
  phoneOnly.expenses.utilities.phone = true;
  const phoneOnlyResult = recommendVerifications(phoneOnly, { suppressInternalData: true, includeIdentity: false });
  console.assert(phoneOnlyResult.recs.some((rec) => rec.key === "EXP-010"), "Expected EXP-010 when only phone is selected");
}

runPrototypeTests();

function Badge({ children, tone = "default" }) {
  const styles = {
    default: "bg-white text-slate-800 border-slate-400",
    required: "bg-slate-100 text-slate-900 border-slate-500",
    recommended: "bg-white text-slate-800 border-slate-400"
  };

  return (
    <span className={`inline-flex items-center border px-2 py-1 text-xs font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}

function InlineExampleContent({ example }) {
  if (Array.isArray(example.segments)) {
    return example.segments.map((segment, index) => {
      if (typeof segment === "string") return segment;
      return <strong key={`${segment.strong}-${index}`} className="font-bold">{segment.strong}</strong>;
    });
  }

  return example.text;
}

function ExampleList({ examples, nested = false }) {
  return (
    <ul className={`${nested ? "mt-1" : "mt-2"} list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700`}>
      {examples.map((example, index) => {
        if (typeof example === "string") {
          return <li key={example}>{example}</li>;
        }

        if (example.type === "heading") {
          return (
            <li key={`${example.text}-${index}`} className="list-none -ml-5 pt-2 font-bold text-slate-800">
              {example.text}
            </li>
          );
        }

        return (
          <li key={`${example.text || example.segments?.[0]}-${index}`}>
            <span><InlineExampleContent example={example} /></span>
            {example.children?.length ? <ExampleList examples={example.children} nested /> : null}
          </li>
        );
      })}
    </ul>
  );
}

function InlineRichText({ text, italicizeBrackets = false }) {
  return String(text || "").split(/(\*\*[^*]+\*\*|\[[^\]]+\])/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`} className="font-bold">{part.slice(2, -2)}</strong>;
    }

    if (italicizeBrackets && part.startsWith("[") && part.endsWith("]")) {
      return <em key={`${part}-${index}`}>{part}</em>;
    }

    return part;
  });
}

function RichText({ text, italic = false, italicizeBrackets = false }) {
  const blocks = String(text || "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-2 text-sm leading-relaxed text-slate-700 ${italic ? "italic" : ""}`}>
      {blocks.map((block) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const listItems = lines.filter((line) => line.startsWith("- ")).map((line) => line.replace(/^-\s+/, ""));
        const proseLines = lines.filter((line) => !line.startsWith("- "));

        return (
          <div key={block} className="space-y-2">
            {proseLines.map((line) => (
              <p key={line}><InlineRichText text={line} italicizeBrackets={italicizeBrackets} /></p>
            ))}
            {listItems.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5">
                {listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DetailsToggle({ details }) {
  const [open, setOpen] = useState(false);

  if (!details?.label || !details?.content) return null;

  return (
    <div className="mt-3 w-full max-w-[400px] border border-slate-300 bg-slate-50 p-3">
      <button
        type="button"
        className="text-left text-sm font-normal underline"
        onClick={() => setOpen(!open)}
      >
        {details.label}
      </button>

      {open ? (
        <div className="mt-3">
          <RichText text={details.content} italicizeBrackets={details.italic} />
        </div>
      ) : null}
    </div>
  );
}

function RecommendationCard({ rec }) {
  return (
    <div className="border border-slate-300 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950">
          <span aria-hidden="true" className="shrink-0 text-4xl leading-none">
            {rec.emoji}
          </span>
          <span>
          {rec.title}
          </span>
        </h3>

        {rec.recommended ? <Badge tone="recommended">Optional, but may increase benefits</Badge> : null}
      </div>

      <div className="mt-2">
        <RichText text={rec.why} />
      </div>

      {rec.examples.length > 0 ? (
        <div className="mt-3">
          {rec.key !== "INC-003" ? <p className="text-sm font-normal text-slate-800">Examples:</p> : null}
          <ExampleList examples={rec.examples} />
        </div>
      ) : null}

      {rec.helperText ? (
        <p className="mt-3 border-l-4 border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed text-slate-800">
          {rec.helperText}
        </p>
      ) : null}

      <DetailsToggle details={rec.details} />
    </div>
  );
}

function ToggleInput({ app, setApp, path, label }) {
  const checked = Boolean(getPathValue(app, path));

  return (
    <label className="flex cursor-pointer items-center gap-3 border border-slate-300 bg-white p-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          const next = clone(app);
          setPathValue(next, path, event.target.checked);
          setApp(next);
        }}
      />
      <span>{label}</span>
    </label>
  );
}

function InputGroup({ title, children }) {
  return (
    <section className="border border-slate-300 bg-white p-4">
      <h3 className="text-[15px] font-semibold text-slate-950">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ApplicationEditor({ app, setApp }) {
  return (
    <section className="border border-slate-300 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-950">Prototype inputs</h2>
      <p className="mt-1 text-sm text-slate-600">
        These checkboxes mirror the DTA Connect SNAP application answers used by the verification mapping spreadsheet.
      </p>

      <div className="mt-4 space-y-4">
        <InputGroup title="Income and benefit types">
          <ToggleInput app={app} setApp={setApp} path="income.wages.reported" label="Wages" />
          <ToggleInput app={app} setApp={setApp} path="income.wages.changed" label="Still working but income changed" />
          <ToggleInput app={app} setApp={setApp} path="income.wages.endedRecently" label="No longer working / job ended" />
          <ToggleInput app={app} setApp={setApp} path="income.selfEmployment.reported" label="Self-employment" />
          <ToggleInput app={app} setApp={setApp} path="income.workStudy.reported" label="Work study" />
          <ToggleInput app={app} setApp={setApp} path="income.ssi.reported" label="SSI" />
          <ToggleInput app={app} setApp={setApp} path="income.rsdi.reported" label="RSDI" />
          <ToggleInput app={app} setApp={setApp} path="income.unemployment.reported" label="Unemployment" />
          <ToggleInput app={app} setApp={setApp} path="income.childSupportReceived.reported" label="Child support received" />
          <ToggleInput app={app} setApp={setApp} path="income.pension.reported" label="Pension" />
          <ToggleInput app={app} setApp={setApp} path="income.veteransBenefits.reported" label="Veterans benefits" />
          <ToggleInput app={app} setApp={setApp} path="income.rentalIncome.reported" label="Rental income" />
          <ToggleInput app={app} setApp={setApp} path="income.workersComp.reported" label="Workers comp" />
          <ToggleInput app={app} setApp={setApp} path="income.pfml.reported" label="Paid family and medical leave" />
          <ToggleInput app={app} setApp={setApp} path="workRules.abawdExemption" label="ABAWD/work-rule exemption or compliance" />
        </InputGroup>

        <InputGroup title="Utilities">
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.heat" label="Heat" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.acElectricity" label="Electricity for air conditioner" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.acFee" label="Fee to use air conditioner" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.electricGas" label="Electricity/gas not used for heat" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.phone" label="Phone/cell service" />
        </InputGroup>

        <InputGroup title="Housing expenses">
          <ToggleInput app={app} setApp={setApp} path="expenses.rent.reported" label="Rent" />
          <ToggleInput app={app} setApp={setApp} path="expenses.mortgage.reported" label="Mortgage" />
          <ToggleInput app={app} setApp={setApp} path="expenses.propertyTaxes.reported" label="Property taxes" />
          <ToggleInput app={app} setApp={setApp} path="expenses.homeInsurance.reported" label="Home insurance" />
          <ToggleInput app={app} setApp={setApp} path="expenses.condoFees.reported" label="Condo fees" />
        </InputGroup>

        <InputGroup title="Dependent care, child support, and medical expenses">
          <ToggleInput app={app} setApp={setApp} path="expenses.dependentCare.reported" label="Dependent care" />
          <ToggleInput app={app} setApp={setApp} path="expenses.dependentCare.driveToProvider" label="Drive dependent to/from care provider" />
          <ToggleInput app={app} setApp={setApp} path="expenses.dependentCare.paidTransportation" label="Pay for transportation for dependent" />
          <ToggleInput app={app} setApp={setApp} path="expenses.childSupportPaid.reported" label="Child support paid" />
          <ToggleInput app={app} setApp={setApp} path="expenses.medical.reported" label="Medical costs" />
          <ToggleInput app={app} setApp={setApp} path="expenses.medical.transportation" label="Drive to medical appointments or pharmacy" />
          <ToggleInput app={app} setApp={setApp} path="expenses.medical.healthInsuranceRelated" label="Health-insurance-related medical expenses" />
          <ToggleInput app={app} setApp={setApp} path="expenses.medical.otherMedical" label="Other medical expenses" />
        </InputGroup>
      </div>
    </section>
  );
}

function ClientActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <button type="button" className="border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-bold text-white">
        Upload documents now
      </button>
      <button type="button" className="border border-slate-500 bg-white px-5 py-3 text-sm font-bold text-slate-900">
        Send me this list for later
      </button>
      <button type="button" className="border border-slate-500 bg-white px-5 py-3 text-sm font-bold text-slate-900">
        Download list
      </button>
    </div>
  );
}

function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submitPassword(event) {
    event.preventDefault();

    if (password === PROTOTYPE_PASSWORD) {
      window.localStorage.setItem("snap-verification-prototype-unlocked", "true");
      onUnlock();
      return;
    }

    setError("That password did not work. Please try again.");
  }

  return (
    <main className="min-h-screen bg-white p-4 text-slate-900 sm:p-8" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
      <section className="mx-auto mt-16 max-w-md border border-slate-300 bg-white p-6 sm:p-8">
        <h1 className="text-xl font-semibold text-slate-950">DTA Discovery | Verification List Prototype</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Enter the password to view this prototype.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submitPassword}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="mt-2 w-full border border-slate-400 px-3 py-2 text-base"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <button type="submit" className="border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}

export default function SnapVerificationPrototype() {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("snap-verification-prototype-unlocked") === "true";
  });
  const [scenarioKey, setScenarioKey] = useState(null);
  const [app, setApp] = useState(clone(EMPTY_APPLICATION));
  const [applicationNumber] = useState(() => String(Math.floor(10000000 + Math.random() * 90000000)));
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mode, setMode] = useState("client");
  const [showScenarioButtons, setShowScenarioButtons] = useState(false);
  const [showPolicyToggles, setShowPolicyToggles] = useState(true);

  const result = useMemo(() => recommendVerifications(app, settings), [app, settings]);

  function loadScenario(key) {
    if (scenarioKey === key) {
      setScenarioKey(null);
      setApp(clone(EMPTY_APPLICATION));
      return;
    }

    setScenarioKey(key);
    setApp(clone(SAMPLE_APPLICATIONS[key]));
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <main className="min-h-screen bg-white p-4 text-slate-900 sm:p-8" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
      <div className="mx-auto max-w-6xl">
        {mode === "logic" ? (
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[22px] font-semibold tracking-normal text-slate-950">DTA Discovery | Verification List Prototype</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
                A rules-based prototype that converts SNAP application answers into a personalized and actionable verification recommendation.
              </p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setMode("client")} className={`border px-4 py-2 text-sm font-bold ${mode === "client" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-500 bg-white text-slate-900"}`}>Client view</button>
              <button type="button" onClick={() => setMode("logic")} className={`border px-4 py-2 text-sm font-bold ${mode === "logic" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-500 bg-white text-slate-900"}`}>Logic view</button>
            </div>
          </header>
        ) : (
          <div className="mb-3 flex justify-end gap-2">
            <button type="button" onClick={() => setMode("client")} className="border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-normal text-slate-500">Client view</button>
            <button type="button" onClick={() => setMode("logic")} className="border border-slate-300 bg-white px-2 py-1 text-xs font-normal text-slate-500">Logic view</button>
          </div>
        )}

        {mode === "logic" ? (
          <>
            <section className="mb-6 border border-slate-300 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Sample application answers</h2>
                  <p className="mt-1 text-sm text-slate-600">Optional scenario shortcuts for demos and future testing scripts.</p>
                </div>
                <button type="button" onClick={() => setShowScenarioButtons(!showScenarioButtons)} className="border border-slate-500 bg-white px-4 py-2 text-sm font-bold text-slate-900">
                  {showScenarioButtons ? "Hide scenarios" : "Show scenarios"}
                </button>
              </div>

              {showScenarioButtons ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Object.entries(SAMPLE_APPLICATIONS).map(([key, scenario]) => {
                    const selected = scenarioKey === key;
                    return (
                      <button type="button" key={key} onClick={() => loadScenario(key)} className={`border p-4 text-left ${selected ? "border-slate-900 bg-slate-100" : "border-slate-300 bg-white"}`}>
                        <div className="font-bold">{scenario.label}</div>
                        <div className="mt-1 text-sm text-slate-600">{selected ? "Clear sample answers" : "Load sample application answers"}</div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </section>

            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ApplicationEditor app={app} setApp={setApp} />
              </div>

              <div className="border border-slate-300 bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Policy assumptions</h2>
                    <p className="mt-1 text-sm text-slate-600">Controls assumptions about what DTA can verify through trusted data before asking clients for documents.</p>
                  </div>
                  <button type="button" onClick={() => setShowPolicyToggles(!showPolicyToggles)} className="border border-slate-500 bg-white px-4 py-2 text-sm font-bold text-slate-900">
                    {showPolicyToggles ? "Hide toggles" : "Show toggles"}
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <label className="flex gap-3 border border-slate-300 bg-white p-3">
                    <input type="checkbox" checked={settings.suppressInternalData} onChange={(event) => setSettings({ ...settings, suppressInternalData: event.target.checked })} />
                    <span>Suppress items below that DTA may verify with internally available data sources</span>
                  </label>
                </div>

                {showPolicyToggles ? (
                  <div className="mt-4 border border-slate-300 bg-white p-4">
                    <h3 className="font-bold text-slate-950">Internal data suppression toggles</h3>
                    <p className="mt-1 text-sm text-slate-600">Tune the individual data-match assumptions used by the recommendation logic.</p>
                    <div className="mt-4 grid gap-3">
                      <ToggleInput app={app} setApp={setApp} path="identity.likelyRMVMatch" label="Identity likely available through RMV/DTA data" />
                      <ToggleInput app={app} setApp={setApp} path="income.ssi.likelySVESAvailable" label="SSI likely available through SVES" />
                      <ToggleInput app={app} setApp={setApp} path="income.rsdi.likelySVESAvailable" label="RSDI likely available through SVES" />
                      <ToggleInput app={app} setApp={setApp} path="income.unemployment.likelyStateMatchAvailable" label="Unemployment likely available through state data" />
                      <ToggleInput app={app} setApp={setApp} path="income.childSupportReceived.likelyRAPIDAvailable" label="Child support likely available through RAPID" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}

        <div className={`grid gap-6 ${mode === "logic" ? "lg:grid-cols-[1fr_330px]" : ""}`}>
          <section className="border border-slate-300 bg-white p-6 sm:p-10">
            {mode === "client" ? (
              <div className="mb-6 border-b border-slate-300 pb-5">
                <p className="text-lg font-semibold text-slate-950">Your SNAP application has been submitted</p>
                <p className="mt-2 text-sm text-slate-700">Your application number is {applicationNumber}</p>
              </div>
            ) : null}

            <h2 className="mt-4 text-2xl font-semibold">We recommend you send proof as soon as you can</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-700">Sending proof with your application (or soon after) may help DTA decide your case faster.</p>
            {mode === "client" ? (
              <div className="mt-4 max-w-2xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700">
                DTA may ask for additional proof once they review your application
              </div>
            ) : null}

            <div className="mt-8 space-y-4">
              {result.recs.length === 0 ? (
                <div className="border border-slate-300 bg-white p-4 text-sm text-slate-700">No recommendations yet. Use Logic view to select application answers.</div>
              ) : null}
              {result.recs.map((rec, index) => <RecommendationCard key={rec.key} rec={rec} index={index} />)}
            </div>

            <div className="mt-8 border border-slate-300 bg-slate-50 p-5">
              <h3 className="font-bold">Submit as much proof as you can.</h3>
              <p className="mt-1 text-sm text-slate-700">Do not delay sending proof because you are missing one document.</p>
            </div>
            <ClientActions />
          </section>

          {mode === "logic" ? (
            <aside className="space-y-4">
              <section className="border border-slate-300 bg-white p-5">
                <h3 className="font-bold">Not shown by default</h3>
                <p className="mt-2 text-sm text-slate-700">These items are hidden because DTA may already be able to verify them automatically.</p>
                <div className="mt-4 space-y-3">
                  {result.suppressed.length === 0 ? <p className="text-sm text-slate-500">No suppressed items.</p> : null}
                  {result.suppressed.map((item) => (
                    <div key={item.key} className="border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900">
                      <div className="font-bold">{item.title}</div>
                      <div className="mt-1">{item.why}</div>
                      {item.dtaDataReliability ? <div className="mt-2 text-xs text-slate-600">{item.dtaDataReliability}</div> : null}
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-slate-300 bg-white p-5">
                <h3 className="font-bold text-slate-950">Prototype only</h3>
                <p className="mt-1 text-sm text-slate-700">Rules and suppression logic still need validation with DTA policy, operations, data-source reliability, and client testing.</p>
              </section>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
