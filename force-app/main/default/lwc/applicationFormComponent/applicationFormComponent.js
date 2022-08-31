import { LightningElement, api, track } from "lwc";
import submitApplicationForm from "@salesforce/apex/ApplicantFormController.submitApplicationForm";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

import Your_Project from "@salesforce/label/c.Your_Project";
import Our_Standards_For_Funding from "@salesforce/label/c.Our_Standards_For_Funding";
import Project_Costs from "@salesforce/label/c.Project_Costs";
import Public_Access from "@salesforce/label/c.Public_Access";
import Not_all_fields_are_filling from "@salesforce/label/c.Not_all_fields_are_filling";
import Could_you_please_review_all_fields from "@salesforce/label/c.Could_you_please_review_all_fields";
import Success from "@salesforce/label/c.Success";
import Your_request_was_successfully_sent from "@salesforce/label/c.Your_request_was_successfully_sent";
import Error from "@salesforce/label/c.Error";
import Some_problem_with_request from "@salesforce/label/c.Some_problem_with_request";
import Saved from "@salesforce/label/c.Saved";
import Submit from "@salesforce/label/c.Submit";
import Close from "@salesforce/label/c.Close";
import Confirmation_Title from "@salesforce/label/c.Confirmation_Title";
import Do_you_want_to_submit from "@salesforce/label/c.Do_you_want_to_submit";
import Yes from "@salesforce/label/c.Yes";
import No from "@salesforce/label/c.No";
import Intro from "@salesforce/label/c.Intro";
import Stages_error_message from "@salesforce/label/c.Stages_error_message";

import utils from "c/utils";

