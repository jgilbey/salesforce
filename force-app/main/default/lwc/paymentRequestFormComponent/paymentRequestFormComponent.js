import { api, track, LightningElement } from "lwc";
import { deleteRecord } from "lightning/uiRecordApi";

import STEPS from "./imports/steps";
import LABELS from "./imports/labels";

import {
  transformForm,
  revertFormTransform,
  revertTransform,
  transformSpendingCosts,
  transformDocument
} from "./maps/transformForm";
import updateFormRecord from "@salesforce/apex/ApplicantFormController.updateFormRecord";
import upsertSpendingCostRecords from "@salesforce/apex/ApplicantFormController.upsertListRecords";
import deleteSpendingCostRecords from "@salesforce/apex/ApplicantFormController.deleteSpendingCostRecords";
import updateDocumentTitleWithPrefix from "@salesforce/apex/ApplicantFormController.updateDocumentTitleWithPrefix";
import obtainGrandTotal from "@salesforce/apex/ApplicantFormController.obtainAllGrandTotalPaid";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import utils from "c/utils";

export default class PaymentRequestFormComponent extends NavigationMixin(
  LightningElement
) {
  @api paymentFormData = {};
  @track paymentForm = {};
  @track spendingCosts = [];
  @track formId;
  @api case = {};
  // @track grandPaid = 0;
  @track uploadedFiles = [];
  @track alreadyPayed = 0;

  //confirm dialoge variables start
  @track isDialogVisible = false;
  //confirm dialoge variables end

  isSubmittion = false;
  spendingCostsOptions = [];
  toDeleteIdSet = [];
  isSaving = false;
  @track isLoading = false;

  selectedStepIndex = 0;
  scrollTo = utils.scrollTo.bind(this);

  get labels() {
    return LABELS;
  }
  get steps() {
    return STEPS.defaultSteps;
  }

  get selectedStepString() {
    return this.steps[this.selectedStepIndex].value;
  }

  get isLast() {
    return this.selectedStepIndex === this.steps.length - 1;
  }

  get isFirst() {
    return this.selectedStepIndex === 0;
  }

  get isBlocked() {
    return this.paymentForm.status == "Submitted";
  }
  get submitButtonName() {
    let buttonName = this.labels.Submit;
    if (this.paymentFormData.isBlocked) {
      buttonName = this.labels.Close;
    }
    return buttonName;
  }

  get grandPaid() {
    let alredyPayed = this.paymentFormData.formData.alreadyPayed;
    alredyPayed = alredyPayed > this.paymentForm.totalGrantAwarded ? this.paymentForm.totalGrantAwarded : alredyPayed; 
    if(alredyPayed <  this.paymentForm.totalGrantAwarded) {
      alredyPayed = alredyPayed * this.paymentForm.paymentPercentage / 100;
    }
    //let limit = this.completionForm.totalCosts  / this.completionForm.totalGrantAwarded * 100;
    // alredyPayed = alredyPayed > limit ? limit : alredyPayed; 
    return alredyPayed;// > limit ? limit : alredyPayed; 
  }

  connectedCallback() {
    this.paymentForm = transformForm(
      this.paymentFormData.formData.formObject,
      this.paymentFormData.formData.formDocuments
    );
    // this.grandPaid = this.paymentFormData.formData.alreadyPayed;
    this.uploadedFiles = this.paymentForm.docsData;
    this.formId = this.paymentFormData.id;
    this.spendingCostsOptions = this.paymentFormData.formData.costsHeaders;
    this.spendingCosts = !!this.paymentForm.spendingCosts
      ? [...this.paymentForm.spendingCosts]
      : [];
    console.log("OPTIONS: " + JSON.stringify(this.spendingCostsOptions));
    console.log({
      paymentFormData: JSON.parse(JSON.stringify(this.paymentFormData))
    });
    // this.populateGrandPaid();
  }

  recalcIndexes() {
    let tempSpendingCost = this.spendingCosts.map(this.cloneObjectFunction);
    tempSpendingCost.forEach((item, index) => {
      item.index = index;
    });
    this.spendingCosts = tempSpendingCost;
  }

  calculateSpendingTotal() {
    this.spendingCosts.forEach((item) => {
      item.total =
        (!!item.costToDate ? Number(item.costToDate) : 0) +
        (!!item.vat ? Number(item.vat) : 0);
    });
  }

  populateGrandPaid() {
    obtainGrandTotal({ caseId: this.paymentForm.caseId })
      .then((response) => {
        this.grandPaid = response;
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  handleNext() {
    this.saveAction();
    if (this.selectedStepIndex < this.steps.length) {
      this.selectedStepIndex = this.selectedStepIndex + 1;
    }
    this.scrollTo(document.body);
  }
  handlePrev() {
    this.saveAction();
    if (this.selectedStepIndex > 0) {
      this.selectedStepIndex = this.selectedStepIndex - 1;
    }
    this.scrollTo(document.body);
  }

  handleFinish() {
    if (this.paymentFormData.isBlocked) {
      this[NavigationMixin.Navigate]({
        type: "standard__namedPage",
        attributes: {
          pageName: "home"
        }
      });
    } else {
      this.isDialogVisible = true;
    }
  }
  @api
  handleSave() {
    this.isSaving = true;
    this.saveAction(false);
  }

  saveAction(actionAfterSubmit) {
    this.isLoading = true;
    upsertSpendingCostRecords({
      recordListJSON: JSON.stringify(
        revertTransform(
          this.spendingCosts ? this.spendingCosts : [],
          this.paymentForm.id
        )
      )
    })
      .then((result) => {
        this.spendingCosts = transformSpendingCosts(result);
        this.recalcIndexes();
        this.calculateSpendingTotal();
        if (actionAfterSubmit) {
          actionAfterSubmit();
        }
        this.deleteSpendingCosts();
        this.saveFormData();
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
      })
      .finally(() => {
        this.isLoading = false;
      });
    // this.saveFormData();
  }

  saveFormData() {
    updateFormRecord({
      formToUpdate: revertFormTransform(this.paymentForm)
    })
      .then((reponse) => {
        if (this.isSaving) {
          this.isSaving = false;
          this.showToast("", "Saving Success", "success");
        }
        if (this.isSubmittion) {
          this.navigateToMonitorings();
          this.showToast("", "Submission Success", "success");
        }
      })
      .catch((error) => {
        this.showToast("Error", "An error occurred", "error");
        console.log(JSON.stringify(error));
      });
  }

  deleteSpendingCosts() {
    deleteSpendingCostRecords({ sObjectIdList: this.toDeleteIdSet })
      .then((response) => {
        this.toDeleteIdSet = [];
      })
      .catch((error) => {
        cosole.log("error:" + JSON.stringify(error));
      });
  }

  submitForm() {
    //if(this.validateForm()) {
    this.isSubmittion = true;
    this.paymentForm.status = "Submitted";
    this.saveFormData();
    //}
  }

  validateForm() {
    let isValid = this.paymentForm.docsData.some((item) => {
      return item.name.startsWith("Proof") || item.name.startsWith("Support");
    });
    if (!isValid) {
      this.sendErrorMessageToFooter("You need to upload at least on file");
    }
    return isValid;
  }

  handleChangeStep(event) {
    this.selectedStepIndex = event.detail;
  }
  handleSpendingCostChanges(event) {
    if (!event.detail.isDeleted) {
      let data = event.detail.newData;
      this.spendingCosts = data;
      console.log(JSON.parse(JSON.stringify(this.spendingCosts)));
    } else if (event.detail.isDeleted) {
      let data = event.detail.toDeleteIdList;
      this.toDeleteIdSet = data;
    }
  }

  fileUploadingHandler(event) {
    let uploadedFiles = event.detail.files;
    updateDocumentTitleWithPrefix({
      prefix: event.detail.name,
      documentIdList: uploadedFiles.map((item) => {
        return item.documentId;
      })
    })
      .then((response) => {
        if (response && response.length > 0) {
          let updatedDoc = transformDocument(response);

          let newDocs = [...this.paymentForm.docsData]
            .map(this.cloneObjectFunction)
            .concat(updatedDoc);
          // newDocs.push(transformDocument(updatedDoc));
          this.paymentForm.docsData = newDocs;
          this.paymentForm = { ...this.paymentForm };
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  handleRowAction(event) {
    if (this.isBlocked) {
      return;
    }
    deleteRecord(event.detail.rowId)
      .then(() => {
        this.paymentForm.docsData = [...this.paymentForm.docsData]
          .map(this.cloneObjectFunction)
          .filter((item) => {
            return item.Id != event.detail.rowId;
          });
        this.paymentForm = { ...this.paymentForm };
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }

  handleDialogClick(event) {
    if (event.target.name === "openConfirmation") {
      this.isDialogVisible = true;
    } else {
      if (event.target.name === "confirmModal") {
        if (event.detail.status === "confirm") {
          this.submitForm();
        }
        this.isDialogVisible = false;
      }
    }
  }

  formDataChangeHandler(event) {
    if (this.isBlocked) {
      return;
    }
    let tempForm = { ...this.paymentForm };
    tempForm[event.detail.field] = event.detail.value;
    this.paymentForm = tempForm;
  }

  cloneObjectFunction = (item) => {
    return { ...item };
  };

  sendErrorMessageToFooter(errorMessage) {
    let footerComponent = this.template.querySelector("c-form-footer");
    if (footerComponent) {
      footerComponent.errorMessage = errorMessage;
    }
  }

  navigateToMonitorings() {
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "Monitoring"
      }
    });
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}