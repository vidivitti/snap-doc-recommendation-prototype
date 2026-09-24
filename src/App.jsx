import React, { useMemo, useState } from "react";
import {
  Baby,
  Briefcase,
  Car,
  CaretDown,
  Check,
  CreditCard,
  EnvelopeSimple,
  FileText,
  FirstAidKit,
  House,
  IdentificationCard,
  Info,
  Lightbulb,
  Money,
  Phone,
  Prescription,
  Receipt,
  Student,
  UsersThree,
  Warning
} from "@phosphor-icons/react";

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
  rent: "Shelter",
  mortgage: "Shelter",
  utilities: "Utilities",
  dependentCare: "Dependent care",
  medical: "Medical",
  medicalPair: "Medical + receipt",
  nonCitizen: "Status",
  collegeStudent: "Student"
};

const PHOSPHOR_ICON_NAMES_BY_KEY = {
  identity: "IdentificationCard",
  wages: "Money",
  jobEnd: "Briefcase",
  selfEmployment: "Money",
  statement: "FileText",
  socialSecurity: "CreditCard",
  unemployment: "CreditCard",
  childSupport: "UsersThree",
  pension: "CreditCard",
  veterans: "CreditCard",
  rentalIncome: "House",
  workersComp: "CreditCard",
  workStudy: "FileText",
  pfml: "CreditCard",
  workRules: "FileText",
  rent: "House",
  mortgage: "House",
  utilities: "Lightbulb",
  dependentCare: "Baby",
  medical: "FirstAidKit",
  medicalPair: "Prescription + Receipt",
  nonCitizen: "IdentificationCard",
  collegeStudent: "Student",
  car: "Car",
  check: "Check",
  doc: "FileText",
  mail: "EnvelopeSimple",
  phone: "Phone",
  credit: "CreditCard",
  cash: "Money",
  home: "House",
  lightbulb: "Lightbulb",
  family: "UsersThree",
  warning: "Warning",
  info: "Info"
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
  "INC-021": "💵",
  "INC-022": "💵",
  "INC-023": "💵",
  "INC-024": "👶💲",
  "INC-025": "💵",
  "INC-026": "💵",
  "INC-027": "💵",
  "INC-028": "💵",
  "INC-029": "💵",
  "HH-001": "🪪",
  "HH-002": "🎓",
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
  "EXP-013": "👶💲",
  "EXP-014": "🩺💊",
  "EXP-016": "🚗",
  "EXP-017": "🩺💊"
};

const DEFAULT_SETTINGS = {
  suppressInternalData: true,
  includeIdentity: true
};

