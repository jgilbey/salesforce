import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { refreshApex } from '@salesforce/apex';

import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getRecordTypeMappings from '@salesforce/apex/ProjectCostFormController.getRecordTypeMapping';

import getProjectCosts from '@salesforce/apex/ProjectCostFormController.getProjectCosts';
import saveCosts from '@salesforce/apex/ProjectCostFormController.saveCosts';
import deleteCosts from '@salesforce/apex/ProjectCostFormController.deleteCosts';

import getCashContributions from '@salesforce/apex/ProjectCostFormController.getCashContributions';
import saveCashContributions from '@salesforce/apex/ProjectCostFormController.saveCashContributions';
import deleteCashContributions from '@salesforce/apex/ProjectCostFormController.deleteCash';

import SAVE_SUCCESSFUL from '@salesforce/label/c.Budget_Management_Save';
import Saved from "@salesforce/label/c.Saved";
import Success from "@salesforce/label/c.Success";
import Error from "@salesforce/label/c.Error";

import COST_HEADING from "@salesforce/schema/Project_Cost__c.Cost_heading__c";
import PROJECT_COST_OBJECT from "@salesforce/schema/Project_Cost__c";
import INCOME_SECURED from "@salesforce/schema/Project_Income__c.Secured_non_cash_contributions__c";
import INCOME_FUNDING_SOURCE from "@salesforce/schema/Project_Income__c.Source_Of_Funding__c";
import PROJECT_INCOME_OBJECT from "@salesforce/schema/Project_Income__c";

var actions = [
    { label: 'Delete', name: 'delete', disabled: false }
];


/*const columns = [
    {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c', type: 'picklistColumn', 
        typeAttributes: 
        {
            placeholder: 'Cost Heading', options: { fieldName: 'costHeadingOptions' }, 
            value: { fieldName: 'Cost_heading__c' },
            context: { fieldName: 'Id' }
        }
    },
    {label: 'Project Description', editable: true, fieldName: 'Project_Cost_Description__c'},
    {label: 'Amount', editable: true, fieldName: 'Costs__c'},
    {label: 'VAT', editable: true, fieldName: 'VAT__C'},
    {label: 'Total Cost', editable: true, fieldName: ''},
];*/

export default class ProjectCostsForm2 extends LightningElement 
{
    columns;
    cashColumns;
    smallGrantProject = "Small_Grant_3_10k";
    mediumGrantProject = "Medium";
    nhmfGrantProject = "Memorial";
    largeGrantDevelopmentProject = "Large_Development_250_500k"
    largeGrantDeliveryProject = "Large"
    smallGrant = false;
    mediumGrant = false;
    largeGrant = false;
    nhmfGrant = false;
    showSpinner = false;

    @api recordId;
    @api objectApiName

    project;
    projectResult;
    projectRecordTypeDeveloperName;
    recordTypeMapping;

    projectCosts = [];
    costHeadingOptions;
    projectsCostsResult;
    costsDraftValues = [];
    costsRowsToDelete = [];

    projectCostsAmountTotal = 0;
    projectCostsVatTotal = 0;
    projectCostsTotal = 0;
    projectCostsTotalRow = [];

    securedOptions;
    fundingSourceOptions;
    cashContributions = [];
    cashContributionsResult;
    cashContributionsDraftValues = [];
    cashContributionRowsToDelete = [];

    cashContributionsAmountTotal = 0;
    cashContributionsTotalRow = [];

    /*get columns()
    {
        if (this.project && this.project.RecordType) 
        {console.log('JAG: ' + this.isEditable);
            switch (this.project.RecordType.DeveloperName) 
            {
                case this.smallGrantProject:
                    return this.smallCols;
                case this.mediumGrantProject:
                    return this.mediumColumns;
                case this.nhmfGrantProject:
                    return this.mediumColumns;
                case this.largeGrantDevelopmentProject:
                    return this.mediumColumns;
                case this.largeGrantDeliveryProject:
                    return this.mediumColumns;
            }
        }
    }*/

