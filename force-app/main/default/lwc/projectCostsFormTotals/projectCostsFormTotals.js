import { LightningElement, api } from 'lwc';

export default class ProjectCostsFormTotals extends LightningElement {

    @api project;
    visible = true;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;
    @api largeGrant;


}