const EMPTY_APPLICATION = {
  certification: {
    type: "simplified"
  },
  identity: {
    likelyRMVMatch: true
  },
  household: {
    memberCount: 1,
    buysAndPreparesTogether: true,
    anyElderlyMember: false,
    anyFederallyCertifiedDisability: false,
    nonCitizenStatusChanged: false,
    collegeStudent: false
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
    pfml: { reported: false },
    changedUnearned: {
      ssi: false,
      rsdi: false,
      unemployment: false,
      childSupportReceived: false,
      pension: false,
      veteransBenefits: false,
      rentalIncome: false,
      workersComp: false,
      pfml: false
    }
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
  skippedQuestions: {
    incomeNoResponse: false,
    expensesNoResponse: false
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
      "Recent pay stubs or statements (4 pay stubs if paid weekly, 2 pay stubs if paid biweekly)",
      "Payroll app screenshots (showing your name, the employer name, gross pay, dates, and hours worked)",
      "Employer statement or letter showing any pay you received and the number of hours worked"
    ],
    "examplesNote": "Note: We do not count earned income for students under 18 who are in school. You do not need to tell us about this income.",
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Sometimes -\nThe Work Number may be able to verify if employer shares data with the service and that data is updated frequently",
    "microcopy": "We need proof of any pay you got in the last 4 weeks. DTA may be able to find this in wage records, but it may help you get benefits sooner if you send what you can now.\n\nMake sure your proof shows the **gross income** amount. Gross income is the amount before taxes or benefits are taken out.",
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
      "Employer letter/text/email",
      "if self employed: business records or statements showing when the income ended"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Rarely ?\nThe Work Number?",
    "microcopy": "You said someone is no longer working at an employer. We need to know when the job ended and any income they got in the last 4 weeks.\n\nMake sure any income amounts shows the gross income amount. Gross income is the amount before taxes or benefits are taken out.",
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
    "examplesInline": true,
    "examples": [
      { "type": "heading", "text": "If you filed taxes as self-employed:" },
      "Schedule C from your 1040 IRS form",
      "1099 forms you got",
      { "type": "heading", "text": "If your self employment is new or you don't file taxes:" },
      {
        "segments": [
          "Business records or statements that show income and business-related expenses from the ",
          { "strong": "past 3 months" }
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
    "id": "INC-021",
    "triggerPath": "income.changedUnearned.ssi",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.ssi.likelySVESAvailable",
    "icon": "socialSecurity",
    "section": "Changed unearned income",
    "answer": "No longer receiving SSI selected",
    "title": "Proof that SSI income ended",
    "examples": [
      "SSA notice showing SSI ended",
      "Bank record showing SSI deposits stopped",
      "Statement explaining when SSI ended"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Sometimes — depends on match quality, freshness, and case context\nSVES federal data match",
    "microcopy": "Send proof showing when SSI income ended, if you have it. DTA may be able to verify this through federal data.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; review/edit content."
  },
  {
    "id": "INC-022",
    "triggerPath": "income.changedUnearned.rsdi",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.rsdi.likelySVESAvailable",
    "icon": "socialSecurity",
    "section": "Changed unearned income",
    "answer": "No longer receiving RSDI selected",
    "title": "Proof that RSDI/Social Security income ended",
    "examples": [
      "SSA notice showing Social Security income ended",
      "Bank record showing Social Security deposits stopped",
      "Statement explaining when Social Security income ended"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Sometimes — depends on match quality, freshness, and case context\nSVES federal data match",
    "microcopy": "Send proof showing when RSDI or Social Security income ended, if you have it. DTA may be able to verify this through federal data.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; review/edit content."
  },
  {
    "id": "INC-023",
    "triggerPath": "income.changedUnearned.unemployment",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.unemployment.likelyStateMatchAvailable",
    "icon": "unemployment",
    "section": "Changed unearned income",
    "answer": "No longer receiving Unemployment selected",
    "title": "Proof that unemployment income ended",
    "examples": [
      "Unemployment notice showing benefits ended",
      "DUA payment history showing the last payment",
      "Bank record showing unemployment deposits stopped"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Usually — if unemployment payments are from Massachusetts; out-of-state unemployment may still need client proof.",
    "microcopy": "Send proof showing when unemployment income ended, if you have it. DTA may be able to verify Massachusetts unemployment through state data.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; review/edit content."
  },
  {
    "id": "INC-024",
    "triggerPath": "income.changedUnearned.childSupportReceived",
    "eligiblePath": null,
    "suppressible": true,
    "dataPath": "income.childSupportReceived.likelyRAPIDAvailable",
    "icon": "childSupport",
    "section": "Changed unearned income",
    "answer": "No longer receiving Child support selected",
    "title": "Proof that child support income ended",
    "examples": [
      "Court or child support agency record showing payments ended",
      "Payment history showing the last payment received",
      "Statement explaining when child support ended"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Yes",
    "dtaDataReliability": "Sometimes — depends on whether child support is formal and court ordered, or if support is informal.",
    "microcopy": "Send proof showing when child support income ended, if you have it.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; user plans to supply final text."
  },
  {
    "id": "INC-025",
    "triggerPath": "income.changedUnearned.pension",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "pension",
    "section": "Changed unearned income",
    "answer": "No longer receiving Pension selected",
    "title": "Proof that pension income ended",
    "examples": [
      "Pension notice or letter showing benefits ended",
      "Payment history showing the last pension payment",
      "Bank record showing pension deposits stopped"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "Sometimes",
    "dtaDataReliability": "Sometimes — may be available through data sources, but clients may still need to provide proof.",
    "microcopy": "Send proof showing when pension income ended.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; user plans to supply final text."
  },
  {
    "id": "INC-026",
    "triggerPath": "income.changedUnearned.veteransBenefits",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "veterans",
    "section": "Changed unearned income",
    "answer": "No longer receiving Veterans benefits selected",
    "title": "Proof that veterans benefits ended",
    "examples": [
      "VA notice or letter showing benefits ended",
      "Payment history showing the last payment",
      "Bank record showing veterans benefit deposits stopped"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof showing when veterans benefits ended.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; user plans to supply final text."
  },
  {
    "id": "INC-027",
    "triggerPath": "income.changedUnearned.rentalIncome",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "rentalIncome",
    "section": "Changed unearned income",
    "answer": "No longer receiving Rental income selected",
    "title": "Proof that rental income ended",
    "examples": [
      "Statement from tenant or roomer/boarder showing payments ended",
      "Lease or agreement showing rental income ended",
      "Written statement explaining when rental income ended"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof showing when rental income ended.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; user plans to supply final text."
  },
  {
    "id": "INC-028",
    "triggerPath": "income.changedUnearned.workersComp",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "workersComp",
    "section": "Changed unearned income",
    "answer": "No longer receiving Workers comp selected",
    "title": "Proof that workers compensation ended",
    "examples": [
      "Workers compensation notice showing the date payments ended",
      "Payment history showing the last payment",
      "Bank record showing workers compensation deposits stopped"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof showing when workers compensation ended.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; user plans to supply final text."
  },
  {
    "id": "INC-029",
    "triggerPath": "income.changedUnearned.pfml",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "pfml",
    "section": "Changed unearned income",
    "answer": "No longer receiving Paid Family and Medical Leave selected",
    "title": "Proof that paid family and medical leave ended",
    "examples": [
      "PFML notice showing the date that benefits ended",
      "Payment history showing the last payment",
      "Bank record showing PFML deposits stopped"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "Send proof showing when paid family and medical leave ended.",
    "source": "Recertification",
    "helpText": "",
    "notes": "Draft placeholder row for changed unearned income; user plans to supply final text."
  },
  {
    "id": "HH-001",
    "triggerPath": "household.nonCitizenStatusChanged",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "nonCitizen",
    "section": "Household member status",
    "answer": "A household member has non-citizen status or status has changed",
    "title": "Proof of noncitizen status",
    "examplesLabel": "Examples of proof of non citizen status",
    "examples": [
      "Permanent Resident Card (“green card”)",
      "Employment Authorization Card",
      "Temporary Resident Card",
      "Naturalization Certificate",
      "Arrival-Departure Record (I-94)",
      "Stamp in passport",
      "Other document showing current or pending immigration status"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If a household member's noncitizen status has changed, please submit proof of the status.",
    "source": "Recertification",
    "helpText": ""
  },
  {
    "id": "HH-002",
    "triggerPath": "household.collegeStudent",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "collegeStudent",
    "section": "Household member status",
    "answer": "A household member is a college student",
    "title": "Proof of college student status",
    "examplesLabel": "Examples of proof of college student status",
    "examples": [
      "If in community college, any document from the school showing you are currently enrolled",
      "If receiving Mass Grant or participating in work study, Financial Aid Award Letter",
      "If working (or in work study), proof of gross income (before taxes) for the last four weeks, such as pay stubs",
      "If in a training program, copy of the letter from program that client attends",
      "If mentally/physically unfit for work, letter from doctor stating that client is unfit for work"
    ],
    "required": true,
    "recommendationType": "Required",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If anyone is a college student, please send us proof of college student enrollment, financial aid, work study award, or training program",
    "source": "Recertification",
    "helpText": ""
  },
  {
    "id": "WRK-001",
    "triggerPath": "workRules.abawdExemption",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "workRules",
    "section": "Household member status",
    "answer": "A household member is ABAWD/must meet work rules",
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
    "section": "Shelter expenses",
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
    "section": "Shelter expenses",
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
    "section": "Shelter expenses",
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
    "section": "Shelter expenses",
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
    "section": "Shelter expenses",
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
    "answer": "Dependent care (general expenses) selected",
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
    "triggerAnyPaths": [
      "expenses.dependentCare.driveToProvider",
      "expenses.dependentCare.paidTransportation"
    ],
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "car",
    "section": "Dependent care expenses",
    "answer": "Drive dependent to/from care provider or pay for transportation for dependent care selected",
    "title": "Proof of transportation costs to dependent care",
    "examples": [],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If you drive: Send a signed statement with the care provider address and how often you drive there\n\nIf you pay for parking or tolls or use transportation: Receipts from the transportation company (e.g., Lyft, Uber)\n- Receipts for public transportation (e.g., bus, subway, taxi, The RIDE)\n- Receipts for parking or tolls\n\nMake sure to note the frequency of the trips (writing on the receipt is ok)",
    "source": "All",
    "helpText": "",
    "details": {
      "label": "Show me an example of a travel statement",
      "content": "I, [Your First and Last name] drive to [care provider name], located at [street address, city, state, zip code] every [frequency]. \n\nSigned: [Your name/signature]\nDate: [Today's date]",
      "italic": true
    }
  },
  {
    "id": "EXP-013",
    "triggerPath": "expenses.childSupportPaid.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "childSupport",
    "section": "Dependent care expenses",
    "answer": "Child support paid selected",
    "title": "Proof of child support you pay",
    "examples": [
      "Court order (if child support is court ordered)",
      "Payment history or cancelled checks",
      "Wage records showing child support withholding",
      "Receipts for child support payments"
    ],
    "required": false,
    "recommendationType": "Optional, but may increase benefits",
    "dtaDataAvailable": "No",
    "dtaDataReliability": "",
    "microcopy": "If someone in your household pays child support to someone outside the home, send proof of the court order (if there is one) and the last 90 days of payment history.",
    "source": "All",
    "helpText": ""
  },
  {
    "id": "EXP-014",
    "triggerPath": "expenses.medical.reported",
    "eligiblePath": null,
    "suppressible": false,
    "dataPath": null,
    "icon": "medicalPair",
    "section": "Medical expenses",
    "answer": "Medical expenses (general) selected",
    "title": "Proof of medical expenses",
    "examples": [
      {
        "text": "Bills or receipts for medical costs not covered by MassHealth or other insurance, such as:",
        "children": [
          "one-time medical bills",
          "prescription medication",
          "over-the-counter medical items",
          "dental care or dentures",
          "eyeglasses",
          "hearing aid batteries",
          "Payments for home health aides or other care you need",
          {
            "text": "For more medical expenses examples click here",
            "href": "https://www.mass.gov/guides/examples-of-medical-costs"
          }
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
    "icon": "car",
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
    "icon": "medicalPair",
    "section": "Medical expenses",
    "answer": "Health insurance expenses selected",
    "title": "Proof of health insurance expenses",
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
  }
];

const SKIPPED_EXPENSE_RECOMMENDATIONS = [
  {
    key: "SKIP-EXP-001",
    iconName: "home",
    title: "Proof of housing costs",
    why: "If you have shelter or utility costs send us proof. Housing costs may increase SNAP benefit amount.",
    examplesLabel: "Examples for proof of housing costs",
    examples: [
      { type: "heading", text: "If you have shelter expenses:" },
      "Rent receipt, lease, payment app record, cancelled check showing payment",
      "Signed statement from your or landlord or roommate (if you sub-let) with what you pay for rent.",
      "Deed or mortgage statement.",
      "Shared housing verification form, or statement from someone you live with.",
      "Property tax bill",
      "Home insurance statement or policy statement showing the amount you pay",
      "Proof of condo or HOA fees",
      { type: "heading", text: "If you have utility costs:" },
      "Bill for heat, air conditioning, electricity, or gas",
      "Lease showing you pay for utilities",
      "Receipt",
      "Signed and dated letter from landlord or roommate"
    ]
  },
  {
    key: "SKIP-EXP-002",
    iconName: "dependentCare",
    title: "Proof of dependent care costs",
    why: "If you anyone has child or adult dependent care costs, send us proof. These costs may increase your SNAP benefit amount.",
    examplesLabel: "Examples of proof of dependent care costs",
    examples: [
      { type: "heading", text: "If you have dependent care expenses" },
      "Statement or letter from the child or adult care provider showing the amount that you are responsible for",
      "Receipts, canceled check, or money order showing the amount you paid to a provider",
      {
        type: "paragraph",
        segments: [
          { strong: "If you drive to a care provider:" },
          " Send a signed statement with the care provider address and how often you drive there"
        ]
      },
      {
        type: "paragraph",
        segments: [
          { strong: "If you pay for parking or tolls or use transportation:" },
          " Receipts from the transportation company (e.g., Lyft, Uber)"
        ]
      },
      "Receipts for public transportation (e.g., bus, subway, taxi, The RIDE)",
      "Receipts for parking or tolls",
      { type: "paragraph", text: "Make sure to note the frequency of the trips (writing on the receipt is ok)" }
    ],
    details: {
      label: "Show me an example of a travel statement for dependent care costs",
      content: "I, [Your First and Last name] drive to [provider], located at [street address, city, state, zip code] every [frequency].\n\nSigned: [Your name/signature]\n\nDate: [Today's date]",
      italic: true
    }
  },
  {
    key: "SKIP-EXP-003",
    iconName: "medicalPair",
    title: "Proof medical costs",
    why: "If anyone is at least age 60 or has a disability, and your household has more than $35 per month in medical expenses, send us proofs of bills, receipts, or statements for medical costs not covered by MassHealth or other insurance. Make sure you note the frequency of the expense (writing on the receipt is ok).",
    examplesLabel: "Examples of medical cost proof",
    examples: [
      { type: "heading", text: "Common health insurance and medical expenses include:" },
      "Copay receipts",
      "Explanation of benefits",
      "Pharmacy printout",
      "Provider bill",
      "Insurer statement",
      "Premium bill",
      "One-time medical bills",
      "Prescription medication",
      "Over-the-counter medical items",
      "Dental care or dentures",
      "Eyeglasses",
      "Hearing aid batteries",
      "Payments for home health aides or other care you need",
      {
        type: "paragraph",
        segments: [
          { strong: "If you drive:" },
          " Send a signed statement with the address of the provider/pharmacy and how often you drive there"
        ]
      },
      {
        type: "paragraph",
        segments: [
          { strong: "If you pay for parking or tolls or use transportation:" }
        ]
      },
      "Receipts for public transportation (e.g., bus, subway, taxi, The RIDE)",
      "Receipts for parking or tolls",
      {
        type: "paragraph",
        text: "For more medical expenses examples click here",
        href: "https://www.mass.gov/guides/examples-of-medical-costs"
      }
    ],
    details: {
      label: "Show me an example of a travel statement for medical costs",
      content: "I, [Your First and Last name] drive to [provider or pharmacy address], located at [street address, city, state, zip code] every [frequency].\n\nSigned: [Your name/signature]\n\nDate: [Today's date]",
      italic: true
    }
  },
  {
    key: "SKIP-EXP-004",
    iconName: "childSupport",
    title: "Proof child support costs",
    why: "If someone in your household pays child support to someone outside the home, send proof of the court order (if there is one) and the last 90 days of payment history.",
    examplesLabel: "Examples of child support costs",
    examples: [
      "Court order (if child support is court ordered)",
      "Payment history or cancelled checks",
      "Wage records showing child support withholding",
      "Receipts for child support payments"
    ],
    examplesNote: "NOTE: Child support payments cannot be credited unless they are legally obligated and being paid. If the legal obligation has changed, we need updated verification. We cannot credit child support payments that are for a child who is part of the SNAP household."
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
  const hasTrigger = Array.isArray(rule.triggerAnyPaths)
    ? rule.triggerAnyPaths.some((path) => Boolean(getPathValue(app, path)))
    : Boolean(getPathValue(app, rule.triggerPath));
  if (!hasTrigger) return false;
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
      iconName: rule.icon || "doc",
      emoji: CARD_EMOJI_BY_RULE_ID[rule.id] || "📝",
      title: rule.title,
      why: rule.microcopy || "Send proof if DTA asks or if you have it ready.",
      examples: rule.examples || [],
      examplesInline: Boolean(rule.examplesInline),
      examplesLabel: rule.examplesLabel,
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
  console.assert(SKIPPED_EXPENSE_RECOMMENDATIONS.length === 4, "Expected four generalized optional-expense recommendations");
  console.assert(
    SKIPPED_EXPENSE_RECOMMENDATIONS.map((rec) => rec.title).join("|") ===
      "Proof of housing costs|Proof of dependent care costs|Proof medical costs|Proof child support costs",
    "Expected generalized optional-expense recommendation titles in the approved order"
  );
  console.assert(
    SKIPPED_EXPENSE_RECOMMENDATIONS.filter((rec) => rec.details).length === 2,
    "Expected travel-statement examples for dependent care and medical costs"
  );

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
  const wageRecommendation = fullIncomeResult.recs.find((rec) => rec.key === "INC-001");
  console.assert(wageRecommendation?.why.includes("last 4 weeks"), "Expected wage recommendation to request the last 4 weeks");
  console.assert(!wageRecommendation?.why.includes("last 30 days"), "Did not expect the retired 30-day wage timeframe");
  const selfEmploymentRecommendation = fullIncomeResult.recs.find((rec) => rec.key === "INC-003");
  console.assert(selfEmploymentRecommendation?.examplesInline, "Expected self-employment examples to display inline");
  console.assert(
    JSON.stringify(selfEmploymentRecommendation?.examples).includes("past 3 months"),
    "Expected the self-employment recommendation to use a 3-month timeframe"
  );

  const householdStatus = clone(EMPTY_APPLICATION);
  householdStatus.household.nonCitizenStatusChanged = true;
  householdStatus.household.collegeStudent = true;
  householdStatus.workRules.abawdExemption = true;
  const householdStatusResult = recommendVerifications(householdStatus, { suppressInternalData: true, includeIdentity: false });
  ["HH-001", "HH-002", "WRK-001"].forEach((key) => {
    const recommendation = householdStatusResult.recs.find((rec) => rec.key === key);
    console.assert(recommendation, `Expected ${key} recommendation`);
    console.assert(recommendation?.required, `Expected ${key} to be required`);
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

  const fullExpensesResult = recommendVerifications(fullExpenses, { suppressInternalData: true, includeIdentity: false });
  ["EXP-001", "EXP-002", "EXP-003", "EXP-004", "EXP-005", "EXP-006", "EXP-011", "EXP-012", "EXP-013", "EXP-014", "EXP-016", "EXP-017"].forEach((key) => {
    console.assert(fullExpensesResult.recs.some((rec) => rec.key === key), `Expected ${key} recommendation`);
  });
  console.assert(!fullExpensesResult.recs.some((rec) => rec.key === "EXP-015"), "Did not expect retired EXP-015 recommendation");
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

  const paidDependentTransportationOnly = clone(EMPTY_APPLICATION);
  paidDependentTransportationOnly.expenses.dependentCare.paidTransportation = true;
  const paidDependentTransportationOnlyResult = recommendVerifications(paidDependentTransportationOnly, { suppressInternalData: true, includeIdentity: false });
  console.assert(
    paidDependentTransportationOnlyResult.recs.some((rec) => rec.key === "EXP-012"),
    "Expected EXP-012 when paid dependent-care transportation is selected"
  );

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

function MayflowerIcon({ name, size = 32, className = "" }) {
  const icons = {
    identity: IdentificationCard,
    wages: Money,
    jobEnd: Briefcase,
    selfEmployment: Money,
    statement: FileText,
    socialSecurity: CreditCard,
    unemployment: CreditCard,
    childSupport: UsersThree,
    pension: CreditCard,
    veterans: CreditCard,
    rentalIncome: House,
    workersComp: CreditCard,
    workStudy: FileText,
    pfml: CreditCard,
    workRules: FileText,
    nonCitizen: IdentificationCard,
    collegeStudent: Student,
    rent: House,
    mortgage: House,
    utilities: Lightbulb,
    dependentCare: Baby,
    check: Check,
    doc: FileText,
    mail: EnvelopeSimple,
    phone: Phone,
    credit: CreditCard,
    cash: Money,
    home: House,
    lightbulb: Lightbulb,
    family: UsersThree,
    car: Car,
    medical: FirstAidKit,
    warning: Warning,
    info: Info
  };

  if (name === "medicalPair") {
    const pairSize = Math.max(18, Math.round(size * 0.72));
    return (
      <span aria-hidden="true" className={`dta-icon ${className}`}>
        <span className="inline-flex items-center">
          <Prescription size={pairSize} weight={size <= 24 ? "bold" : "regular"} />
          <Receipt size={pairSize} weight={size <= 24 ? "bold" : "regular"} className="-ml-2" />
        </span>
      </span>
    );
  }

  const Icon = icons[name] || FileText;

  return (
    <span aria-hidden="true" className={`dta-icon ${className}`}>
      <Icon size={size} weight={size <= 24 ? "bold" : "regular"} />
    </span>
  );
}

function InlineMessage({ tone = "info", title, children }) {
  const styles = {
    warning: {
      icon: "warning",
      iconClass: "text-[#a15c00]",
      borderClass: "border-[#d0d0d0]",
      bgClass: "bg-white"
    },
    info: {
      icon: "info",
      iconClass: "text-[#145f9f]",
      borderClass: "border-[#d0d0d0]",
      bgClass: "bg-white"
    }
  };
  const style = styles[tone] || styles.info;

  return (
    <div className={`rounded-md border ${style.borderClass} ${style.bgClass} p-4`}>
      <div className="flex items-start gap-3">
        <MayflowerIcon name={style.icon} size={18} className={`mt-0.5 ${style.iconClass}`} />
        <div>
          <h2 className="text-sm font-bold leading-snug text-[#141414]">{title}</h2>
          {typeof children === "string" ? (
            <p className="mt-1 text-sm leading-relaxed text-[#141414]">{children}</p>
          ) : (
            <div className="mt-1 text-sm leading-relaxed text-[#141414]">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function GuidanceList({ items }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SkippedIncomeGuidance() {
  return (
    <InlineMessage tone="info" title="You may need to send verifications to complete your Recertification">
      <div className="space-y-4">
        <p>You must send in any mandatory verifications we request to complete your Recertification. Failure to comply may result in delay or denial of benefits.</p>

        <section>
          <p><strong className="font-bold">If anyone in household has earned income,</strong> send us proof of income for the last four weeks, such as:</p>
          <GuidanceList items={[
            "Pay stubs (four pay stubs if paid weekly, two pay stubs if paid biweekly)",
            "Letter indicating any pay you received and the number of hours worked",
            "If self-employed (including gig work), business documents such as a Schedule C (1040 IRS form), 1099 IRS form, or other records that show income and/or business costs"
          ]} />
        </section>

        <p><strong className="font-bold">NOTE:</strong> We do not count earned income for students under 18 who are in school. You do not need to tell us about this income.</p>

        <section>
          <p><strong className="font-bold">If anyone in household has unearned income,</strong> send us proof of the monthly amount, such as:</p>
          <GuidanceList items={[
            "Benefit or award letter",
            "Statement from person, agency, or organization making payments"
          ]} />
        </section>

        <p><strong className="font-bold">NOTE:</strong> We can usually verify the amount of Social Security, SSI, Child Support you get through DOR, or MA Unemployment Compensation ourselves. We will tell you if you need to verify any of these items.</p>

        <section>
          <p><strong className="font-bold">If your household address moved and/or you reported housing costs earlier in the form,</strong> send us proof. Examples:</p>
          <GuidanceList items={[
            "Rent receipt, lease, letter from your landlord, mortgage statement, property tax, condo fees, home insurance bill, or other document showing the exact amount you are supposed to pay",
            "If you are not the primary tenant or the homeowner, provide a statement from the person you live with stating what your share of the shelter and utility expenses are."
          ]} />
        </section>

        <section>
          <p><strong className="font-bold">If your household address moved and/or you reported utility costs earlier in the form,</strong> send us proof. Examples:</p>
          <GuidanceList items={[
            "Bill for heat, air conditioning, electricity, gas or phone",
            "Bill for other utility costs such as coal, wood for heating, garbage collection, water and sewer",
            "Lease, letter from landlord or roommate showing you pay for utilities"
          ]} />
        </section>

        <section>
          <p><strong className="font-bold">If a household member's noncitizen status has changed,</strong> please submit proof of the status, such as:</p>
          <GuidanceList items={[
            "Permanent Resident Card (“green card”)",
            "Employment Authorization Card",
            "Temporary Resident Card",
            "Naturalization Certificate",
            "Arrival-Departure Record (I-94)",
            "Stamp in passport",
            "Other document showing current or pending immigration status"
          ]} />
        </section>

        <section>
          <p><strong className="font-bold">If anyone is a college student,</strong> please, send us:</p>
          <GuidanceList items={[
            "If in community college, any document from the school showing you are currently enrolled",
            "If receiving Mass Grant or participating in work study, Financial Aid Award Letter",
            "If working (or in work study), proof of gross income (before taxes) for the last four weeks, such as pay stubs",
            "If in a training program, copy of the letter from program that client attends",
            "If mentally/physically unfit for work, letter from doctor stating that client is unfit for work"
          ]} />
        </section>

        <section>
          <p><strong className="font-bold">If you reported dependent care costs earlier in the form,</strong> send us proof. Examples:</p>
          <GuidanceList items={[
            "Receipts, canceled check, money order, or letter from the child or adult care provider showing the amount that you are responsible for.",
            "If you drive and provided information in the form (e.g., address of provider, number of trips per week), no further proof is needed.",
            "If not driving and you pay for any other transportation costs such as parking or tolls, public transportation (e.g., bus, subway, The RIDE), Lyft/Uber rides, provide receipts of these expenses."
          ]} />
        </section>

        <section>
          <p><strong className="font-bold">If anyone is at least age 60 or has a disability, and your household has more than $35 per month in medical expenses,</strong> send us proofs of bills or receipts for medical costs not covered by MassHealth or other insurance, such as:</p>
          <GuidanceList items={[
            "Health insurance co-pays and premiums, medical bills, prescription medication, over-to-the counter medical items, dental care or dentures, eyeglasses, hearing aid batteries, etc.",
            "If you drive and provided information in the form (e.g., address of provider, number of trips per week), no further proof is needed.",
            "If not driving and you pay for any other transportation costs such as parking or tolls, public transportation (e.g., bus, subway, The RIDE), Lyft/Uber rides, please provide receipts of these expenses."
          ]} />
        </section>

        <section>
          <p><strong className="font-bold">If anyone in the household is making payments for child support,</strong> please send us:</p>
          <p className="mt-2">Verification of the legal obligation to pay the child support (such as a court order) and proof of recent payments. If you have already submitted proof of legal obligation, you only have to submit proof of payments.</p>
        </section>

        <p><strong className="font-bold">NOTE:</strong> Child support payments cannot be credited unless they are legally obligated and being paid. If the legal obligation has changed, we need updated verification. We cannot credit child support payments that are for a child who is part of the SNAP household.</p>
      </div>
    </InlineMessage>
  );
}

function SkippedExpensesGuidance() {
  return (
    <>
      {SKIPPED_EXPENSE_RECOMMENDATIONS.map((rec) => (
        <RecommendationCard key={rec.key} rec={rec} />
      ))}
    </>
  );
}

function RecommendationSection({ label, children }) {
  return (
    <section className="mt-8">
      <div className="border-b border-[#b7ced6] pb-2">
        <h2 className="text-xs font-bold leading-snug text-[#141414]">{label}</h2>
      </div>
      <div className="mt-5 space-y-5">
        {children}
      </div>
    </section>
  );
}

function Badge({ children, tone = "default" }) {
  const styles = {
    default: "bg-white text-[#141414] border-[#79a6b7]",
    required: "bg-[#eef7f8] text-[#141414] border-[#79a6b7]",
    recommended: "bg-white text-[#141414] border-[#79a6b7]"
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

  if (example.href) {
    return (
      <a href={example.href} target="_blank" rel="noreferrer" className="font-semibold text-[#14558f] underline">
        {example.text}
      </a>
    );
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

        if (example.type === "paragraph") {
          return (
            <li key={`${example.text || example.segments?.[0]?.strong}-${index}`} className="list-none -ml-5 pt-2">
              <InlineExampleContent example={example} />
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
    <div className="mt-3 w-full max-w-[400px] border border-[#b7ced6] bg-[#f5fbfc] p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left text-sm font-normal text-[#14558f] underline underline-offset-2"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>{details.label}</span>
        <CaretDown aria-hidden="true" size={18} weight="bold" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="mt-3">
          <RichText text={details.content} italicizeBrackets={details.italic} />
        </div>
      ) : null}
    </div>
  );
}

function lowerCaseFirstLetter(text) {
  if (!text) return "";
  return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

function ExamplesDetailsToggle({ title, label, examples, note }) {
  const [open, setOpen] = useState(false);

  if (!examples?.length) return null;

  return (
    <div className="mt-3 w-full">
      <button
        type="button"
        className="flex w-fit max-w-full items-center gap-3 border-b-2 border-[#14558f] pb-0.5 text-left text-sm font-medium leading-snug text-[#14558f]"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>{label || `Examples for ${lowerCaseFirstLetter(title)}`}</span>
        <CaretDown aria-hidden="true" size={18} weight="bold" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
      <div className="mt-2">
        <ExampleList examples={examples} />
        {note ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{note}</p>
        ) : null}
      </div>
      ) : null}
    </div>
  );
}

function RecommendationCard({ rec }) {
  return (
    <div className="dta-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="flex items-center gap-3 text-xl font-bold leading-tight text-[#141414]">
          <MayflowerIcon name={rec.iconName} size={36} />
          <span>
          {rec.title}
          </span>
        </h3>
      </div>

      <div className="mt-2">
        <RichText text={rec.why} />
      </div>

      {rec.examplesInline ? (
        <div className="mt-3">
          <ExampleList examples={rec.examples} />
          {rec.examplesNote ? (
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{rec.examplesNote}</p>
          ) : null}
        </div>
      ) : (
        <ExamplesDetailsToggle title={rec.title} label={rec.examplesLabel} examples={rec.examples} note={rec.examplesNote} />
      )}

      {rec.helperText ? (
        <p className="mt-3 border-l-4 border-[#79a6b7] bg-[#f5fbfc] p-3 text-sm leading-relaxed text-slate-800">
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
    <label className="dta-input-choice">
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

function ChoiceInput({ app, setApp, path, value, label }) {
  const checked = getPathValue(app, path) === value;

  return (
    <label className="dta-input-choice">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          const next = clone(app);
          setPathValue(next, path, value);
          setApp(next);
        }}
      />
      <span>{label}</span>
    </label>
  );
}

function InputGroup({ title, children }) {
  return (
    <section className="dta-card bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#141414]">{title}</h3>
      <div className="dta-input-list mt-3">{children}</div>
    </section>
  );
}

function ApplicationEditor({ app, setApp }) {
  return (
    <section className="dta-card bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-[#141414]">Prototype inputs</h2>
      <p className="mt-2 text-base leading-relaxed text-slate-700">
        These checkboxes mirror the DTA Connect SNAP recertification answers used by the verification mapping spreadsheet.
      </p>

      <div className="mt-4 space-y-4">
        <InputGroup title="Minimal recertification submission/ Skipped questions">
          <p className="text-sm leading-relaxed text-slate-700">
            When a client submits a recertification without responding to questions in the following sections, show generalized rules instead
          </p>
          <ToggleInput app={app} setApp={setApp} path="skippedQuestions.incomeNoResponse" label="No response in income section" />
          <ToggleInput app={app} setApp={setApp} path="skippedQuestions.expensesNoResponse" label="No response in expenses section/ show general recommendations for optional expenses" />
        </InputGroup>

        <InputGroup title="Household member status">
          <ToggleInput app={app} setApp={setApp} path="household.nonCitizenStatusChanged" label="A household member has non-citizen status or status has changed" />
          <ToggleInput app={app} setApp={setApp} path="household.collegeStudent" label="A household member is a college student" />
          <ToggleInput app={app} setApp={setApp} path="workRules.abawdExemption" label="A household member is ABAWD/must meet work rules" />
        </InputGroup>

        <InputGroup title="Earned income">
          <div className="sm:col-span-2 text-sm font-bold text-slate-700">New earned income</div>
          <ToggleInput app={app} setApp={setApp} path="income.wages.reported" label="Wages" />
          <ToggleInput app={app} setApp={setApp} path="income.selfEmployment.reported" label="Self-employment" />
          <ToggleInput app={app} setApp={setApp} path="income.workStudy.reported" label="Work study" />
          <div className="sm:col-span-2 mt-2 text-sm font-bold text-slate-700">Changed earned income</div>
          <ToggleInput app={app} setApp={setApp} path="income.wages.changed" label="Still working but income changed" />
          <ToggleInput app={app} setApp={setApp} path="income.wages.endedRecently" label="No longer working, income/job ended" />
        </InputGroup>

        <InputGroup title="Unearned income">
          <div className="sm:col-span-2 text-sm font-bold text-slate-700">New unearned income</div>
          <ToggleInput app={app} setApp={setApp} path="income.ssi.reported" label="SSI" />
          <ToggleInput app={app} setApp={setApp} path="income.rsdi.reported" label="RSDI" />
          <ToggleInput app={app} setApp={setApp} path="income.unemployment.reported" label="Unemployment" />
          <ToggleInput app={app} setApp={setApp} path="income.childSupportReceived.reported" label="Child support received" />
          <ToggleInput app={app} setApp={setApp} path="income.pension.reported" label="Pension" />
          <ToggleInput app={app} setApp={setApp} path="income.veteransBenefits.reported" label="Veterans benefits" />
          <ToggleInput app={app} setApp={setApp} path="income.rentalIncome.reported" label="Rental income" />
          <ToggleInput app={app} setApp={setApp} path="income.workersComp.reported" label="Workers comp" />
          <ToggleInput app={app} setApp={setApp} path="income.pfml.reported" label="Paid family and medical leave" />
          <div className="sm:col-span-2 mt-2 text-sm font-bold text-slate-700">Changed unearned income</div>
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.ssi" label="No longer receiving SSI" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.rsdi" label="No longer receiving RSDI" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.unemployment" label="No longer receiving Unemployment" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.childSupportReceived" label="No longer receiving Child support" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.pension" label="No longer receiving Pension" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.veteransBenefits" label="No longer receiving Veterans benefits" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.rentalIncome" label="No longer receiving Rental income" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.workersComp" label="No longer receiving Workers comp" />
          <ToggleInput app={app} setApp={setApp} path="income.changedUnearned.pfml" label="No longer receiving Paid Family and Medical Leave" />
        </InputGroup>

        <InputGroup title="Shelter expenses">
          <ToggleInput app={app} setApp={setApp} path="expenses.rent.reported" label="Rent" />
          <ToggleInput app={app} setApp={setApp} path="expenses.mortgage.reported" label="Mortgage" />
          <ToggleInput app={app} setApp={setApp} path="expenses.propertyTaxes.reported" label="Property taxes" />
          <ToggleInput app={app} setApp={setApp} path="expenses.homeInsurance.reported" label="Home insurance" />
          <ToggleInput app={app} setApp={setApp} path="expenses.condoFees.reported" label="Condo fees" />
        </InputGroup>

        <InputGroup title="Utilities">
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.heat" label="Heat" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.acElectricity" label="Electricity for air conditioner" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.acFee" label="Fee to use air conditioner" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.electricGas" label="Electricity/gas not used for heat" />
          <ToggleInput app={app} setApp={setApp} path="expenses.utilities.phone" label="Phone/cell service" />
        </InputGroup>

        <InputGroup title="Dependent care expenses">
          <ToggleInput app={app} setApp={setApp} path="expenses.childSupportPaid.reported" label="Child support paid" />
          <ToggleInput app={app} setApp={setApp} path="expenses.dependentCare.reported" label="Dependent care (general expenses)" />
          <ToggleInput app={app} setApp={setApp} path="expenses.dependentCare.driveToProvider" label="Drive dependent to/from care provider" />
          <ToggleInput app={app} setApp={setApp} path="expenses.dependentCare.paidTransportation" label="Pay for transportation for dependent care" />
        </InputGroup>

        <InputGroup title="Medical expenses">
          <ToggleInput app={app} setApp={setApp} path="expenses.medical.healthInsuranceRelated" label="Health insurance expenses" />
          <ToggleInput app={app} setApp={setApp} path="expenses.medical.reported" label="Medical expenses (general)" />
          <ToggleInput app={app} setApp={setApp} path="expenses.medical.transportation" label="Drive to medical appointments or pharmacy" />
        </InputGroup>
      </div>
    </section>
  );
}

function ClientActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <button type="button" className="dta-button-primary">
        Send documents to DTA
      </button>
      <button type="button" className="dta-button-secondary">
        I'll send documents later
      </button>
    </div>
  );
}

function SubmittedScreen({ applicationNumber, onReviewProof }) {
  return (
    <section className="dta-shell">
      <div className="dta-hero-band px-6 py-8 sm:px-16 sm:py-10">
        <div className="grid max-w-4xl grid-cols-[56px_1fr] items-start gap-4">
          <MayflowerIcon name="check" size={54} className="self-start pt-1 text-[#00856d]" />
          <div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[#141414] sm:text-4xl">
              Your Recertification was submitted
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-4xl text-lg text-[#141414]">
          Your web application number is <strong className="font-bold">{applicationNumber}</strong>
        </p>
        <a href="#" className="mt-3 inline-block text-base font-bold text-[#145f9f] underline">
          Download a copy of your application
        </a>
      </div>

      <div className="px-6 py-8 sm:px-16">
        <h2 className="text-xl font-bold text-[#141414]">What's next:</h2>

        <div className="mt-10 grid grid-cols-[56px_1fr] items-start gap-4">
          <MayflowerIcon name="doc" size={32} className="self-start text-[#141414]" />
          <div>
            <h3 className="max-w-3xl text-2xl font-bold leading-tight text-[#141414]">Submit as much proof as you can now</h3>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#141414]">
              We'll suggest documents to submit based on your application answers. Sending proof now will help avoid delays.
            </p>
            <button
              type="button"
              onClick={onReviewProof}
              className="dta-button-primary mt-5"
            >
              Review suggested proof →
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[56px_1fr] items-start gap-4">
          <MayflowerIcon name="phone" size={32} className="self-start text-[#141414]" />
          <div>
            <h3 className="text-2xl font-bold leading-tight text-[#141414]">Have your DTA Interview (if required)</h3>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">
              If your household has <strong className="font-bold">only</strong> elderly or disabled members, you won't have an interview.
            </p>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">
              Otherwise, <strong className="font-bold">you will get a call from DTA in 1 to 3 days</strong>.
            </p>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">
              If you miss this call, you'll get a Recertification Interview Appointment notice. Your interview will be scheduled in 7 to 10 days. If you miss the interview you can call DTA back.
            </p>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">
              During your interview, a case worker will review your recertification answers and ask other questions to check if you still qualify for SNAP.
            </p>
            <p className="mt-5 text-base italic leading-relaxed text-[#141414]">
              Tip: Add 1-800-XXX-XXXX to your phone contacts so you recognize the call from DTA
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[56px_1fr] items-start gap-4">
          <MayflowerIcon name="mail" size={32} className="self-start text-[#141414]" />
          <div>
            <h3 className="text-2xl font-bold leading-tight text-[#141414]">Get notices about what's next</h3>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">
              DTA will send you letters in the mail to request more information or let you know if you still qualify for SNAP. These notices will also be available in DTAConnect
            </p>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">
              In some cases you might need to send more proof of your situation like paystubs, receipts or expenses.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[56px_1fr] items-start gap-4">
          <MayflowerIcon name="credit" size={32} className="self-start text-[#141414]" />
          <div>
            <h3 className="text-2xl font-bold leading-tight text-[#141414]">Get a decision</h3>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">If approved your benefits will continue.</p>
            <p className="mt-5 text-base leading-relaxed text-[#141414]">
              Your Benefits Determination Letter will also have helpful information about when you'll need to talk to DTA again.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-md border border-[#d0d0d0] bg-white p-5 text-base leading-relaxed text-[#141414]">
          If you need more help with food, <a href="https://www.mass.gov/how-to/find-a-local-food-bank" className="underline">find your local food bank.</a>
        </div>

        <button
          type="button"
          onClick={onReviewProof}
          className="dta-button-primary mt-16"
        >
          Review suggested proof →
        </button>
      </div>
    </section>
  );
}

export default function SnapVerificationPrototype() {
  const [app, setApp] = useState(clone(EMPTY_APPLICATION));
  const [applicationNumber] = useState(() => String(Math.floor(10000000 + Math.random() * 90000000)));
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mode, setMode] = useState("logic");
  const [clientScreen, setClientScreen] = useState("submitted");
  const [showPolicyToggles, setShowPolicyToggles] = useState(true);

  const result = useMemo(() => recommendVerifications(app, settings), [app, settings]);
  const recommendationIntro = "Sending proof now will help avoid delays.";
  const requiredRecommendations = result.recs.filter((rec) => rec.required);
  const optionalRecommendations = result.recs.filter((rec) => !rec.required);
  const showSkippedIncomeGuidance = Boolean(app.skippedQuestions?.incomeNoResponse);
  const showSkippedExpensesGuidance = Boolean(app.skippedQuestions?.expensesNoResponse) && !showSkippedIncomeGuidance;

  return (
    <main className="dta-page" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
      <div className={mode === "logic" ? "dta-logic-shell" : ""}>
        {mode === "logic" ? (
          <header className="mb-6 flex flex-col gap-4 border-b border-[#b7ced6] bg-white p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[22px] font-semibold tracking-normal text-[#141414]">DTA Discovery | Recertification Verification List Prototype</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
                A rules-based prototype that clarifies what's next for SNAP recertification clients and converts their recertification answers into personalized and actionable proof suggestions.
              </p>
              <div className="mt-4 max-w-2xl border-l-4 border-[#79a6b7] bg-[#f5fbfc] p-4">
                <h2 className="text-base font-bold text-[#141414]">How to use this prototype</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Select prototype inputs that correspond to a client's possible DTA Connect recertification responses. Then click the “Client view” button (at the top right) to see the 2 screens that would replace the current submitted screen.
                </p>
              </div>
            </div>

            <div className="dta-view-toggle shrink-0">
              <button type="button" onClick={() => setMode("client")} className={`dta-tab ${mode === "client" ? "dta-tab-active" : ""}`}>Client view</button>
              <button type="button" onClick={() => setMode("logic")} className={`dta-tab ${mode === "logic" ? "dta-tab-active" : ""}`}>Logic view</button>
            </div>
          </header>
        ) : (
          <div className="dta-top-actions">
            <div className="dta-view-toggle">
              <button type="button" onClick={() => setMode("client")} className="dta-tab dta-tab-active">Client view</button>
              <button type="button" onClick={() => setMode("logic")} className="dta-tab">Logic view</button>
            </div>
          </div>
        )}

        {mode === "logic" ? (
          <>
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ApplicationEditor app={app} setApp={setApp} />
              </div>

              <div className="dta-card bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#141414]">Policy assumptions</h2>
                    <p className="mt-1 text-sm text-slate-600">Controls what proof DTA can most likely verify through internally-available data sources and does not want to automatically suggest in the verification suggestion list.</p>
                  </div>
                  <button type="button" onClick={() => setShowPolicyToggles(!showPolicyToggles)} className="dta-button-secondary px-4 py-2 text-sm">
                    {showPolicyToggles ? "Hide toggles" : "Show toggles"}
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <label className="flex gap-3 border border-[#b7ced6] bg-white p-3">
                    <input type="checkbox" checked={settings.suppressInternalData} onChange={(event) => setSettings({ ...settings, suppressInternalData: event.target.checked })} />
                    <span>Do not suggest the following proof because DTA likely has this info available through trusted data sources</span>
                  </label>
                </div>

                {showPolicyToggles ? (
                  <div className="mt-4 border border-[#b7ced6] bg-white p-4">
                    <h3 className="font-bold text-[#141414]">Internal data suppression toggles</h3>
                    <p className="mt-1 text-sm text-slate-600">Tune the individual data-match assumptions used by the recommendation logic.</p>
                    <div className="mt-4 grid gap-3">
                      <ToggleInput app={app} setApp={setApp} path="identity.likelyRMVMatch" label="Identity proof (likely avail through RMV/DTA data)" />
                      <ToggleInput app={app} setApp={setApp} path="income.ssi.likelySVESAvailable" label="SSI income/ changed income proof (likely avail through SVES)" />
                      <ToggleInput app={app} setApp={setApp} path="income.rsdi.likelySVESAvailable" label="RSDI income/ changed income proof (likely avail through SVES)" />
                      <ToggleInput app={app} setApp={setApp} path="income.unemployment.likelyStateMatchAvailable" label="Unemployment income/ changed income proof (likely available if MA UI in state data)" />
                      <ToggleInput app={app} setApp={setApp} path="income.childSupportReceived.likelyRAPIDAvailable" label="Child support income/ changed income proof (likely available if court ordered in RAPID)" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}

        <div className={`grid gap-6 ${mode === "logic" ? "lg:grid-cols-[1fr_330px]" : ""}`}>
          {mode === "client" && clientScreen === "submitted" ? (
            <SubmittedScreen
              applicationNumber={applicationNumber}
              onReviewProof={() => setClientScreen("recommendations")}
            />
          ) : (
            <section className="dta-shell">
            <div className="dta-hero-band px-6 py-8 sm:px-16 sm:py-10">
            {mode === "client" ? (
              <button
                type="button"
                onClick={() => setClientScreen("submitted")}
                className="mb-4 text-sm font-normal text-[#003b5c] underline"
              >
                Back to submitted screen
              </button>
            ) : null}

            <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-[#141414] sm:text-4xl">Submit as much proof as you can now</h1>
            <div className="mt-4 max-w-2xl space-y-2 text-lg leading-relaxed text-[#141414]">
              <p>{recommendationIntro}</p>
              <p className="text-base">Your recertification due date is [RecertificationDueDate].</p>
            </div>
            {mode === "client" ? (
              <div className="mt-5 max-w-2xl">
                <InlineMessage tone="warning" title="DTA may request additional proof">
                  The suggestions below are based on what you told us. DTA may ask for additional documents after a worker reviews your recertification.
                </InlineMessage>
              </div>
            ) : null}
            </div>

            <div className="space-y-5 px-6 py-8 sm:px-16">
              {result.recs.length === 0 && !showSkippedIncomeGuidance && !showSkippedExpensesGuidance ? (
                <div className="dta-card bg-white p-4 text-sm text-slate-700">No recommendations yet. Use Logic view to select application answers.</div>
              ) : null}

              {showSkippedIncomeGuidance ? (
                <SkippedIncomeGuidance />
              ) : (
                <>
                  {requiredRecommendations.length > 0 ? (
                    <RecommendationSection label="Required to decide if you still qualify">
                      {requiredRecommendations.map((rec, index) => <RecommendationCard key={rec.key} rec={rec} index={index} />)}
                    </RecommendationSection>
                  ) : null}

                  {optionalRecommendations.length > 0 || showSkippedExpensesGuidance ? (
                    <RecommendationSection label="Optional to get a higher benefit amount">
                      <InlineMessage tone="info" title="New rules">
                        SNAP households now have to submit proof to get expense deductions. Sending proof of costs and expenses can increase SNAP benefits, but are not required to qualify for SNAP
                      </InlineMessage>
                      {showSkippedExpensesGuidance ? (
                        <SkippedExpensesGuidance />
                      ) : (
                        optionalRecommendations.map((rec, index) => <RecommendationCard key={rec.key} rec={rec} index={index} />)
                      )}
                    </RecommendationSection>
                  ) : null}
                </>
              )}

              <div className="dta-card-soft mt-8 p-5">
                <p className="text-sm leading-relaxed text-slate-700">
                  Submit as much proof as you can now — it will reduce back and forth during the process and can reduce delays or missed benefits.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  If you need more time you can come back and submit proof until [YourRecertificationDueDate]
                </p>
              </div>
              <ClientActions />
            </div>
          </section>
          )}

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
