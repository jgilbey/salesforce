import { LightningElement, api, track, wire } from "lwc";
import formStage0 from "./applicationFormStage0.html";
import formStage1 from "./applicationFormStage1.html";
import formStage2 from "./applicationFormStage2.html";
import formStage3 from "./applicationFormStage3.html";
import formStage4 from "./applicationFormStage4.html";
import formStage5 from "./applicationFormStage5.html";
import formStage6 from "./applicationFormStage6.html";
import formStage7 from "./applicationFormStage7.html";
import formStage8 from "./applicationFormStage8.html";
import obtainProjectCaseOptions from "@salesforce/apex/ApplicantFormController.obtainProjectCaseOptions";
import updateFileTitlesOnApplicationForm from "@salesforce/apex/ApplicantFormController.updateFileTitlesOnApplicationForm";
import { deleteRecord } from "lightning/uiRecordApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import HERITAGE_FIELD from "@salesforce/schema/Case.Heritage_Formal_designation__c";
import HEADING_FIELD from "@salesforce/schema/Project_Cost__c.Cost_heading__c";
import FUNDING_FIELD from "@salesforce/schema/Project_Income__c.Source_Of_Funding__c";
import constants from "c/constants";

import Intro_Application_Form_Notes from "@salesforce/label/c.Intro_Application_Form_Notes";
import Intro_AF_Confirmation from "@salesforce/label/c.Intro_AF_Confirmation";
import Project_title from "@salesforce/label/c.Project_title";
import Limit_15_words from "@salesforce/label/c.Limit_15_words";
import Stage_1_title from "@salesforce/label/c.Stage_1_title";
import AF_1a_section from "@salesforce/label/c.AF_1a_section";
import AF_1b_section from "@salesforce/label/c.AF_1b_section";
import Enter_another_project_address from "@salesforce/label/c.Enter_another_project_address";
import type_here from "@salesforce/label/c.type_here";
import Select_Type from "@salesforce/label/c.Select_Type";
import Please_specify from "@salesforce/label/c.Please_specify";
import What_is_your_project from "@salesforce/label/c.What_is_your_project";
import Limit_200_words from "@salesforce/label/c.Limit_200_words";
import Local_authority_project_place from "@salesforce/label/c.Local_authority_project_place";
import Constituency_project_place from "@salesforce/label/c.Constituency_project_place";
import AF_1c_section from "@salesforce/label/c.AF_1c_section";
import AF_1d_section from "@salesforce/label/c.AF_1d_section";
import Org_size_staff_structure from "@salesforce/label/c.Org_size_staff_structure";
import How_many_board_members_in_org from "@salesforce/label/c.How_many_board_members_in_org";
import Last_financial_year_org_expenses from "@salesforce/label/c.Last_financial_year_org_expenses";
import What_level_of_unrestricted_funds from "@salesforce/label/c.What_level_of_unrestricted_funds";
import Limit_150_words from "@salesforce/label/c.Limit_150_words";
import Org_type_info_title from "@salesforce/label/c.Org_type_info_title";
import Company_registration_number from "@salesforce/label/c.Company_registration_number";
import Charity_in_England_Scotland_Wales from "@salesforce/label/c.Charity_in_England_Scotland_Wales";
import AF_1e_section from "@salesforce/label/c.AF_1e_section";
import Currency_field from "@salesforce/label/c.Currency_field";
import Who_are_your_partners from "@salesforce/label/c.Who_are_your_partners";
import Upload_files from "@salesforce/label/c.Upload_files";
import Do_you_want_upload_files from "@salesforce/label/c.Do_you_want_upload_files";
import File_Type from "@salesforce/label/c.File_Type";
import File_Name from "@salesforce/label/c.File_Name";
import AF_1f_section from "@salesforce/label/c.AF_1f_section";
import Provide_VAT_Number from "@salesforce/label/c.Provide_VAT_Number";
import Intro_section_2 from "@salesforce/label/c.Intro_section_2";
import Header_section_2 from "@salesforce/label/c.Header_section_2";
import AF_2a_section from "@salesforce/label/c.AF_2a_section";
import give_deadline_details from "@salesforce/label/c.give_deadline_details";
import AF_2b_section from "@salesforce/label/c.AF_2b_section";
import AF_2c_section from "@salesforce/label/c.AF_2c_section";
import AF_2d_section from "@salesforce/label/c.AF_2d_section";
import Tell_building_name from "@salesforce/label/c.Tell_building_name";
import Tell_capital_work_owner from "@salesforce/label/c.Tell_capital_work_owner";
import Tell_us from "@salesforce/label/c.Tell_us";
import If_Org_has_a_land from "@salesforce/label/c.If_Org_has_a_land";
import If_Org_has_the_lease from "@salesforce/label/c.If_Org_has_the_lease";
import If_Org_has_a_mortage from "@salesforce/label/c.If_Org_has_a_mortage";
import Give_details_of_lender from "@salesforce/label/c.Give_details_of_lender";
import Partner_has_freehold_of_land from "@salesforce/label/c.Partner_has_freehold_of_land";
import Partner_Org_Name from "@salesforce/label/c.Partner_Org_Name";
import If_partner_has_lease from "@salesforce/label/c.If_partner_has_lease";
import If_partner_has_mortgage from "@salesforce/label/c.If_partner_has_mortgage";
import Give_details_of_lender_and_amount from "@salesforce/label/c.Give_details_of_lender_and_amount";
import If_not_meet_ownership_requirements from "@salesforce/label/c.If_not_meet_ownership_requirements";

