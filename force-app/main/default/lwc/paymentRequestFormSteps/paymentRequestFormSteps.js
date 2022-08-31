import { LightningElement, api } from "lwc";
import STEPS from "./imports/steps";
import LABELS from "./imports/labels";
import ACCEPTED_FORMATS from "./imports/acceptedFormats";
import constants from "c/constants";
import utils from "c/utils";

const ValidationUtils = utils.validation;
const { SUPPORTING_DOCUMENT_COLUMNS } = constants.columnsConstants;

export default class PaymentRequestFormSteps extends LightningElement {
  @api selectedStepIndex = 0;
  @api paymentForm = {};
  @api spendingCosts = [];
  @api toDeleteIdSet = [];
  @api spendingCostPicklistValues = [];
  @api grandPaid = 0;
  @api uploadedFiles = [];
  @api isBlocked = false;
  acceptedFormats = ACCEPTED_FORMATS;

  get labels() {
    return LABELS;
  }
  get grandPaidPercentage(){
    return this.grandPaid / this.paymentForm.totalGrantAwarded * 100;
  }

  get paymentLimit() {
    return this.paymentForm.totalGrantAwarded - this.grandPaid;
  }
  get proofFiles() {
    return this.paymentForm.docsData.filter(item=>{return item.name.startsWith("Proof")});
  }

  get supportingFiles() {
    return this.paymentForm.docsData.filter(item=>{return item.name.startsWith("Support")});
  }

  get fileColumns() {
    return SUPPORTING_DOCUMENT_COLUMNS;
  }

  render() {
    if (this.selectedStepIndex === -1) {
      return this.steps[0].template;
    } else {
      return this.steps[this.selectedStepIndex].template;
    }
  }

  get steps() {
    return STEPS.defaultSteps;
  }

  get sectionTitle() {
    return this.steps[this.selectedStepIndex].title;
  }

  changeFormHandler(event) {
    this.sendEvent({
      field: event.target.name,
      value: event.target.value
    })
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }

  sendEvent(details) {
      // Creates the event with the data.
      const selectedEvent = new CustomEvent("formchanging", {
        detail: details,
        bubbles: true,
        composed: true
      });
  
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
  }
}