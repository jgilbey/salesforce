import { LightningElement, api } from 'lwc';

export default class ProjectCostsFormTotals extends LightningElement {

    @api project;
    visible = true;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;

    get projectMinusVAT(){//todo change
        if(this.nhmfGrant)
        {
            console.log('Total_amount_cost__c', this.project.Total_amount_cost__c);
            
            console.log('Total_project_VAT__c', this.project.Total_project_VAT__c);
            return parseInt(this.project.Total_amount_cost__c) - parseInt(this.project.Total_project_VAT__c);
        }
        else{
            return parseInt(this.project.Total_Cost__c) - parseInt(this.project.Total_project_VAT__c);
        }
    }



}