    get totalColumns()
    {
        if (this.project && this.project.RecordType) 
        {
            switch (this.project.RecordType.DeveloperName) 
            {
                case this.smallGrantProject:
                    return this.smallTotalCols;
                case this.mediumGrantProject:
                    return this.mediumTotalColumns;
                case this.nhmfGrantProject:
                    return this.mediumTotalColumns;
                case this.largeGrantDevelopmentProject:
                    return this.mediumTotalColumns;
                case this.largeGrantDeliveryProject:
                    return this.mediumTotalColumns;
            }
        }
    }

    /*get cashColumns()
    {
        if (this.project && this.project.RecordType) 
        {
            switch (this.project.RecordType.DeveloperName) 
            {
                case this.smallGrantProject:
                    return this.contributionColumns;
                case this.mediumGrantProject:
                    return this.contributionColumns;
                case this.nhmfGrantProject:
                    return this.nhmfContributionColumns;
                case this.largeGrantDevelopmentProject:
                    return this.contributionColumns;
                case this.largeGrantDeliveryProject:
                    return this.contributionColumns;
            }
        }
    }*/

    get totalCashColumns()
    {
        if (this.project && this.project.RecordType) 
        {
            switch (this.project.RecordType.DeveloperName) 
            {
                case this.smallGrantProject:
                    return this.totalContributionColumns;
                case this.mediumGrantProject:
                    return this.totalContributionColumns;
                case this.nhmfGrantProject:
                    return this.totalNhmfContributionColumns;
                case this.largeGrantDevelopmentProject:
                    return this.totalContributionColumns;
                case this.largeGrantDeliveryProject:
                    return this.totalContributionColumns;
            }
        }
    }

    smallCols = [
        {type: 'action',
            typeAttributes: 
            { 
                rowActions: actions, menuAlignment: 'left' 
            } 
        },
        {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c', type: 'picklistColumn', hideDefaultActions: true,
            typeAttributes: 
                {
                    placeholder: 'Cost Heading', options: { fieldName: 'costHeadingOptions' }, 
                    value: { fieldName: 'Cost_heading__c' },
                    context: { fieldName: 'Id' }
                }
        },
        {label: 'Description', editable: true, fieldName: 'Project_Cost_Description__c', type: 'textAreaColumn', hideDefaultActions: true,
            typeAttributes: 
                {
                    placeholder: 'description', 
                    value: { fieldName: 'Project_Cost_Description__c' },
                    context: { fieldName: 'Id' }
                }
        },
        {label: 'Amount', editable: true, fieldName: 'Costs__c', type: 'currency',cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true},
    ];


    smallTotalCols = [
        {label: 'firstCol', initialWidth: 52, editable: false, fieldName: 'firstCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'secondCol', initialWidth: 50, editable: false, fieldName: 'secondCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Cost Heading', editable: false, fieldName: 'costHeadingOptions', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Description', editable: false, fieldName: 'Project_Cost_Description__c', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
        cellAttributes:{
            class: 'slds-theme_shade', alignment: 'left'
        },}
    ];

    mediumColumns = [
        {type: 'action',
            typeAttributes: 
            { 
                rowActions: actions, menuAlignment: 'left' 
            } 
        },
        {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c', type: 'picklistColumn', hideDefaultActions: true,
            typeAttributes: 
                {
                    placeholder: 'Cost Heading', options: { fieldName: 'costHeadingOptions' }, 
                    value: { fieldName: 'Cost_heading__c' },
                    context: { fieldName: 'Id' }
                }
        },
        {label: 'Description', editable: true, fieldName: 'Project_Cost_Description__c', type: 'textAreaColumn', hideDefaultActions: true,
            typeAttributes: 
                {
                    placeholder: 'description', 
                    value: { fieldName: 'Project_Cost_Description__c' },
                    context: { fieldName: 'Id' }
                }
        },
        {label: 'Amount', editable: true, fieldName: 'Costs__c', type: 'currency', sortable: true, cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true},
        {label: 'VAT', editable: true, fieldName: 'Vat__c', type: 'currency', cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true},
        {label: 'Total Cost', editable: false, fieldName: 'Total_Cost__c', type: 'currency', cellAttributes: {alignment: 'left'}, hideDefaultActions: true}
        /*{type: "button", 
            typeAttributes: 
            {  
                label: 'Delete',  
                name: 'Delete',  
                title: 'Delete',  
                disabled: false,  
                value: 'Delete',  
                iconPosition: 'left'  
            }   
        },*/
    ];

