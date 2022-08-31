import { LightningElement, api } from "lwc";

import Select_Type from "@salesforce/label/c.Select_Type";

import constants from "c/constants";
import utils from "c/utils";
const { SUPPORTING_DOCUMENT_COLUMNS } = constants.columnsConstants;
const ValidationUtils = utils.validation;

export default class SupportingDocument extends LightningElement {
  @api name = "";
  @api documentProvisionTypes = [];
  @api doscData = {};
  @api appForm = {};
  @api acceptedFormats = [];

  columns = SUPPORTING_DOCUMENT_COLUMNS;

  labels = {
    Select_Type
  };

  get comboboxRequired() {
    return this.doscData[this.name].required;
  }

  get comboboxValue() {
    return (this.doscData[this.name]? this.doscData[this.name].data.provisionType: null);
  }

  get isElectronic() {
    return (this.doscData[this.name]? this.doscData[this.name].data.isElectronic: false);
  }

  get isFilesUploaded() {
    return (this.doscData[this.name]? this.doscData[this.name].data.documentFiles && this.doscData[this.name].data.documentFiles.length: false);
  }

  get recordId() {
    return (this.doscData[this.name]? this.doscData[this.name].data.documentId: null);
  }

  get documentFiles() {
    return (this.doscData[this.name]? this.doscData[this.name].data.documentFiles: null);
  }

  @api validatePicklist() {
    return ValidationUtils.validateComponents("lightning-combobox", this);
  }

  handleProvisionTypeChange(event) {
    this.fireEvent({
      eventName: "changeprovisiontype",
      details: {
        name: this.name,
        value: event.target.value
      }
    });
  }

  handleUploadFinished(event) {
    this.fireEvent({
      eventName: "uploadfinished",
      details: {
        name: this.name,
        files: event.detail.files
      }
    });
  }

  handleRowAction(event) {
    this.fireEvent({
      eventName: "rowaction",
      details: {
        name: this.name,
        rowId: event.detail.row.Id
      }
    });
  }

  fireEvent({ eventName, details }) {
    this.dispatchEvent(new CustomEvent(eventName, { detail: details }));
  }
}