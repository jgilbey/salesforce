import { LightningElement, api } from "lwc";

import constants from "c/constants";

import labelProject_Number from "@salesforce/label/c.Project_Number";
import labelProject_Name from "@salesforce/label/c.Project_Name";
import labelStatus from "@salesforce/label/c.Status";
import applicationView from "@salesforce/label/c.View_Application_Label";
import applicationContinue from "@salesforce/label/c.Continue_Application_Label";

const {
  NEW,
  AWAITING_FURTHER_INFORMATION,
  ENCOURAGED,
  DISCOURAGED,
  SUBMITTED
} = constants.projectStatusesConstants;

const CONTINUE_STATUSES = [NEW, AWAITING_FURTHER_INFORMATION];
const VIEW_STATUSES = [ENCOURAGED, DISCOURAGED, SUBMITTED];

export default class FormTableRow extends LightningElement {
  @api project = {};

  labels = {
    labelProject_Number,
    labelProject_Name,
    labelStatus,
    applicationView,
    applicationContinue,
    labelRemovePoject: "Remove"
  };

  get applicationButtonLabel() {
    const caseStatus = this.project.caseStatus || "";
    if (CONTINUE_STATUSES.includes(caseStatus)) {
      return this.labels.applicationContinue;
    }else if (VIEW_STATUSES.includes(caseStatus)) {
      return this.labels.applicationView;
    } else {
      return this.labels.applicationView;
    }
  }

  continueProjectHandler() {
    this.fireEvent({
      eventName: "continue",
      details: { id: this.project.Id }
    });
  }

  continueApplicationHandler() {
    this.fireEvent({
      eventName: "continue",
      details: { id: this.project.caseId }
    });
  }

  removeProjectHandler() {
    this.fireEvent({
      eventName: "remove",
      details: { id: this.project.Id }
    });
  }

  fireEvent({ eventName, details }) {
    this.dispatchEvent(new CustomEvent(eventName, { detail: details }));
  }
}