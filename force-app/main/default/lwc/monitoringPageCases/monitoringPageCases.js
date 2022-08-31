import { LightningElement, api } from "lwc";
import Projects from "@salesforce/label/c.Projects"

export default class MonitoringPageCases extends LightningElement {
  @api cases = [];
  @api preselectedCase = '';
  
  labels = {
    Projects
  }
  
  connectedCallback(){
  }
}