import Any_legal_conditions from "@salesforce/label/c.Any_legal_conditions";
import Please_provide_details from "@salesforce/label/c.Please_provide_details";
import Has_condition_survey_been_undertaken from "@salesforce/label/c.Has_condition_survey_been_undertaken";
import Provide_Ordnance_Survey_grid from "@salesforce/label/c.Provide_Ordnance_Survey_grid";
import Does_project_involve_acquisition from "@salesforce/label/c.Does_project_involve_acquisition";
import Tick_any_of_following from "@salesforce/label/c.Tick_any_of_following";
import Stage_3_title from "@salesforce/label/c.Stage_3_title";
import Section_3_Intro from "@salesforce/label/c.Section_3_Intro";
import AF_3a_section from "@salesforce/label/c.AF_3a_section";
import AF_3b_section from "@salesforce/label/c.AF_3b_section";
import AF_3c_section from "@salesforce/label/c.AF_3c_section";
import AF_3d_section from "@salesforce/label/c.AF_3d_section";
import AF_3e_section from "@salesforce/label/c.AF_3e_section";
import AF_3f_section from "@salesforce/label/c.AF_3f_section";
import AF_3g_section from "@salesforce/label/c.AF_3g_section";
import AF_3h_section from "@salesforce/label/c.AF_3h_section";
import Stage_4_title from "@salesforce/label/c.Stage_4_title";
import AF_4a_section from "@salesforce/label/c.AF_4a_section";
import AF_4b_section from "@salesforce/label/c.AF_4b_section";
import AF_4c_section from "@salesforce/label/c.AF_4c_section";
import AF_4d_section from "@salesforce/label/c.AF_4d_section";
import Stage_5_title from "@salesforce/label/c.Stage_5_title";
import Intro_section_5 from "@salesforce/label/c.Intro_section_5";
import AF_5a_section from "@salesforce/label/c.AF_5a_section";

import AF_5b_section from "@salesforce/label/c.AF_5b_section";
import AF_5c_section from "@salesforce/label/c.AF_5c_section";
import Stage_6_title from "@salesforce/label/c.Stage_6_title";
import Intro_section_6 from "@salesforce/label/c.Intro_section_6";
import AF_6a_section from "@salesforce/label/c.AF_6a_section";
import AF_6b_section from "@salesforce/label/c.AF_6b_section";
import NHMF_grant_request from "@salesforce/label/c.NHMF_grant_request";
import Total from "@salesforce/label/c.Total";
import Financial_Summary from "@salesforce/label/c.Financial_Summary";
import Total_costs from "@salesforce/label/c.Total_costs";
import Total_partnership_funding from "@salesforce/label/c.total_partnership_funding";

import NHMF_grant_ratio from "@salesforce/label/c.NHMF_grant_ratio";
import AF_6c_section from "@salesforce/label/c.AF_6c_section";
import Stage_7_title from "@salesforce/label/c.Stage_7_title";
import Terms_of_Grant from "@salesforce/label/c.Terms_of_Grant";
import Must_read_terms_of_grant from "@salesforce/label/c.Must_read_terms_of_grant";
import All_partners_must_confirm_by_adding_a_contact from "@salesforce/label/c.All_partners_must_confirm_by_adding_a_contact";
import Freedom_of_Information from "@salesforce/label/c.Freedom_of_Information";
import As_part_of_the_application_process from "@salesforce/label/c.As_part_of_the_application_process";
import When_complete_the_Declaration from "@salesforce/label/c.When_complete_the_Declaration";
import We_will_take_these_into_account from "@salesforce/label/c.We_will_take_these_into_account";
import When_complete_Declaration_also_agree from "@salesforce/label/c.When_complete_Declaration_also_agree";

import Whether_to_give_grant from "@salesforce/label/c.Whether_to_give_grant";
import Monitor_and_evaluate_grants from "@salesforce/label/c.Monitor_and_evaluate_grants";
import Legitimate_interest_in_applications from "@salesforce/label/c.Legitimate_interest_in_applications";
import To_hold_in_database from "@salesforce/label/c.To_hold_in_database";
import If_we_offer_grant from "@salesforce/label/c.If_we_offer_grant";
import Support_our_work from "@salesforce/label/c.Support_our_work";
import Org_has_given_authority from "@salesforce/label/c.Org_has_given_authority";
import Application_falls_within_the_purposes from "@salesforce/label/c.Application_falls_within_the_purposes";
import Org_has_power_to_accept_grant from "@salesforce/label/c.Org_has_power_to_accept_grant";
import If_Org_receives_grant from "@salesforce/label/c.If_Org_receives_grant";
import Info_is_true_and_correct from "@salesforce/label/c.Info_is_true_and_correct";
import I_confirm_that_I_agree_with_the_above_statements from "@salesforce/label/c.I_confirm_that_I_agree_with_the_above_statements";
import Applying_on_behalf_of_partnership from "@salesforce/label/c.Applying_on_behalf_of_partnership";
import We_are_committed_to_being_as_open_as_possible from "@salesforce/label/c.We_are_committed_to_being_as_open_as_possible";

import Stage_8_title from "@salesforce/label/c.Stage_8_title";
import Intro_section_8 from "@salesforce/label/c.Intro_section_8";
import For_all_projects from "@salesforce/label/c.For_all_projects";
import All_projects_question_1 from "@salesforce/label/c.All_projects_question_1";
import All_projects_question_1_extra_info from "@salesforce/label/c.All_projects_question_1_extra_info";
import All_projects_question_2 from "@salesforce/label/c.All_projects_question_2";
import All_projects_question_3 from "@salesforce/label/c.All_projects_question_3";
import All_projects_question_4 from "@salesforce/label/c.All_projects_question_4";
import All_projects_question_5 from "@salesforce/label/c.All_projects_question_5";
import All_projects_question_6 from "@salesforce/label/c.All_projects_question_6";
import All_projects_question_7 from "@salesforce/label/c.All_projects_question_7";

import For_acquisition_projects from "@salesforce/label/c.For_acquisition_projects";
import Acquisition_Projects_1 from "@salesforce/label/c.Acquisition_Projects_1";
import Acquisition_Projects_2 from "@salesforce/label/c.Acquisition_Projects_2";
import Acquisition_Projects_3 from "@salesforce/label/c.Acquisition_Projects_3";
import Acquisition_Projects_4 from "@salesforce/label/c.Acquisition_Projects_4";

