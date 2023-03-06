import { LightningElement, api } from 'lwc';

export default class ProjectBudgetLargeGrantSummary extends LightningElement {
    @api project;
    @api development;
    @api delivery;
}