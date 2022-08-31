export const transformForm = (formObject, docsData) => {
  return {
    id: formObject.Id || null,
    recordTypeDeveloperName: formObject.RecordTypeId
      ? formObject.RecordType.DeveloperName
      : null,
    projectTitle: formObject.Project_Title__c || null,
    projectRef: formObject.Project_ref__c || null,
    totalGrantAwarded: formObject.NHMF_Total_Grant_Award__c || null,
    grantExpiryDate: formObject.Grant_Expiry_Date__c || null,
    caseId: formObject.Case__c || null,
    totalCosts: formObject.Case__r.Total_amount_cost__c || null,
    fundingAknowledgement: formObject.NHMF_Funding_acknowledgement__c || null,
    lessonLearnedDetails: formObject.Lesson_learned_details__c || null,
    paymentPercentage: formObject.Case__r.NHMF_Grant_Percentage__c || 0,
    substantiveChanges: formObject.Substantive_changes_to_agreed_budget__c,
    status: formObject.Status__c,
    spendingCosts: formObject.Spending_Costs__r
      ? transformSpendingCosts([...formObject.Spending_Costs__r])
      : null,
    docsData: transformDocument(docsData)
  };
};

export const transformSpendingCosts = (array) => {
  return array.map((el) => ({
    costHeading: el.Cost_Heading__c,
    invoiceReferenceNumber: el.Invoice_Reference_Number__c,
    invoiceDate: el.Invoice_Date__c,
    supplierName: el.Name_of_supplier__c,
    description: el.Description__c,
    costToDate: el.Cost_to_date__c,
    vat: el.VAT__c,
    total: el.Total__c,
    attachExpenditureProof: el.We_are_attaching_proof_of_expenditure__c,
    id: el.Id
  }));
};

export const revertTransform = (spendingCosts, formId) => {
  return spendingCosts.map((el) => ({
    Cost_Heading__c: el.costHeading,
    Invoice_Reference_Number__c: el.invoiceReferenceNumber,
    Invoice_Date__c: el.invoiceDate,
    Name_of_supplier__c: el.supplierName,
    Description__c: el.description,
    Cost_to_date__c: el.costToDate,
    VAT__c: el.vat,
    We_are_attaching_proof_of_expenditure__c: el.attachExpenditureProof,
    Id: el.id,
    Forms__c: formId,
    attributes:{type:'Spending_Costs__c'}
  }));
};

export const revertFormTransform = (formWrappedData) => {
  let formRecord = {
    Id: formWrappedData.id,
    Substantive_changes_to_agreed_budget__c: formWrappedData.substantiveChanges,
    Status__c : formWrappedData.status
  };
  return formRecord;
};

export const transformDocument = (contentDocument) =>{
  return contentDocument.map(doc=>{
    let tempDoc = {...doc};
    tempDoc.name = tempDoc.Title;
    return tempDoc;
  });
}