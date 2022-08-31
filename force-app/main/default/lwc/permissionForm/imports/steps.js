import STEP from "@salesforce/label/c.Step";
import INTRO from "@salesforce/label/c.Intro";

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
  { label: INTRO, value: STEP_0 },
  { label: "1", value: STEP_1 },
  { label: "2", value: STEP_2 },
  { label: "3", value: STEP_3 },
  { label: "4", value: STEP_4 }
];

const capitalSteps = [
  { label: INTRO, value: STEP_0 },
  { label: "1", value: STEP_1 },
  { label: "2", value: STEP_2 },
  { label: "3", value: STEP_3 },
  { label: "4", value: STEP_4 },
  { label: "5", value: STEP_5 },
  { label: "6", value: STEP_6 }
];

export default {
  defaultSteps,
  capitalSteps
};