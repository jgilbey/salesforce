import constants from "c/constants";
const { monitoringFormTypes } = constants;
export const transformForm = (formObject, approvedPurposeList, projectIncomes, docsData) => {
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
    paymentPercentage: formObject.Case__r.NHMF_Grant_Percentage__c || null,
    fundingAknowledgement: formObject.NHMF_Funding_acknowledgement__c || null,
    lessonLearnedDetails: formObject.Lesson_learned_details__c || null,
    hasProjectIncomes: formObject.Partnership_funding_since_last_report__c,
    hasStaturyPermissions: formObject.We_have_statutory_permissions_required__c,
    staturyPermissionInfo: formObject.Further_info_on_statutory_permissions__c,
    haveYouPurchasedGoods: formObject.Have_you_purchased_goods__c,
    purchasedGoods: formObject.Purchased_goods_worth_10000_details__c,
    reasonNotAwardToTender: formObject.Reason_not_award_to_lowest_tender__c,
    isVendorLinked: formObject.Is_vendor_linked__c,
    explainWhyVendorAppointed: formObject.Explain_why_vendor_appointed__c,
    substantiveChanges: formObject.Substantive_changes_to_agreed_budget__c,
    approvedPurposes: approvedPurposeList
      ? transformApprovedPurposesArray([...approvedPurposeList])
      : null,
    projectIncomes: projectIncomes
      ? transformProjectIncomesArray([...projectIncomes])
      : null,
    spendingCosts: formObject.Spending_Costs__r
      ? transformSpendingCosts([...formObject.Spending_Costs__r])
      : null,
    docsData: docsData,
    images: obtainFiles(docsData, monitoringFormTypes.FORM_IMAGES_FILE_PREFIX),
    submissions: obtainFiles(
      docsData,
      monitoringFormTypes.SUBMISSION_FILE_PREFIX
    ),
    proofFiles:obtainFiles(docsData, "Proof"),
  };
};

export const transformProjectIncomesArray = (array) => {
  return array.map((el, index) => ({
    sourceOfFunding: el.Source_Of_Funding__c,
    amountExpect: el.Value__c,
    amountReceived: el.Amount_you_have_received__c,
    amountStillToCome: el.Amount_still_to_come__c,
    expectedDate: el.Date_you_expect_this_amount__c,
    id: el.Id,
    index: index
  }));
};

const transformApprovedPurposesArray = (array) => {
  return array.map((el, index) => ({
    purpose: el.Approved_Purposes__c,
    id: el.Id,
    summary: el.Final_summery_of_achievements__c,
    index: index
  }));
};

export const transformRefreshedForm = (
  formObject,
  caseData,
  spendingCosts,
  docsData,
  recordType
) => {
  return {
    id: formObject.Id || null,
    recordTypeDeveloperName: recordType,
    projectTitle: formObject.Project_Title__c || null,
    projectRef: formObject.Project_ref__c || null,
    totalGrantAwarded: formObject.NHMF_Total_Grant_Award__c || null,
    grantExpiryDate: formObject.Grant_Expiry_Date__c || null,
    caseId: caseData.caseId,
    totalCosts: caseData.totalCosts || null,
    paymentPercentage: caseData.paymentPercentage || null,
    fundingAknowledgement: formObject.NHMF_Funding_acknowledgement__c || null,
    lessonLearnedDetails: formObject.Lesson_learned_details__c || null,
    spendingCosts: spendingCosts
      ? transformSpendingCosts([...spendingCosts])
      : null,
    docsData: docsData
  };
};

export const transformSpendingCosts = (array) => {
  return array.map((el,index) => ({
    costHeading: el.Cost_Heading__c,
    invoiceReferenceNumber: el.Invoice_Reference_Number__c,
    invoiceDate: el.Invoice_Date__c,
    supplierName: el.Name_of_supplier__c,
    description: el.Description__c,
    costToDate: el.Cost_to_date__c,
    vat: el.VAT__c,
    total: el.Total__c,
    attachExpenditureProof: el.We_are_attaching_proof_of_expenditure__c,
    totalSpentCost: el.Total_spent_cost__c,
    id: el.Id,
    index: index
  }));
};

const obtainFiles = (array, prefix) => {
  if (!array || array.length == 0) {
    return [];
  }
  return array.filter((el) => {
    if (el.Title.startsWith(prefix + "_")) {
      return true;
    }
    return false;
  });
};