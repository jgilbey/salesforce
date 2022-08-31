import { LightningElement, api } from "lwc";

export default class MonitoringPageCase extends LightningElement {
  @api caseObject = {};
  @api preselectedCase = '';

  get caseClass(){
    return this.caseObject.selected ? "case__container selected" : "case__container";
  }
  renderedCallback(){
    sessionStorage.getItem('preselectedCase') == this.caseObject.Id && !this.caseObject.selected && 
      this.handleCaseClick();
  }
  handleCaseClick() {
    this.dispatchEvent(
        
      new CustomEvent("caseclick", {
        bubbles: true,
        composed: true,
        detail: {
          caseId: this.caseObject.Id
        }
      })
    );
  }
}