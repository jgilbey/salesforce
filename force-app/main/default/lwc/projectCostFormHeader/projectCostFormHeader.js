import { LightningElement, api } from 'lwc';

export default class ProjectCostFormHeader extends LightningElement {

    @api project;

    get grantPercentage(){
        if(this.project){
            return Math.round((this.project.Grant_requested__c/this.project.Total_Cost__c)*100);
        } else {
            return 0;
        }
    }

}