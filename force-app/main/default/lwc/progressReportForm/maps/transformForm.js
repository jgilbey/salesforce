export const transformForm = (formObject, userData, docsData, approvedPurposeList, projectIncomes) => {
  return {
    id: formObject.Id || null,
    status: formObject.Status__c || null,
    recordTypeDeveloperName: formObject.RecordTypeId? formObject.RecordType.DeveloperName: null,
    projectTitle: formObject.Project_Title__c || null,
    projectRef: formObject.Project_ref__c || null,
    progressReportNumber: formObject.Progress_report_number__c || null,
    howRisksBeingManaged: formObject.How_project_risks_being_managed__c || null,
    overallCompletionDate: formObject.Likely_overall_completion_date__c || null,
    projectTimetable: formObject.Project_timetable__c || null,
    statutoryPermissionsRequired: formObject.We_have_statutory_permissions_required__c || null,
    statutoryPermissionsFurtherInfo: formObject.Further_info_on_statutory_permissions__c || null,
    isPartnerFundingLastReport: formObject.Partnership_funding_since_last_report__c || null,
    fundingAcknowledgement: formObject.NHMF_Funding_acknowledgement__c || null,
    grantAwarded: formObject.Grant_Awarded__c || null,
    grantExpiryDate: formObject.Case__r.Grant_Expiry_Date__c || null,
    havePurchasedGoods: formObject.Have_you_purchased_goods__c || null,
    purchasedGoodsDetails: formObject.Purchased_goods_worth_10000_details__c || null,
    reasonNotAwardTender: formObject.Reason_not_award_to_lowest_tender__c || null,
    isVendorLinked: formObject.Is_vendor_linked__c || null,
    explainVendorAppointed: formObject.Explain_why_vendor_appointed__c || null,
    attachingCostBreakdown: formObject.Attaching_a_cost_breakdown__c,
    isAttachingTimetable: formObject.Attaching_a_proposed_timetable__c,
    isAttachingDetailsProjectManagement: formObject.Attaching_details_of_project_management__c,
    statutoryPermission: formObject.We_have_statutory_permissions_required__c,
    agreeWithStatements: formObject.Agree_with_the_statements__c,
    caseId: formObject.Case__c || null,
    totalCosts: formObject.Case__r.Total_Cost__c || null,
    grantPercentage: formObject.Case__r.NHMF_Grant_Percentage__c || null,
    contactId: userData && userData.Contact ? userData.ContactId : null,
    contactName: userData && userData.Contact ? userData.Contact.Name : null,
    contactTitle: userData && userData.Contact ? userData.Contact.Title : null,
    organisationName:
      userData && userData.Contact && userData.Contact.Account
        ? userData.Contact.Account.Name
        : null,
    organisationId:
      userData && userData.Contact ? userData.Contact.AccountId : null,
    bankAccountId: formObject.Bank_Accounts__r
      ? formObject.Bank_Accounts__r[0].Id
      : null,
    totalPartnershipFunding: formObject.Case__r.NHMF_Total_Cash_Contributions__c || null,
    accountName: formObject.Bank_Accounts__r
      ? formObject.Bank_Accounts__r[0].Account_Name__c
      : null,
    accountNumber: formObject.Bank_Accounts__r
      ? formObject.Bank_Accounts__r[0].Account_Number__c
      : null,
    sortCode: formObject.Bank_Accounts__r
      ? formObject.Bank_Accounts__r[0].Sort_Code__c
      : null,
    societyRollNumber: formObject.Bank_Accounts__r
      ? formObject.Bank_Accounts__r[0].Building_Society_Roll_Numbe__c
      : null,
    paymentCode: formObject.Bank_Accounts__r
      ? formObject.Bank_Accounts__r[0].Code_to_use_for_payment_making__c
      : null,
    partnershipFunding: projectIncomes
      ? transformPartnershipArray([...projectIncomes])
      : null,
    approvedPurposes: approvedPurposeList
      ? transformApprovedPurposesArray([
          ...approvedPurposeList
        ])
      : null,
    docsData: transformDocument(docsData),
    isBlocked: formObject.Status__c == "Submitted"
  };
};

export const transformRefreshedForm = (
  formObject,
  caseData,
  bankAccount,
  approvedPurposes,
  projectIncome,
  contactObject,
  orgObject,
  docsData,
  recordType
) => {
  return {
    id: formObject.Id || null,
    recordTypeDeveloperName: recordType,
    projectTitle: formObject.Project_Title__c || null,
    projectRef: formObject.Project_ref__c || null,
    grantAwarded: formObject.Grant_Awarded__c || null,
    grantExpiryDate: formObject.Grant_Expiry_Date__c || null,
    isAttachingTimetable: formObject.Attaching_a_proposed_timetable__c,
    isAttachingDetailsProjectManagement:
      formObject.Attaching_details_of_project_management__c,
    statutoryPermission: formObject.We_have_statutory_permissions_required__c,
    attachingCostBreakdown: formObject.Attaching_a_cost_breakdown__c,
    agreeWithStatements: formObject.Agree_with_the_statements__c,
    caseId: caseData.caseId || null,
    totalCosts: caseData.totalCosts || null,
    grantPercentage: caseData.grantPercentage || null,
    contactId: contactObject ? contactObject.Id : null,
    contactName: contactObject ? contactObject.Name : null,
    contactTitle: contactObject ? contactObject.Title : null,
    organisationName: orgObject ? orgObject.Name : null,
    organisationId: orgObject ? orgObject.Id : null,
    bankAccountId: bankAccount ? bankAccount.Id : null,
    totalPartnershipFunding: caseData.NHMF_Total_Cash_Contributions__c || null,
    accountName: bankAccount ? bankAccount.Account_Name__c : null,
    accountNumber: bankAccount ? bankAccount.Account_Number__c : null,
    sortCode: bankAccount ? bankAccount.Sort_Code__c : null,
    societyRollNumber: bankAccount
      ? bankAccount.Building_Society_Roll_Numbe__c
      : null,
    paymentCode: bankAccount
      ? bankAccount.Code_to_use_for_payment_making__c
      : null,
    partnershipFunding: projectIncome
      ? transformPartnershipArray([...projectIncome])
      : null,
    approvedPurposes: approvedPurposes
      ? transformApprovedPurposesArray([...approvedPurposes])
      : null,
    docsData: docsData
  };
};

export const transformPartnershipArray = (array) => {
  return array.map((el) => ({
    sourceOfFunding: el.Source_Of_Funding__c,
    amountExpect: el.Value__c,
    amountReceived: el.Amount_you_have_received__c,
    amountStillToCome: el.Amount_still_to_come__c,
    expectedDate: el.Date_you_expect_this_amount__c ,
    id: el.Id
  }));
};

export const transformApprovedPurposesArray = (array) => {
  return array.map((el, index) => ({
    purpose: el.Approved_Purposes__c,
    id: el.Id,
    summary: el.Final_summery_of_achievements__c,
    index: index
  }));
};

export const transformDocument = (contentDocument) =>{
  return contentDocument.map(doc=>{
    let tempDoc = {...doc};
    tempDoc.name = tempDoc.Title;
    return tempDoc;
  });
}