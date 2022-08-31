import { LightningElement, api, track } from "lwc";

import LABELS from "./imports/labels";
import STEPS from "./imports/steps";
import ACCEPTED_FORMATS from "./imports/acceptedFormats";
import { obtainPartnerShipColumns } from "./maps/parthershipTableMap";
import { obtainApprovedPuprosesColums } from "./maps/approvedPurposesMap";

import constants from "c/constants";
import utils from "c/utils";

const { applySortCodeMask, removeMask, filterSortCodeMaskInput } = utils;
const { SUPPORTING_DOCUMENT_COLUMNS } = constants.columnsConstants;
const { pfValidationConstants } = constants;
const { monitoringFormTypes } = constants;

const ValidationUtils = utils.validation;

export default class PermissionFormSteps extends LightningElement {
  @api selectedStepIndex = 0;
  @api permissionForm = {};
  @api isCapital = false;
  // @track sortCode;
  scrollTo = utils.scrollTo.bind(this);
  labels = LABELS;
  acceptedFormats = ACCEPTED_FORMATS;
  fileColumns = SUPPORTING_DOCUMENT_COLUMNS;
  LAST_STEP_FILE_PREFIX = monitoringFormTypes.LAST_STEP_FILE_PREFIX
  PARTNER_FINDING_FILE_PREFIX = monitoringFormTypes.PARTNER_FINDING_FILE_PREFIX

  get steps() {
    return this.isCapital ? STEPS.capitalSteps : STEPS.defaultSteps;
  }

  get sectionTitle() {
    return this.steps[this.selectedStepIndex].title;
  }

  get isFilesUploaded() {
    return this.permissionForm.docsData ? true : false;
  }

  get currentDateTime() {
    return new Date().toISOString();
  }

  get partnerShipColumnList() {
    return obtainPartnerShipColumns(this.partnerShipColumnHandler, this.permissionForm.isBlocked);
  }

  get approvedPuprosesColumList() {
    return obtainApprovedPuprosesColums(this.approvedPurposeColumnHandler, this.permissionForm.isBlocked);
  }

  get sortCode() {
    return this.permissionForm.sortCode ? applySortCodeMask(this.permissionForm.sortCode) : null;
  }

  render() {
    /* if ( this.selectedStepIndex == 3 && this.permissionForm.sortCode) {
      this.sortCode = applySortCodeMask(this.permissionForm.sortCode);
    } */
    if (this.selectedStepIndex === -1) {
      return this.steps[0].template;
    } else {
      return this.steps[this.selectedStepIndex].template;
    }
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }

  handleUploadFinished(event) {
    this.dispatchEvent(
      new CustomEvent("uploadfinished", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleRowAction(event) {
    try {
      this.dispatchEvent(
        new CustomEvent("rowaction", {
          bubbles: true,
          composed: true,
          detail: {
            rowId: event.detail.row.Id
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  handleGenerateUrl(event) {
    this.dispatchEvent(
      new CustomEvent("generateurl", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleTextChange(event) {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.value,
      typeChanges: "own"
    });
  }
  handleCheckNumber(event) {
    let allowed=['1','2','3','4','5','6','7','8','9','0','Backspace','Delete','ArrowLeft','ArrowRight'];
    if (!allowed.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }
  handleCheckbox(event) {
    console.log(event.target.checked);
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.checked,
      typeChanges: "own"
    });
  }

  handleFocusSortCode(event) {
    // event.target.value = removeMask(event.target.value);
  }

  handleBlurSortCode(event) {
    event.target.value = applySortCodeMask(event.target.value);
    event.target.reportValidity();
  }

  handleChangeSortCode(event) {
    // event.target.value = filterSortCodeMaskInput(event.target.value);
    // this.sortCode = applySortCodeMask(event.target.value);
    this.sendEventToParent({
      field: event.target.name,
      value: filterSortCodeMaskInput(event.target.value),
      typeChanges: "own"
    });
  }

  stageErrorMap = {};
  firstErrorFieldName = "";
  blockScroll = false;
  fieldToStageMap = pfValidationConstants.PERMISSION_FORM_FIELD_MAP;

  @api
  validateStage() {
    this.firstErrorFieldName = null;
    let inputsAreValid = this.validateComponents("lightning-input");
    let table = this.template.querySelector("c-custom-data-table");
    if (table) {
      console.log("table ", table.validateTable());
    }
    this.scrollToError();
    return inputsAreValid;
  }

  validateComponents(componentsName) {
    let isValid = true;
    let components = [...this.template.querySelectorAll(componentsName)];
    if (components) {
      isValid = components.reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        if (!this.firstErrorFieldName && !inputCmp.checkValidity()) {
          this.firstErrorFieldName = inputCmp.name;
        }
        return validSoFar && inputCmp.checkValidity();
      }, true);
    }
    return isValid;
  }

  scrollToSectionBegining(conditionToScroll) {
    if (this.blockScroll) {
      return;
    }
    let firstSectionElement = this.template.querySelectorAll(conditionToScroll);
    if (!!firstSectionElement && firstSectionElement.length > 0) {
      firstSectionElement[0].scrollIntoView();
      this.blockScroll = true;
    }
  }

  scrollToError() {
    if (this.firstErrorFieldName == "" || this.firstErrorFieldName == null)
      return;
    this.blockScroll = false;
    // this.scrollTo('[name="' + this.firstErrorFieldName + '"]');
    this.scrollToSectionBegining(
      '[name="' + this.firstErrorFieldName + '"]'
    );
  }

  partnerShipColumnHandler = (event) => {
    let value =
      event.target.name === "attachingConfirmation"
        ? event.target.checked
        : event.target.value;

    this.sendEventToParent({
      field: event.target.name,
      value: value,
      id: event.target.dataset.index,
      typeChanges: "partnershipFunding"
    });
  };

  approvedPurposeColumnHandler = (event) => {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.value,
      id: event.target.dataset.index,
      typeChanges: "approvedPurposes"
    });
  };

  sendEventToParent(detailData) {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        detail: detailData
      })
    );
  }
}