import For_Capital_Works from "@salesforce/label/c.For_Capital_Works";
import Capital_Works_Projects_1 from "@salesforce/label/c.Capital_Works_Projects_1";
import Capital_Works_Projects_2 from "@salesforce/label/c.Capital_Works_Projects_2";
import Capital_Works_Projects_3 from "@salesforce/label/c.Capital_Works_Projects_3";
import Capital_Works_Projects_4 from "@salesforce/label/c.Capital_Works_Projects_4";
import Capital_Works_Projects_5_1 from "@salesforce/label/c.Capital_Works_Projects_5_1";
import Capital_Works_Projects_5_2 from "@salesforce/label/c.Capital_Works_Projects_5_2";
import Capital_Works_Projects_6 from "@salesforce/label/c.Capital_Works_Projects_6";
import Capital_Works_Projects_7 from "@salesforce/label/c.Capital_Works_Projects_7";
import Capital_Works_Projects_8 from "@salesforce/label/c.Capital_Works_Projects_8";
import Attach_any_additional_documents from "@salesforce/label/c.Attach_any_additional_documents";
import utils from "c/utils";

const ARRAY_OF_CHECKBOXES = [
  "Is_Project_organisation_address_same__c",
  "Delivered_by_partnership__c",
  "Account.Are_you_VAT_registered__c",
  "Does_project_involve_physical_heritage__c",
  "Project_involved_acquisition__c",
  "Any_legal_restriction_which_may_impact__c",
  "Survey_in_last_5_years__c",
  "Decision_deadline__c",
  "Fixed_milestone_for_project_timetable__c",
  "Consent_for_application_form__c",
  "Behalf_of_partnership__c"
];

const {
  columnsConstants,
  questionsConstants,
  formatsConstants,
  stageFieldMapping
} = constants;
const { PDF, JPG, DOCX, DOC, XLSX, PPTX } = formatsConstants;
const ValidationUtils = utils.validation;

export default class ApplicationFormStages extends LightningElement {
  @track options = [];
  @track error;
  @track dropdown =
    "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
  @track dropdownList =
    "slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta";
  @track selectedListOfValues = [];
  @track costsObjectData = [];
  @track incomesObjectData = [];
  @track currentRisksObjectData = [];
  @track futureRisksObjectData = [];
  @track partnersObjectData = [];
  @track documentsObjectData = [];

  blockScroll = false;
  scrollTo = utils.scrollTo.bind(this);

  @track allProjectsDocsQuestionsData = questionsConstants.QUESTIONS_DATA;

  risksColumns = columnsConstants.RISKS_COLUMNS;
  costsColumns = columnsConstants.COSTS_COLUMNS;
  incomesColumns = columnsConstants.INCOMES_COLUMNS;
  fieldToStageMap = stageFieldMapping.STAGE_FIELD_MAP;

  @api
  selectedStepString;
  @api
  caseRtId = "";
  @api
  costRtId;
  @api
  incomeRtId;
  orgTypeList;
  legalStatusList1;
  legalStatusList2;
  workOwnerList;
  costsHeadingList;
  sourceOfFundingList;
  riskImpactList;
  riskLikelihoodList;
  documentProvisionTypes;
  hasFiles;
  steps = [
    { value: "step-0", template: formStage0 },
    { value: "step-1", template: formStage1 },
    { value: "step-2", template: formStage2 },
    { value: "step-3", template: formStage3 },
    { value: "step-4", template: formStage4 },
    { value: "step-5", template: formStage5 },
    { value: "step-6", template: formStage6 },
    { value: "step-7", template: formStage7 },
    { value: "step-8", template: formStage8 }
  ];

