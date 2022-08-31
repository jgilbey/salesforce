//templates
import intro from "../steps/intro.html";
import paymentRequest from "../steps/paymentRequest.html";
import images from "../steps/images.html";
import fundingAcknowledgement from "../steps/fundingAcknowledgement.html";
import submission from "../steps/submission.html";
import approvedPurposes from "../steps/approvedPurposes.html";
import statutoryPermissions from "../steps/statutoryPermissions.html";
import fundingUpdate from "../steps/fundingUpdate.html";
import suppliers from "../steps/suppliers.html";

//labels

import constants from "c/constants";
const {
  STEP_0,
  STEP_1,
  STEP_2,
  STEP_3,
  STEP_4,
  STEP_5,
  STEP_6,
  STEP_7,
  STEP_8
} = constants.stepsConstants;

const acquisitionsSteps = [
  { value: STEP_0, template: intro, title: "" },
  {
    value: STEP_1,
    template: paymentRequest,
    title: "Section 1: Your payment request"
  },
  { value: STEP_2, template: images, title: "Section 2: Images" },
  {
    value: STEP_3,
    template: fundingAcknowledgement,
    title: "Section 3: Funding acknowledgement and lessons learned"
  },
  { value: STEP_4, template: submission, title: "Section 4: Submission" }
];

const capitalSteps = [
  { value: STEP_0, template: intro, title: "" },
  {
    value: STEP_1,
    template: approvedPurposes,
    title: "Section 1: Approved purposes"
  },
  {
    value: STEP_2,
    template: statutoryPermissions,
    title: "Section 2: Statutory permissions"
  },
  {
    value: STEP_3,
    template: fundingUpdate,
    title: "Section 3: Funding update"
  },
  { value: STEP_4, template: suppliers, title: "Section 4: Suppliers" },
  {
    value: STEP_5,
    template: paymentRequest,
    title: "Section 5: Final Payment"
  },
  { value: STEP_6, template: images, title: "Section 6: Images" },
  {
    value: STEP_7,
    template: fundingAcknowledgement,
    title: "Section 7: Funding acknowledgement"
  },
  { value: STEP_8, template: submission, title: "Section 8: Submission" }
];

export default {
  acquisitionsSteps,
  capitalSteps
};