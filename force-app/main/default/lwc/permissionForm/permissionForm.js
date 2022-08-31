import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import obtainData from "@salesforce/apex/ApplicantFormController.obtainFormData";
import updateData from "@salesforce/apex/ApplicantFormController.updatePermissionFormData";
import generateDocumentUrl from "@salesforce/apex/ApplicantFormController.generateDocumentUrl";
import updateDocumentTitleWithPrefix from "@salesforce/apex/ApplicantFormController.updateDocumentTitleWithPrefix";
import { deleteRecord } from "lightning/uiRecordApi";

import STEPS from "./imports/steps";
import { transformForm, transformRefreshedForm } from "./maps/transformForm";
import { transformReverseForm } from "./maps/transformReverseForm";
import constants from "c/constants";

import Confirmation_Title from "@salesforce/label/c.Confirmation_Title";
import Do_you_want_to_submit from "@salesforce/label/c.Do_you_want_to_submit";
import Yes from "@salesforce/label/c.Yes";
import No from "@salesforce/label/c.No";
import Submit from "@salesforce/label/c.Submit";
import Close from "@salesforce/label/c.Close";
import Success from "@salesforce/label/c.Success";
import Saved from "@salesforce/label/c.Saved";
import Your_request_was_successfully_sent from "@salesforce/label/c.Your_request_was_successfully_sent";
import Stages_error_message from "@salesforce/label/c.Stages_error_message";

const { monitoringFormTypes } = constants;
import utils from "c/utils";

export default class PermissionForm extends NavigationMixin(LightningElement) {
  isCapital = true;
  @api permissionFormData = {};
  @track permissionForm = {};
  @track formId;
  @api case = {};

  @track isLoading = false;

  selectedStepIndex = 0;
  isDialogVisible = false;
  scrollTo = utils.scrollTo.bind(this);

  labels = { Confirmation_Title, Do_you_want_to_submit, Yes, No };

  connectedCallback() {
    this.permissionForm = transformForm(
      this.permissionFormData.formData.formObject,
      this.permissionFormData.formData.userData,
      this.permissionFormData.formData.formDocuments,
      this.permissionFormData.formData.projectIncomes,
      this.permissionFormData.formData.approvedPurposeList
    );
    this.permissionForm.isBlocked = this.permissionFormData.isBlocked;
    this.formId = this.permissionForm.id;
    this.isCapital = !(
      this.permissionForm.recordTypeDeveloperName ===
      monitoringFormTypes.PERMISSION_ACQUISITIONS_DEV_NAME
    );
  }

  getFormData() {
    obtainData({ formId: this.formId })
      .then((resp) => {
        console.log({ resp });
        this.permissionForm = transformForm(
          resp.formData.formObject,
          resp.formData.userData,
          resp.formData.formDocuments,
          resp.formData.projectIncomes,
          resp.formData.approvedPurposeList
        );
        this.permissionForm.isBlocked = this.permissionFormData.isBlocked;
        console.log(JSON.parse(JSON.stringify(this.permissionForm)));
      })
      .catch((err) => console.error(err));
  }

