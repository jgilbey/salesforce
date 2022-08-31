/**
 * @description       : Footer actions of form
 * @author            : Methods
 * @group             : 
 * @last modified on  : 01-14-2021
 * @last modified by  : Methods
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   01-14-2021   Methods   Initial Version
**/
import { LightningElement, api } from "lwc";
import labelNext from '@salesforce/label/c.Next';
import labelPrevious from '@salesforce/label/c.Previous';
import labelSubmit from '@salesforce/label/c.Submit';
import labelSave from '@salesforce/label/c.Save';

export default class FormFooter extends LightningElement {
  @api
  isLastStage;
  @api
  isFirstStage;
  @api
  nextButtonName = labelNext;
  @api
  prevButtonName = labelPrevious;
  @api
  submitButtonName = labelSubmit;
  @api
  saveButtonName = labelSave;
  @api
  disableSaveButton;

  @api errorMessage;

  @api
  get showErrorMessage() {
    return !!this.errorMessage;
  }


  handleBackButton() {
    this.dispatchEvent(new CustomEvent("back"));
  }
  handleNextButton() {
    this.dispatchEvent(new CustomEvent("next"));
  }

  handleSubmitButton() {
    this.errorMessage = null;
    this.dispatchEvent(new CustomEvent("submit"));
  }
  handleSaveButton() {
    this.dispatchEvent(new CustomEvent("save"));
  }

  handleMessageClose() {
    this.errorMessage = "";
  }
}