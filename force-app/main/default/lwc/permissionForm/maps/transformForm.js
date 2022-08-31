import constants from "c/constants";
const { monitoringFormTypes } = constants;
export const transformForm = (
  formObject,
  userData,
  docsData,
  projectIncomes,
  approvedPurposeList
) => {
  return {
    id: formObject.Id || null,
    recordTypeDeveloperName: formObject.RecordTypeId
      ? formObject.RecordType.DeveloperName
      : null,
    projectTitle: formObject.Project_Title__c || null,
    projectRef: formObject.Project_ref__c || null,
    grantAwarded: formObject.NHMF_Grant_Award__c || null,
    grantExpiryDate: formObject.Grant_Expiry_Date__c || null,
    attachingCostBreakdown: formObject.Attaching_a_cost_breakdown__c,
    isAttachingTimetable: formObject.Attaching_a_proposed_timetable__c,
    isAttachingDetailsProjectManagement:
      formObject.Attaching_details_of_project_management__c,
    statutoryPermission: formObject.Permissions_or_licences_information__c,
    authorisedPerson1: formObject.Authorised_Person1_Name__c || null,
    authorisedPerson2: formObject.Authorised_Person2_Name__c || null,
    authorisedPerson3: formObject.Authorised_Person3_Name__c || null,
    agreeWithStatements: formObject.Agree_with_the_statements__c,
    caseId: formObject.Case__c || null,
    totalCosts: formObject.Case__r.Total_amount_cost__c || null,
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
    totalPartnershipFunding:
      formObject.Case__r.NHMF_Total_cash_contributions__c || null,
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
    isAttachedBankAccountDetails: formObject.Attaching_Bank_Account_Details__c,
    partnershipFunding: projectIncomes
      ? transformPartnershipArray([...projectIncomes])
      : null,
    approvedPurposes: approvedPurposeList
      ? transformApprovedPurposesArray([...approvedPurposeList])
      : null,
    lastStepFile: obtainFiles(
      docsData,
      monitoringFormTypes.LAST_STEP_FILE_PREFIX
    ),
    partnerFindingFiles: obtainFiles(
      docsData,
      monitoringFormTypes.PARTNER_FINDING_FILE_PREFIX
    )
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
    recordTypeDeveloperName: formObject.recordTypeDeveloperNames,
    projectTitle: formObject.Project_Title__c || null,
    projectRef: formObject.Project_ref__c || null,
    grantAwarded: formObject.NHMF_Grant_Award__c || null,
    grantExpiryDate: formObject.Grant_Expiry_Date__c || null,
    isAttachingTimetable: formObject.Attaching_a_proposed_timetable__c,
    isAttachingDetailsProjectManagement:
      formObject.Attaching_details_of_project_management__c,
    statutoryPermission: formObject.Permissions_or_licences_information__c,
    authorisedPerson1: formObject.Authorised_Person1_Name__c || null,
    authorisedPerson2: formObject.Authorised_Person2_Name__c || null,
    authorisedPerson3: formObject.Authorised_Person3_Name__c || null,
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
    totalPartnershipFunding: caseData.NHMF_Total_cash_contributions__c || null,
    accountName: bankAccount ? bankAccount.Account_Name__c : null,
    accountNumber: bankAccount ? bankAccount.Account_Number__c : null,
    sortCode: bankAccount ? bankAccount.Sort_Code__c : null,
    societyRollNumber: bankAccount
      ? bankAccount.Building_Society_Roll_Numbe__c
      : null,
    paymentCode: bankAccount
      ? bankAccount.Code_to_use_for_payment_making__c
      : null,
    isAttachedBankAccountDetails: formObject.Attaching_Bank_Account_Details__c,
    partnershipFunding: projectIncome
      ? transformPartnershipArray([...projectIncome])
      : null,
    approvedPurposes: approvedPurposes
      ? transformApprovedPurposesArray([...approvedPurposes])
      : null,

    lastStepFile: obtainFiles(
      docsData,
      monitoringFormTypes.LAST_STEP_FILE_PREFIX
    ),
    partnerFindingFiles: obtainFiles(
      docsData,
      monitoringFormTypes.PARTNER_FINDING_FILE_PREFIX
    )
  };
};

const transformPartnershipArray = (array) => {
  return array.map((el) => ({
    description: el.Description_for_cash_contributions__c,
    amount: el.Value__c,
    amountSecured: el.Amount_secured__c || 0,
    attachingConfirmation: el.attaching_proof_of_partnership_funding__c ,
    id: el.Id
  }));
};

const transformApprovedPurposesArray = (array) => {
  console.log("APPROVED PURPOSES: ", array);
  return array.map((el) => ({
    purpose: el.Approved_Purposes__c,
    id: el.Id
  }));
};

const obtainFiles = (array, prefix) => {
  if(!array || array.length == 0){
    return [];
  }
  return array.filter((el) => {
    if (el.Title.startsWith(prefix + "_")) {
      return true;
    }
    return false;
  });
};