    mediumTotalColumns = [

        {label: 'firstCol', initialWidth: 52, editable: false, fieldName: 'firstCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'secondCol', initialWidth: 50, editable: false, fieldName: 'secondCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Cost Heading', editable: false, fieldName: 'costHeadingOptions', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Description', editable: false, fieldName: 'Project_Cost_Description__c', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
        cellAttributes:{
            class: 'slds-theme_shade',alignment: 'left'
        },},
        {label: 'VAT Total', editable: false, fieldName: 'vattotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
        cellAttributes:{
            class: 'slds-theme_shade',alignment: 'left'
        },},
        {label: 'Total Cost Total', editable: false, fieldName: 'totalcosttotal', type: 'currency',
        cellAttributes:{
            class: 'slds-theme_shade',alignment: 'left'
        },}
    ];
    
    contributionColumns = [
        {type: 'action',
            typeAttributes: 
            { 
                rowActions: actions, menuAlignment: 'left' 
            } 
        },
        {label: 'Description', editable: true, fieldName: 'Description_for_cash_contributions__c', type: 'textAreaColumn',  hideDefaultActions: true,
            typeAttributes: 
                {
                    placeholder: 'description', 
                    value: { fieldName: 'Description_for_cash_contributions__c' },
                    context: { fieldName: 'Id' }
                }
        },
        {label: 'Secured', editable: true, fieldName: 'Secured_non_cash_contributions__c', type: 'picklistColumn', hideDefaultActions: true,
            typeAttributes: 
                {
                    options: { fieldName: 'securedOptions' }, 
                    value: { fieldName: 'Secured_non_cash_contributions__c' },
                    context: { fieldName: 'Id' }
                }
        },
        {label: 'Amount', editable: true, fieldName: 'Amount_you_have_received__c', type: 'currency', cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true}
        
    ];

    totalContributionColumns = [

        {label: 'firstCol', initialWidth: 52, editable: false, fieldName: 'firstCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'secondCol', initialWidth: 50, editable: false, fieldName: 'secondCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Description', editable: false, fieldName: 'Description_for_cash_contributions__c', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Secured', editable: false, fieldName: 'Secured_non_cash_contributions__c', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
        cellAttributes:{
            class: 'slds-theme_shade',alignment: 'left'
        },}
    ];

    nhmfContributionColumns = [
        {type: 'action',
            typeAttributes: 
            { 
                rowActions: actions, menuAlignment: 'left' 
            } 
        },
        {label: 'Source of Funding', editable: true, fieldName: 'Source_Of_Funding__c', type: 'picklistColumn', hideDefaultActions: true,
            typeAttributes: 
                {
                    options: { fieldName: 'fundingSourceOptions' }, 
                    value: { fieldName: 'Source_Of_Funding__c' },
                    context: { fieldName: 'Id' }
                }
        }, 
        {label: 'Description', editable: true, fieldName: 'Description_for_cash_contributions__c', type: 'textAreaColumn', hideDefaultActions: true,
            typeAttributes: 
                {
                    placeholder: 'description', 
                    value: { fieldName: 'Description_for_cash_contributions__c' },
                    context: { fieldName: 'Id' }
                }
        },  
        {label: 'Secured', editable: true, fieldName: 'Secured__c', type: 'boolean'}, 
        {label: 'Amount', editable: true, fieldName: 'Value__c', type: 'currency', cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true} 
    ];

    totalNhmfContributionColumns = [

        {label: 'firstCol', initialWidth: 52, editable: false, fieldName: 'firstCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'secondCol', initialWidth: 50, editable: false, fieldName: 'secondCol', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Source of Funding', editable: false, fieldName: 'Source_Of_Funding__c', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Description', editable: false, fieldName: 'Description_for_cash_contributions__c', type: 'text',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Secured', editable: false, fieldName: 'Secured__c', type: 'boolean',
        cellAttributes:{
            class: 'slds-theme_shade'
        },},
        {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
        cellAttributes:{
            class: 'slds-theme_shade',alignment: 'left'
        },}
    ];

    @wire(getObjectInfo, { objectApiName: PROJECT_COST_OBJECT })
    objectInfo;
    @wire(getObjectInfo, { objectApiName: PROJECT_INCOME_OBJECT })
    objectInfo;