  labels = {
    Intro_Application_Form_Notes,
    Intro_AF_Confirmation,
    Project_title,
    Limit_15_words,
    Stage_1_title,
    AF_1a_section,
    AF_1b_section,
    Enter_another_project_address,
    type_here,
    Select_Type,
    Please_specify,
    What_is_your_project,
    Limit_200_words,
    Local_authority_project_place,
    Constituency_project_place,
    AF_1c_section,
    AF_1d_section,
    Org_size_staff_structure,
    How_many_board_members_in_org,
    Last_financial_year_org_expenses,
    What_level_of_unrestricted_funds,
    Limit_150_words,
    Org_type_info_title,
    Company_registration_number,
    Charity_in_England_Scotland_Wales,
    AF_1e_section,
    Currency_field,
    Who_are_your_partners,
    Upload_files,
    Do_you_want_upload_files,
    AF_1f_section,
    Provide_VAT_Number,
    Header_section_2,
    Intro_section_2,
    AF_2a_section,
    give_deadline_details,
    AF_2b_section,
    AF_2c_section,
    AF_2d_section,
    Tell_building_name,
    Tell_capital_work_owner,
    Tell_us,
    If_Org_has_a_land,
    If_Org_has_the_lease,
    If_Org_has_a_mortage,
    Give_details_of_lender,
    Partner_has_freehold_of_land,
    Partner_Org_Name,
    If_partner_has_lease,
    If_partner_has_mortgage,
    Give_details_of_lender_and_amount,
    If_not_meet_ownership_requirements,
    Any_legal_conditions,
    Please_provide_details,
    Has_condition_survey_been_undertaken,
    Provide_Ordnance_Survey_grid,
    Does_project_involve_acquisition,
    Tick_any_of_following,
    Stage_3_title,
    Section_3_Intro,
    AF_3a_section,
    AF_3b_section,
    AF_3c_section,
    AF_3d_section,
    AF_3e_section,
    AF_3f_section,
    AF_3g_section,
    AF_3h_section,
    Stage_4_title,
    AF_4a_section,
    AF_4b_section,
    AF_4c_section,
    AF_4d_section,
    Stage_5_title,
    Intro_section_5,
    AF_5a_section,
    AF_5b_section,
    AF_5c_section,
    Stage_6_title,
    Intro_section_6,
    AF_6a_section,
    AF_6b_section,
    NHMF_grant_request,
    Total,
    Financial_Summary,
    Total_costs,
    Total_partnership_funding,
    AF_6c_section,
    NHMF_grant_ratio,
    Stage_7_title,
    Terms_of_Grant,
    Must_read_terms_of_grant,
    All_partners_must_confirm_by_adding_a_contact,
    Freedom_of_Information,
    As_part_of_the_application_process,
    When_complete_the_Declaration,
    We_will_take_these_into_account,
    When_complete_Declaration_also_agree,
    Whether_to_give_grant,
    Monitor_and_evaluate_grants,
    Legitimate_interest_in_applications,
    To_hold_in_database,
    If_we_offer_grant,
    Support_our_work,
    Org_has_given_authority,
    Application_falls_within_the_purposes,
    Org_has_power_to_accept_grant,
    If_Org_receives_grant,
    Info_is_true_and_correct,
    I_confirm_that_I_agree_with_the_above_statements,
    Applying_on_behalf_of_partnership,
    Stage_8_title,
    Intro_section_8,
    For_all_projects,
    All_projects_question_1,
    All_projects_question_2,
    All_projects_question_3,
    All_projects_question_4,
    All_projects_question_5,
    All_projects_question_6,
    All_projects_question_7,
    For_acquisition_projects,
    Acquisition_Projects_1,
    Acquisition_Projects_2,
    Acquisition_Projects_3,
    Acquisition_Projects_4,
    For_Capital_Works,
    Capital_Works_Projects_1,
    Capital_Works_Projects_2,
    Capital_Works_Projects_3,
    Capital_Works_Projects_4,
    Capital_Works_Projects_5_1,
    Capital_Works_Projects_5_2,
    Capital_Works_Projects_6,
    Capital_Works_Projects_7,
    Capital_Works_Projects_8,
    Attach_any_additional_documents,
    All_projects_question_1_extra_info,
    We_are_committed_to_being_as_open_as_possible
  };

  @api
  applicationFormObject;
  stageErrorMap = {};
  firstErrorFieldName = "";
  @api
  validateStage() {
    //voiding error field name for seacth new one;
    this.firstErrorFieldName = null;
    let inputsAreValid = this.validateComponents("lightning-input");
    let comboboxAreValid = this.validateComponents("lightning-combobox");
    let textareaAreValid = this.validateComponents("lightning-textarea");
    let docPickListValid = this.validatedSubPicklistComponents();
    let risktableValid = this.riskTableValidation();
    let multilineValid = this.multiLineValidation();
    this.scrollToError();
    return (
      inputsAreValid &&
      comboboxAreValid &&
      textareaAreValid &&
      docPickListValid &&
      risktableValid &&
      multilineValid
    );
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }

  riskTableValidation() {
    let isValid = true;
    if (this.template.querySelector("c-risks-table")) {
      isValid = this.template.querySelector("c-risks-table").validateTable();
    }
    return isValid;
  }

  multiLineValidation() {
    let isValid = true;
    let components = [...this.template.querySelectorAll("c-multiline-input")];
    if (components) {
      isValid = components.reduce((validSoFar, inputCmp) => {
        return inputCmp.validation();
      }, true);
    }
    return isValid;
  }

