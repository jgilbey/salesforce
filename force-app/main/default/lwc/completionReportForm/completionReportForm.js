import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import obtainData from "@salesforce/apex/ApplicantFormController.obtainFormData";
import updateData from "@salesforce/apex/ApplicantFormController.updateCompletionReportFormData";
import generateDocumentUrl from "@salesforce/apex/ApplicantFormController.generateDocumentUrl";
import updateDocumentTitleWithPrefix from "@salesforce/apex/ApplicantFormController.updateDocumentTitleWithPrefix";
import { deleteRecord } from "lightning/uiRecordApi";
import { obtainValidationMap } from "./imports/validationMap";

import STEPS from "./imports/steps";
import {
  transformForm,
  transformRefreshedForm,
  transformProjectIncomesArray,
  transformSpendingCosts
} from "./maps/transformForm";
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

export default class CompletionReportForm extends NavigationMixin(
  LightningElement
) {
  @api completionFormData = {};

  @track completionForm = {};
  @track spendingCostsOptions = [];
  @track formId;
  @track isCapital = false;
  @track isLoading = false;

  selectedStepIndex = 0;
  isDialogVisible = false;

  projectsIncomeToDeleteIds = [];

  labels = { Confirmation_Title, Do_you_want_to_submit, Yes, No };
  scrollTo = utils.scrollTo.bind(this);

  get stepsIsValid() {
    return this.template
      .querySelector("c-completion-report-form-steps")
      .validateStage();
  }
  get submitButtonName() {
    let buttonName = Submit;
    if (this.completionForm.isBlocked) {
      buttonName = Close;
    }
    return buttonName;
  }

  connectedCallback() {
    this.fillForm(this.completionFormData);
  }

  fillForm(data) {
    this.completionForm = transformForm(
      data.formData.formObject,
      data.formData.approvedPurposeList,
      data.formData.projectIncomes,
      data.formData.formDocuments
    );
    this.formId = this.completionForm.id;
    this.spendingCostsOptions = data.formData.costsHeaders;
    this.completionForm.projectIncomePicklist =
      data.formData.projectIncomePicklist;

    this.completionForm.alreadyPayed = data.formData.alreadyPayed;
    this.completionForm.isBlocked = data.isBlocked;
    console.log("OPTIONS: " + JSON.stringify(this.spendingCostsOptions));
    console.log({
      completionForm: JSON.parse(JSON.stringify(this.completionForm))
    });
    this.isCapital =
      this.completionForm.recordTypeDeveloperName !==
      monitoringFormTypes.COMPLETION_REQUEST_ACQUISITIONS_DEV_NAME;
  }

  getFormData() {
    obtainData({ formId: this.formId })
      .then((resp) => {
        this.fillForm(resp);
      })
      .catch((err) => console.error(err));
  }

  get steps() {
    return this.isCapital ? STEPS.capitalSteps : STEPS.acquisitionsSteps;
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
    if (!this.completionForm.isBlocked) {
      if (
        this.template
          .querySelector("c-completion-report-form-steps")
          .validateStage()
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
    if (!this.completionForm.isBlocked) {
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
    if (this.completionForm.isBlocked) {
      this[NavigationMixin.Navigate]({
        type: "standard__namedPage",
        attributes: {
          pageName: "home"
        }
      });
    } else {
      let sectionList = this.validateForm();
      if (sectionList.length > 0) {
        let stageWithErrors =
          Stages_error_message + " " + [...sectionList].join(", ");
        this.sendErrorMessageToFooter(stageWithErrors);
      } else {
        this.isDialogVisible = true;
      }
    }
  }

  validateForm() {
    let invalidSections = [];
    let validationMap = obtainValidationMap(this.isCapital);
    validationMap.forEach((element) => {
      if (
        element.dependedField &&
        this.completionForm[element.dependedField] &&
        (this.completionForm[element.field] == null ||
          this.completionForm[element.field] === "" ||
          this.completionForm[element.field] === "undefined")
      ) {
        invalidSections.push(element.section);
      } else {
        if (element.isList) {
          if (
            ((element.dependedField &&
              this.completionForm[element.dependedField]) ||
              !element.dependedField) &&
            this.completionForm[element.field]
          ) {
            this.completionForm[element.field].forEach((child) => {
              element.fieldsToCheck.forEach((fieldToCheck) => {
                if (
                  child[fieldToCheck] == null ||
                  child[fieldToCheck] === "" ||
                  child[fieldToCheck] === "undefined"
                ) {
                  invalidSections.push(element.section);
                }
              });
            });
          }
        } else {
          if (
            !element.dependedField &&
            (this.completionForm[element.field] == null ||
              this.completionForm[element.field] === "" ||
              this.completionForm[element.field] === "undefined")
          ) {
            invalidSections.push(element.section);
          }
        }
      }
    });
    invalidSections = [...new Set(invalidSections)];
    return invalidSections;
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
              .querySelector("c-completion-report-form-steps")
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
  cloneObjectFunction = (item) => {
    return { ...item };
  };

  handleFormChanges(event) {
    const changes = event.detail;
    // let completionFormTemp = JSON.parse(JSON.stringify(this.completionForm));
    let completionFormTemp = { ...this.completionForm };
    completionFormTemp.projectIncomes &&
      (completionFormTemp.projectIncomes = completionFormTemp.projectIncomes.map(
        this.cloneObjectFunction
      ));

    switch (changes.typeChanges) {
      case "own":
        completionFormTemp[changes.field] = changes.value;
        break;
      case "projectIncomes":
        let projectIncomes = completionFormTemp.projectIncomes.map((el) => ({
          ...el,
          ...(el.id === changes.id && { [changes.field]: changes.value })
        }));
        completionFormTemp.projectIncomes = projectIncomes;
        break;
      case "approvedPurposes":
        let approvedPurposes = completionFormTemp.approvedPurposes.map(
          (el) => ({
            ...el,
            ...(el.id === changes.id && { [changes.field]: changes.value })
          })
        );
        completionFormTemp.approvedPurposes = approvedPurposes;
        break;
      case "addfunding":
        if (
          !completionFormTemp.projectIncomes ||
          completionFormTemp.projectIncomes.length == 0
        ) {
          completionFormTemp.projectIncomes = [{}];
        }
        if (
          typeof completionFormTemp.projectIncomes[changes.value.index] ===
          "undefined"
        ) {
          completionFormTemp.projectIncomes[changes.value.index] = {};
        }
        for (var key in changes.value) {
          completionFormTemp.projectIncomes[changes.value.index][key] =
            changes.value[key];
        }
        break;
      case "deletefunding":
        if (
          completionFormTemp.projectIncomes &&
          completionFormTemp.projectIncomes[changes.id]
        ) {
          if (completionFormTemp.projectIncomes[changes.id].id) {
            this.projectsIncomeToDeleteIds.push(
              completionFormTemp.projectIncomes[changes.id].id
            );
          }
          completionFormTemp.projectIncomes.splice(changes.id, 1);
          completionFormTemp.projectIncomes.forEach(
            (element, index) => (element.index = index)
          );
        }

        break;
      case "funding":
        if (
          completionFormTemp.projectIncomes &&
          completionFormTemp.projectIncomes[changes.id]
        ) {
          completionFormTemp.projectIncomes[changes.id][changes.field] =
            changes.value;
        }
        break;
      default:
        break;
    }
    this.completionForm = completionFormTemp;
    this.template
      .querySelector("c-completion-report-form-steps")
      .checkValue(this.completionForm);
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
    if (!this.completionForm.isBlocked) {
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
  }

  updateFormData() {
    this.isLoading = true;

    return updateData({
      formToUpdateJSON: JSON.stringify(
        transformReverseForm(this.completionForm).formObject
      ),
      spendingCostsJSON: JSON.stringify(
        transformReverseForm(this.completionForm).spendingCostsObject
      )
    })
      .then((resp) => {
        console.log({ resp });
        const caseData = {
          caseId: this.completionForm.caseId,
          totalCosts: this.completionForm.totalCosts,
          paymentPercentage: this.completionForm.paymentPercentage
        };
        const tempDocsData = this.completionForm.docsData;
        const currentRecordType = this.completionForm.recordTypeDeveloperName;
        this.completionForm = transformRefreshedForm(
          resp.form,
          caseData,
          resp.spendingCosts,
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
      formType: "PermissionFormAcquisition"
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

  submitAction(isFinished, actionAfterSubmit) {
    this.isLoading = true;

    return updateData(this.requestPayload(isFinished))
      .then((resp) => {
        console.log({ resp });
        if (resp.projectIncomes) {
          this.completionForm.projectIncomes = transformProjectIncomesArray(
            resp.projectIncomes
          );
        }
        if (resp.spendingCosts) {
          this.completionForm.spendingCosts = transformSpendingCosts(
            resp.spendingCosts
          );
        }
        this.deleteRecords();
        //this.fillFormData(this.completionForm, resp);
        if (actionAfterSubmit) {
          actionAfterSubmit();
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        this.isLoading = false;
      });
  }

  deleteRecords() {
    if (
      this.projectsIncomeToDeleteIds &&
      this.projectsIncomeToDeleteIds.length > 0
    ) {
      const promises = this.projectsIncomeToDeleteIds.map((recordInput) =>
        deleteRecord(recordInput)
      );
      Promise.all(promises)
        .then((result) => {
          // Clear all draft values
          this.projectsIncomeToDeleteIds = [];

          // Display fresh data in the datatable
          return;
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
        });
    }
  }

  requestPayload(isFinished) {
    let transformReverseFormObject = transformReverseForm(this.completionForm);
    if (isFinished) {
      transformReverseFormObject.formObject.Status__c = "Submitted";
    }
    return {
      request: {
        formObject: {
          Form__c: transformReverseFormObject.formObject
            ? JSON.stringify(transformReverseFormObject.formObject)
            : null
        },
        approvedPurposes: {
          "List<Approved__c>": transformReverseFormObject.approvedPurposes
            ? JSON.stringify(transformReverseFormObject.approvedPurposes)
            : "[]"
        },
        projectIncomes: {
          "List<Project_Income__c>": transformReverseFormObject.projectIncomes
            ? JSON.stringify(transformReverseFormObject.projectIncomes)
            : "[]"
        },
        spendingCosts: {
          "List<Project_cost__c>": transformReverseFormObject.spendingCosts
            ? JSON.stringify(transformReverseFormObject.spendingCosts)
            : "[]"
        }
      }
    };
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }

  spendingCostChangesHandler(e) {
    let requestData = e.detail;
    if (requestData.isDeleted) {
      this.projectsIncomeToDeleteIds.push(requestData.toDeleteIdList);
      this.projectsIncomeToDeleteIds = [
        ...new Set(this.projectsIncomeToDeleteIds)
      ];
    } else {
      this.completionForm.spendingCosts = requestData.newData;
    }
  }
}