    @wire(getProject, {projectId: '$recordId'})
    async proj(result)
    {
        if(result.data)
        {
            this.projectResult = result;
            this.project = JSON.parse(JSON.stringify(this.projectResult.data));

            if(this.project.RecordType.DeveloperName === this.smallGrantProject)
            {
                this.smallGrant = true;
                this.columns = this.smallCols;
                this.cashColumns = this.contributionColumns;
            } 
            else if(this.project.RecordType.DeveloperName === this.mediumGrantProject)
            {
                this.mediumGrant = true;
                this.columns = this.mediumColumns;
                this.cashColumns = this.contributionColumns;
            } 
            else if(this.project.RecordType.DeveloperName === this.nhmfGrantProject)
            {
                this.nhmfGrant = true;
                this.columns = this.mediumColumns;
                this.cashColumns = this.nhmfContributionColumns;
            }

            //Set currency columns as not-editable if Award Amount confirmed.
            /*if(this.project.Confirm_award_amount__c == true)
            {
                var columnsChange = this.columns;
                columnsChange.forEach(ele => 
                {
                    if(ele.type == 'currency')
                    {
                        ele.editable = false;
                    }
                });
                this.columns = columnsChange;

                var cashColumnsChange = this.cashColumns;
                cashColumnsChange.forEach(ele => 
                {
                    if(ele.type == 'currency')
                    {
                        ele.editable = false;
                    }
                });
                this.cashColumns = cashColumnsChange;
            }*/

            //Disable delete if Award Amount confirmed. May need to be reworked.
            /*if(this.project.Confirm_award_amount__c == true)
            {
                //console.log('JAG ' + JSON.stringify(this.columns[0].typeAttributes.rowActions[0].disabled));
                this.columns.forEach(ele => 
                    {
                        if(ele.type == 'action')
                        {
                            ele.typeAttributes.rowActions.forEach(ele2 => 
                                {
                                    if(ele2.name == 'delete')
                                    {
                                        ele2.disabled = true;
                                    }
                                })
                        }
                    })
            }*/

            this.projectRecordTypeDeveloperName = this.project.RecordType.DeveloperName;

            //Get Record type mapping custom metadata.
            this.recordTypeMapping = await getRecordTypeMappings({projectDeveloperName: this.projectRecordTypeDeveloperName});
        }
        else if (result.error)
        {
            console.log('error retrieving project: ' + error);
        }
    }

    //Get Project Cost Headings PL values.
    @wire(getPicklistValues, 
    {
        recordTypeId: "$recordTypeMapping.costRecordTypeId",
        fieldApiName: COST_HEADING
    })
    costHeadings(result) 
    {
        if (result.data) 
        {
            this.costHeadingOptions = result.data.values;
            console.log('Cost Headings: ' + JSON.stringify(result.data.values));

            this.projectCosts.forEach(ele => {
                ele.costHeadingOptions = this.costHeadingOptions;
            })
        } 
        else if (result.error) 
        {
            console.log('Error retrieving cost headings: ' + result.error);
        }
    }

    //Get Cash Contribution Secured PL values.
    @wire(getPicklistValues, 
    {
        recordTypeId: "$recordTypeMapping.cashRecordTypeId",
        fieldApiName: INCOME_FUNDING_SOURCE
    })
    fundingSource(result) 
    {
        if (result.data) 
        {
            this.fundingSourceOptions = result.data.values;
            console.log('Funding source options: ' + JSON.stringify(result.data.values));

            this.cashContributions.forEach(ele => {
                ele.fundingSourceOptions = this.fundingSourceOptions;
            })
        } 
        else if (result.error) 
        {
            console.log(result.error);
        }
    }

    //Get Cash Contribution Funding Source PL values.
    @wire(getPicklistValues, 
    {
        recordTypeId: "$recordTypeMapping.cashRecordTypeId",
        fieldApiName: INCOME_SECURED
    })
    securedHeadings(result) 
    {
        if (result.data) 
        {
            this.securedOptions = result.data.values;
            console.log('Secured options: ' + JSON.stringify(result.data.values));

            this.cashContributions.forEach(ele => {
                ele.securedOptions = this.securedOptions;
            })
        } 
        else if (result.error) 
        {
            console.log(result.error);
        }
    }

