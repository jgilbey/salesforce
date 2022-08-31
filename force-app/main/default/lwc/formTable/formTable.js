import { LightningElement, track } from "lwc";
import obtainData from "@salesforce/apex/ApplicantFormController.obtainFormData";
import obtainAllForms from "@salesforce/apex/ApplicantFormController.obtainAllForms";
import createProjectEnquiry from "@salesforce/apex/ApplicantFormController.createProjectEnquiry";
import removeProjectEnquiry from "@salesforce/apex/ApplicantFormController.removeProjectEnquiry";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

//labels
import lableProjectButton from "@salesforce/label/c.New_project_button";
import labelProject_Number from "@salesforce/label/c.Project_Number";
import labelProject_Name from "@salesforce/label/c.Project_Name";
import enquiryStatus from "@salesforce/label/c.Enquiry_Status";
import applicationStatus from "@salesforce/label/c.Application_Status";
import labelView from "@salesforce/label/c.View";
import labelContinue from "@salesforce/label/c.Continue";
import applicationView from "@salesforce/label/c.View_Application_Label";
import projectEnquiry from "@salesforce/label/c.Project_Enquiry";
import application from "@salesforce/label/c.Application";

import Modal_Title from "@salesforce/label/c.Modal_Title"
import Modal_message from "@salesforce/label/c.Hame_Table_Modal_message"
import Modal_Yes from "@salesforce/label/c.Modal_Yes"
import Modal_No from "@salesforce/label/c.Modal_No"

export default class FormTable extends NavigationMixin(LightningElement) {
  @track projectList = [];
  @track blockProjectCreation = false;

  urlCreateProjectPage;
  urlContinuePage;
  fromPageUrl;
  newProjectId;
  @track isDialogVisible = false;
  projectIdToRemove;

  labels = {
    lableProjectButton,
    labelProject_Number,
    labelProject_Name,
    enquiryStatus,
    applicationStatus,
    labelView,
    labelContinue,
    applicationView,
    projectEnquiry,
    application,
    labelRemovePoject:"Remove",
    Modal_Title,
    Modal_message,
    Modal_Yes,
    Modal_No
  };
  connectedCallback() {
    this.retrieveData();
    this.initRedirectionUrl();
  }

  initRedirectionUrl() {
    this.urlCreateProjectPage = {
      type: "comm__namedPage",
      attributes: {
        name: "Form_Page__c"
      }
    };
    this.urlContinuePage = {
      type: "comm__namedPage",
      attributes: {
        name: "Form_Page__c"
      },
      state: {
        formId: ""
      }
    };

  }

  navigateToFormPage(formId) {
    this.urlContinuePage.state.formId = formId;
    this[NavigationMixin.Navigate](this.urlContinuePage);
  }

  retrieveData() {
    obtainAllForms()
      .then((response) => {
        console.log(JSON.stringify(response));
        this.projectList = this.projectDataFormatter(response);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  projectDataFormatter(projectsList) {
    projectsList.forEach(element => {
      element.projectButtonLabel = element.noContinued ? this.labels.labelView : this.labels.labelContinue;
      element.allowRemoving = element.Status == 'New';
      element.allowApplication = element.caseId != null;
    });
    return projectsList;
  }

  createProject() {
    createProjectEnquiry()
      .then((response) => {
        this.newProjectId = response;
        this.navigateToFormPage(this.newProjectId);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      }).finally(()=>{
        this.blockProjectCreation = false;
      });
  }


  deleteProject(projectId) {
    removeProjectEnquiry({porjectEnquiryId: projectId})
    .then(response=>{
      if(response.success) {
        this.retrieveData();
      } else {
        this.showToast('error', 'Removing failed', this.errorMessageHandler(response.message));
        console.log('Delete fail: ' + response.message);
      }
    })
    .catch(error=>{
      this.showToast('error', 'Removing failed', this.errorMessageHandler(JSON.stringify(error)));
      console.log(JSON.stringify(error));
    })
    .finally(()=>{
      this.isDialogVisible = false;
    });

  }
  // handlers functins --start
  continueProjectHandler(event) {
    this.navigateToFormPage(event.detail.id);
  }
  
  newProjectHandler(event) {
    this.blockProjectCreation = true;
    this.createProject();
  }
  
  removeProjectHandler() {
    this.deleteProject(this.projectIdToRemove);
  }

  openConfirmation(event) {
    this.projectIdToRemove = event.currentTarget.project.Id;//event.detail.id;
    this.isDialogVisible = true;
  }
  // handlers functins --end


  // handlers functins --start
  showToast(variant, title, message) {
    this.dispatchEvent(
      new ShowToastEvent({variant, title, message})
    );
  }
  
  handleDialogClick(event) {
    if (event.target.name === "confirmModal") {
        if (event.detail.status === "confirm") {
          this.removeProjectHandler();
        } else if(event.detail.status === "cancel") {
          this.isDialogVisible = false;
        }
    }
        
}
  
  // notification functions --end

  //error handler --start
  errorMessageHandler(errorMessage) {
    let newErrorMessage = errorMessage;
    if(errorMessage.includes('insufficient access rights')) {
      newErrorMessage = 'You don\'t have permission';
    }
    return newErrorMessage;
  }
  //error handler --end
}