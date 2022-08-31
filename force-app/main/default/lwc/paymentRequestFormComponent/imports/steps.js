import INTRO from "@salesforce/label/c.Intro";

import constants from "c/constants";
const { STEP_0, STEP_1, STEP_2 } = constants.stepsConstants;

const defaultSteps = [
  { label: INTRO, value: STEP_0 },
  { label: "1", value: STEP_1 },
  { label: "2", value: STEP_2 }
];

export default {
  defaultSteps
};