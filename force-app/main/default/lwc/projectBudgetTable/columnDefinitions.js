var actions = [
    { label: 'Delete', name: 'delete', disabled: false }
];

export const smallColumns = [
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
    {type: 'action', fixedWidth: 50,
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'auto' 
        } 
    }
];

export const smallTotalColumns = [
    {label: 'keyCol', initialWidth: 52, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Cost Heading', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Description', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
    cellAttributes:{
        class: 'slds-theme_shade', alignment: 'left'
    },},
    {label: 'actionCol', initialWidth: 50, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },}
];

export const mediumColumns = [
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
    {label: 'Total Cost', editable: false, fieldName: 'Total_Cost__c', type: 'currency', cellAttributes: {alignment: 'left'}, hideDefaultActions: true},
    {type: 'action', fixedWidth: 50,
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'auto' 
        } 
    }
];

export const mediumTotalColumns = [
    {label: 'keyCol', initialWidth: 52, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Cost Heading', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Description', editable: false, fieldName: '', type: 'text',
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
    },},
    {label: 'actionCol', initialWidth: 50, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },}
];

export const largeColumns = [
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
    {label: 'Total Cost', editable: false, fieldName: 'Total_Cost__c', type: 'currency', cellAttributes: {alignment: 'left'}, hideDefaultActions: true},
    {type: 'action', fixedWidth: 50,
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'auto' 
        } 
    },
];

export const largeTotalColumns = [
    {label: 'keyCol', initialWidth: 52, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Cost Heading', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Description', editable: false, fieldName: '', type: 'text',
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
    },},
    {label: 'actionCol', initialWidth: 50, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },}
];

export const largeColumnsDelivery = [
    {label: 'Cost Type', editable: true, fieldName: 'Cost_Type__c', type: 'picklistColumn', hideDefaultActions: true,
        typeAttributes: 
            {
                placeholder: 'Cost Type', options: { fieldName: 'costTypeOptions' }, 
                value: { fieldName: 'Cost_Type__c' },
                context: { fieldName: 'Id' }
            }
    },
    {label: 'Cost Heading (Delivery)', editable: true, fieldName: 'Cost_heading_Delivery__c', type: 'picklistColumn', hideDefaultActions: true,
        typeAttributes: 
            {
                placeholder: 'Cost Heading', options: { fieldName: 'costHeadingDeliveryOptions' }, 
                value: { fieldName: 'Cost_heading_Delivery__c' },
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
    {label: 'Total Cost', editable: false, fieldName: 'Total_Cost__c', type: 'currency', cellAttributes: {alignment: 'left'}, hideDefaultActions: true},
    {type: 'action', fixedWidth: 50,
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'auto' 
        } 
    }
];

export const largeTotalColumnsDelivery = [
    {label: 'keyCol', initialWidth: 52, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Cost Type', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Cost Heading', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Description', editable: false, fieldName: '', type: 'text',
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
    },},
    {label: 'actionCol', initialWidth: 50, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
];

export const contributionColumns = [
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
    {label: 'Amount', editable: true, fieldName: 'Amount_you_have_received__c', type: 'currency', cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true},
    {type: 'action', fixedWidth: 50,
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'auto' 
        } 
    }
];

export const totalContributionColumns = [

    {label: 'keyCol', initialWidth: 52, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Description', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Secured', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
    cellAttributes:{
        class: 'slds-theme_shade',alignment: 'left'
    },},
    {label: 'actionCol', initialWidth: 50, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
];

export const largeContributionColumns = [
    {label: 'Source of Funding', editable: true, fieldName: 'Source_Of_Funding__c', type: 'picklistColumn', hideDefaultActions: true,
        typeAttributes: 
            {
                options: { fieldName: 'fundingSourceOptions' }, 
                value: { fieldName: 'Source_Of_Funding__c' },
                context: { fieldName: 'Id' }
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
    {label: 'Secured', editable: true, fieldName: 'Secured__c', type: 'boolean'},
    {label: 'Evidence of Secured', editable: true, fieldName: 'Evidence_for_secured_income__c', type: 'boolean'},
    {label: 'Amount', editable: true, fieldName: 'Amount_you_have_received__c', type: 'currency', cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true},
    {type: 'action', fixedWidth: 50,
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'auto' 
        } 
    }    
];

export const largeTotalContributionColumns = [

    {label: 'keyCol', initialWidth: 52, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Source of Funding', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Description', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Secured', editable: false, fieldName: '', type: 'boolean',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Evidence of Secured', editable: false, fieldName: '', type: 'boolean',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
    cellAttributes:{
        class: 'slds-theme_shade',alignment: 'left'
    },},
    {label: 'actionCol', initialWidth: 50, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
];

export const nhmfContributionColumns = [
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
    {label: 'Amount', editable: true, fieldName: 'Value__c', type: 'currency', cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true},
    {type: 'action', fixedWidth: 50,
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'auto' 
        } 
    }
];

export const nhmfTotalContributionColumns = [

    {label: 'keyCol', initialWidth: 52, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Source of Funding', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Description', editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Secured', editable: false, fieldName: '', type: 'boolean',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
    cellAttributes:{
        class: 'slds-theme_shade',alignment: 'left'
    },},
    {label: 'actionCol', initialWidth: 50, editable: false, fieldName: '', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },}
];