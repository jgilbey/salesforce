import { LightningElement, api } from 'lwc';

export default class ProjectBugetFormSummaryHeader extends LightningElement {

    @api project;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;
    @api largeGrant;
    @api variation;

    get headerTitle()
    {
        if(this.variation == 'Large_Development_Delivery')
        {
            return 'Potential Delivery Budget';
        }
        else if (this.largeGrant == true)
        {
            return 'Development Budget';
        }
        else
        {
            return 'Project Budget';
        }
    }
}