//templates
import intro from "../steps/intro.html";
import paymentRequest from "../steps/paymentRequest.html";
import submission from "../steps/submission.html";

//labels
import section_1_approved_purposes from "@salesforce/label/c.section_1_approved_purposes";
import section_1_funding from "@salesforce/label/c.section_1_funding";
import section_2_funding from "@salesforce/label/c.section_2_funding";
import section_2_bank_details from "@salesforce/label/c.section_2_bank_details";
import section_3_declaration from "@salesforce/label/c.section_3_declaration";
import section_6_bank_details from "@salesforce/label/c.section_6_bank_details";
import section_7_declaration from "@salesforce/label/c.section_7_declaration";

import constants from "c/constants";
const { STEP_0, STEP_1, STEP_2 } = constants.stepsConstants;

const defaultSteps = [
  { value: STEP_0, template: intro, title: "" },
  {
    value: STEP_1,
    template: paymentRequest,
    title: "Section 1: Your payment request"
  },
  { value: STEP_2, template: submission, title: "Section 2: Submission" }
];

export default {
  defaultSteps
};