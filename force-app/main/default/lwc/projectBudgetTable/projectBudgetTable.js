import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { refreshApex } from '@salesforce/apex';
import LightningConfirm from 'lightning/confirm';

import getProject from '@salesforce/apex/ProjectBudgetTableController.getProject';
import getRecordTypeMappings from '@salesforce/apex/ProjectBudgetTableController.getRecordTypeMapping';

import getProjectCosts from '@salesforce/apex/ProjectBudgetTableController.getProjectCosts';
import saveCosts from '@salesforce/apex/ProjectBudgetTableController.saveCosts';
import deleteCosts from '@salesforce/apex/ProjectBudgetTableController.deleteCosts';

import getCashContributions from '@salesforce/apex/ProjectBudgetTableController.getCashContributions';
import saveCashContributions from '@salesforce/apex/ProjectBudgetTableController.saveCashContributions';
import deleteCashContributions from '@salesforce/apex/ProjectBudgetTableController.deleteCash';
import checkGrantReviewsPending from '@salesforce/apex/ProjectBudgetTableController.checkGrantReviewsPending';

import PROJECT_BUDGET_DELETE_WARNING from "@salesforce/label/c.ProjectBudgetDeleteWarning";
import PROJECT_BUDGET_DELETE_ERROR from "@salesforce/label/c.ProjectBudgetDeleteError";

import COST_HEADING from "@salesforce/schema/Project_Cost__c.Cost_heading__c";
import COST_HEADING_DELIVERY from "@salesforce/schema/Project_Cost__c.Cost_heading_Delivery__c";
import COST_TYPE from "@salesforce/schema/Project_Cost__c.Cost_Type__c";
import INCOME_SECURED from "@salesforce/schema/Project_Income__c.Secured_non_cash_contributions__c";
import INCOME_FUNDING_SOURCE from "@salesforce/schema/Project_Income__c.Source_Of_Funding__c";

import {
    smallColumns,
    smallTotalColumns,
    mediumColumns,
    mediumTotalColumns,
    largeColumns,
    largeColumnsDelivery,
    largeTotalColumns,
    largeTotalColumnsDelivery,
    contributionColumns,
    totalContributionColumns,
    largeContributionColumns,
    largeTotalContributionColumns,
    nhmfContributionColumns,
    nhmfTotalContributionColumns
} from './columnDefinitions';

