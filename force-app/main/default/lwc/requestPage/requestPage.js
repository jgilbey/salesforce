import { LightningElement, api, wire, track } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import obtainFormData from "@salesforce/apex/ApplicantFormController.obtainFormData";
import obtainDocumentList from "@salesforce/apex/ApplicantFormController.obtainDocumentList";
import obtainRecordTypesIds from "@salesforce/apex/ApplicantFormController.obtainNHMFRecordTypeIds";
import mainPage from "./requestPage.html";
import applicationFormPage from "./applicationFormPage.html";
import permissionFormPage from "./permissionFormPage.html";
import projectEnquiryPage from "./projectEnquiryPage.html";
import completionReportFormPage from "./completionReportFormPage.html";
import progressReportFormPage from "./progressReportFormPage.html";
import paymentReportFormPage from "./paymentRequestFormPage.html";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import Exit_button from "@salesforce/label/c.Exit_button";
import Error from "@salesforce/label/c.Error";
import Some_problem_with_request from "@salesforce/label/c.Some_problem_with_request";
import Save from "@salesforce/label/c.Save";

export default class RequestPage extends NavigationMixin(LightningElement) {
  currentPageReference = null;
  formType;
  _formId;
  caseRtId;
  costRtId;
  incomeRtId;

  @track formObject = {
    formType: "",
    projectEnquiry: {},
    isBlocked: false
  };

  label = {
    Exit_button,
    Save
  };

  @wire(CurrentPageReference)
  getStateParameters(currentPageReference) {
    if (currentPageReference) {
      this._formId = currentPageReference && currentPageReference.state.formId;
      if (this._formId) {
        obtainFormData({ formId: this._formId })
          .then((result) => {
            if (result) {
              this.formObject = { ...result };
            }
          })
          .catch((e) => {
            const event = new ShowToastEvent({
              title: Error,
              message: Some_problem_with_request,
              variant: "error"
            });
            this.dispatchEvent(event);
            this.navigateToHomePage();
          });
        obtainRecordTypesIds()
          .then((data) => {
            //console.log('GET DATA ON Request: '+ JSON.stringify(data));
            if (data) {
              this.caseRtId = data["Case"];
              this.costRtId = data["Project_cost__c"];
              this.incomeRtId = data["Project_Income__c"];
            }
          })
          .catch((e) => {
            console.log("ERR: ", e);
          });
      }
    }
  }

  async refreshRelatedData() {
    if (this._formId) {
      await obtainFormData({ formId: this._formId })
        .then((result) => {
          if (result) {
            this.formObject = { ...result };
          }
        })
        .then(() => {
          this.template
            .querySelector("c-application-form-component")
            .handleDocsRefreshData();
        })
        .catch((e) => {
          console.log("ERR: ", e);
        });
    }
  }

  render() {
    if (!this.formObject || !this.formObject.formType) {
      return mainPage;
    }

    switch (this.formObject.formType) {
      case "PE":
        return projectEnquiryPage;
      case "AC":
        return applicationFormPage;
      case "MF":
        return permissionFormPage;
      case "CR":
        return completionReportFormPage;
      case "PR":
        return progressReportFormPage;
      case "PRF":
        return paymentReportFormPage;
      default:
        return mainPage;
    }
  }

  handleFormChanges(event) {
    let changes = event.detail;
    if (changes.formType == "PE") {
      this.setToValue(
        this.formObject.projectEnquiry,
        changes.value,
        changes.fieldName
      );
      if (changes.fieldName == "Non_Profit__c" && changes.value == false) {
        this.setToValue(
          this.formObject.projectEnquiry,
          null,
          "Type_of_profit_organization__c"
        );
      }
      if (
        changes.fieldName == "Deadline_by_which_you_need_a_decision__c" &&
        changes.value == true
      ) {
        this.setToValue(
          this.formObject.projectEnquiry,
          null,
          "Deadline_details__c"
        );
      }
      //this.formObject.projectEnquiry[changes.fieldName] = changes.value;
    }
    if (changes.formType == "AC") {
      if (changes.costsData) {
        this.formObject.projectCosts = JSON.parse(
          JSON.stringify(changes.costsData)
        );
      } else if (changes.incomesData) {
        this.formObject.projectIncomes = JSON.parse(
          JSON.stringify(changes.incomesData)
        );
      } else if (changes.currentRisksData) {
        this.formObject.currentProjectRisks = JSON.parse(
          JSON.stringify(changes.currentRisksData)
        );
      } else if (changes.futureRisksData) {
        this.formObject.futureProjectRisks = JSON.parse(
          JSON.stringify(changes.futureRisksData)
        );
      } else if (changes.partnersData) {
        this.formObject.projectPartners = JSON.parse(
          JSON.stringify(changes.partnersData)
        );
      } else if (changes.documentsData) {
        this.formObject.projectDocuments = JSON.parse(
          JSON.stringify(changes.documentsData)
        );
        this.template
          .querySelector("c-application-form-component")
          .handleDocsSaveData();
      } else {
        this.setToValue(
          this.formObject.projectCase,
          changes.value,
          changes.fieldName
        );

        if (
          changes.fieldName == "Is_Project_organisation_address_same__c" &&
          changes.value === false
        ) {
          this.setToValue(
            this.formObject.projectCase,
            "",
            "Project_Street__c"
          );
          this.setToValue(
            this.formObject.projectCase,
            "",
            "Project_City__c"
          );
          this.setToValue(
            this.formObject.projectCase,
            "",
            "Project_County__c"
          );
          this.setToValue(
            this.formObject.projectCase,
            "",
            "Project_Post_Code__c"
          );
        }
      }
    }
  }

  handleFilesuploaded(event) {
    let changes = event.detail;
    if (changes.isOnCase) {
      this.refreshRelatedData();
    } else {
      if (changes.isNew) {
        obtainDocumentList({ entityId: this.formObject.projectEnquiry.Id })
          .then((data) => {
            this.formObject.documentList = data;
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.formObject.documentList = this.formObject.documentList.filter(
          function (obj) {
            return obj.Id !== changes.Id;
          }
        );
      }
    }
  }
  setToValue(obj, value, path) {
    var i;
    path = path.split(".");
    for (i = 0; i < path.length - 1; i++) obj = obj[path[i]];

    obj[path[i]] = value;
  }

  @api get formId() {
    return this._formId;
  }
  set getformId(value) {
    this._formId = value;
  }

  navigateToHomePage() {
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    });
  }

  navigateToMonitoringPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "Monitoring"
      }
    });
  }

  saveForm(){
    let components = [...this.template.querySelectorAll('[data-type="form"]')];
    if(components){
      components[0].handleSave();
    }
  }
}