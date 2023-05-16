var actions = [
    { label: 'Delete', name: 'delete', disabled: false }
];

export const smallColumns = [
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

export const smallTotalColumns = [
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

export const mediumColumns = [
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

export const mediumTotalColumns = [
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

export const largeColumns = [
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
];

export const largeTotalColumns = [
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

export const largeColumnsDelivery = [
    {type: 'action',
        typeAttributes: 
        { 
            rowActions: actions, menuAlignment: 'left' 
        } 
    },
    {label: 'Cost Type', editable: true, fieldName: 'Cost_Type__c', type: 'picklistColumn', hideDefaultActions: true,
        typeAttributes: 
            {
                placeholder: 'Cost Type', options: { fieldName: 'costTypeOptions' }, 
                value: { fieldName: 'Cost_Type__c' },
                context: { fieldName: 'Id' }
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
];

export const largeTotalColumnsDelivery = [
    {label: 'firstCol', initialWidth: 52, editable: false, fieldName: 'firstCol', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'secondCol', initialWidth: 50, editable: false, fieldName: 'secondCol', type: 'text',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Cost Type', editable: false, fieldName: 'costTypeOptions', type: 'text',
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

export const contributionColumns = [
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

export const totalContributionColumns = [

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

export const largeContributionColumns = [
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
    {label: 'Amount', editable: true, fieldName: 'Amount_you_have_received__c', type: 'currency', cellAttributes: {alignment: 'left'}, typeAttributes: {maximumFractionDigits: 0}, hideDefaultActions: true}
    
];

export const largeTotalContributionColumns = [

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
    {label: 'Evidence of Secured', editable: false, fieldName: 'Evidence_for_secured_income__c', type: 'boolean',
    cellAttributes:{
        class: 'slds-theme_shade'
    },},
    {label: 'Amount Total', editable: false, fieldName: 'amounttotal', type: 'currency', typeAttributes: {maximumFractionDigits: 0},
    cellAttributes:{
        class: 'slds-theme_shade',alignment: 'left'
    },}
];

export const nhmfContributionColumns = [
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

export const nhmfTotalContributionColumns = [

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