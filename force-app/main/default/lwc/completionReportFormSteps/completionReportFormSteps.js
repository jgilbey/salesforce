import { LightningElement, api, track, wire } from "lwc";

import LABELS from "./imports/labels";
import STEPS from "./imports/steps";
import ACCEPTED_FORMATS from "./imports/acceptedFormats";

import { obtainApprovedPuprosesColums, obtainProjectComesColumns, columns, viewColumns } from "./maps/tableMap";
import constants from "c/constants";
import utils from "c/utils";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import PROJECT_INCOME_OBJECT from "@salesforce/schema/Project_Income__c";
import SOURCE_OF_FUNDING_FIELD from "@salesforce/schema/Project_Income__c.Source_Of_Funding__c";

const { applySortCodeMask, removeMask, filterSortCodeMaskInput } = utils;
const {
  SUPPORTING_DOCUMENT_COLUMNS,
  SPENDING_SUMMARY
} = constants.columnsConstants;
const { pfValidationConstants } = constants;

const { monitoringFormTypes } = constants;
const ValidationUtils = utils.validation;

export default class CompletionReportFormSteps extends LightningElement {
  @api selectedStepIndex = 0;
  @api completionForm = {};
  @api isCapital = false;
  @api spendingCostsOptions = [];
  @track showModal;
  @track projectIncomes;
  editIndex = undefined;

  recordTypeId;

  @wire(getObjectInfo, { objectApiName: PROJECT_INCOME_OBJECT })
  wiredPeMetadata({ error, data }) {
    if (data) {
      for (var eachRecordtype in data.recordTypeInfos) {
        if (data.recordTypeInfos[eachRecordtype].name === "NHMF") {
          this.recordTypeId = data.recordTypeInfos[eachRecordtype].recordTypeId;
          break;
        }
      }
    }
  }
  @wire(
    getPicklistValues,

    {
      recordTypeId: "$recordTypeId",

      fieldApiName: SOURCE_OF_FUNDING_FIELD
    }
  )
  obtainSourceOfFundingPicklist({ error, data }) {
    if (data) {
      this.sourceOfFundingPicklist = data.values;
      this.obtainProjectComesColumns = obtainProjectComesColumns(
        this.projectIncomesColumnHandler,
        this.projectIncomesHandleDelete,
        this.sourceOfFundingPicklist,
        this.completionForm.isBlocked
      );
      this.columns = columns(
        this.projectIncomesColumnHandler,
        this.sourceOfFundingPicklist,
        this.completionForm.isBlocked
      );
      this.viewColumns = viewColumns(
        this.projectIncomesHandleDelete,
        this.projectIncomesHandleEdit,
        this.completionForm.isBlocked
      );
      this.projectIncomes = this.completionForm.projectIncomes ? 
        this.completionForm.projectIncomes.map(this.cloneObjectFunction) : [];
      this.projectIncomes.length && this.projectIncomes.forEach( 
            (i, index) => i.index = index )
    }
  }

  sourceOfFundingPicklist;

  labels = LABELS;
  acceptedFormats = ACCEPTED_FORMATS;
  spendingSummary = SPENDING_SUMMARY;
  fileColumns = SUPPORTING_DOCUMENT_COLUMNS;
  FORM_IMAGES_FILE_PREFIX = monitoringFormTypes.FORM_IMAGES_FILE_PREFIX
  SUBMISSION_FILE_PREFIX = monitoringFormTypes.SUBMISSION_FILE_PREFIX

  stageErrorMap = {};
  firstErrorFieldName = "";
  blockScroll = false;
  fieldToStageMap = pfValidationConstants.PERMISSION_FORM_FIELD_MAP;

  cloneObjectFunction = (item) => {return {...item}}; 

  connectedCallback(){
    
  }
  get steps() {
    return this.isCapital ? STEPS.capitalSteps : STEPS.acquisitionsSteps;
  }

  get sectionTitle() {
    return this.steps[this.selectedStepIndex].title;
  }

  get isFilesUploaded() {
    return this.completionForm.docsData ? true : false;
  }

  get currentDateTime() {
    return new Date().toISOString();
  }

  get spendingCostsData() {
    // if (this.completionForm.spendingCosts) {
    //   return mapSpendingCosts(
    //     this.completionForm.spendingCosts,
    //     this.spendingCostsOptions,
    //     this.handleTextChangeInList,
    //     this.handleCheckboxChangeInList
    //   );
    // }

    return [];
  }
  get calculatedAlreadyPayed() {
    const alredyPayed = this.completionForm.alreadyPayed * this.completionForm.paymentPercentage / 100;
    
    return alredyPayed <= this.completionForm.totalGrantAwarded ? alredyPayed : this.completionForm.totalGrantAwarded;
  }

  get paymentLimit() {
    return this.completionForm.totalGrantAwarded - this.calculatedAlreadyPayed ;
  }
  get grandPaidPercentage(){
    return this.calculatedAlreadyPayed  / this.completionForm.totalGrantAwarded * 100;
  }

  render() {
    if (this.selectedStepIndex === -1) {
      return this.steps[0].template;
    } else {
      return this.steps[this.selectedStepIndex].template;
    }
  }

  handleGenerateUrl() {
    this.dispatchEvent(
      new CustomEvent("generateurl", {
        bubbles: true,
        composed: true,
        detail: {
          id: this.completionForm.Id
        }
      })
    );
  }

