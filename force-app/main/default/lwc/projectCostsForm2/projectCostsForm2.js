import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { refreshApex } from '@salesforce/apex';
import LightningConfirm from 'lightning/confirm';

import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getRecordTypeMappings from '@salesforce/apex/ProjectCostFormController.getRecordTypeMapping';

import getProjectCosts2 from '@salesforce/apex/ProjectCostFormController.getProjectCosts2';
import saveCosts from '@salesforce/apex/ProjectCostFormController.saveCosts';
import deleteCosts from '@salesforce/apex/ProjectCostFormController.deleteCosts';

import getCashContributions2 from '@salesforce/apex/ProjectCostFormController.getCashContributions2';
import saveCashContributions from '@salesforce/apex/ProjectCostFormController.saveCashContributions';
import deleteCashContributions from '@salesforce/apex/ProjectCostFormController.deleteCash';

import SAVE_SUCCESSFUL from '@salesforce/label/c.Budget_Management_Save';
import Saved from "@salesforce/label/c.Saved";
import Success from "@salesforce/label/c.Success";
import Error from "@salesforce/label/c.Error";

import COST_HEADING from "@salesforce/schema/Project_Cost__c.Cost_heading__c";
import COST_TYPE from "@salesforce/schema/Project_Cost__c.Cost_Type__c";
import PROJECT_COST_OBJECT from "@salesforce/schema/Project_Cost__c";
import INCOME_SECURED from "@salesforce/schema/Project_Income__c.Secured_non_cash_contributions__c";
import INCOME_FUNDING_SOURCE from "@salesforce/schema/Project_Income__c.Source_Of_Funding__c";
import PROJECT_INCOME_OBJECT from "@salesforce/schema/Project_Income__c";

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
    costTypeOptions;
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
            return 'Potential Delivery Cash Contributions'
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
                }
                else
                {
                    this.columns = largeColumns;
                }

                this.cashColumns = largeContributionColumns;

                /*if(this.variation == null) //This affects all instances of the component for some reason.
                {
                    
                    var columnsChange = this.columns;

                    for(var column in columnsChange){
                        if(columnsChange[column].label=='Cost Type')
                        {
                            columnsChange.splice(column,1);
                            break;
                        }
                    }
                    this.columns = columnsChange;
                }*/
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
            this.recordTypeMapping = await getRecordTypeMappings({projectDeveloperName: this.projectRecordTypeDeveloperName, variation: this.variation});
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
            console.log('Cost Types: ' + JSON.stringify(result.data.values));

            this.projectCosts.forEach(ele => {
                ele.costTypeOptions = this.costTypeOptions;
            })
        } 
        else if (result.error) 
        {
            console.log('Error retrieving cost types: ' + result.error);
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

    @wire(getProjectCosts2, {projectId: '$recordId', recordType: '$recordTypeMapping.costRecordTypeId', variation: '$variation'})
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
                    ele.costTypeOptions = this.costTypeOptions;

                    projectCostsAmountTotal = projectCostsAmountTotal + Number(ele.Costs__c);
                })

                this.projectCostsTotalRow.push(
                {
                    Id: 'totalRow',
                    firstCol: ' ',
                    secondCol: '',
                    costHeadingOptions: '',
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
                    firstCol: ' ',
                    secondCol: '',
                    costHeadingOptions: '',
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

                    projectCostsAmountTotal = projectCostsAmountTotal + Number(ele.Costs__c);
                    projectCostsVatTotal = projectCostsVatTotal + Number(ele.Vat__c);
                    projectCostsTotal = projectCostsTotal + Number(ele.Total_Cost__c);
                });

                this.projectCostsTotalRow.push({
                    Id: 'totalRow',
                    firstCol: ' ',
                    secondCol: '',
                    costHeadingOptions: '',
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
            console.log('Failed to get Project Costs.');
        }
    }

    @wire(getCashContributions2, {projectId: '$recordId', recordType: '$recordTypeMapping.cashRecordTypeId'})
    contributions(result)
    {
        if(result.data)
        {
            var cashContributionsAmountTotal = 0;

            this.cashContributionsTotalRow = [];

            //Assign to results variable first to allow apexRefresh on save.
            this.cashContributionsResult = result;
            this.cashContributions = JSON.parse(JSON.stringify(this.cashContributionsResult.data));

            if(this.largeGrant == true)
            {
                this.cashContributions.forEach(ele => 
                {
                    ele.securedOptions = this.securedOptions;
                    ele.fundingSourceOptions = this.fundingSourceOptions;;

                    cashContributionsAmountTotal = cashContributionsAmountTotal + Number(ele.Amount_you_have_received__c);
                });

                this.cashContributionsTotalRow.push(
                {
                    Id: 'totalRow',
                    firstCol: '',
                    secondCol: '',
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
                    firstCol: ' ',
                    secondCol: '',
                    Description_for_cash_contributions__c: '',
                    Secured_non_cash_contributions__c: '',
                    amounttotal: cashContributionsAmountTotal
                });
            }
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

    //Handle row level actions e.g. delete.
    async handleCostRowAction(event)
    {
        const action = event.detail.action;
        const row = event.detail.row;

        switch(action.name)
        {
            case 'delete':
                const result = await LightningConfirm.open(
                {
                    label: 'Unsaved changes will be reverted',
                    message: 'Save your work in the table before deleting any rows.',
                    theme: 'warning'
                });

                if(result == true)
                {
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
    }

    async handleCashRowAction(event)
    {
        const action = event.detail.action;
        const row = event.detail.row;

        console.log('draft values on row action: ' + event.detail.draftValues);

        switch(action.name)
        {
            case 'delete':
                const result = await LightningConfirm.open(
                {
                    label: 'Unsaved changes will be reverted',
                    message: 'Save your work in the table before deleting any rows.',
                    theme: 'warning'
                });
    
                if(result == true)
                {
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
                ['RecordType', 'costHeadingOptions', 'costTypeOptions'].forEach(e => delete item[e]);
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
        let newCost = [{Id: 'row-' + idValue, Case__c: this.recordId, Costs__c: 0, Cost_heading__c: this.costHeadingOptions[0].value, Cost_Type__c: this.costTypeOptions[0].value, Vat__c: 0,
                        Project_Cost_Description__c: '', RecordTypeId: this.recordTypeMapping.costRecordTypeId, costHeadingOptions: this.costHeadingOptions, costTypeOptions: this.costTypeOptions}];
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
            ['RecordType', 'costHeadingOptions', 'costTypeOptions', 'securedOptions', 'fundingSourceOptions'].forEach(e => delete item[e]);
        });

        return costsOrCash;
    }
}