  validateComponents(componentsName) {
    let isValid = true;
    let components = [...this.template.querySelectorAll(componentsName)];
    if (components) {
      isValid = components.reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        if (!this.firstErrorFieldName && !inputCmp.checkValidity()) {
          this.firstErrorFieldName = inputCmp.dataset.name;
        }
        return validSoFar && inputCmp.checkValidity();
      }, true);
    }
    return isValid;
  }

  validatedSubPicklistComponents() {
    let isValid = true;
    let components = [
      ...this.template.querySelectorAll("c-supporting-document")
    ];
    if (components) {
      isValid = components.reduce((validSoFar, inputCmp) => {
        return validSoFar && inputCmp.validatePicklist();
      }, true);
    }
    return isValid;
  }
  @api
  validateData() {
    this.validateStage();
    let errorFieldsMap = {};
    this.fieldToStageMap.forEach((key, value, map) => {
      let keysArray = value.split(".");
      let fieldValue = this[keysArray[0]];
      if (
        keysArray.length === 3 &&
        Array.isArray(this[keysArray[0]][keysArray[1]])
      ) {
        let childList = this[keysArray[0]][keysArray[1]];
        let hasEmpty = childList.some((item) => {
          console.log(keysArray[2]);
          console.log(item[keysArray[2]]);
          console.log(!item[keysArray[2]]);
          return !item[keysArray[2]];
        });
        if (hasEmpty) {
          fieldValue = undefined;
        } else {
          fieldValue = "not empty";
        }
      } else {
        for (let i = 1; i < keysArray.length; ++i) {
          if (fieldValue) {
            fieldValue = fieldValue[keysArray[i]];
          }
        }
      }

      if (fieldValue == "" || fieldValue == undefined) {
        if (this.additionalDataValidation(value)) {
          if (errorFieldsMap[key] == undefined) {
            errorFieldsMap[key] = [];
          }

          errorFieldsMap[key].push(keysArray[keysArray.length - 1]);
        }
      }
    });
    return (this.stageErrorMap = errorFieldsMap);
  }

  additionalDataValidation(value) {
    let result = true;
    let section1 = [
      "applicationFormObject.projectCase.Project_Street__c",
      "applicationFormObject.projectCase.Project_City__c",
      "applicationFormObject.projectCase.Project_County__c",
      "applicationFormObject.projectCase.Project_Post_Code__c"
    ];
    if (
      value ==
        "applicationFormObject.projectCase.Delivery_partner_details__c" &&
      !this.applicationFormObject.projectCase.Delivered_by_partnership__c
    ) {
      result = false;
    } else if (
      value == "applicationFormObject.projectCase.Account.VAT_number__c" &&
      !this.applicationFormObject.projectCase.Account.Are_you_VAT_registered__c
    ) {
      result = false;
    } else if (
      value ==
        "applicationFormObject.projectCase.Capital_work_by_Organization_details__c" &&
      (!this.applicationFormObject.projectCase
        .Does_project_involve_physical_heritage__c ||
        this.applicationFormObject.projectCase.Capital_work_owner__c !=
          "Your organisation")
    ) {
      result = false;
    } else if (
      value ==
        "applicationFormObject.projectCase.Capital_work_by_Project_partner_details__c" &&
      (!this.applicationFormObject.projectCase
        .Does_project_involve_physical_heritage__c ||
        this.applicationFormObject.projectCase.Capital_work_owner__c !=
          "Project Partner")
    ) {
      result = false;
    } else if (
      value ==
        "applicationFormObject.projectCase.Capital_work_ownership_will_assign__c" &&
      (!this.applicationFormObject.projectCase
        .Does_project_involve_physical_heritage__c ||
        this.applicationFormObject.projectCase.Capital_work_owner__c !=
          "Neither")
    ) {
      result = false;
    } else if (
      value == "applicationFormObject.projectCase.Capital_work_owner__c" &&
      !this.applicationFormObject.projectCase
        .Does_project_involve_physical_heritage__c
    ) {
      result = false;
    } else if (
      section1.includes(value) &&
      this.applicationFormObject.projectCase
        .Is_Project_organisation_address_same__c
    ) {
      result = false;
    } else if (value == "applicationFormObject.projectIncomes.How_will_you_secure_cash_contributions__c" && !this.incomesObjectData.some((item) => {return item.Secured__c === false})) {
      result = false;
    }
    return result;
  }
  @api
  showInputError(inputName, errorMessage) {
    let inputCmp = this.template.querySelector(
      '[data-name="' + inputName + '"]'
    );
    inputCmp.setCustomValidity(errorMessage);
    inputCmp.reportValidity();
  }

  isNonProfit = true;
  peInfo;

  formats;

  options = [];
  acceptedFormats = [PDF, JPG, DOCX, DOC, XLSX, PPTX];
  columns = columnsConstants.SUPPORTING_DOCUMENT_COLUMNS;

  /**
   * @description
   * Generates uuid value for table-data inputs managing
   * @return String
   */
  createUUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  // /**
  //  * @description
  //  * Iterates through Project costs records and builds objects from uuid and costs data
  //  * @return Array
  //  */

  iteratedObjectData(apiObjectListData) {
    let tempData = [];
    for (let i = 0; i < apiObjectListData.length; i++) {
      tempData.push({
        uuid: this.createUUID(),
        data: JSON.parse(JSON.stringify(apiObjectListData[i]))
      });
    }
    return tempData;
  }

  mapDocumentsObjectData(docObjectListData) {
    let tempKeysArray = Object.keys(this.allProjectsDocsQuestionsData);
    for (let i = 0; i < docObjectListData.length; i++) {
      tempKeysArray.forEach((el) => {
        if (
          this.allProjectsDocsQuestionsData[el].question ===
          docObjectListData[i].documentQuestion
        ) {
          this.allProjectsDocsQuestionsData[el].data = docObjectListData[i];
        }
      });
    }
  }

  connectedCallback() {
    this.costsObjectData = this.iteratedObjectData(
      this.applicationFormObject.projectCosts
    );
    this.incomesObjectData = this.iteratedObjectData(
      this.applicationFormObject.projectIncomes
    );
    this.currentRisksObjectData = this.iteratedObjectData(
      this.applicationFormObject.currentProjectRisks
    );
    this.futureRisksObjectData = this.iteratedObjectData(
      this.applicationFormObject.futureProjectRisks
    );
    this.partnersObjectData = this.iteratedObjectData(
      this.applicationFormObject.projectPartners
    );
    this.mapDocumentsObjectData(this.applicationFormObject.projectDocuments);
    if (this.applicationFormObject.projectCase.Heritage_Formal_designation__c) {
      this.selectedListOfValues = this.applicationFormObject.projectCase.Heritage_Formal_designation__c.split(
        ";"
      );
    }

    let inputIncomes = this.template.querySelectorAll(".IncomeValue");

    if (this.grantRequestValue < 0) {
      inputIncomes.forEach((inputIncome) => {
        inputIncome.setCustomValidity("Incomes value is bigger than costs!");
        inputIncome.reportValidity();
      });
    } else {
      inputIncomes.forEach((inputIncome) => {
        inputIncome.setCustomValidity("");
        inputIncome.reportValidity();
      });
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$caseRtId",
    fieldApiName: HERITAGE_FIELD
  })
  wiredCasePickList({ error, data }) {
    if (data) {
      let dataList = [...data.values];
      this.options = dataList.map((el) => ({
        value: el.value,
        label: el.label,
        isChecked: this.selectedListOfValues.includes(el.value)
      }));
      //console.log('PICKLIST DATA: ' + JSON.stringify(data));
    } else {
      console.log("ERROR: " + JSON.stringify(error));
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$costRtId",
    fieldApiName: HEADING_FIELD
  })
  wiredCostPickList({ error, data }) {
    if (data) {
      let dataList = [...data.values];
      this.costsHeadingList = dataList.map((el) => ({
        value: el.value,
        label: el.label
      }));
    } else {
      console.log("ERROR: " + JSON.stringify(error));
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$incomeRtId",
    fieldApiName: FUNDING_FIELD
  })
  wiredIncomePickList({ error, data }) {
    if (data) {
      let dataList = [...data.values];
      this.sourceOfFundingList = dataList.map((el) => ({
        value: el.value,
        label: el.label
      }));
    } else {
      console.log("ERROR: " + JSON.stringify(error));
    }
  }

  /**
   * Obtains/sets all picklists options for all application stages
   */
  constructor() {
    super();
    obtainProjectCaseOptions()
      .then((data) => {
        if (!data) {
          return;
        }

        this.legalStatusList1 =
          data["Account.Organisation_s_Legal_Status_part_1__c"];
        this.legalStatusList2 =
          data["Account.Organisation_s_Legal_Status_part_2__c"];
        this.workOwnerList = data["Capital_work_owner__c"];
        this.riskImpactList = data["Project_Risk__c.Impact__c"];
        this.riskLikelihoodList = data["Project_Risk__c.Likelihood__c"];
        this.documentProvisionTypes =
          data["Project_Document__c.Provision_type__c"];
      })
      .catch((e) => {
        console.log(e);
      });
  }
  renderedCallback() {
    if (!this.hasFiles) {
      this.hasFiles =
        this.applicationFormObject &&
        this.applicationFormObject.documentList &&
        this.applicationFormObject.documentList.length > 0;
    }
    if (this.formats) {
      this.acceptedFormats = this.formats.replace(" ", "").split(",");
    }
  }

  render() {
    let index = this.steps.map((e) => e.value).indexOf(this.selectedStepString);
    if (index == -1) {
      return formStage0;
    } else {
      return this.steps[index].template;
    }
  }

  scrollToError() {
    if (!this.firstErrorFieldName) {
      return;
    }
    this.blockScroll = false;

    const node = this.template
      .querySelector('[data-name="' + this.firstErrorFieldName + '"]')
      .closest("div");
    this.scrollTo(node);
  }
  /**
   * @description
   * Handles field-value changes on Case and related Account/Contact objects,
   * after temporary save, dispatches changes to parent component to update main object
   */
  handleChange(event) {
    let value = "";

    const name = event.detail.name || event.target.name;

    if (ARRAY_OF_CHECKBOXES.includes(name)) {
      value = event.target.checked;

      if (name === "Behalf_of_partnership__c" && !value) {
        this.removeAllPartners();
      }
    } else {
      value = event.detail.value || event.target.value || "";
    }

    try {
      this.showInputError(event.target.name, "");
    } catch (e) {}

    console.log({ value, name });
    //this.validateData();
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          fieldName: name,
          value
        }
      })
    );
  }

  handleUploadFinished(event) {
    let questionName = event.detail.name || event.target.name;
    let filesData = event.detail.files;

    console.log({
      questionName,
      filesData
    });
    let filesIdsForUpdate = filesData.map((el) => el.documentId);

    updateFileTitlesOnApplicationForm({
      uploadedFilesIdsList: filesIdsForUpdate,
      question: this.allProjectsDocsQuestionsData[questionName].question
    })
      .then((respone) => {
        this.dispatchEvent(
          new CustomEvent("filesuploaded", {
            bubbles: true,
            composed: true,
            detail: {
              isOnCase: true,
              documentId: this.allProjectsDocsQuestionsData[questionName].data[
                "documentId"
              ],
              isNew: true
            }
          })
        );
      })
      .catch((err) => {
        console.log("ERROR ON FILE UPDATE: ", err);
      });
  }

  handleRowAction(e) {
    const tempName = e.detail.name || e.target.name;
    const rowId = e.detail.rowId || e.detail.row.Id;

    console.log({
      tempName,
      rowId
    });
    if (!this.applicationFormObject.isBlocked) {
      deleteRecord(rowId)
        .then(() => {
          this.dispatchEvent(
            new CustomEvent("filesuploaded", {
              bubbles: true,
              composed: true,
              detail: {
                isOnCase: true,
                documentId: this.allProjectsDocsQuestionsData[tempName].data
                  .documentId,
                isNew: false,
                Id: rowId
              }
            })
          );
        })
        .catch((error) => {
          console.log("ERROR: ", error);
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error deleting record",
              message: error.body.message,
              letiant: "error"
            })
          );
        });
    }
  }

  @api
  refreshDocsData() {
    this.mapDocumentsObjectData(this.applicationFormObject.projectDocuments);
  }

  /**
   * @description
   * Drop-down open action initialization for custom multipicklist on stage 2
   */
  openDropdown() {
    this.dropdown =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open";
  }
  /**
   * @description
   * Drop-down close action initialization for custom multipicklist on stage 2
   */
  closeDropDown() {
    this.dropdown =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
  }

  /**
   * @description
   * Triggered if picklist option was selected,
   * Adds selected option to selectedListOfValues,
   * Rerenders List of selected options below the drop-down field,
   * Dispatches custom event to update field data on Case object
   */
  handleSelectOption(event) {
    const { index, checked } = event.detail;

    this.options = this.options.map((el, i) => ({
      ...el,
      ...(index === i && { isChecked: checked })
    }));

    this.selectedListOfValues = this.options.filter((el) => el.isChecked);
    const changedData = this.selectedListOfValues
      .map((el) => el.label)
      .join(";");

    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          fieldName: "Heritage_Formal_designation__c",
          value: changedData
        }
      })
    );
  }

  /**
   * @description
   * Handles field-value changes on Project_cost__c table,
   * after temporary save, dispatches changes to parent component to update main object
   */
  handleCostsChange(event) {
    let name, id, value, type;

    if (event.detail && event.detail.name) {
      ({ name, id, value } = event.detail);
    } else {
      ({ name, id, value, type } = event.target);
    }

    this.costsObjectData.map((el) => {
      if (el.uuid === id.slice(0, 36 - id.length)) {
        el.data[name] = type === "number" ? parseInt(value) : value;
        if (name === "Costs__c" || name === "Vat__c") {
          el.data["Total_Cost__c"] =
            (el.data["Costs__c"] ? el.data["Costs__c"] : 0) +
            (el.data["Vat__c"] ? el.data["Vat__c"] : 0);
        }
      }
      return el;
    });

    let inputIncomes = this.template.querySelectorAll(".IncomeValue");

    if (
      (name === "Costs__c" || name === "Vat__c") &&
      this.grantRequestValue < 0
    ) {
      inputIncomes.forEach((inputIncome) => {
        inputIncome.setCustomValidity("Incomes value is bigger than costs!");
        inputIncome.reportValidity();
      });
    } else {
      inputIncomes.forEach((inputIncome) => {
        inputIncome.setCustomValidity("");
        inputIncome.reportValidity();
      });
    }
    this.dispatchCostsChange(this.costsObjectData);
  }

  /**
   * @description
   * Handles remove button click from row-record on costs table,
   * deletes picked row-record from costsObjectData list,
   * dispatches update event to parent component to modify related projectCosts data
   */
  removeRow(event) {
    this.costsObjectData.splice(event.target.value, 1);
    this.dispatchCostsChange(this.costsObjectData);
  }

  /**
   * @description
   * Handles add-record button click on costs table,
   * inserts record (as object with uuid and actual data) to costsObjectData list,
   * dispatches update event to parent component to modify related projectCosts data
   */
  addRow() {
    this.costsObjectData.push({ uuid: this.createUUID(), data: {} });
    this.dispatchCostsChange(this.costsObjectData);
  }

  dispatchCostsChange(objectData) {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          costsData: this.buildRelatedObjectData(objectData)
        }
      })
    );
  }

  /**
   * @description
   * Handles field-value changes on Project_Income__c table,
   * after temporary save, dispatches changes to parent component to update main object
   */
  handleIncomesChange(event) {
    let name, id, value, type;

    if (event.detail && event.detail.name) {
      ({ name, id, value } = event.detail);
    } else {
      ({ name, id, value, type } = event.target);
    }

    if (name === "How_will_you_secure_cash_contributions__c") {
      this.incomesObjectData.map((el) => {
        if (el.data["Secured__c"] !== true) {
          el.data[name] = value;
        }
        return el;
      });
    } else {
      this.incomesObjectData.map((el) => {
        if (el.uuid === id.slice(0, 36 - id.length)) {
          el.data[name] =
            type === "number"
              ? parseInt(value)
              : type === "checkbox"
              ? event.target.checked
              : value;
            if(name = "Secured__c") {
              el.data.How_will_you_secure_cash_contributions__c = !el.data[name] ? this.cashContributionSecure : null;
            }
        }
        return el;
      });
    }

    let inputIncomes = this.template.querySelectorAll(".IncomeValue");

    if (name === "Value__c" && this.grantRequestValue < 0) {
      inputIncomes.forEach((inputIncome) => {
        inputIncome.setCustomValidity("Total funding exceeds project costs");
        inputIncome.reportValidity();
      });
    } else {
      inputIncomes.forEach((inputIncome) => {
        inputIncome.setCustomValidity("");
        inputIncome.reportValidity();
      });
    }

    this.dispatchIncomesChange(this.incomesObjectData);
  }

  /**
   * @description
   * Handles remove button click from row-record on incomes table,
   * deletes picked row-record from incomesObjectData list,
   * dispatches update event to parent component to modify related projectIncomes data
   */
  removeIncomesRow(event) {
    this.incomesObjectData.splice(event.target.value, 1);
    this.dispatchIncomesChange(this.incomesObjectData);
  }

  /**
   * @description
   * Handles add-record button click on incomes table,
   * inserts record (as object with uuid and actual data) to incomesObjectData list,
   * dispatches update event to parent component to modify related projectIncomes data
   */
  addIncomesRow() {
    this.incomesObjectData.push({ uuid: this.createUUID(), data: {} });
    this.dispatchIncomesChange(this.incomesObjectData);
  }

  dispatchIncomesChange(objectData) {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          incomesData: this.buildRelatedObjectData(objectData)
        }
      })
    );
  }

  fireCurrentRisksData() {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          currentRisksData: this.buildRelatedObjectData(
            this.currentRisksObjectData
          )
        }
      })
    );
  }

  handleCurrentRiskChange(event) {
    let name, id, value;

    if (event.detail && event.detail.name) {
      ({ name, id, value } = event.detail);
    } else {
      ({ name, id, value } = event.target);
    }

    this.currentRisksObjectData = this.currentRisksObjectData.map((el) => {
      if (el.uuid === id.slice(0, 36 - id.length)) {
        el.data[name] = value;
      }
      return el;
    });

    this.fireCurrentRisksData();
  }

  removeCurrentRiskRow(event) {
    this.currentRisksObjectData.splice(event.detail.index, 1);

    this.fireCurrentRisksData();
  }

  addCurrentRiskRow() {
    this.currentRisksObjectData = [
      ...this.currentRisksObjectData,
      { uuid: this.createUUID(), data: {} }
    ];

    this.fireCurrentRisksData();
  }

  fireFutureRisksData() {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          futureRisksData: this.buildRelatedObjectData(
            this.futureRisksObjectData
          )
        }
      })
    );
  }

  handleFutureRiskChange(event) {
    const { name, value, id } = event.detail;

    this.futureRisksObjectData.map((el) => {
      if (el.uuid === id.slice(0, 36 - id.length)) {
        el.data[name] = value;
      }
      return el;
    });

    console.log({
      futureRisksObjectData: JSON.parse(
        JSON.stringify(this.futureRisksObjectData)
      )
    });

    this.fireFutureRisksData();
  }

  removeFutureRiskRow(event) {
    this.futureRisksObjectData.splice(event.target.value, 1);
    this.fireFutureRisksData();
  }

  addFutureRiskRow() {
    this.futureRisksObjectData.push({ uuid: this.createUUID(), data: {} });
    this.fireFutureRisksData();
  }

  handlePartnerChange(event) {
    this.partnersObjectData.map((el) => {
      if (el.uuid === event.target.id.slice(0, 36 - event.target.id.length)) {
        el.data[event.target.name] = event.target.value;
      }
      return el;
    });

    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          partnersData: this.buildRelatedObjectData(this.partnersObjectData)
        }
      })
    );
  }

  removePartnerRow(event) {
    this.partnersObjectData.splice(event.target.value, 1);
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          partnersData: this.buildRelatedObjectData(this.partnersObjectData)
        }
      })
    );
  }

  removeAllPartners() {
    this.partnersObjectData = [];
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          partnersData: []
        }
      })
    );
  }

  addPartnerRow() {
    this.partnersObjectData.push({ uuid: this.createUUID(), data: {} });

    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          partnersData: this.buildRelatedObjectData(this.partnersObjectData)
        }
      })
    );
  }

  /**
   * @description
   * Prpares related Object Data for update-event dispatching,
   * extracts only data-fields objects into separate list without uuid
   * @return list of objects with simply records data
   */
  buildRelatedObjectData(objectData) {
    let tempData = [];
    objectData.forEach((el) => {
      tempData.push(el.data);
    });
    return tempData;
  }

  handleProvisionTypeChange(event) {
    let name, value;

    if (event.detail.name) {
      ({ name, value } = event.detail);
    } else {
      ({ name, value } = event.target);
    }

    console.log({
      name,
      value
    });

    try {
      let tempObj = JSON.parse(
        JSON.stringify(this.allProjectsDocsQuestionsData)
      );

      tempObj[name].data.provisionType = value;
      tempObj[name].data.documentQuestion = tempObj[name].question;
      tempObj[event.target.name].data.isElectronic =
        tempObj[name].data.provisionType === "Electronic";
      this.allProjectsDocsQuestionsData = tempObj;
    } catch (err) {
      console.log("err>", err);
    }

    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "AC",
          documentsData: this.buildDocumentsObjectData()
        }
      })
    );
  }

  buildDocumentsObjectData() {
    let tempData = [];
    let tempQuestionsData = [];
    let tempKeysArray = Object.keys(this.allProjectsDocsQuestionsData);
    tempKeysArray.forEach((el) => {
      if (
        this.allProjectsDocsQuestionsData[el].data !== {} &&
        this.allProjectsDocsQuestionsData[el].data["provisionType"] &&
        !tempQuestionsData.includes(
          this.allProjectsDocsQuestionsData[el].question
        )
      ) {
        tempData.push(this.allProjectsDocsQuestionsData[el].data);
        tempQuestionsData.push(this.allProjectsDocsQuestionsData[el].question);
      }
    });
    return tempData;
  }

  /**
   * Getters below check selected picklist values,
   * compare the selected option with hardcoded value,
   * if equal, invoke additional data input field
   * @return Boolean
   */

  get isOther() {
    return (
      this.applicationFormObject.projectCase.Account
        .Organisation_s_Legal_Status_part_2__c === "Other" &&
      this.isOrgNotInPublicSector
    );
  }

  get isOrgNotInPublicSector() {
    return (
      this.applicationFormObject.projectCase.Account
        .Organisation_s_Legal_Status_part_1__c ===
      "Organisation not in the public sector"
    );
  }

  get isYourOrganisation() {
    return (
      this.applicationFormObject.projectCase.Capital_work_owner__c ===
      "Your organisation"
    );
  }

  get isProjectPartner() {
    return (
      this.applicationFormObject.projectCase.Capital_work_owner__c ===
      "Project Partner"
    );
  }

  get isNeither() {
    return (
      this.applicationFormObject.projectCase.Capital_work_owner__c === "Neither"
    );
  }

  get isMultipicklistEnabled() {
    return (
      this.applicationFormObject.projectCase
        .Does_project_involve_physical_heritage__c ||
      this.applicationFormObject.projectCase.Project_involved_acquisition__c
    );
  }

  /**
   * Getters below compute costs/incomes from related tables in Stage 6
   * @return Number
   */

  get fullCostsValue() {
    let totalSum = 0;
    this.costsObjectData.forEach((el) => {
      totalSum += el.data["Costs__c"] ? el.data["Costs__c"] : 0;
    });
    return totalSum;
  }

  get fullVatValue() {
    let totalSum = 0;
    this.costsObjectData.forEach((el) => {
      totalSum += el.data["Vat__c"] ? el.data["Vat__c"] : 0;
    });
    return totalSum;
  }

  get totalCostsValue() {
    let totalSum = 0;
    this.costsObjectData.forEach((el) => {
      totalSum += el.data["Total_Cost__c"] ? el.data["Total_Cost__c"] : 0;
    });
    return totalSum;
  }

  get totalIncomesValue() {
    let totalSum = 0;
    this.incomesObjectData.forEach((el) => {
      totalSum += el.data["Value__c"] ? el.data["Value__c"] : 0;
    });
    return totalSum;
  }

  get grantRequestValue() {
    return this.totalCostsValue - this.totalIncomesValue;
  }

  get grantRatio() {
    return this.totalCostsValue !== 0
      ? ((this.grantRequestValue * 100) / this.totalCostsValue).toFixed(2) +
          " %"
      : "0 %";
  }

  /**
   * @description
   * Sets date for Application Form user-confirmation in Stage 7
   * @return Date
   */
  get currentDateTime() {
    return new Date().toISOString();
  }

  /**
   * @description
   * Obtains value for 6c input field
   * by collecting it from incomesObjectData field
   * @return String
   */
  get cashContributionSecure() {
    let securityConfirmation = "";
    this.incomesObjectData.forEach((el) => {
      if (el.data["Secured__c"] !== true && el.data["How_will_you_secure_cash_contributions__c"]) {
        securityConfirmation =
          el.data["How_will_you_secure_cash_contributions__c"];
      }
    });
    return securityConfirmation;
  }
}