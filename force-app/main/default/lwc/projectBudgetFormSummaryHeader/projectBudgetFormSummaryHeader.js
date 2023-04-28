import { LightningElement, api } from 'lwc';

export default class ProjectBugetFormSummaryHeader extends LightningElement {

    @api project;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;
    @api largeGrantDevelopment;
    @api largeGrantDelivery;
    @api variation;

    get headerTitle()
    {
        if(this.variation == 'Large_Development_Delivery')
        {
            return 'Potential Delivery Budget';
        }
        else if (this.largeGrantDevelopment == true)
        {
            return 'Development Budget';
        }
        else
        {
            return 'Project Budget';
        }
    }

    get variationIsDelivery()
    {
        if(this.variation == 'Large_Development_Delivery')
        {
            return true;
        }
    }
}