//templates

import intro from "../steps/intro.html"
import approvedPuproses from "../steps/approvedPuproses.html"
import managingRisk from "../steps/managingRisk.html"
import projectTimetable from "../steps/projectTimetable.html"
import statutoryPermissions from "../steps/statutoryPermissions.html"
import partnershipFundingUpdate from "../steps/partnershipFundingUpdate.html"
import suppliers from "../steps/suppliers.html"
import images from "../steps/images.html"
import fundingAcknowledgement from "../steps/fundingAcknowledgement.html"
import submission from "../steps/submission.html"
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
  STEP_8,
  STEP_9
} = constants.stepsConstants;

const progressReportSteps = [
   { value: STEP_0, template: intro, title: "" },
  { value: STEP_1, template: approvedPuproses, title: "Section 1: Approved purposes" },
  { value: STEP_2, template: managingRisk, title: "Section 2: Managing risk" },
  { value: STEP_3, template: projectTimetable, title: "Section 3: Project timetable" }, 
  { value: STEP_4, template: statutoryPermissions, title: "Section 4: Statutory permissions" }, 
  { value: STEP_5, template: partnershipFundingUpdate, title: "Section 5: Partnership funding update" }, 
  { value: STEP_6, template: suppliers, title: "Section 6: Suppliers" }, 
  { value: STEP_7, template: images, title: "Section 7: Images" }, 
  { value: STEP_8, template: fundingAcknowledgement, title: "Section 8: Funding acknowledgement" }, 
  { value: STEP_9, template: submission, title: "Section 9: Submission" }
];


export default {
  progressReportSteps
};