import removeProjectCost from '@salesforce/apex/ProjectCostFormController.removeProjectCost';
import { LightningElement, api } from 'lwc';

export default class ProjectCostFormHeader extends LightningElement {

    @api project;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;

    get grantPercentage(){
        if(this.project && this.project.Grant_requested__c && this.project.Total_Cost__c){
            return Math.round((this.project.Grant_requested__c/this.project.Total_Cost__c)*100);
        } else {
            return 0;
        }
    }

    get nhmfGrantPercentage(){
        if(this.project && this.project.NHMF_Grant_requested__c && this.project.NHMF_Total_Cost__c) {
            return Math.round((this.project.NHMF_Grant_requested__c/this.project.NHMF_Total_Cost__c))
        } else {
            return 0;
        }
    }

}