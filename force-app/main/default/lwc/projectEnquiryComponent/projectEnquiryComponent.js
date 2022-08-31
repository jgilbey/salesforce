/**
 * @description       : Project enquiry wrapper component.
 *                      Implement all logic for project enquiry form
 * @author            : Methods
 * @group             :
 * @last modified on  : 01-18-2021
 * @last modified by  : Methods
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   01-18-2021   Methods   Initial Version
 **/
import { LightningElement, api, track } from "lwc";
import submitProjectEnquiry from "@salesforce/apex/ApplicantFormController.submitProjectEnquiry";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

import utils from "c/utils";

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
import Step from "@salesforce/label/c.Step";
import Stages_error_message from "@salesforce/label/c.Stages_error_message";

export default class ProjectEnquiryComponent extends NavigationMixin(
  LightningElement
) {
  @api
  projectEnquiryForm;

  @track isLoading = false;

  get submitButtonName() {
    let buttonName = Submit;
    if (this.projectEnquiryForm.isBlocked) {
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
    Step
  };
  steps = [
    { label: "1", value: "step-1" },
    { label: "2", value: "step-2" },
    { label: "3", value: "step-3" },
    { label: "4", value: "step-4" }
  ];

  handleNext() {
    if (!this.projectEnquiryForm.isBlocked) {
      if (
        this.template.querySelector("c-project-enquiry-stages").validateStage()
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
    let index = this.steps.map((e) => e.value).indexOf(this.selectedStepString);
    if (index !== 3) {
      index += 1;
      this.selectedStepString = this.steps[index].value;
    }
    utils.scrollTo(document.body);
  }
  handlePrev() {
    if (!this.projectEnquiryForm.isBlocked) {
      this.submitAction(false, () => {
        this.prevAction();
      });
    } else {
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
    utils.scrollTo(document.body);
  }
  handleFinish() {
    if (this.projectEnquiryForm.isBlocked) {
      this[NavigationMixin.Navigate]({
        type: "standard__namedPage",
        attributes: {
          pageName: "home"
        }
      });
    } else {
      let errorsFieldMap = this.template
        .querySelector("c-project-enquiry-stages")
        .validateData();
      if (JSON.stringify(errorsFieldMap) === JSON.stringify({})) {
        this.validateProject() === true
          ? (this.isDialogVisible = true)
          : this.showToast(
              this.labels.Not_all_fields_are_filling,
              this.labels.Could_you_please_review_all_fields,
              "error"
            );
      } else {
        let stageWithErrors =
          Stages_error_message + " " + Object.keys(errorsFieldMap).join(", ");
        this.sendErrorMessageToFooter(stageWithErrors);
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
          this.submitAction(true, () => {
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
    console.log(event.detail);
    this.selectedStepString = this.steps[event.detail].value;
  }
  @api
  handleSave() {
    this.submitAction(false, () => {
      this.showToast(this.labels.Success, this.labels.Saved, "success");
    });
  }

  validateProject() {
    let textFieldsToCheckList = [
      "Project_Title__c",
      "Where_did_you_hear_about_us__c",
      "What_is_your_project__c",
      "About_Project_Focus__c",
      "Importance_to_the_national_heritage__c",
      "Outstanding_interest__c",
      "How_much_project_will_likely_cost__c",
      "How_will_you_provide_care_for_Heritage__c",
      "Financial_need__c",
      "Does_project_have_public_access__c"
    ];
    let numberFieldsToCheck = ["Likely_Requested_Amount__c"];
    let projectEnquiry = this.projectEnquiryForm.projectEnquiry;
    let isValid = true;
    textFieldsToCheckList.some((field) => {
      if (this.isBlank(projectEnquiry[field])) {
        isValid = false;
      }
      return !isValid;
    });
    if (isValid) {
      numberFieldsToCheck.some((field) => {
        if (!this.isNumeric(projectEnquiry[field])) {
          isValid = false;
        }
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

  sendErrorMessageToFooter(errorMessage) {
    let footerComponent = this.template.querySelector("c-form-footer");
    if (footerComponent) {
      footerComponent.errorMessage = errorMessage;
    }
  }

  submitAction(isFinished, actionAfterSubmit) {
    this.isLoading = true;
    submitProjectEnquiry({
      projectEnquiry: this.projectEnquiryForm.projectEnquiry,
      isFinish: isFinished
    })
      .then(() => {
        if (actionAfterSubmit) {
          actionAfterSubmit();
        }
      })
      .catch((e) => {
        this.handlerError(e);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  handlerError(e) {
    if (e && e.body) {
      if (e.body.fieldErrors) {
        Object.keys(e.body.fieldErrors).forEach((key_i) => {
          this.template
            .querySelector("c-project-enquiry-stages")
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
}