    @wire(getProjectCosts, {projectId: '$recordId', recordTypeMapping: '$recordTypeMapping'})
    costs(result)
    {
        if(result.data)
        {
            //Assign to results variable first to allow apexRefresh on save.
            this.projectsCostsResult = result;
            this.projectCosts = JSON.parse(JSON.stringify(this.projectsCostsResult.data));

            var projectCostsAmountTotal = 0;
            var projectCostsVatTotal = 0;
            var projectCostsTotal = 0;

            this.projectCostsTotalRow = [];

            if(this.smallGrant == true)
            {
                this.projectCosts.forEach(ele => 
                {
                    ele.costHeadingOptions = this.costHeadingOptions;

                    projectCostsAmountTotal = projectCostsAmountTotal + Number(ele.Costs__c);
                })

                this.projectCostsTotalRow.push(
                {
                    Id: 'totalRow',
                    firstCol: ' ',
                    secondCol: '',
                    costHeadingOptions: '',
                    Project_Cost_Description__c: '',
                    amounttotal: projectCostsAmountTotal,
                });
            }
            else if(this.mediumGrant == true || this.nhmfGrant == true)
            {
                this.projectCosts.forEach(ele => 
                {
                    ele.costHeadingOptions = this.costHeadingOptions;

                    projectCostsAmountTotal = projectCostsAmountTotal + Number(ele.Costs__c);
                    projectCostsVatTotal = projectCostsVatTotal + Number(ele.Vat__c);
                    projectCostsTotal = projectCostsTotal + Number(ele.Total_Cost__c);
                })

                this.projectCostsTotalRow.push({
                    Id: 'totalRow',
                    firstCol: ' ',
                    secondCol: '',
                    costHeadingOptions: '',
                    Project_Cost_Description__c: '',
                    amounttotal: projectCostsAmountTotal,
                    vattotal: projectCostsVatTotal,
                    totalcosttotal: projectCostsTotal
                });
            }
        }
        else if (result.error)
        {
            console.log('Failed to get Project Costs.');
        }
    }

    @wire(getCashContributions, {projectId: '$recordId'})
    contributions(result)
    {
        if(result.data)
        {
            var cashContributionsAmountTotal = 0;

            this.cashContributionsTotalRow = [];

            //Assign to results variable first to allow apexRefresh on save.
            this.cashContributionsResult = result;
            this.cashContributions = JSON.parse(JSON.stringify(this.cashContributionsResult.data));

            this.cashContributions.forEach(ele => 
            {
                ele.securedOptions = this.securedOptions;
                ele.fundingSourceOptions = this.fundingSourceOptions;
                
                if(this.nhmfGrant == true)
                {
                    cashContributionsAmountTotal = cashContributionsAmountTotal + Number(ele.Value__c);
                }
                else
                {
                    cashContributionsAmountTotal = cashContributionsAmountTotal + Number(ele.Amount_you_have_received__c);
                }
                
            })

            this.cashContributionsTotalRow.push(
            {
                Id: 'totalRow',
                firstCol: ' ',
                secondCol: '',
                Description_for_cash_contributions__c: '',
                Secured_non_cash_contributions__c: '',
                amounttotal: cashContributionsAmountTotal
            });
        }
        else if (result.error)
        {
            console.log('Failed to get Cash Contributions.');
        }
    }

