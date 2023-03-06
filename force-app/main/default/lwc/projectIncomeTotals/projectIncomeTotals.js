import { LightningElement, api } from 'lwc';

export default class ProjectIncomeTotals extends LightningElement {

    @api mediumGrant;
    @api nhmfGrant;
    @api smallGrant;
    @api largeGrant;
    @api project;
    @api isDev;
    @api isDel;

}