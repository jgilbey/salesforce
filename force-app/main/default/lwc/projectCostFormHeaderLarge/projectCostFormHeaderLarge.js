import { LightningElement, api } from 'lwc';

export default class ProjectCostFormHeaderLarge extends LightningElement {

    @api project;
    @api development;
    @api delivery;

}