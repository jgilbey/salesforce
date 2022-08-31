export const STAGE_FIELD_MAP = new Map([
  ["applicationFormObject.projectCase.Project_Title__c", "Section 0"],
  ["applicationFormObject.projectCase.Project_Summery__c", "Section 0"],
  ["applicationFormObject.projectCase.Project_Street__c", "Section 1"],
  ["applicationFormObject.projectCase.Project_City__c", "Section 1"],
  ["applicationFormObject.projectCase.Project_County__c", "Section 1"],
  ["applicationFormObject.projectCase.Project_Post_Code__c", "Section 1"],
  [
    "applicationFormObject.projectCase.Account.Organisation_s_Main_Purpose_Activities__c",
    "Section 1"
  ],
  [
    "applicationFormObject.projectCase.Account.Organisation_s_Legal_Status_part_1__c",
    "Section 1"
  ],
  // ['applicationFormObject.projectCase.Account.Organisation_s_Legal_Status_part_2__c', 'Section 1'],
  // ['applicationFormObject.projectCase.Account.Other_Legal_Status_Type__c', 'Section 1'],
  [
    "applicationFormObject.projectCase.Delivery_partner_details__c",
    "Section 1"
  ],
  ["applicationFormObject.projectCase.Account.VAT_number__c", "Section 1"],
  [
    "applicationFormObject.projectCase.Deadline_by_which_you_need_a_decision__c",
    "Section 2"
  ],
  [
    "applicationFormObject.projectCase.Do_you_want_a_grant_to_buy_Property__c",
    "Section 2"
  ],
  [
    "applicationFormObject.projectCase.Information_about_the_value_of_property__c",
    "Section 2"
  ],
  ["applicationFormObject.projectCase.Capital_work_owner__c", "Section 2"],
  [
    "applicationFormObject.projectCase.Capital_work_by_Organization_details__c",
    "Section 2"
  ],
  [
    "applicationFormObject.projectCase.Capital_work_by_Project_partner_details__c",
    "Section 2"
  ],
  [
    "applicationFormObject.projectCase.Capital_work_ownership_will_assign__c",
    "Section 2"
  ],
  [
    "applicationFormObject.projectCase.Item_of_importance_to_national_heritage__c",
    "Section 3"
  ],
  [
    "applicationFormObject.projectCase.Property_item_of_outstanding_interest__c",
    "Section 3"
  ],
  ["applicationFormObject.projectCase.Property_Details__c", "Section 3"],
  [
    "applicationFormObject.projectCase.Details_for_risk_of_item_or_property__c",
    "Section 3"
  ],
  // ['applicationFormObject.projectCase.Does_your_property_have_Memorial_connect__c', 'Section 3'],
  [
    "applicationFormObject.projectCase.Details_of_providing_care_for_property__c",
    "Section 3"
  ],
  [
    "applicationFormObject.projectCase.Other_measures_to_raise_funds__c",
    "Section 3"
  ],
  ["applicationFormObject.projectCase.Public_access_to__c", "Section 3"],
  ["applicationFormObject.currentProjectRisks.Case__c", "Section 4"],
  ["applicationFormObject.currentProjectRisks.Impact__c", "Section 4"],
  ["applicationFormObject.currentProjectRisks.Likelihood__c", "Section 4"],
  ["applicationFormObject.currentProjectRisks.Mitigation__c", "Section 4"],
  ["applicationFormObject.currentProjectRisks.Name", "Section 4"],
  [
    "applicationFormObject.currentProjectRisks.Who_will_lead_this__c",
    "Section 4"
  ],

  ["applicationFormObject.futureProjectRisks.Case__c", "Section 5"],
  ["applicationFormObject.futureProjectRisks.Impact__c", "Section 5"],
  ["applicationFormObject.futureProjectRisks.Likelihood__c", "Section 5"],
  ["applicationFormObject.futureProjectRisks.Mitigation__c", "Section 5"],
  ["applicationFormObject.futureProjectRisks.Name", "Section 5"],
  [
    "applicationFormObject.futureProjectRisks.Who_will_lead_this__c",
    "Section 5"
  ],

  ["applicationFormObject.projectCosts.Case__c", "Section 6"],
  ["applicationFormObject.projectCosts.Cost_heading__c", "Section 6"],
  ["applicationFormObject.projectCosts.Costs__c", "Section 6"],

  ["applicationFormObject.projectIncomes.Case__c", "Section 6"],
  [
    "applicationFormObject.projectIncomes.How_will_you_secure_cash_contributions__c",
    "Section 6"
  ],
  ["applicationFormObject.projectIncomes.Value__c", "Section 6"],
  [
    "applicationFormObject.projectIncomes.Description_for_cash_contributions__c",
    "Section 6"
  ],
  ["applicationFormObject.projectIncomes.Source_Of_Funding__c", "Section 6"],

  ["applicationFormObject.projectPartners.Case__c", "Section 7"],
  ["applicationFormObject.projectPartners.Name", "Section 7"],
  ["applicationFormObject.projectPartners.Organisation__c", "Section 7"],
  ["applicationFormObject.projectPartners.Position__c", "Section 7"],

  ["applicationFormObject.projectCase.Contact.Title", "Section 7"],
  [
    "allProjectsDocsQuestionsData.allProjectsQuestion1.data.provisionType",
    "Section 8"
  ],
  [
    "allProjectsDocsQuestionsData.allProjectsQuestion2.data.provisionType",
    "Section 8"
  ],
  [
    "allProjectsDocsQuestionsData.allProjectsQuestion3.data.provisionType",
    "Section 8"
  ],
  [
    "allProjectsDocsQuestionsData.allProjectsQuestion4.data.provisionType",
    "Section 8"
  ],
  [
    "allProjectsDocsQuestionsData.allProjectsQuestion5.data.provisionType",
    "Section 8"
  ],
  [
    "allProjectsDocsQuestionsData.allProjectsQuestion6.data.provisionType",
    "Section 8"
  ],
  [
    "allProjectsDocsQuestionsData.allProjectsQuestion7.data.provisionType",
    "Section 8"
  ]
  // ['allProjectsDocsQuestionsData.acquisitionProjects1.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.acquisitionProjects2.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.acquisitionProjects3.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.acquisitionProjects4.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects1.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects2.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects2.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects3.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects4.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects5.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects6.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects7.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.capitalWorksProjects8.data.provisionType', 'Section 8'],
  // ['allProjectsDocsQuestionsData.allProjectsQuestion8.data.provisionType', 'Section 8']
]);

export const STAGE_FIELD_VALIDATE_CONDITION = {
  "applicationFormObject.projectCase.Delivery_partner_details__c":
    "applicationFormObject.projectCase.Delivered_by_partnership__c"
};