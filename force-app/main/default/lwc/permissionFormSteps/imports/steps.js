//templates
import intro from "../steps/intro.html";
import approvedPurposes from "../steps/approvedPurposes.html";
import funding from "../steps/funding.html";
import bankDetails from "../steps/bankDetails.html";
import declaration from "../steps/declaration.html";
import statutoryPermissions from "../steps/statutoryPermissions.html";
import nextSteps from "../steps/nextSteps.html"

//labels
import section_1_approved_purposes from "@salesforce/label/c.section_1_approved_purposes";
import section_1_funding from "@salesforce/label/c.section_1_funding";
import section_2_funding from "@salesforce/label/c.section_2_funding";
import section_2_bank_details from "@salesforce/label/c.section_2_bank_details";
import section_3_declaration from "@salesforce/label/c.section_3_declaration";
import section_6_bank_details from "@salesforce/label/c.section_6_bank_details";
import section_7_declaration from "@salesforce/label/c.section_7_declaration";

import constants from "c/constants";
const {
  STEP_0,
  STEP_1,
  STEP_2,
  STEP_3,
  STEP_4,
  STEP_5,
  STEP_6
} = constants.stepsConstants;

const defaultSteps = [
  { value: STEP_0, template: intro, title: "" },
  { value: STEP_1, template: funding, title: section_1_funding },
  { value: STEP_2, template: bankDetails, title: section_2_bank_details },
  { value: STEP_3, template: declaration, title: section_3_declaration },
  { value: STEP_4, template: nextSteps, title: "Next Steps" }
];

const capitalSteps = [
  { value: STEP_0, template: intro, title: "" },
  {
    value: STEP_1,
    template: approvedPurposes,
    title: section_1_approved_purposes
  },
  { value: STEP_2, template: funding, title: section_2_funding },
  { value: STEP_3, template: statutoryPermissions, title: "" },
  { value: STEP_4, template: bankDetails, title: section_6_bank_details },
  { value: STEP_5, template: declaration, title: section_7_declaration },
  { value: STEP_6, template: nextSteps, title: "Next Steps" }
];

export default {
  defaultSteps,
  capitalSteps
};