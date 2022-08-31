import { LightningElement, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import { transformData } from "./transformService/transformData";

import obtainMonitoringFormsData from "@salesforce/apex/ApplicantFormController.obtainMonitoringFormsData";

export default class MonitoringPage extends NavigationMixin(LightningElement) {
  @track cases = [];
  @track forms = [];
  preselectedCase = '';

  urlContinuePage = {
    type: "comm__namedPage",
    attributes: {
      name: "Form_Page__c"
    },
    state: {
      formId: ""
    }
  };

  connectedCallback() {
    this.getInitialData();
    this.preselectedCase = sessionStorage.getItem('preselectedCase') || '';
  }

  getInitialData() {
    obtainMonitoringFormsData().then((data) => {
      console.log({data});
      if (!data.length){
        return;
      }
      
      this.cases = transformData(data);

      if (this.cases.length > 0) {
        const caseId = this.cases[0].Id;
        this.selectCase({ caseId });
      }
    });
  }

  selectCase({ caseId }) {
    const selectedCase = this.cases.find((caseObj) => caseObj.Id === caseId);
    this.forms = selectedCase ? selectedCase.forms : [];

    this.cases = this.cases = this.cases.map((caseObj) => ({
      ...caseObj,
      selected: caseObj.Id === caseId
    }));
    this.preselectedCase = caseId;
  }

  handleCaseClick(event) {
    const caseId = event.detail.caseId;
    sessionStorage.setItem('preselectedCase', caseId);
    this.selectCase({ caseId });
  }

  handleOpenForm(event) {
    const formId = event.detail.formId;
    console.log({ formId });
    this.navigateToFormPage(formId);
  }

  navigateToFormPage(formId) {
    this.urlContinuePage.state.formId = formId;
    this[NavigationMixin.Navigate](this.urlContinuePage);
  }
}