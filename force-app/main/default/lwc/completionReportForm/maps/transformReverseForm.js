export const transformReverseForm = (formData) => {
  return {
    formObject: {
      attributes: { type: "Forms__c" },
      Id: formData.id,
      Project_Title__c: formData.projectTitle,
      Project_ref__c: formData.projectRef,
      Grant_Expiry_Date__c: formData.grantExpiryDate,
      NHMF_Funding_acknowledgement__c: formData.fundingAknowledgement,
      Lesson_learned_details__c: formData.lessonLearnedDetails,
      Partnership_funding_since_last_report__c: formData.hasProjectIncomes,
      We_have_statutory_permissions_required__c: formData.hasStaturyPermissions,
      Further_info_on_statutory_permissions__c: formData.staturyPermissionInfo,
      Have_you_purchased_goods__c: formData.haveYouPurchasedGoods,
      Purchased_goods_worth_10000_details__c: formData.purchasedGoods,
      Reason_not_award_to_lowest_tender__c: formData.reasonNotAwardToTender,
      Is_vendor_linked__c: formData.isVendorLinked,
      Explain_why_vendor_appointed__c: formData.explainWhyVendorAppointed,
      Substantive_changes_to_agreed_budget__c: formData.substantiveChanges
    },
    approvedPurposes: formData.approvedPurposes
      ? transformReverseApprovedList(formData.approvedPurposes, formData.id)
      : [],
    projectIncomes: formData.projectIncomes
      ? transformProjectIncomesList(formData.projectIncomes, formData)
      : [],
      spendingCosts: formData.spendingCosts
      ? transformReverseSpendingCosts(formData.spendingCosts, formData)
      : null
  };
};

const transformReverseSpendingCosts = (array, formData) => {
  return array.map((el) => ({
    attributes: { type: "Spending_Costs__c" },
    Cost_Heading__c: el.costHeading,
    Invoice_Reference_Number__c: el.invoiceReferenceNumber,
    Invoice_Date__c: el.invoiceDate,
    Name_of_supplier__c: el.supplierName,
    Description__c: el.description,
    Cost_to_date__c: el.costToDate,
    VAT__c: el.vat,
    Total__c: el.total,
    We_are_attaching_proof_of_expenditure__c: el.attachExpenditureProof,
    Id: el.id,
    Forms__c: formData.id
  }));
};

const transformReverseApprovedList = (array, formId) => {
  return array.map((el) => ({
    attributes: { type: "Approved__c" },
    Approved_Purposes__c: el.purpose,
    Final_summery_of_achievements__c: el.summary,
    Id: el.id,
    Forms__c: formId
  }));
};

const transformProjectIncomesList = (array, formData) => {
  return array.map((el) => ({
    attributes: { type: "Project_Income__c" },
    Source_Of_Funding__c: el.sourceOfFunding,
    Value__c: el.amountExpect,
    Amount_you_have_received__c: el.amountReceived,
    Amount_still_to_come__c: el.amountStillToCome,
    Date_you_expect_this_amount__c: el.expectedDate,
    Id: el.id,
    Case__c: formData.caseId,
    Forms__c: formData.id
  }));
};