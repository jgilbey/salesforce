export const transformReverseForm = (formData) => {
  return {
      Id: formData.id,
      Status__c: formData.status,
      Project_Title__c: formData.projectTitle,
      Project_ref__c: formData.projectRef,
      Grant_Awarded__c: formData.grantAwarded,
      Attaching_a_proposed_timetable__c: formData.isAttachingTimetable,
      Attaching_details_of_project_management__c: formData.isAttachingDetailsProjectManagement,
      We_have_statutory_permissions_required__c: formData.statutoryPermission,
      Agree_with_the_statements__c: formData.agreeWithStatements,
      How_project_risks_being_managed__c: formData.howRisksBeingManaged,
      Likely_overall_completion_date__c: formData.overallCompletionDate,
      Project_timetable__c: formData.projectTimetable,
      We_have_statutory_permissions_required__c: formData.statutoryPermissionsRequired,
      Further_info_on_statutory_permissions__c: formData.statutoryPermissionsFurtherInfo,
      Partnership_funding_since_last_report__c: formData.isPartnerFundingLastReport,
      Have_you_purchased_goods__c: formData.havePurchasedGoods,
      Purchased_goods_worth_10000_details__c: formData.purchasedGoodsDetails,
      Reason_not_award_to_lowest_tender__c: formData.reasonNotAwardTender,
      Is_vendor_linked__c: formData.isVendorLinked,
      Explain_why_vendor_appointed__c: formData.explainVendorAppointed,
      NHMF_Funding_acknowledgement__c: formData.fundingAcknowledgement
  };
};

export const transformReversePartnershipArray = (array, formData) => {
  return array.map((el) => ({
    attributes: { type: "Project_Income__c" },
    Source_Of_Funding__c: el.sourceOfFunding,
    Value__c: el.amountExpect,
    Amount_you_have_received__c: el.amountReceived,
    Amount_still_to_come__c: el.amountStillToCome,
    Date_you_expect_this_amount__c: el.expectedDate,
    Id: el.id,
    Case__c: formData.caseId,
    Forms__c: formData.id,
    Description_for_cash_contributions__c: el.sourceOfFunding,
    amount: 0
  }));
};

export const transformReverseApprovedList = (array, formId) => {
  return array.map((el) => ({
    attributes: { type: "Approved__c" },
    Approved_Purposes__c: el.purpose,
    Final_summery_of_achievements__c: el.summary,
    Id: el.id,
    Forms__c: formId
  }));
};