  handleUploadFinished() {
    this.dispatchEvent(
      new CustomEvent("uploadfinished", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleRowAction(event) {
    try {
      this.dispatchEvent(
        new CustomEvent("rowaction", {
          bubbles: true,
          composed: true,
          detail: {
            rowId: event.detail.row.Id
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  handleTextChangeInList = (event) => {
    this.fireData({
      field: event.target.name,
      value: event.target.value,
      id: event.target.id.slice(0, 18 - event.target.id.length),
      isList: true
    });
  };

  handleCheckboxChangeInList = (event) => {
    this.fireData({
      field: event.target.name,
      value: event.target.checked,
      id: event.target.id.slice(0, 18 - event.target.id.length),
      isList: true
    });
  };

  handleTextChange(event) {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.value,
      typeChanges: "own"
    });
  }

  handleCheckbox(event) {
    console.log(event.target.checked);

    this.sendEventToParent({
      field: event.target.name,
      value: event.target.checked,
      typeChanges: "own"
    });
  }

  handleFocusSortCode(event) {
    event.target.value = removeMask(event.target.value);
  }

  handleBlurSortCode(event) {
    event.target.value = applySortCodeMask(event.target.value);
    event.target.reportValidity();
  }

  handleChangeSortCode(event) {
    const value = filterSortCodeMaskInput(event.target.value);

    this.fireData({
      field: event.target.name,
      value
    });
  }

  fireData({ field, value, id = "", isList = false }) {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: {
          field,
          value,
          id,
          isList
        }
      })
    );
  }

  @api
  validateStage() {
    this.firstErrorFieldName = null;
    let inputsAreValid = this.validateComponents("lightning-input");
    let inputTextsAreValid = this.validateComponents("lightning-textarea");
    let table = this.template.querySelector("c-custom-data-table");
    if (table) {
      console.log("table ", table.validateTable());
    }
    this.scrollToError();
    return inputsAreValid && inputTextsAreValid;
  }

  validateComponents(componentsName) {
    let isValid = true;
    const components = [...this.template.querySelectorAll(componentsName)];
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

    const firstSectionElement = this.template.querySelector(conditionToScroll);
    if (firstSectionElement) {
      firstSectionElement.scrollIntoView();
      this.blockScroll = true;
    }
  }

  scrollToError() {
    if (!this.firstErrorFieldName) {
      return;
    }

    this.blockScroll = false;
    this.scrollToSectionBegining(
      '[data-name="' + this.firstErrorFieldName + '"]'
    );
  }

  approvedPurposeColumnHandler = (event) => {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.value,
      id: event.target.dataset.index,
      typeChanges: "approvedPurposes"
    });
  };
  projectIncomesColumnHandler = (event) => {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.value,
      id: event.target.dataset.index,
      typeChanges: "funding"
    });
  };

  projectIncomesHandleDelete = (event) => {
    this.sendEventToParent({
      id: event.target.dataset.index,
      typeChanges: "deletefunding"
    });
  }
  @api checkValue(value) {
    this.projectIncomes = value.projectIncomes
  }
  handleChange(e) {
    this.currentItem.filter( i => i.fieldName == e.target.name )[0].value = /**/ e.target.value;
      (e.target.type == 'checkbox' ? e.target.checked : e.target.value);
    let cost = this.currentItem.filter( i => i.fieldName == 'costToDate')[0];
    let vat = this.currentItem.filter( i => i.fieldName == 'vat')[0];
    this.currentItem.filter( i => i.fieldName == 'total')[0].value = (cost ? +cost.value : 0) + (vat ? +vat.value : 0);
  }
  projectIncomesHandleEdit = (e) => {
    e.preventDefault();
    this.editIndex = Number(e.target.dataset.index);
    let itemToEdit = this.projectIncomes.map(this.cloneObjectFunction)[this.editIndex];
    this.currentItem = [...this.columns].map( i => {i[i.type] = true; return i});
    this.currentItem.forEach(item => item.value = itemToEdit[item.fieldName]);
    this.showModal = true;
    // this.sendEventToParent({
    //   id: event.target.dataset.index,
    //   typeChanges: "editfunding"
    // });
  }
  get approvedPuprosesColumList() {
    return obtainApprovedPuprosesColums(
      this.approvedPurposeColumnHandler,
      this.completionForm.isBlocked,
      this.textKeyPressHandler
    );
  }
  // get projectIncomesColumList() {
  //   return obtainProjectComesColumns(
  //     this.projectIncomesColumnHandler,
  //     this.projectIncomesHandleDelete,
  //     this.completionForm.projectIncomePicklist,
  //     this.completionForm.isBlocked
  //   );
  // }

  sendEventToParent(detailData) {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        detail: detailData
      })
    );
  }

  // addProjectIncomes(){
  //   this.sendEventToParent({
  //     typeChanges: "addfunding"
  //   });
  // }
  openModal(){
    this.currentItem = this.columns
      .map( i => {i = this.cloneObjectFunction(i); return i})
      .map( i => {i[i.type] = true; i.value = ''; return i});
    this.showModal = true;
  }
  abortAdding(){
    this.showModal = false;
    this.currentItem = null;
  }
  _validateForm(){
    const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
    .concat([...this.template.querySelectorAll('lightning-combobox')])
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);
    return isInputsCorrect;
  }
  addProjectIncomes(){
    if (!this._validateForm()) return;
    let o = {};
    this.currentItem.forEach( i => i.type !== 'iconType' && (o[i.fieldName] = i.value));
    o.index = (this.editIndex != undefined ? 
        this.editIndex : 
        this.projectIncomes ? 
          this.projectIncomes.length : 0);
    this.sendEventToParent({
      typeChanges: "addfunding",
      value: o
    });
    this.showModal = false;
    this.currentItem = null;
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }

  textKeyPressHandler = (event) => {
    ValidationUtils.validateInput(event,this);
  };
}