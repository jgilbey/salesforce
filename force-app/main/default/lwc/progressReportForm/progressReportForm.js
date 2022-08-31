import { LightningElement, track, api } from "lwc";
import STEPS from "./imports/steps";
import LABELS from "./imports/labels";
import * as fieldMap from "./imports/sectionFieldMap";
import {
  transformForm,
  /* transformRefreshedForm, */ transformDocument,
  transformPartnershipArray,
  transformApprovedPurposesArray
} from "./maps/transformForm";
import {
  transformReverseForm,
  transformReverseApprovedList,
  transformReversePartnershipArray
} from "./maps/transformReverseForm";
import { deleteRecord } from "lightning/uiRecordApi";
import updateFormRecord from "@salesforce/apex/ApplicantFormController.updateFormRecord";
import upsertListRecords from "@salesforce/apex/ApplicantFormController.upsertListRecords";
import updateDocumentTitleWithPrefix from "@salesforce/apex/ApplicantFormController.updateDocumentTitleWithPrefix";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import utils from "c/utils";
export default class ProgressReportForm extends NavigationMixin(
  LightningElement
) {
  @api progressFormData = {};
  @track progressForm = {};
  @track formId;
  @track isLoading = false;
  // @track isBlocked = false;
  isSaving = false;
  selectedStepIndex = 0;
  isDialogVisible = false;
  isSubmittion = false;
  projectsIncomeToDeleteIds = [];
  sectionFieldMap = fieldMap.STAGE_FIELD_MAP;
  scrollTo = utils.scrollTo.bind(this);

  get labels() {
    return LABELS;
  }

  get submitButtonName() {
    let buttonName = this.labels.Submit;
    if (this.isBlocked) {
      buttonName = this.labels.Close;
    }
    return buttonName;
  }

  get isBlocked() {
    return this.progressFormData.isBlocked;
  }

  connectedCallback() {
    this.progressForm = transformForm(
      this.progressFormData.formData.formObject,
      this.progressFormData.formData.userData,
      this.progressFormData.formData.formDocuments,
      this.progressFormData.formData.approvedPurposeList,
      this.progressFormData.formData.projectIncomes
    );
    // this.isBlocked = this.progressForm.status == "Submitted";
    this.progressForm.projectIncomePicklist = this.progressFormData.formData.projectIncomePicklist;
    this.formId = this.progressForm.id;
    // this.progressForm.partnershipFunding && this.progressForm.partnershipFunding.forEach(
    //     (i, index) => i.index = index )
  }

  get steps() {
    return STEPS.progressSteps;
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

  changeFormHandler(event) {
    if (this.isBlocked) {
      return;
    }
    if (!event.detail.typeChanges) {
      let tempForm = { ...this.progressForm };
      tempForm[event.detail.field] = event.detail.value;
      this.progressForm = tempForm;
    } else {
      this.tableDataChange(event);
    }
  }

  cloneObjectFunction = (item) => {
    return { ...item };
  };

  tableDataChange(event) {
    const changes = event.detail;
    let tempForm = { ...this.progressForm };
    tempForm.partnershipFunding &&
      (tempForm.partnershipFunding = tempForm.partnershipFunding.map(
        this.cloneObjectFunction
      ));
    switch (changes.typeChanges) {
      case "addfunding":
        if (!tempForm.partnershipFunding) tempForm.partnershipFunding = [{}];
        tempForm.partnershipFunding[changes.value.index] = changes.value;

        for (var key in changes.value) {
          tempForm.partnershipFunding[changes.value.index][key] =
            changes.value[key];
        }
        break;
      case "deletefunding":
        if (
          tempForm.partnershipFunding &&
          tempForm.partnershipFunding[+changes.id]
        ) {
          if (tempForm.partnershipFunding[+changes.id].id) {
            this.projectsIncomeToDeleteIds.push(
              tempForm.partnershipFunding[+changes.id].id
            );
          }
          tempForm.partnershipFunding.splice(+changes.id, 1);
          tempForm.partnershipFunding.forEach((i, index) => (i.index = index));
        }

        break;
      case "funding":
        if (
          tempForm.partnershipFunding &&
          tempForm.partnershipFunding[+changes.id]
        ) {
          tempForm.partnershipFunding[+changes.id][changes.field] =
            changes.value;
        }
        break;
      case "approvedPurposes":
        let approvedPurposes = tempForm.approvedPurposes.map((el) => {
          let tempEl = { ...el };
          if (tempEl.id === changes.id) {
            tempEl[changes.field] = changes.value;
          }
          return tempEl;
        });
        tempForm.approvedPurposes = approvedPurposes;
        break;
      default:
        break;
    }
    this.progressForm = tempForm;
    this.template
      .querySelector("c-progress-report-form-steps")
      .checkValue(this.progressForm);
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

  handleNext() {
    if (
      this.template
        .querySelector("c-progress-report-form-steps")
        .validateStage()
    ) {
      if (this.selectedStepIndex < this.steps.length) {
        ++this.selectedStepIndex; // = this.selectedStepIndex + 1;
      }
      this.scrollTo(document.body);
      this.saveFormData();
    }
  }

  handlePrev() {
    /* if (
      this.template
        .querySelector("c-progress-report-form-steps")
        .validateStage()
    ) { */
    if (this.selectedStepIndex > 0) {
      --this.selectedStepIndex; // = this.selectedStepIndex - 1;
    }
    this.scrollTo(document.body);
    this.saveFormData();
    // }
  }
  @api
  handleSave() {
    this.isSaving = true;
    this.saveFormData();
  }

  handleFinish() {
    if(this.isBlocked) {
      this.navigateToMonitorings();
      return;
    }
    let Stages_error_message = "Not valid section: ";
    let errorSections = this.formDataValidation();
    if (Object.keys(errorSections).length == 0) {
      this.isDialogVisible = true;
    } else {
      this.sendErrorMessageToFooter(
        Stages_error_message + " " + Object.keys(errorSections).join(", ")
      );
    }
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

  saveFormData() {
    if (this.isBlocked) {
      return;
    }
    Promise.all([
      this.saveTablesData(
        JSON.stringify(
          transformReverseApprovedList(
            this.progressForm.approvedPurposes
              ? this.progressForm.approvedPurposes
              : [],
            this.progressForm.id
          )
        ),
        "approvedPurposes",
        transformApprovedPurposesArray
      ),
      this.saveTablesData(
        JSON.stringify(
          transformReversePartnershipArray(
            this.progressForm.partnershipFunding
              ? this.progressForm.partnershipFunding
              : [],
            this.progressForm
          )
        ),
        "partnershipFunding",
        transformPartnershipArray
      )
    ])
      .then((response) => {
        console.log("saved tabels");
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });

    updateFormRecord({
      formToUpdate: transformReverseForm(this.progressForm)
    })
      .then((reponse) => {
        if (this.isSubmittion) {
          this.showToast("", "Successful Submission", "success");
          this.navigateToMonitorings();
        }
        if (this.isSaving) {
          this.isSaving = false;
          this.showToast("", "Successful Saving", "success");
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });

    this.deleteRecords();
  }

  saveTablesData(tableDataJSON, listName, formatFunction) {
    upsertListRecords({
      recordListJSON: tableDataJSON
    })
      .then((result) => {
        this.progressForm[listName] = formatFunction(result);
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  submitForm() {
    if (this.isBlocked) {
      this.navigateToMonitorings();
    } else {
      this.progressForm.status = "Submitted";
      this.isSubmittion = true;
      this.saveFormData();
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
          let updatedDoc = response; //transformDocument(response);

          let newDocs = [...this.progressForm.docsData]
            .map(this.cloneObjectFunction)
            .concat(updatedDoc);
          // newDocs.push(transformDocument(updatedDoc));
          this.progressForm.docsData = newDocs;
          this.progressForm = { ...this.progressForm };
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
        this.progressForm.docsData = [...this.progressForm.docsData]
          .map(this.cloneObjectFunction)
          .filter((item) => {
            return item.Id != event.detail.rowId;
          });
        this.progressForm = { ...this.progressForm };
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  }

  formDataValidation() {
    let errorFieldsMap = {};
    this.sectionFieldMap.forEach((key, value, map) => {
      let fieldValue = this.progressForm[value];
      if (fieldValue == "" || fieldValue == undefined) {
        if (this.additionalDataValidation(value)) {
          if (errorFieldsMap[key] == undefined) {
            errorFieldsMap[key] = [];
          }

          errorFieldsMap[key].push(value);
        }
      }
    });
    return errorFieldsMap;
  }

  additionalDataValidation(value) {
    let result = true;
    if (
      (value == "statutoryPermissionsFurtherInfo" &&
        !this.progressForm.statutoryPermissionsRequired) ||
      (value == "purchasedGoodsDetails" &&
        !this.progressForm.havePurchasedGoods) ||
      (value == "explainVendorAppointed" && !this.progressForm.isVendorLinked)
    ) {
      result = false;
    }
    return result;
  }

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

  cloneObjectFunction = (item) => {
    return item;
  };

  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}