  get steps() {
    return this.isCapital ? STEPS.capitalSteps : STEPS.defaultSteps;
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

  handleChangeStep(event) {
    this.selectedStepIndex = event.detail;
  }

  handleNext() {
    if (!this.permissionForm.isBlocked) {
      if (
        this.template.querySelector("c-permission-form-steps").validateStage()
      ) {
        this.submitAction(false, () => {
          this.nextAction();
        });
      }
    } else {
      this.nextAction();
    }
  }
  nextAction() {
    if (this.selectedStepIndex < this.steps.length) {
      this.selectedStepIndex = this.selectedStepIndex + 1;
    }
    this.scrollTo(document.body);
  }
  handlePrev() {
    if (!this.permissionForm.isBlocked) {
      this.submitAction(false, () => {
        this.prevAction();
      });
    } else {
      this.prevAction();
    }
  }

  prevAction() {
    if (this.selectedStepIndex > 0) {
      this.selectedStepIndex = this.selectedStepIndex - 1;
    }
    this.scrollTo(document.body);
  }
  @api
  handleSave() {
    this.submitAction(false, () => {
      this.showToast(Success, Saved, "success");
      this.dispatchEvent(
        new CustomEvent("relateddataupdate", {
          bubbles: true,
          composed: true
        })
      );
    });
  }

  handleFinish() {
    if (this.permissionForm.isBlocked) {
      this[NavigationMixin.Navigate]({
        type: "standard__namedPage",
        attributes: {
          pageName: "home"
        }
      });
    } else {
      let sectionList = this.validateForm();
      if (sectionList.size > 0) {
        let stageWithErrors =
          Stages_error_message + " " + [...sectionList].join(", ");
        this.sendErrorMessageToFooter(stageWithErrors);
      } else {
        this.isDialogVisible = true;
      }
    }
  }
  sendErrorMessageToFooter(errorMessage) {
    let footerComponent = this.template.querySelector("c-form-footer");
    if (footerComponent) {
      footerComponent.errorMessage = errorMessage;
    }
  }

  handleDialogClick(event) {
    if (event.target.name === "openConfirmation") {
      this.isDialogVisible = true;
    } else if (event.target.name === "confirmModal") {
      if (event.detail !== 1) {
        if (event.detail.status === "confirm") {
          if (
            this.template
              .querySelector("c-permission-form-steps")
              .validateStage()
          ) {
            this.submitAction(true, () => {
              this.showToast(
                Success,
                Your_request_was_successfully_sent,
                "success"
              );
              this[NavigationMixin.Navigate]({
                type: "standard__namedPage",
                attributes: {
                  pageName: "Monitoring"
                }
              });
              this.dispatchEvent(
                new CustomEvent("relateddataupdate", {
                  bubbles: true,
                  composed: true
                })
              );
            });
          } else if (event.detail.status === "cancel") {
          }
        }
        this.isDialogVisible = false;
      }
    }
  }

  handleFormChanges(event) {
    const changes = event.detail;
    let permissionFormTemp = JSON.parse(JSON.stringify(this.permissionForm));
    if (changes.typeChanges === "own") {
      permissionFormTemp[changes.field] = changes.value;
    } else if (changes.typeChanges === "partnershipFunding") {
      let partnershipFunding = permissionFormTemp.partnershipFunding.map(
        (el) => ({
          ...el,
          ...(el.id === changes.id && { [changes.field]: changes.value })
        })
      );
      permissionFormTemp.partnershipFunding = partnershipFunding;
    } else if (changes.typeChanges === "approvedPurposes") {
      let approvedPurposes = permissionFormTemp.approvedPurposes.map((el) => ({
        ...el,
        ...(el.id === changes.id && { [changes.field]: changes.value })
      }));
      permissionFormTemp.approvedPurposes = approvedPurposes;
    }
    this.permissionForm = permissionFormTemp;
  }

  handleUploadFinished(e) {
    const data = e.detail;

    updateDocumentTitleWithPrefix({
      prefix: data.name,
      documentIdList: data.files.map((e) => e.documentId)
    })
      .then(() => {
        this.submitAction(false, () => {
          this.getFormData();
        });
      })
      .catch((e) => {});
  }

  handleRowAction(event) {
    if (this.permissionForm.isBlocked) {
      return;
    }
    deleteRecord(event.detail.rowId)
      .then(() => {
        this.submitAction(false, () => {
          this.getFormData();
        });
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }

  updateFormData() {
    this.isLoading = true;
    let transformReverseFormObject = transformReverseForm(this.permissionForm);

    return updateData({
      formToUpdateJSON: transformReverseFormObject.formObject
        ? JSON.stringify(transformReverseFormObject.formObject)
        : null,
      bankAccountsDataJSON: transformReverseFormObject.bankAccountObject
        ? JSON.stringify(transformReverseFormObject.bankAccountObject)
        : null,
      ApprovedPurposesJSON: transformReverseFormObject.approvedPurposesObject
        ? JSON.stringify(transformReverseFormObject.approvedPurposesObject)
        : null,
      projectIncomeJSON: transformReverseFormObject.projectIncomes
        ? JSON.stringify(transformReverseFormObject.projectIncomes)
        : null,
      contactJSON:
        transformReverseFormObject.contactObject &&
        transformReverseFormObject.contactObject.Id
          ? JSON.stringify(transformReverseFormObject.contactObject)
          : null,
      organisatinJSON:
        transformReverseFormObject.organisationObject &&
        transformReverseFormObject.organisationObject.Id
          ? JSON.stringify(transformReverseFormObject.organisationObject)
          : null
    })
      .then((resp) => {
        console.log({ resp });
        const caseData = {
          caseId: this.permissionForm.caseId,
          totalCosts: this.permissionForm.totalCosts,
          grantPercentage: this.permissionForm.grantPercentage,
          totalPartnershipFunding: this.permissionForm.totalPartnershipFunding
        };
        const tempDocsData = this.permissionForm.docsData;
        const currentRecordType = this.permissionForm.recordTypeDeveloperName;

        this.permissionForm = transformRefreshedForm(
          resp.form,
          caseData,
          resp.bankAccount,
          resp.approvedPurposes,
          resp.projectIncome,
          resp.contact,
          resp.organisation,
          tempDocsData,
          currentRecordType
        );
      })
      .catch((err) => console.error(err))
      .finally(() => {
        this.isLoading = false;
      });
  }

  //document generation logic --start
  generateDocumentHandler(event) {
    this.isLoading = true;
    generateDocumentUrl({
      formId: this.formId,
      formType: this.isCapital
        ? "PermissionFormCapital"
        : "PermissionFormAcquisition"
    })
      .then((response) => {
        this.navigateToGeneratedDocument(response);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  navigateToGeneratedDocument(url) {
    window.open(url, "_blank");
  }
  //document generation logic --end

  isBlank(str) {
    return !str || /^\s*$/.test(str);
  }
  isNumeric(value) {
    return /^-?\d+$/.test(value);
  }
  get submitButtonName() {
    let buttonName = Submit;
    if (this.permissionForm.isBlocked) {
      buttonName = Close;
    }
    return buttonName;
  }

  submitAction(isFinished, actionAfterSubmit) {
    this.isLoading = true;

    return updateData(this.requestPayload(isFinished))
      .then((resp) => {
        console.log({ resp });
        this.getFormData();
        //this.fillFormData(this.permissionForm, resp);
        if (actionAfterSubmit) {
          actionAfterSubmit();
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        this.isLoading = false;
      });
  }

  requestPayload(isFinished) {
    let transformReverseFormObject = transformReverseForm(this.permissionForm);
    if (isFinished) {
      transformReverseFormObject.formObject.Status__c = "Submitted";
    }
    return {
      formToUpdateJSON: transformReverseFormObject.formObject
        ? JSON.stringify(transformReverseFormObject.formObject)
        : null,
      bankAccountsDataJSON: transformReverseFormObject.bankAccountObject
        ? JSON.stringify(transformReverseFormObject.bankAccountObject)
        : null,
      ApprovedPurposesJSON: transformReverseFormObject.approvedPurposesObject
        ? JSON.stringify(transformReverseFormObject.approvedPurposesObject)
        : null,
      projectIncomeJSON: transformReverseFormObject.projectIncomes
        ? JSON.stringify(transformReverseFormObject.projectIncomes)
        : null,
      contactJSON:
        transformReverseFormObject.contactObject &&
        transformReverseFormObject.contactObject.Id
          ? JSON.stringify(transformReverseFormObject.contactObject)
          : null,
      organisatinJSON:
        transformReverseFormObject.organisationObject &&
        transformReverseFormObject.organisationObject.Id
          ? JSON.stringify(transformReverseFormObject.organisationObject)
          : null
    };
  }

  fillFormData(permissionForm, data) {
    const caseData = {
      caseId: permissionForm.caseId,
      totalCosts: permissionForm.totalCosts,
      grantPercentage: permissionForm.grantPercentage,
      totalPartnershipFunding: permissionForm.totalPartnershipFunding
    };
    const tempDocsData = permissionForm.formDocuments;
    const currentRecordType = permissionForm.recordTypeDeveloperName;

    this.permissionForm = transformRefreshedForm(
      data.form,
      caseData,
      data.bankAccount,
      data.approvedPurposes,
      data.projectIncome,
      data.contact,
      data.organisation,
      tempDocsData,
      currentRecordType
    );
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }

  validateForm() {
    let isValid = true;
    let sectionList = new Set();
    if (
      this.permissionForm.partnershipFunding &&
      this.permissionForm.partnershipFunding.length > 0
    ) {
      this.permissionForm.partnershipFunding.forEach((item) => {
        if (item.amountSecured == null || item.amountSecured  === '' || item.amountSecured === 'undefined') {
          sectionList.add(this.isCapital ? "Section 2" : "Section 1");
        }
      });
    }
    if (
      !this.permissionForm.accountName ||
      !this.permissionForm.accountNumber ||
      !this.permissionForm.sortCode 
    ) {
      sectionList.add(this.isCapital ? "Section 6" : "Section 2");
    }
    if (!this.permissionForm.agreeWithStatements) {
      sectionList.add(this.isCapital ? "Section 7" : "Section 3");
    }
    return sectionList;
  }
}