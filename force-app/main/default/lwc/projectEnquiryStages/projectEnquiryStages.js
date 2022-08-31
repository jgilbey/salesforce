/**
 * @description       : Component to fill out project enquiry form.
 *                      Component is managing of each stage of form.
 * @author            : Methods
 * @group             :
 * @last modified on  : 01-14-2021
 * @last modified by  : Methods
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   01-14-2021   Methods   Initial Version
 **/
import { LightningElement, api, wire } from "lwc";
import formStage0 from "./projectEnquiryStage0.html";
import formStage1 from "./projectEnquiryStage1.html";
import formStage2 from "./projectEnquiryStage2.html";
import formStage3 from "./projectEnquiryStage3.html";
import formStage4 from "./projectEnquiryStage4.html";
import { deleteRecord } from "lightning/uiRecordApi";
import constants from "c/constants";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import PE_OBJECT from "@salesforce/schema/EOI_Project_Enquiry__c";

import WHERE_DID_YOU_HEAR_ABOUT_US_FIELD from "@salesforce/schema/EOI_Project_Enquiry__c.Where_did_you_hear_about_us__c";

import Intro_PE_form from "@salesforce/label/c.Intro_PE_form";
import Project_title from "@salesforce/label/c.Project_title";
import Limit_15_words from "@salesforce/label/c.Limit_15_words";
import Reference_number from "@salesforce/label/c.Reference_number";
import Are_you_a_not_for_profit_organisation from "@salesforce/label/c.Are_you_a_not_for_profit_organisation";
import If_you_are_not_a_not_for_profit_organisation_please_tell_us_the_type_of_organis from "@salesforce/label/c.If_you_are_not_a_not_for_profit_organisation_please_tell_us_the_type_of_organis";
import Where_did_you_hear_about_the_National_Heritage_Memorial_Fund from "@salesforce/label/c.Where_did_you_hear_about_the_National_Heritage_Memorial_Fund";
import type_here from "@salesforce/label/c.type_here";
import Select_Type from "@salesforce/label/c.Select_Type";
import Please_specify from "@salesforce/label/c.Please_specify";
import What_is_your_project from "@salesforce/label/c.What_is_your_project";
import Limit_200_words from "@salesforce/label/c.Limit_200_words";
import Please_describe_the_heritage_item_or_property_your_project_focuses_on from "@salesforce/label/c.Please_describe_the_heritage_item_or_property_your_project_focuses_on";
import Is_there_an_important_deadline_by_which_you_need_a_decision from "@salesforce/label/c.Is_there_an_important_deadline_by_which_you_need_a_decision";
import Please_give_details_and_explain_why from "@salesforce/label/c.Please_give_details_and_explain_why";
import p_Use_this_section_to_show_us_how_the_heritage_item_which_your_project_focuses from "@salesforce/label/c.p_Use_this_section_to_show_us_how_the_heritage_item_which_your_project_focuses";
import Importance_to_the_national_heritage_explain_how_the_heritage_item_or_property_i from "@salesforce/label/c.Importance_to_the_national_heritage_explain_how_the_heritage_item_or_property_i";
import Outstanding_interest_explain_how_the_heritage_item_or_property_is_of_outstandin from "@salesforce/label/c.Outstanding_interest_explain_how_the_heritage_item_or_property_is_of_outstandin";
import At_risk_explain_why_the_heritage_item_or_property_is_at_risk from "@salesforce/label/c.At_risk_explain_why_the_heritage_item_or_property_is_at_risk";
import And_or from "@salesforce/label/c.and_or";
import Memorial_character_we_give_special_consideration_to_heritage_item_or_property_w from "@salesforce/label/c.Memorial_character_we_give_special_consideration_to_heritage_item_or_property_w";
import Limit_150_words from "@salesforce/label/c.Limit_150_words";
import How_much_is_your_project_likely_to_cost_What_will_the_major_costs_be_If_you_ar from "@salesforce/label/c.How_much_is_your_project_likely_to_cost_What_will_the_major_costs_be_If_you_ar";
import How_much_are_you_likely_to_ask_for_from_us from "@salesforce/label/c.How_much_are_you_likely_to_ask_for_from_us";
import How_will_your_project_last_over_the_long_term_and_how_will_you_provide_appropria from "@salesforce/label/c.How_will_your_project_last_over_the_long_term_and_how_will_you_provide_appropria";
import Financial_need_we_are_a_funder_of_last_resort_please_give_details_of_any_partn from "@salesforce/label/c.Financial_need_we_are_a_funder_of_last_resort_please_give_details_of_any_partn";
import Currency_field from "@salesforce/label/c.Currency_field";
import NHMF_requires_that_the_public_have_access_to_your_project_Please_explain_how_yo from "@salesforce/label/c.NHMF_requires_that_the_public_have_access_to_your_project_Please_explain_how_yo";
import Upload_files from "@salesforce/label/c.Upload_files";
import Do_you_want_upload_files from "@salesforce/label/c.Do_you_want_upload_files";
import File_Type from "@salesforce/label/c.File_Type";
import File_Name from "@salesforce/label/c.File_Name";
import section_1_your_project from "@salesforce/label/c.section_1_your_project";
import section_2_our_standards_for_funding from "@salesforce/label/c.section_2_our_standards_for_funding";
import section_3_project_costs from "@salesforce/label/c.section_3_project_costs";
import costs_and_whether from "@salesforce/label/c.costs_and_whether";
import section_4_public_access from "@salesforce/label/c.section_4_public_access";
import {validation} from "c/utils";