    async handleCostSave(event) 
    {
        this.showSpinner = true;

        const updatedFields = event.detail.draftValues;

        try 
        {
            var existingCosts = JSON.parse(JSON.stringify(this.projectCosts));
            var existingCash = JSON.parse(JSON.stringify(this.cashContributions));

            //Remove recordtype and costheadings for Apex.
            this.removeNonRecordFields(existingCosts);
            this.removeNonRecordFields(existingCash);

            //Apex save records.
            const result = await saveCosts({draftCosts: updatedFields, existingCostsValues: existingCosts, cashContributions: existingCash, projectId: this.recordId});
            this.showSpinner = false;
            console.log(JSON.stringify("Apex update result: "+ result));

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Costs updated',
                    variant: 'success'
                })
            );
    
            //Refresh datatable.
            await refreshApex(this.projectsCostsResult);
            //Refresh header.
            await refreshApex(this.projectResult);

            //Clear all draft values in the datatable
            this.costsDraftValues = [];
        } 
        catch(error)
        {
            console.log('JAG costs on error' + JSON.stringify(this.projectCosts));
            this.showSpinner = false;
            console.log('failed to save costs... ' + error.body.message);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        };
    }

    async handleCashSave(event)
    {
        this.showSpinner = true;

        const updatedFields = event.detail.draftValues;
        console.log('draft values on save: ' + event.detail.draftValues);

        try 
        {
            var existingCosts = JSON.parse(JSON.stringify(this.projectCosts));
            var existingCash = JSON.parse(JSON.stringify(this.cashContributions));

            //Remove recordtype and dropdown options for Apex.
            this.removeNonRecordFields(existingCash);
            this.removeNonRecordFields(existingCosts);

            //Apex save records.
            const result = await saveCashContributions({draftCash: updatedFields, existingCash: existingCash, existingCosts: existingCosts, projectId: this.recordId});
            this.showSpinner = false;
            console.log(JSON.stringify("Apex update result: "+ result));

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Cash Contributions updated',
                    variant: 'success'
                })
            );
    
            //Refresh datatable.
            await refreshApex(this.cashContributionsResult);
            //Refresh header.
            await refreshApex(this.projectResult);

            //Clear all draft values in the datatable
            this.cashContributionsDraftValues = [];
        } 
        catch(error)
        {
            this.showSpinner = false;
            console.log('failed to save cash contributions... ' + error.body.message);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        };
    }

    handleCostCancel(event) 
    {
        //Clear draftValues (data changes).
        this.costsDraftValues = [];
    }

    handleCashCancel(event)
    {
        //Clear draftValues (data changes).
        this.cashContributionsDraftValues = [];
    }

    //Handle row level actions e.g, delete.
     handleCostRowAction(event)
    {
        const action = event.detail.action;
        const row = event.detail.row;

        switch(action.name)
        {
            case 'delete':
                const rows = [...this.projectCosts];
                const rowIndex = rows.findIndex(function(element) {return element.Id == row.Id});

                //Check we are looking at an existing record, if not just remove from table.
                if(rows[rowIndex].Id.length == 18)
                {
                    if(this.project.Confirm_award_amount__c == true)
                    {
                        var doNotDelete = false;
                        var mymap = new Map(Object.entries(row));

                        for(const ele of this.columns) 
                        {
                            if(ele.type == 'currency')
                            {

                                if(mymap.get(ele.fieldName) != 0)
                                {
                                    this.dispatchEvent(
                                        new ShowToastEvent({
                                            title: 'Error deleting project cost',
                                            message: 'The grant percentage and total costs cannot change after a decision is confirmed. Please redistribute currency values before deleting.',
                                            variant: 'error'
                                        })
                                    );
                                    doNotDelete = true;
                                    break;
                                }
                            }
                        }
                        if(doNotDelete == false)
                        {
                            this.costsRowsToDelete.push(row);
                            this.handleCostDelete();
                        }
                    }
                    else
                    {
                        this.costsRowsToDelete.push(row);
                        this.handleCostDelete();
                    }
                }
                else
                {
                    rows.splice(rowIndex, 1);
                    this.projectCosts = rows;
                }
            break;
        }
    }

    async handleCashRowAction(event)
    {
        const action = event.detail.action;
        const row = event.detail.row;

        console.log('draft values on row action: ' + event.detail.draftValues);

        switch(action.name)
        {
            case 'delete':
                const rows = [...this.cashContributions];
                const rowIndex = rows.findIndex(function(element) {return element.Id == row.Id});

                //Check we are looking at an existing record, if not just remove from table.
                if(rows[rowIndex].Id.length == 18)
                {
                    if(this.project.Confirm_award_amount__c == true)
                    {
                        if(this.project.Confirm_award_amount__c == true)
                        {
                            var doNotDelete = false;
                            var mymap = new Map(Object.entries(row));

                            for(const ele of this.cashColumns) 
                            {
                                if(ele.type == 'currency')
                                {

                                    if(mymap.get(ele.fieldName) != 0)
                                    {
                                        this.dispatchEvent(
                                            new ShowToastEvent({
                                                title: 'Error deleting cash contribution',
                                                message: 'The grant percentage and total costs cannot change after a decision is confirmed. Please redistribute currency values before deleting.',
                                                variant: 'error'
                                            })
                                        );
                                        doNotDelete = true;
                                        break;
                                    }
                                }
                            }
                            if(doNotDelete == false)
                            {
                                this.cashContributionRowsToDelete.push(row);
                                this.handleCashDelete();
                            }
                        }
                        
                    }
                    else
                    {
                        this.cashContributionRowsToDelete.push(row);
                        this.handleCashDelete();
                    }
                }
                else
                {
                    rows.splice(rowIndex, 1);
                    this.cashContributions = rows;
                }
            break;
        }
    }

    async handleCostDelete()
    {
        this.showSpinner = true;
        try
        {
            this.costsRowsToDelete.forEach(function (item, index)
            {
                ['RecordType', 'costHeadingOptions'].forEach(e => delete item[e]);
            });

            const result = await deleteCosts({pCostsToDelete: this.costsRowsToDelete});
            this.showSpinner = false;

            console.log(JSON.stringify("Apex delete result: "+ result));

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Cost deleted',
                    variant: 'success'
                })
            );
        
            //Refresh lightning cache and wires
            //getRecordNotifyChange(notifyChangeIds);

            //Display fresh data in the datatable
            await refreshApex(this.projectsCostsResult);

            //Refresh header.
            await refreshApex(this.projectResult);

            //Clear all draft values in the datatable
            this.costsRowsToDelete = [];
        } 
        catch(error)
        {
            this.showSpinner = false;
            console.log('failed to delete costs... ' + error.message);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting or refreshing records',
                    message: error.message,
                    variant: 'error'
                })
            );
        };
    }

    async handleCashDelete()
    {
        this.showSpinner = true;
        try
        {
            this.cashContributionRowsToDelete.forEach(function (item, index)
            {
                ['RecordType', 'securedOptions', 'fundingSourceOptions'].forEach(e => delete item[e]);
            });

            const result = await deleteCashContributions({cashToDelete: this.cashContributionRowsToDelete});
            this.showSpinner = false;

            console.log(JSON.stringify("Apex delete result cash: "+ result));

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Cash Contribution deleted',
                    variant: 'success'
                })
            );
        
            //Refresh lightning cache and wires
            //getRecordNotifyChange(notifyChangeIds);

            //Display fresh data in the datatable
            await refreshApex(this.cashContributionsResult);

            //Refresh header.
            await refreshApex(this.projectResult);

            //Clear all draft values in the datatable
            this.cashContributionRowsToDelete = [];
        } 
        catch(error)
        {
            this.showSpinner = false;
            console.log('failed to delete cash... ' + error.message);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting or refreshing cash records',
                    message: error.message,
                    variant: 'error'
                })
            );
        };
    }

    async handleAddProjectCost(event)
    {
        let idValue = this.projectCosts.length;
        let newCost = [{Id: 'row-' + idValue, Case__c: this.recordId, Costs__c: 0, Cost_heading__c: this.costHeadingOptions[0].value, Vat__c: 0,
                        Project_Cost_Description__c: '', RecordTypeId: this.recordTypeMapping.costRecordTypeId, costHeadingOptions: this.costHeadingOptions}];
        this.projectCosts = this.projectCosts.concat(newCost);
    }

    async handleAddCashContributions(event)
    {
        let idValue = this.cashContributions.length;
        let newCashContribution = [{Id: 'row-' + idValue, Case__c: this.recordId, Value__c: 0, Amount_you_have_received__c: 0, Secured_non_cash_contributions__c: this.securedOptions[0].value,
                        Description_for_cash_contributions__c: '', Source_Of_Funding__c: this.fundingSourceOptions[0].value,
                        RecordTypeId: this.recordTypeMapping.cashRecordTypeId, securedOptions: this.securedOptions, fundingSourceOptions: this.fundingSourceOptions}];
        this.cashContributions = this.cashContributions.concat(newCashContribution);
    }

    showToast(title, message, variant, mode) 
    {
        const evt = new ShowToastEvent(
        {
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    removeNonRecordFields(costsOrCash)
    {
        costsOrCash.forEach(function (item, index)
        {
            ['RecordType', 'costHeadingOptions', 'securedOptions', 'fundingSourceOptions'].forEach(e => delete item[e]);
        });

        return costsOrCash;
    }
}