export default class ProjectBudgetTable extends LightningElement 
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
    largeGrantDevelopment = false;
    largeGrantDelivery = false;
    nhmfGrant = false;
    showSpinner = false;

    @api recordId;
    @api variation = '';

    project;
    projectResult;
    projectRecordTypeDeveloperName;
    recordTypeMapping;

    projectCosts = [];
    costHeadingOptions;
    costHeadingDeliveryOptions = [];
    costTypeOptions;
    projectsCostsResult;
    costsDraftValues = [];
    costsRowsToDelete = [];
    projectCostsAmountTotal = 0;
    projectCostsVatTotal = 0;
    projectCostsTotal = 0;
    projectCostsTotalRow = [];

    cashContributions = [];
    securedOptions;
    fundingSourceOptions;
    cashContributionsResult;
    cashContributionsDraftValues = [];
    cashContributionRowsToDelete = [];
    cashContributionsAmountTotal = 0;
    cashContributionsTotalRow = [];

    costRowCounter = 0
    cashRowCounter = 0

    costHeadingDeliveryControllerValues;

    get costCardTitle()
    {
        if(this.variation == 'Large_Development_Delivery')
        {
            return 'Potential Delivery Costs';
        }
        else if(this.project.RecordType.DeveloperName === this.largeGrantDevelopmentProject)
        {
            return 'Development Costs'
        }
        else if(this.project.RecordType.DeveloperName === this.largeGrantDeliveryProject)
        {
            return 'Delivery Costs'
        }
        else
        {
            return 'Project Costs';
        }
    }

    get cashCardTitle()
    {
        if(this.variation == 'Large_Development_Delivery')
        {
            return 'Potential Delivery Cash Contributions';
        }
        else if(this.project.RecordType.DeveloperName === this.largeGrantDevelopmentProject)
        {
            return 'Development Cash Contributions'
        }
        else if(this.project.RecordType.DeveloperName === this.largeGrantDeliveryProject)
        {
            return 'Delivery Cash Contributions'
        }
        else
        {
            return 'Cash Contributions';
        }
    }

    get totalColumns()
    {
        if (this.project && this.project.RecordType) 
        {
            switch (this.project.RecordType.DeveloperName) 
            {
                case this.smallGrantProject:
                    return smallTotalColumns;
                case this.mediumGrantProject:
                    return mediumTotalColumns;
                case this.nhmfGrantProject:
                    return mediumTotalColumns;
                case this.largeGrantDevelopmentProject:
                    if(this.variation == 'Large_Development_Delivery')
                    {
                        return largeTotalColumnsDelivery;
                    }
                    else
                    {
                        return largeTotalColumns;
                    }
                case this.largeGrantDeliveryProject:
                    return largeTotalColumnsDelivery;
            }
        }
    }

    get totalCashColumns()
    {
        if (this.project && this.project.RecordType) 
        {
            switch (this.project.RecordType.DeveloperName) 
            {
                case this.smallGrantProject:
                    return totalContributionColumns;
                case this.mediumGrantProject:
                    return totalContributionColumns;
                case this.nhmfGrantProject:
                    return nhmfTotalContributionColumns;
                case this.largeGrantDevelopmentProject:
                    return largeTotalContributionColumns;
                case this.largeGrantDeliveryProject:
                    return largeTotalContributionColumns;
            }
        }
    }

    //Get the project info and set relevant variables.
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
                this.columns = smallColumns;
                this.cashColumns = contributionColumns;
            } 
            else if(this.project.RecordType.DeveloperName === this.mediumGrantProject)
            {
                this.mediumGrant = true;
                this.columns = mediumColumns;
                this.cashColumns = contributionColumns;
            } 
            else if(this.project.RecordType.DeveloperName === this.largeGrantDevelopmentProject)
            {
                this.largeGrant = true;
                this.largeGrantDevelopment = true;

                if(this.variation == 'Large_Development_Delivery')
                {
                    this.columns = largeColumnsDelivery;
                    this.largeGrantDelivery = true;
                }
                else
                {
                    this.columns = largeColumns;
                }

                this.cashColumns = largeContributionColumns;
            }
            else if(this.project.RecordType.DeveloperName === this.largeGrantDeliveryProject)
            {
                this.largeGrant = true;
                this.largeGrantDelivery = true;
                this.columns = largeColumnsDelivery;
                this.cashColumns = largeContributionColumns;
            }
            else if(this.project.RecordType.DeveloperName === this.nhmfGrantProject)
            {
                this.nhmfGrant = true;
                this.columns = mediumColumns;
                this.cashColumns = nhmfContributionColumns;
            }

            this.projectRecordTypeDeveloperName = this.project.RecordType.DeveloperName;

            //Get Record type mapping custom metadata.
            this.recordTypeMapping = await getRecordTypeMappings({projectDeveloperName: this.projectRecordTypeDeveloperName, variation: this.variation});
        }
        else if (result.error)
        {
            console.log('error retrieving project: ' + error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving Project data',
                    message: error.body.message,
                    variant: 'error'
                })
            );
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

            this.projectCosts.forEach(ele => {
                ele.costHeadingOptions = this.costHeadingOptions;
            })
        } 
        else if (result.error) 
        {
            console.log('Error retrieving cost headings: ' + result.error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving cost headings',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    //Get Project Cost Headings (Delivery) PL values.
    @wire(getPicklistValues, 
        {
            recordTypeId: "$recordTypeMapping.costRecordTypeId",
            fieldApiName: COST_HEADING_DELIVERY
        })
        costHeadingsDelivery(result) 
        {
            if (result.data) 
            {
                this.costHeadingDeliveryOptions = result.data.values;
                this.costHeadingDeliveryControllerValues = new Map(Object.entries(result.data.controllerValues));
            } 
            else if (result.error) 
            {
                console.log('Error retrieving cost headings (delivery): ' + result.error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error retrieving cost headings (delivery)',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            }
        }
    
    //Get Project Cost Type PL values.
    @wire(getPicklistValues, 
    {
        recordTypeId: "$recordTypeMapping.costRecordTypeId",
        fieldApiName: COST_TYPE
    })
    costTypes(result) 
    {
        if (result.data) 
        {
            this.costTypeOptions = result.data.values;

            this.projectCosts.forEach(ele => {
                ele.costTypeOptions = this.costTypeOptions;
            })
        } 
        else if (result.error) 
        {
            console.log('Error retrieving cost types: ' + result.error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving cost types',
                    message: error.body.message,
                    variant: 'error'
                })
            );
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

            this.cashContributions.forEach(ele => {
                ele.fundingSourceOptions = this.fundingSourceOptions;
            })
        } 
        else if (result.error) 
        {
            console.log('Error retrieving funding sources: ' + result.error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving funding sources',
                    message: error.body.message,
                    variant: 'error'
                })
            );
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

            this.cashContributions.forEach(ele => {
                ele.securedOptions = this.securedOptions;
            })
        } 
        else if (result.error) 
        {
            console.log('Error retrieving secured options: ' + result.error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving secured options',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    @wire(getProjectCosts, {projectId: '$recordId', recordType: '$recordTypeMapping.costRecordTypeId', variation: '$variation'})
    costs(result)
    {
        if(result.data)
        {
            //Assign to results variable first to allow apexRefresh on save.
            this.projectsCostsResult = result;
            this.projectCosts = JSON.parse(JSON.stringify(this.projectsCostsResult.data));
            this.costRowCounter = this.projectCosts.length;

            var projectCostsAmountTotal = 0;
            var projectCostsVatTotal = 0;
            var projectCostsTotal = 0;

            this.projectCostsTotalRow = [];

            if(this.smallGrant == true)
            {
                //Apply picklist options and add to runnign total for totals row.
                this.projectCosts.forEach(ele => 
                {
                    ele.costHeadingOptions = this.costHeadingOptions;
                    ele.costTypeOptions = this.costTypeOptions;

                    projectCostsAmountTotal = projectCostsAmountTotal + Number(ele.Costs__c);
                })

                //Add total row.
                this.projectCostsTotalRow.push(
                {
                    Id: 'totalRow',
                    keyCol: ' ',
                    actionCol: '',
                    costHeadingOptions: '',
                    costHeadingDeliveryOptions: '',
                    costTypeOptions: '',
                    Project_Cost_Description__c: '',
                    amounttotal: projectCostsAmountTotal,
                });
            }
            else if(this.mediumGrant == true || this.nhmfGrant == true)
            {
                this.projectCosts.forEach(ele => 
                {
                    ele.costHeadingOptions = this.costHeadingOptions;
                    ele.costTypeOptions = this.costTypeOptions;

                    projectCostsAmountTotal = projectCostsAmountTotal + Number(ele.Costs__c);
                    projectCostsVatTotal = projectCostsVatTotal + Number(ele.Vat__c);
                    projectCostsTotal = projectCostsTotal + Number(ele.Total_Cost__c);
                })

                this.projectCostsTotalRow.push({
                    Id: 'totalRow',
                    keyCol: ' ',
                    actionCol: '',
                    costHeadingOptions: '',
                    costHeadingDeliveryOptions: '',
                    costTypeOptions: '',
                    Project_Cost_Description__c: '',
                    amounttotal: projectCostsAmountTotal,
                    vattotal: projectCostsVatTotal,
                    totalcosttotal: projectCostsTotal
                });
            }
            else if(this.largeGrant == true)
            {
                this.projectCosts.forEach(ele => 
                {
                    ele.costHeadingOptions = this.costHeadingOptions;
                    ele.costTypeOptions = this.costTypeOptions;

                    //Cost Headings (Delivery) is a dependent picklist so we need to build this using the controllerValues attribute provided.
                    if(this.largeGrantDelivery == true)
                    {
                        ele.costHeadingDeliveryOptions = [];
                        this.costHeadingDeliveryOptions.forEach(value => 
                        {
                            for(let i = 0; i < value.validFor.length; i++)
                            {
                                if(this.costHeadingDeliveryControllerValues.get(ele.Cost_Type__c) == value.validFor[i])
                                {
                                    ele.costHeadingDeliveryOptions.push(value);
                                }
                            }
                        })
                    }
                    
                    projectCostsAmountTotal = projectCostsAmountTotal + Number(ele.Costs__c);
                    projectCostsVatTotal = projectCostsVatTotal + Number(ele.Vat__c);
                    projectCostsTotal = projectCostsTotal + Number(ele.Total_Cost__c);
                });

                this.projectCostsTotalRow.push({
                    Id: 'totalRow',
                    keyCol: ' ',
                    actionCol: '',
                    costHeadingOptions: '',
                    costHeadingDeliveryOptions: '',
                    costTypeOptions: '',
                    Project_Cost_Description__c: '',
                    amounttotal: projectCostsAmountTotal,
                    vattotal: projectCostsVatTotal,
                    totalcosttotal: projectCostsTotal
                });
            }
        }
        else if (result.error)
        {
            console.log('Failed to get Project Costs.' + error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving project costs',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    @wire(getCashContributions, {projectId: '$recordId', recordType: '$recordTypeMapping.cashRecordTypeId'})
    contributions(result)
    {
        if(result.data)
        {
            var cashContributionsAmountTotal = 0;

            this.cashContributionsTotalRow = [];

            //Assign to results variable first to allow apexRefresh on save.
            this.cashContributionsResult = result;
            this.cashContributions = JSON.parse(JSON.stringify(this.cashContributionsResult.data));
            this.cashRowCounter = this.cashContributions.length;

            if(this.largeGrant == true)
            {
                //Apply picklist options and add to running total for total row..
                this.cashContributions.forEach(ele => 
                {
                    ele.securedOptions = this.securedOptions;
                    ele.fundingSourceOptions = this.fundingSourceOptions;;

                    cashContributionsAmountTotal = cashContributionsAmountTotal + Number(ele.Amount_you_have_received__c);
                });

                //Add row.
                this.cashContributionsTotalRow.push(
                {
                    Id: 'totalRow',
                    keyCol: '',
                    actionCol: '',
                    Source_Of_Funding__c: '',
                    Description_for_cash_contributions__c: '',
                    Secured__c: false,
                    Evidence_for_secured_income__c: false,
                    amounttotal: cashContributionsAmountTotal
                });
            } 
            else
            {
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
                    keyCol: ' ',
                    actionCol: '',
                    Description_for_cash_contributions__c: '',
                    Secured_non_cash_contributions__c: '',
                    amounttotal: cashContributionsAmountTotal
                });
            }
        }
        else if (result.error)
        {
            console.log('Failed to get Cash Contributions.' + error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error retrieving cash contribution records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
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
            this.showSpinner = false;
            console.log('failed to save costs... ' + error.body.message);
        
            var errorData = JSON.parse(error.body.message);

            if(errorData)
            {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: errorData.name,
                        message: errorData.message,
                        variant: 'error'
                    })
                );
            }
            else
            {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating or refreshing records',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            }
        };
    }

    async handleCashSave(event)
    {
        this.showSpinner = true;

        const updatedFields = event.detail.draftValues;

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
            
            var errorData = JSON.parse(error.body.message);

            if(errorData)
            {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: errorData.name,
                        message: errorData.message,
                        variant: 'error'
                    })
                );
            }
            else
            {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating or refreshing records',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            }
        };
    }

    async handleCostCancel(event) 
    {
        //Clear draftValues (data changes).
        this.costsDraftValues = [];
        this.refs.costsDatatable.draftValues = this.projectCosts;

        //Reset Cost Heading (delivery) picklist values.
        if(this.largeGrantDelivery == true) 
        {
            this.projectCosts.forEach(ele =>
            {
                ele.costHeadingDeliveryOptions = [];
                this.costHeadingDeliveryOptions.forEach(value => 
                {
                    for(let i = 0; i < value.validFor.length; i++)
                    {
                        if(this.costHeadingDeliveryControllerValues.get(ele.Cost_Type__c) == value.validFor[i])
                        {
                            ele.costHeadingDeliveryOptions.push(value);
                        }
                    }
                })
            });
        }
    }

    handleCashCancel(event)
    {
        //Clear draftValues (data changes).
        this.cashContributionsDraftValues = [];
        this.refs.cashDatatable.draftValues = this.cashContributions;
    }

    //Handle row level actions e.g. delete.
    async handleCostRowAction(event)
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
                    var warningResult = true;

                    //If we have draft values, show warning modal before allowing delete.
                    if(this.refs.costsDatatable.draftValues != '' || this.refs.cashDatatable.draftValues != '')
                    {
                        warningResult = await LightningConfirm.open(
                        {
                            label: 'Unsaved changes will be lost',
                            message: PROJECT_BUDGET_DELETE_WARNING,
                            theme: 'warning'
                        });
                    }

                    //If in monitoring or has Grant Review in "Pending" Status, do not allow save if changed made to currency fields.
                    const hasPendingDraftReviewsResult = await checkGrantReviewsPending({projectId: this.recordId});
                    if(this.project.Confirm_award_amount__c == true && hasPendingDraftReviewsResult == false)
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
                                            title: 'Error deleting cost',
                                            message: PROJECT_BUDGET_DELETE_ERROR,
                                            variant: 'error'
                                        })
                                    );
                                    doNotDelete = true;
                                    break;
                                }
                            }
                        }
                        if(doNotDelete == false && warningResult == true)
                        {
                            this.costsRowsToDelete.push(row);
                            this.handleCostDelete();
                        }
                    }
                    else if(warningResult == true)
                    {
                        this.costsRowsToDelete.push(row);
                        this.handleCostDelete();
                    }
                }
                else //If just deleting a new unsaved row.
                {
                    //Remove from project costs.
                    rows.splice(rowIndex, 1);
                    this.projectCosts = rows;

                    //Remove from draftvalues in datatable.
                    const draftRows = [...this.refs.costsDatatable.draftValues];
                    const draftRowIndex = draftRows.findIndex(function(element) {return element.Id == row.Id});
                    
                    draftRows.splice(draftRowIndex, 1);
                    this.refs.costsDatatable.draftValues = draftRows;
                }
                break;
        }   
    }

    async handleCashRowAction(event)
    {
        const action = event.detail.action;
        const row = event.detail.row;

        switch(action.name)
        {
            case 'delete':
                const rows = [...this.cashContributions];
                const rowIndex = rows.findIndex(function(element) {return element.Id == row.Id});

                //Check we are looking at an existing record, if not just remove from table.
                if(rows[rowIndex].Id.length == 18)
                {
                    var warningResult = true;

                    //If we have draft values, show warning modal before allowing delete.
                    if(this.refs.cashDatatable.draftValues != '' || this.refs.costsDatatable.draftValues != '')
                    {
                        warningResult = await LightningConfirm.open(
                        {
                            label: 'Unsaved Changes will be lost',
                            message: PROJECT_BUDGET_DELETE_WARNING,
                            theme: 'warning'
                        });
                    }

                    //If in monitoring or has Grant Review in "Pending" Status, do not allow save if changed made to currency fields.
                    const hasPendingDraftReviewsResult = await checkGrantReviewsPending({projectId: this.recordId});

                    if(this.project.Confirm_award_amount__c == true && hasPendingDraftReviewsResult == false)
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
                                            message: PROJECT_BUDGET_DELETE_ERROR,
                                            variant: 'error'
                                        })
                                    );
                                    doNotDelete = true;
                                    break;
                                }
                            }
                        }
                        if(doNotDelete == false && warningResult == true)
                        {
                            this.cashContributionRowsToDelete.push(row);
                            this.handleCashDelete();
                        }
                    }
                    else if(warningResult == true)
                    {
                        this.cashContributionRowsToDelete.push(row);
                        this.handleCashDelete();
                    }
                }
                else //If just deleting a new unsaved row.
                {
                    //Remove from project costs.
                    rows.splice(rowIndex, 1);
                    this.cashContributions = rows;

                    //Remove from draftvalues in datatable.
                    const draftRows = [...this.refs.cashDatatable.draftValues];
                    const draftRowIndex = draftRows.findIndex(function(element) {return element.Id == row.Id});
                    
                    draftRows.splice(draftRowIndex, 1);
                    this.refs.cashDatatable.draftValues = draftRows;
                }

                break;
        }
    }

    async handleCostDelete()
    {
        this.showSpinner = true;

        //Clear all draft values in the datatable
        this.costsDraftValues = [];

        try
        {
            this.costsRowsToDelete.forEach(function (item, index)
            {
                ['RecordType', 'costHeadingOptions', 'costHeadingDeliveryOptions', 'costTypeOptions'].forEach(e => delete item[e]);
            });

            const result = await deleteCosts({pCostsToDelete: this.costsRowsToDelete});
            this.showSpinner = false;

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

        //Clear all draft values in the datatable
        this.cashContributionsDraftValues = [];
        
        try
        {
            this.cashContributionRowsToDelete.forEach(function (item, index)
            {
                ['RecordType', 'securedOptions', 'fundingSourceOptions'].forEach(e => delete item[e]);
            });

            const result = await deleteCashContributions({cashToDelete: this.cashContributionRowsToDelete});
            this.showSpinner = false;

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
        //let idValue = this.projectCosts.length;
        let newCost = [{Id: 'costrow-' + this.costRowCounter, Case__c: this.recordId, Costs__c: 0, Cost_heading__c: '', Cost_Type__c: '', Vat__c: 0, Cost_heading_Delivery__c: '',
                        Project_Cost_Description__c: '', RecordTypeId: this.recordTypeMapping.costRecordTypeId, 
                        costHeadingOptions: this.costHeadingOptions, costHeadingDeliveryOptions: [], costTypeOptions: this.costTypeOptions}];

        this.projectCosts = this.projectCosts.concat(newCost);
        this.costRowCounter++;
    }

    async handleAddCashContributions(event)
    {
        //let idValue = this.cashContributions.length;
        let newCashContribution = [{Id: 'cashrow-' + this.cashRowCounter, Case__c: this.recordId, Value__c: 0, Amount_you_have_received__c: 0, Secured_non_cash_contributions__c: '',
                                    Description_for_cash_contributions__c: '', Source_Of_Funding__c: '', RecordTypeId: this.recordTypeMapping.cashRecordTypeId, 
                                    securedOptions: this.securedOptions, fundingSourceOptions: this.fundingSourceOptions}];
        
        this.cashContributions = this.cashContributions.concat(newCashContribution);
        this.cashRowCounter++;
    }

    handleCellChange(event)
    {
        //Handle change/initial set of Cost Type in Cost Heading (Delivery) dependent picklist.
        if(JSON.stringify(event.detail.draftValues).includes('Cost_Type__c') && this.largeGrantDelivery == true)
        {
            this.projectCosts.forEach(ele => 
            {
                if(ele.Id == event.detail.draftValues[0].Id)
                {
                    //Set draft value to blank.
                    var drafts = this.refs.costsDatatable.draftValues;
                    drafts.forEach(draft =>
                    {
                        if(draft.Id == event.detail.draftValues[0].Id)
                        {
                            draft.Cost_heading_Delivery__c = '';
                        }
                    });
                    this.refs.costsDatatable.draftValues = drafts;

                    //Set options.
                    ele.costHeadingDeliveryOptions = [];
                    this.costHeadingDeliveryOptions.forEach(value => 
                    {
                        for(let i = 0; i < value.validFor.length; i++)
                        {
                            if(this.costHeadingDeliveryControllerValues.get(event.detail.draftValues[0].Cost_Type__c) == value.validFor[i])
                            {
                                ele.costHeadingDeliveryOptions.push(value);
                            }
                        }
                    });
                }
            });
        }
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
            ['RecordType', 'costHeadingOptions', 'costHeadingDeliveryOptions', 'costTypeOptions', 'securedOptions', 'fundingSourceOptions'].forEach(e => delete item[e]);
        });

        return costsOrCash;
    }
}