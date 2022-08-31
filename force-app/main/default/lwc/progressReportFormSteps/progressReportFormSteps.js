import { LightningElement, api, track } from 'lwc';
import STEPS from './imports/steps';
import LABELS from './imports/labels';
import ACCEPTED_FORMATS from "./imports/acceptedFormats";

import constants from "c/constants";
import utils from "c/utils";
import { mapApprovedPurposes } from "./maps/approvedPurposesMap";
import { obtainApprovedPuprosesColums, obtainProjectComesColumns, columns, viewColumns } from "./maps/tableMap";

const {
    APPROVED_PURPOSES,
    SUPPORTING_DOCUMENT_COLUMNS, 
    DOCUMENT_UPLOADER_DEFAULT_COLUMNS
} = constants.columnsConstants;

const ValidationUtils = utils.validation;
export default class ProgressReportFormSteps extends LightningElement {
  @api progressForm = {};
  @api selectedStepIndex = 0;
  @api isBlocked = false;
  @track showModal = false;
  @track partnershipFunding;

  @track isPartnerFundingLastReport;
  get isPartnerFundingLastReportCheckbox() {
    return this.progressForm.isPartnerFundingLastReport;
  }
  acceptedFormats = ACCEPTED_FORMATS;
  editIndex = undefined;
  checkboxFieldsSet = new Set(["statutoryPermissionsRequired", "havePurchasedGoods", "isVendorLinked", "isPartnerFundingLastReport"]);

  get labels() {
    return LABELS;
  }

  get isFilesUploaded() {
    return false;
  }

  approvedPurposesColumns = APPROVED_PURPOSES;
  
  get steps() {
      return STEPS.progressReportSteps;
  }

  get sectionTitle() {
      return this.steps[this.selectedStepIndex].title;
  }
  @api checkValue(value) {
    this.partnershipFunding = value.partnershipFunding;
    this.partnershipFunding.length && this.partnershipFunding.forEach( 
      (i, index) => i.index = index );
  }

  get imageFiles() {
    return this.progressForm.docsData.filter(item=>{return item.Title.startsWith("Image")});
  }

  get supportingFiles() {
    return this.progressForm.docsData.filter(item=>{return item.Title.startsWith("Support")});
  }

  get fileColumns(){
    return this.isBlocked ? DOCUMENT_UPLOADER_DEFAULT_COLUMNS : SUPPORTING_DOCUMENT_COLUMNS;
  }

  render() {
    if (this.selectedStepIndex === -1) {
        this.selectedStepIndex = 0;
    } 
    return this.steps[this.selectedStepIndex].template;
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }

  connectedCallback(){
    this.obtainProjectComesColumns = obtainProjectComesColumns(
      this.projectIncomesColumnHandler,
      this.projectIncomesHandleDelete,
      this.progressForm.projectIncomePicklist,
      this.isBlocked
    );
    this.columns = columns(
      this.projectIncomesColumnHandler,
      this.progressForm.projectIncomePicklist,
      this.isBlocked
    );
    this.viewColumns = viewColumns(
      this.projectIncomesHandleDelete,
      this.projectIncomesHandleEdit,
      this.isBlocked
    );
    this.partnershipFunding = this.progressForm.partnershipFunding ? 
      this.progressForm.partnershipFunding.map(this.cloneObjectFunction) : [];
    this.partnershipFunding.length && this.partnershipFunding.forEach( 
          (i, index) => i.index = index );
    this.isPartnerFundingLastReport = this.progressForm.isPartnerFundingLastReport;
  }
  get approvedPurposesData() {
      if (this.progressForm.approvedPurposes) {
        return mapApprovedPurposes(
          this.progressForm.approvedPurposes,
          this.handleTextChangeInList
        );
      }
  
      return [];
  }

  get approvedPuprosesColumList() {
    return obtainApprovedPuprosesColums(
      this.approvedPurposeColumnHandler,
      this.progressForm.isBlocked,
      this.textKeyPressHandler
    );
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
        this.partnershipFunding ? 
          this.partnershipFunding.length : 0);
    if(this.editIndex != undefined  && this.partnershipFunding[this.editIndex] != null && this.partnershipFunding[this.editIndex].id){
      o.id = this.partnershipFunding[this.editIndex].id;
    }      
    this.sendEventToParent({
      typeChanges: "addfunding",
      value: o
    });
    this.showModal = false;
    this.currentItem = null;
  }

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

  projectIncomesHandleEdit = (e) => {
    e.preventDefault();
    this.editIndex = Number(e.target.dataset.index);
    let itemToEdit = this.partnershipFunding.map(this.cloneObjectFunction)[this.editIndex];
    this.currentItem = [...this.columns].map( i => {i[i.type] = true; return i});
    this.currentItem.forEach(item => item.value = itemToEdit[item.fieldName]);
    this.showModal = true;
  }

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
  @api
  validateStage() {
      return ValidationUtils.validateComponents("lightning-input", this) && ValidationUtils.validateComponents("lightning-textarea", this);
  }
  toggleHavePartnerShip(){
    this.isPartnerFundingLastReport = !this.isPartnerFundingLastReport;
    this.progressForm.isPartnerFundingLastReport = !this.progressForm.isPartnerFundingLastReport;
  }
  handleTableChange(e) {
    this.currentItem.filter( i => i.fieldName == e.target.name )[0].value = /* e.target.value; */
      (e.target.type == 'checkbox' ? e.target.checked : e.target.value);
    let cost = this.currentItem.filter( i => i.fieldName == 'costToDate')[0];
    let vat = this.currentItem.filter( i => i.fieldName == 'vat')[0];
    this.currentItem.filter( i => i.fieldName == 'total')[0].value = (cost ? +cost.value : 0) + (vat ? +vat.value : 0);
  }
  handleChange(event) {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.type == 'checkbox' ? event.target.checked : event.target.value
    });
  //this.checkboxFieldsSet.has(
  }

  handleTextChangeInList = (event) => {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.value,
      id: event.target.id.slice(0, 18),
      isList: true
    });
  }


  approvedPurposeColumnHandler = (event) => {
    this.sendEventToParent({
      field: event.target.name,
      value: event.target.value,
      id: event.target.dataset.index,
      typeChanges: "approvedPurposes"
    });
  };

  textKeyPressHandler = (event) => {
    ValidationUtils.validateInput(event,this);
  };

  sendEventToParent(detailData) {
    this.dispatchEvent(
      new CustomEvent("formchanged", {
        bubbles: true,
        composed: true,
        detail: detailData
      })
    );
  }

  cloneObjectFunction = (item) => {return {...item}}; 

}