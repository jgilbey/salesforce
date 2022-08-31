import File_Type from "@salesforce/label/c.File_Type";
import File_Name from "@salesforce/label/c.File_Name";
import description_of_funding from "@salesforce/label/c.description_of_funding";
import amount from "@salesforce/label/c.amount";
import amount_secured from "@salesforce/label/c.amount_secured";
import we_are_attaching_confirmation from "@salesforce/label/c.we_are_attaching_confirmation";

export const RISKS_COLUMNS = [
  { label: "Risk", apiName: "Name" },
  { label: "Likelihood", apiName: "Likelihood__c" },
  { label: "Impact", apiName: "Impact__c" },
  { label: "Mitigation", apiName: "Mitigation__c" },
  { label: "Who will lead this", apiName: "Who_will_lead_this__c" }
];

export const COSTS_COLUMNS = [
  { label: "Cost heading", apiName: "Cost_heading__c" },
  { label: "Description", apiName: "Project_Cost_Description__c" },
  { label: "Cost", apiName: "Costs__c" },
  { label: "VAT", apiName: "Vat__c" },
  { label: "Total", apiName: "Total_Cost__c" }
];

export const INCOMES_COLUMNS = [
  { label: "Source of funding", apiName: "Source_Of_Funding__c" },
  { label: "Description", apiName: "Description_for_cash_contributions__c" },
  { label: "Secured", apiName: "Secured__c" },
  { label: "Value", apiName: "Value__c" }
];

export const PARTNERSHIP_COLUMNS = [
  { label: description_of_funding, apiName: "description_of_funding" },
  { label: amount, apiName: "amount" },
  { label: amount_secured, apiName: "amount_secured" },
  { label: we_are_attaching_confirmation, apiName: "confirmation" }
];

export const APPROVED_PURPOSES = [
  { label: "Approved Purposes", apiName: "approved_purposes" }
];

export const SUPPORTING_DOCUMENT_COLUMNS = [
  {
    label: File_Name,
    fieldName: "Title",
    type: "text"
  },
  {
    label: File_Type,
    fieldName: "FileType",
    type: "text",
    resizable: false,
    wrapText: true,
    hideDefaultActions: true,
    fixedWidth: 120
  },
  {
    label: "",
    type: "button-icon",
    typeAttributes: {
      iconName: "action:close",
      title: "Delete",
      name: "Delete",
      letiant: "destructive",
      alternativeText: "Delete"
    },
    wrapText: false,
    hideDefaultActions: true,
    resizable: false,
    fixedWidth: 70
  }
];

export const DOCUMENT_UPLOADER_DEFAULT_COLUMNS = [
  {
    label: File_Name,
    fieldName: "Title",
    type: "text"
  }
];

export const SPENDING_SUMMARY = [
  {
    label: "Cost heading",
    fieldName: "cost_heading",
    type: "text"
  },
  {
    label: "Invoice reference",
    fieldName: "invoice_reference",
    type: "text"
  },
  {
    label: "Invoice date",
    fieldName: "invoice_date",
    type: "text"
  },
  {
    label: "Name of supplier",
    fieldName: "name_of_supplier",
    type: "text"
  },
  {
    label: "Description",
    fieldName: "description",
    type: "text"
  },
  {
    label: "Total of eligible costs (Excluding VAT)",
    fieldName: "total_of_eligible",
    type: "text"
  },
  {
    label: "VAT",
    fieldName: "vat",
    type: "text"
  },
  {
    label: "Total",
    fieldName: "total",
    type: "text"
  },
  {
    label: "We are attaching proof of expenditure",
    fieldName: "we_are_attaching",
    type: "text"
  },
  {
    label: "",
    fieldName: "deleteCost",
    type: "action"
  }
];