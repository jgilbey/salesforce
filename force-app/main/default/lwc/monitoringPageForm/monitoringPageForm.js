import { LightningElement, api } from "lwc";

import View from "@salesforce/label/c.View";
import Continue from "@salesforce/label/c.Continue";

import constants from "c/constants";

const {
  NEW,
  AWAITING_FURTHER_INFORMATION,
  ENCOURAGED,
  DISCOURAGED,
  SUBMITTED
} = constants.projectStatusesConstants;

const CONTINUE_STATUSES = [NEW, AWAITING_FURTHER_INFORMATION];
const VIEW_STATUSES = [ENCOURAGED, DISCOURAGED, SUBMITTED];

export default class MonitoringPageForm extends LightningElement {
  @api form = {};

  labels = {
    View,
    Continue
  };

  get buttonLabel() {
    const formStatus = this.form.status || "";
    if (CONTINUE_STATUSES.includes(formStatus)) {
      return this.labels.Continue;
    } else if (VIEW_STATUSES.includes(formStatus)) {
      return this.labels.View;
    } else {
      return this.labels.View;
    }
  }

  handleFormButtonClick() {
    this.dispatchEvent(
      new CustomEvent("openform", {
        bubbles: true,
        composed: true,
        detail: {
          formId: this.form.Id
        }
      })
    );
  }
}