const { peStagesMapConstants } = constants;
export default class ProjectEquiryStages extends LightningElement {
  @api
  selectedStepString;
  orgTypeList;
  @wire(
    getPicklistValues,

    {
      recordTypeId: "$recordTypeId",

      fieldApiName: WHERE_DID_YOU_HEAR_ABOUT_US_FIELD
    }
  )
  wireWhereHearList({ error, data }) {
    if (data) {
      this.whereHearList = data.values;
    }
  }
  whereHearList;
  hasFiles;
  steps = [
    { value: "step-0", template: formStage0 },
    { value: "step-1", template: formStage1 },
    { value: "step-2", template: formStage2 },
    { value: "step-3", template: formStage3 },
    { value: "step-4", template: formStage4 }
  ];
  labels = {
    Intro_PE_form,
    Project_title,
    Limit_15_words,
    Reference_number,
    Are_you_a_not_for_profit_organisation,
    If_you_are_not_a_not_for_profit_organisation_please_tell_us_the_type_of_organis,
    Where_did_you_hear_about_the_National_Heritage_Memorial_Fund,
    type_here,
    Select_Type,
    Please_specify,
    What_is_your_project,
    Limit_200_words,
    Please_describe_the_heritage_item_or_property_your_project_focuses_on,
    Is_there_an_important_deadline_by_which_you_need_a_decision,
    Please_give_details_and_explain_why,
    p_Use_this_section_to_show_us_how_the_heritage_item_which_your_project_focuses,
    Importance_to_the_national_heritage_explain_how_the_heritage_item_or_property_i,
    Outstanding_interest_explain_how_the_heritage_item_or_property_is_of_outstandin,
    At_risk_explain_why_the_heritage_item_or_property_is_at_risk,
    And_or,
    Memorial_character_we_give_special_consideration_to_heritage_item_or_property_w,
    Limit_150_words,
    How_much_is_your_project_likely_to_cost_What_will_the_major_costs_be_If_you_ar,
    How_much_are_you_likely_to_ask_for_from_us,
    How_will_your_project_last_over_the_long_term_and_how_will_you_provide_appropria,
    Financial_need_we_are_a_funder_of_last_resort_please_give_details_of_any_partn,
    Currency_field,
    NHMF_requires_that_the_public_have_access_to_your_project_Please_explain_how_yo,
    Upload_files,
    Do_you_want_upload_files,
    section_1_your_project,
    section_2_our_standards_for_funding,
    section_3_project_costs,
    costs_and_whether,
    section_4_public_access
  };
  stylesLoaded = false;

  @api
  projectEnquiryForm;
  stageErrorMap = {};
  firstErrorFieldName = "";
  blockScroll = false;
  fieldToStageMap = peStagesMapConstants.PE_STAGE_FIELD_MAP;
  recordTypeId;

  @wire(getObjectInfo, { objectApiName: PE_OBJECT })
  wiredPeMetadata({ error, data }) {
    if (data) {
      for (var eachRecordtype in data.recordTypeInfos) {
        if (data.recordTypeInfos[eachRecordtype].name === "NHMF EOI") {
          this.recordTypeId = data.recordTypeInfos[eachRecordtype].recordTypeId;
          break;
        }
      }
    }
  }
  peMetadata;

