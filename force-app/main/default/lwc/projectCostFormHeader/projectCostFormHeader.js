import removeProjectCost from '@salesforce/apex/ProjectCostFormController.removeProjectCost';
import { LightningElement, api } from 'lwc';

export default class ProjectCostFormHeader extends LightningElement {

    @api project;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;

}