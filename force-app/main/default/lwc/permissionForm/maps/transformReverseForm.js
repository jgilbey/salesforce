export const transformReverseForm = (formData) => {
  return {
    formObject: {
      attributes: { type: "Forms__c" },
      Id: formData.id,
      Project_Title__c: formData.projectTitle,
      Project_ref__c: formData.projectRef,
      Grant_Awarded__c: formData.grantAwarded,
      Grant_Expiry_Date__c: formData.grantExpiryDate,
      Attaching_a_proposed_timetable__c: formData.isAttachingTimetable,
      Attaching_details_of_project_management__c:
        formData.isAttachingDetailsProjectManagement,
      Permissions_or_licences_information__c: formData.statutoryPermission,
      Authorised_Person1_Name__c: formData.authorisedPerson1,
      Authorised_Person2_Name__c: formData.authorisedPerson2,
      Authorised_Person3_Name__c: formData.authorisedPerson3,
      Agree_with_the_statements__c: formData.agreeWithStatements,
      Attaching_a_cost_breakdown__c: formData.attachingCostBreakdown,
      Attaching_Bank_Account_Details__c: formData.isAttachedBankAccountDetails
    },
    bankAccountObject: {
      attributes: { type: "Bank_Account__c" },
      Id: formData.bankAccountId,
      Account_Name__c: formData.accountName,
      Account_Number__c: formData.accountNumber,
      Sort_Code__c: formData.sortCode,
      Building_Society_Roll_Numbe__c: formData.societyRollNumber,
      Code_to_use_for_payment_making__c: formData.paymentCode,
      Forms__c: formData.id
    },
    approvedPurposesObject: formData.approvedPurposes
      ? transformReverseApprovedPurposesArray(formData.approvedPurposes, formData.id)
      : null,
    projectIncomes: formData.partnershipFunding
      ? transformReversePartnershipArray(formData.partnershipFunding, formData)
      : null,
    contactObject: {
      attributes: { type: "Contact" },
      Id: formData.contactId,
      Name: formData.contactName,
      Title: formData.contactTitle
    },
    organisationObject: {
      attributes: { type: "Account" },
      Id: formData.organisationId,
      Name: formData.organisationName
    }
  };
};

const transformReversePartnershipArray = (array, formData) => {
  return array.map((el) => ({
    attributes: { type: "Project_Income__c" },
    attaching_proof_of_partnership_funding__c: el.attachingConfirmation,
    Amount_secured__c: el.amountSecured,
    Id: el.id,
    Forms__c: formData.id
  }));
};

const transformReverseApprovedPurposesArray = (array, formId) => {
  return array.map((el) => ({
    attributes: { type: "Approved__c" },
    Approved_Purposes__c: el.purpose,
    Id: el.id,
    Forms__c: formId
  }));
};