  @api
  validateStage() {
    this.firstErrorFieldName = null;
    let inputsAreValid = this.validateComponents("lightning-input");
    let comboboxAreValid = this.validateComponents("lightning-combobox");
    let textareaAreValid = this.validateComponents("lightning-textarea");
    this.scrollToError();
    return inputsAreValid && comboboxAreValid && textareaAreValid;
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

  scrollToSectionBegining(conditionToScroll) {
    if (this.blockScroll) {
      return;
    }
    let firstSectionElement = this.template.querySelectorAll(conditionToScroll);
    if (!!firstSectionElement && firstSectionElement.length > 0) {
      firstSectionElement[0].scrollIntoView();
      this.blockScroll = true;
    }
  }

  scrollToError() {
    if (this.firstErrorFieldName === "" || this.firstErrorFieldName == null)
      return;
    this.blockScroll = false;
    this.scrollToSectionBegining(
      '[data-name="' + this.firstErrorFieldName + '"]'
    );
  }

  @api
  validateData() {
    this.validateStage();
    let errorFieldsMap = {};
    this.fieldToStageMap.forEach((key, value) => {
      let keysArray = value.split(".");
      let fieldValue = this[keysArray[0]];
      for (let i = 1; i < keysArray.length; ++i) {
        if (fieldValue) {
          fieldValue = fieldValue[keysArray[i]];
        }
      }
      if (fieldValue === "" || fieldValue === undefined) {
        if (errorFieldsMap[key] === undefined) {
          errorFieldsMap[key] = [];
        }
        errorFieldsMap[key].push(keysArray[keysArray.length - 1]);
      }
    });
    this.additionalDataValidation(errorFieldsMap);
    return (this.stageErrorMap = errorFieldsMap);
  }

  additionalDataValidation(errorFieldsMap) {
    let dependecyMap = [
      {
        field: "Type_of_profit_organization__c",
        dependedField: "Non_Profit__c",
        value: false,
        section: "Section 0"
      },
      {
        field: "Other_hear_from_us__c",
        dependedField: "Where_did_you_hear_about_us__c",
        value: "Other",
        section: "Section 0"
      },
      {
        field: "Deadline_details__c",
        dependedField: "Deadline_by_which_you_need_a_decision__c",
        value: true,
        section: "Section 1"
      }
    ];

    dependecyMap.map((dependency) => {
      if (
        this.projectEnquiryForm.projectEnquiry[dependency.dependedField] ===
          dependency.value &&
        this.isBlank(this.projectEnquiryForm.projectEnquiry[dependency.field])
      ) {
        if (errorFieldsMap[dependency.section] === undefined) {
          errorFieldsMap[dependency.section] = [];
        }
        errorFieldsMap[dependency.section].push(dependency.dependedField);
      }
    });
  }

  isBlank(str) {
    return !str || /^\s*$/.test(str);
  }

  @api
  showInputError(inputName, errorMessage) {
    var inputCmp = this.template.querySelector(
      '[data-name="' + inputName + '"]'
    );
    inputCmp.setCustomValidity(errorMessage);
    inputCmp.reportValidity();
  }

  isNonProfit = true;
  peInfo;

  formats;

  options = [];
  acceptedFormats = [".pdf", ".docx", ".jpg", ".doc", ".xlsx", ".pptx"];
  columns = [
    {
      label: File_Name,
      fieldName: "Title",
      type: "text"
      //fixedWidth: 300
    },

    {
      label: File_Type,
      fieldName: "FileType",
      type: "text"
      //fixedWidth: 120
    },
    {
      label: "",
      type: "button-icon",
      typeAttributes: {
        iconName: "action:close",
        title: "Delete",
        name: "Delete",
        variant: "destructive",
        alternativeText: "Delete"
      }
    }
  ];

  renderedCallback() {
    if (!this.hasFiles) {
      this.hasFiles =
        this.projectEnquiryForm &&
        this.projectEnquiryForm.documentList &&
        this.projectEnquiryForm.documentList.length > 0;
    }
    if (this.formats) {
      this.acceptedFormats = this.formats.replace(" ", "").split(",");
    }
  }

  render() {
    let index = this.steps.map((e) => e.value).indexOf(this.selectedStepString);
    if (index === -1) {
      return formStage0;
    }
    return this.steps[index].template;
  }
  changeIsNotProfit(event) {
    this.isNonProfit = event.target.checked;
  }

  handleValidation(event){
    validation.validateInput(event,this);
  }
  
  handleChange(event) {
    let value = "";
    if (
      event.target.name === "Deadline_by_which_you_need_a_decision__c" ||
      event.target.name === "Non_Profit__c"
    ) {
      value = event.target.checked;
    } else {
      value = event.target.value;
    }
    try {
      this.showInputError(event.target.name, "");
    } catch (e) {}

    this.dispatchEvent(
      new CustomEvent("formischanged", {
        bubbles: true,
        composed: true,
        detail: {
          formType: "PE",
          fieldName: event.target.name,
          value: value
        }
      })
    );
  }

  handleUploadFinished() {
    this.dispatchEvent(
      new CustomEvent("filesuploaded", {
        bubbles: true,
        composed: true,
        detail: {
          isNew: true
        }
      })
    );
  }

  handleRowAction(e) {
    if (!this.projectEnquiryForm.isBlocked) {
      deleteRecord(e.detail.row.Id)
        .then(() => {
          this.dispatchEvent(
            new CustomEvent("filesuploaded", {
              bubbles: true,
              composed: true,
              detail: {
                isNew: false,
                Id: e.detail.row.Id
              }
            })
          );
        })
        .catch((error) => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error deleting record",
              message: error.body.message,
              variant: "error"
            })
          );
        });
    }
  }

  handleHasFilesChange(e) {
    this.hasFiles = e.target.checked;
  }
  get isOther() {
    return (
      this.projectEnquiryForm.projectEnquiry.Where_did_you_hear_about_us__c ===
      "Other"
    );
  }
}