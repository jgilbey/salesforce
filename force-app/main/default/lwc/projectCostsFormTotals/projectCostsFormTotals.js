import { LightningElement, api } from 'lwc';

export default class ProjectCostsFormTotals extends LightningElement {

    @api project;
    visible = true;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;

    get projectPlusVAT(){
        return parseInt(this.project.Total_project_VAT__c) + parseInt(this.project.Total_Cost__c);
    }



}