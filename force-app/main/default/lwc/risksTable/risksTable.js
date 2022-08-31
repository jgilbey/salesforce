import { LightningElement, api } from "lwc";

import Select_Type from "@salesforce/label/c.Select_Type";

import constants from "c/constants";
const { RISKS_COLUMNS } = constants.columnsConstants;

export default class RisksTable extends LightningElement {
  @api risksData = [];
  @api appForm = {};
  @api likelihoodList = [];
  @api impactList = [];

  risksColumns = RISKS_COLUMNS;

  labels = {
    Select_Type
  };

  handleCurrentRiskChange(event) {
    let name, value, id;

    if (event.detail && event.detail.name) {
      ({ name, id, value } = event.detail);
    } else {
      ({ name, id, value } = event.target);
    }

    this.dispatchEvent(
      new CustomEvent("changerisk", {
        detail: { name, value, id }
      })
    );
  }

  removeCurrentRiskRow(event) {
    this.dispatchEvent(
      new CustomEvent("removerow", {
        detail: {
          index: event.target.value
        }
      })
    );
  }

  addCurrentRiskRow() {
    this.dispatchEvent(new CustomEvent("addrow"));
  }
  @api
  validateTable() {
    //voiding error field name for seacth new one;
    this.firstErrorFieldName = null;
    let inputsAreValid = this.validateComponents("lightning-input");
    let comboboxAreValid = this.validateComponents("lightning-combobox");
    let textareaAreValid = this.validateComponents("lightning-textarea");
    let multilineValid = this.multiLineValidation();

    return (
      inputsAreValid && comboboxAreValid && textareaAreValid && multilineValid
    );
  }

  multiLineValidation() {
    let isValid = true;
    let components = [...this.template.querySelectorAll("c-multiline-input")];
    if (components) {
      isValid = components.reduce((validSoFar, inputCmp) => {
        return inputCmp.validation();
      }, true);
    }
    return isValid;
  }

  validateComponents(componentsName) {
    let isValid = true;
    let components = [...this.template.querySelectorAll(componentsName)];
    if (components) {
      isValid = components.reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        if (!this.firstErrorFieldName && !inputCmp.checkValidity()) {
          this.firstErrorFieldName = inputCmp.dataset.name;
        }
        return validSoFar && inputCmp.checkValidity();
      }, true);
    }
    return isValid;
  }
}