export default class ApplicationFormComponent extends NavigationMixin(
  LightningElement
) {
  @api
  applicationFormObject;

  @api
  caseRtId;

  @api
  costRtId;

  @api
  incomeRtId;

  @track isLoading = false;

  scrollTo = utils.scrollTo.bind(this);

  get submitButtonName() {
    let buttonName = Submit;
    if (this.applicationFormObject.isBlocked) {
      buttonName = Close;
    }
    return buttonName;
  }

  selectedStepString = "step-0";
  isNonProfit = true;
  options = [];
  isDialogVisible = false;
  labels = {
    Your_Project,
    Our_Standards_For_Funding,
    Project_Costs,
    Public_Access,
    Not_all_fields_are_filling,
    Could_you_please_review_all_fields,
    Success,
    Your_request_was_successfully_sent,
    Error,
    Some_problem_with_request,
    Saved,
    Confirmation_Title,
    Do_you_want_to_submit,
    Yes,
    No,
    Intro
  };
  steps = [
    { label: this.labels.Intro, value: "step-0" },
    { label: "1", value: "step-1" },
    { label: "2", value: "step-2" },
    { label: "3", value: "step-3" },
    { label: "4", value: "step-4" },
    { label: "5", value: "step-5" },
    { label: "6", value: "step-6" },
    { label: "7", value: "step-7" },
    { label: "8", value: "step-8" }
  ];

  connectedCallback() {
    console.log("LOADED: " + this.caseRtId);
  }

  handleNext() {
    if (!this.applicationFormObject.isBlocked) {
      if (
        this.template.querySelector("c-application-form-stages").validateStage()
      ) {
        this.submitAction(false, true, () => {
          this.nextAction();
        });
      }
    } else {
      this.nextAction();
    }
  }
  nextAction() {
    let index = this.steps.map((e) => e.value).indexOf(this.selectedStepString);

    if (index !== 8) {
      index += 1;
      this.selectedStepString = this.steps[index].value;
    }
    this.scrollTo(document.body);

    this.dispatchEvent(
      new CustomEvent("relateddataupdate", {
        bubbles: true,
        composed: true
      })
    );
  }
  handlePrev() {
    if (!this.applicationFormObject.isBlocked) {
      this.submitAction(false, true, () => {
        this.prevAction();
      });
    }else {
      this.prevAction();
    }
  }
  prevAction() {
    let index = this.steps.map((e) => e.value).indexOf(this.selectedStepString);
    if (index === 0) {
      this.selectedStepString = "step-0";
    } else if (index !== -1) {
      index -= 1;
      this.selectedStepString = this.steps[index].value;
    }
    this.scrollTo(document.body);
    this.dispatchEvent(
      new CustomEvent("relateddataupdate", {
        bubbles: true,
        composed: true
      })
    );
  }
  handleFinish() {
    if (this.applicationFormObject.isBlocked) {
      this[NavigationMixin.Navigate]({
        type: "standard__namedPage",
        attributes: {
          pageName: "home"
        }
      });
    } else {
      let errorsFieldMap = this.template
        .querySelector("c-application-form-stages")
        .validateData();
      if (JSON.stringify(errorsFieldMap) === JSON.stringify({})) {
        /* this.validateProject() */ true
          ? (this.isDialogVisible = true)
          : this.showToast(
              this.labels.Not_all_fields_are_filling,
              this.labels.Could_you_please_review_all_fields,
              "error"
            );
        /*  if (this.validateProject()) {
          this.isDialogVisible = true;
        } else {
          this.showToast(
            this.labels.Not_all_fields_are_filling,
            this.labels.Could_you_please_review_all_fields,
            "error"
          );
        } */
      } else {
        let stageWithErrors =
          Stages_error_message + " " + Object.keys(errorsFieldMap).join(", ");
        this.sendErrorMessageToFooter(stageWithErrors);
        /*  this.showToast(
          this.labels.Not_all_fields_are_filling,
          "Not filed stages: "+Object.keys(errorsFieldMap),
          "error"
        ); */
      }
    }
  }
  get isLast() {
    return this.selectedStepString === this.steps[this.steps.length - 1].value;
  }
  get isFirst() {
    return this.selectedStepString === "step-0";
  }
  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }

  sendErrorMessageToFooter(errorMessage) {
    let footerComponent = this.template.querySelector("c-form-footer");
    if (footerComponent) {
      footerComponent.errorMessage = errorMessage;
    }
  }

  handleDialogClick(event) {
    if (event.target.name === "openConfirmation") {
      //it can be set dynamically based on your logic
      this.originalMessage = "test message";
      //shows the component
      this.isDialogVisible = true;
    } else if (event.target.name === "confirmModal") {
      //when user clicks outside of the dialog area, the event is dispatched with detail value  as 1
      if (event.detail !== 1) {
        //gets the detail message published by the child component
        this.displayMessage =
          "Status: " +
          event.detail.status +
          ". Event detail: " +
          JSON.stringify(event.detail.originalMessage) +
          ".";

        //you can do some custom logic here based on your scenario
        if (event.detail.status === "confirm") {
          this.submitAction(true, true, () => {
            this.showToast(
              this.labels.Success,
              this.labels.Your_request_was_successfully_sent,
              "success"
            );
            this[NavigationMixin.Navigate]({
              type: "standard__namedPage",
              attributes: {
                pageName: "home"
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
          //do something else
        }
      }

      //hides the component
      this.isDialogVisible = false;
    }
  }

  handleChangestep(event) {
    this.selectedStepString = this.steps[event.detail].value;
  }
  @api
  handleSave() {
    /* if (
      this.template.querySelector("c-application-form-stages").validateStage()
    ) { */
    this.submitAction(false, true, () => {
      this.showToast(this.labels.Success, this.labels.Saved, "success");
      this.dispatchEvent(
        new CustomEvent("relateddataupdate", {
          bubbles: true,
          composed: true
        })
      );
    });
  }

  @api
  handleDocsRefreshData() {
    this.template.querySelector("c-application-form-stages").refreshDocsData();
  }

  @api
  handleDocsSaveData() {
    this.submitAction(false, false, () => {
      this.dispatchEvent(
        new CustomEvent("relateddataupdate", {
          bubbles: true,
          composed: true
        })
      );
      this.handleDocsRefreshData();
    });
  }

  collectInitialRelatedObjIds(objectData) {
    let initDataIds = [];
    objectData.forEach((el) => {
      initDataIds.push(el.Id);
    });
    return initDataIds;
  }

  validateProject() {
    let textFieldsToCheckList = [
      "Project_Title__c",
      "Organisation_s_Main_Purpose_Activities__c",
      "Organisation_s_Legal_Status__c",
      "Do_you_want_a_grant_to_buy_Property__c",
      "Information_about_the_value_of_property__c",
      "Capital_work_owner__c",
      "Item_of_importance_to_national_heritage__c",
      "Property_item_of_outstanding_interest__c",
      "Property_Details__c",
      "Details_for_risk_of_item_or_property__c",
      "Details_of_providing_care_for_property__c",
      "Other_measures_to_raise_funds__c",
      "Public_access_to__c"
    ];
    let numberFieldsToCheck = ["Number_Of_Board_members_or_Trustees__c"];
    let projectCase = this.applicationFormObject.projectCase;
    let account = this.applicationFormObject.projectCase.Account;
    let isValid = true;
    textFieldsToCheckList.some((field) => {
      if (this.isBlank(projectCase[field]) && this.isBlank(account[field])) {
        isValid = false;
      }
      //console.log('TEXT ERR: ', field + ' : ' + isValid + ' : ' +  projectCase[field] );

      return !isValid;
    });
    if (isValid) {
      numberFieldsToCheck.some((field) => {
        if (
          !this.isNumeric(projectCase[field]) &&
          !this.isNumeric(account[field]) &&
          (!this.isBlank(projectCase[field]) || !this.isBlank(account[field]))
        ) {
          isValid = false;
        }
        //console.log('Number ERR: ', field + ' : ' + isValid + ' : ' +  projectCase[field] );

        return !isValid;
      });
    }
    return isValid;
  }

  isBlank(str) {
    return !str || /^\s*$/.test(str);
  }
  isNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  handleError(e) {
    if (e && e.body) {
      if (e.body.fieldErrors) {
        Object.keys(e.body.fieldErrors).forEach((key_i) => {
          this.template
            .querySelector("c-application-form-stages")
            .showInputError(key_i, e.body.fieldErrors[key_i][0].message);
        });
      }
    }
    this.showToast(
      this.labels.Error,
      this.labels.Some_problem_with_request,
      "error"
    );
  }
  submitAction(isFinished, isNotDocs, actionAfterSubmit) {
    this.isLoading = true;
    submitApplicationForm(this.obtainSubmitPayload(isFinished, isNotDocs))
      .then(() => {
        if (actionAfterSubmit) {
          actionAfterSubmit();
        }
      })
      .catch((e) => {
        this.handleError(e);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  obtainSubmitPayload(isFinished, isNotDocs) {
    let submitPayload = {
      applicationRequestDataJSON: "{}",
      isFinish: isFinished
    };
    let applicationRequestData = {
      projectCase: {},
      projectCosts: [],
      projectIncomes: [],
      initialProjectCostIds: [],
      initialProjectIncomeIds: [],
      projectPartners: [],
      currentProjectRisks: [],
      futureProjectRisks: [],
      initialPartnerIds: [],
      initialRiskIds: [],
      documentsData: []
    };
    applicationRequestData.projectCase = this.applicationFormObject.projectCase;
    applicationRequestData.documentsData = this.applicationFormObject.projectDocuments;
    if (isNotDocs) {
      applicationRequestData.projectCosts = this.applicationFormObject.projectCosts;
      applicationRequestData.projectIncomes = this.applicationFormObject.projectIncomes;
      applicationRequestData.initialProjectCostIds = this.applicationFormObject
        .projectCase.Project_Costs__r
        ? this.collectInitialRelatedObjIds(
            this.applicationFormObject.projectCase.Project_Costs__r
          )
        : [];
      applicationRequestData.initialProjectIncomeIds = this
        .applicationFormObject.projectCase.Project_Incomes__r
        ? this.collectInitialRelatedObjIds(
            this.applicationFormObject.projectCase.Project_Incomes__r
          )
        : [];
      applicationRequestData.projectPartners = this.applicationFormObject.projectPartners;
      applicationRequestData.currentProjectRisks = this.applicationFormObject.currentProjectRisks;
      applicationRequestData.futureProjectRisks = this.applicationFormObject.futureProjectRisks;
      applicationRequestData.initialPartnerIds = this.applicationFormObject
        .projectCase.Project_Partners__r
        ? this.collectInitialRelatedObjIds(
            this.applicationFormObject.projectCase.Project_Partners__r
          )
        : [];
      applicationRequestData.initialRiskIds = this.applicationFormObject
        .projectCase.Project_Risks__r
        ? this.collectInitialRelatedObjIds(
            this.applicationFormObject.projectCase.Project_Risks__r
          )
        : [];
    }
    submitPayload.applicationRequestData = applicationRequestData; //JSON.stringify(applicationRequestData);

    return submitPayload;
  }
}