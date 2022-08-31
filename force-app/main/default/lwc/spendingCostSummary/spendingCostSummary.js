import { LightningElement, api, track } from "lwc";
import {
  // mapSpendingCosts,
  setupColumns,
  viewColumns
} from "./maps/spendingCostsTableMap";
import constants from "c/constants";
const {
  SPENDING_SUMMARY,
  SUPPORTING_DOCUMENT_COLUMNS
} = constants.columnsConstants;
import ACCEPTED_FORMATS from "./imports/acceptedFormats";
import LABELS from "./imports/labels";

import utils from "c/utils";
const ValidationUtils = utils.validation;

export default class SpendingCostSummary extends LightningElement {
  @api spendingCostList = [];
  @api picklistData;
  @api prevCalculation;
  // @api toDeleteIdSet = [];
  @api recordId;
  @api uploadedFiles = [];
  @track spendingCostsData = [];
  @api isBlocked = false;
  toDeleteIdSet = [];
  // toDeleteIdArray = [];
  @api percentageLimit;
  @api paymentLimit;
  @track showModal = false; 
  totalRequested = 0;
  totalCalculated = 0;
  acceptedFormats = ACCEPTED_FORMATS;

  columns = [];
  get fileColumns() {
    return SUPPORTING_DOCUMENT_COLUMNS;
  }
  editIndex;
  spendingSummaryColumns = SPENDING_SUMMARY;

  get labels() {
    return LABELS;
  }
  get totalSpendingCosts() {
    return (this.spendingCostList && this.spendingCostList.length > 0) ? this.spendingCostList.map(item=>{return item.total}).reduce((prevResult, current)=>{return prevResult + current}) : 0; //reduce((prevResult, item)=>{return item.total + prevResult.total;}) : 0;
  }
  connectedCallback() {
    if (this.spendingCostList && this.spendingCostList.length) {
      this.calcTotal();
    }
    let headingOptionList = this.picklistData.map((el, index) => {
      return { label: el, value: el };
    });
    this.columns = setupColumns(
      headingOptionList,
      this.handleTextChangeInList,
      this.isBlocked
    );
    this.viewColumns = viewColumns(
      this.handleDeleteCost,
      this.handleEditCost,
      this.isBlocked
    );
    console.log("COSTS: ", JSON.stringify(this.picklistData));
  }

  handleTextChangeInList = (event) => {
    event.preventDefault();

    let index = Number(event.target.dataset.index);
    let tempSpendingCostList = this.spendingCostList.map(
      this.cloneObjectFunction
    ); // [...this.spendingCostList];
    if (tempSpendingCostList[index]) {
      tempSpendingCostList[index][event.target.name] = event.target.value;

      let total =
        (!!tempSpendingCostList[index].costToDate
          ? Number(tempSpendingCostList[index].costToDate)
          : 0) +
        (!!tempSpendingCostList[index].vat
          ? Number(tempSpendingCostList[index].vat)
          : 0);
      tempSpendingCostList[index].total = total;

      this.spendingCostList = tempSpendingCostList;
    }
    this.calcTotal();
    this.sendEvent({
      newData: this.spendingCostList
    });
  };

  handleCheckboxChangeInList = (event) => {
    let index = Number(event.target.dataset.index);
    let tempSpendingCostList = this.spendingCostList.map(
      this.cloneObjectFunction
    );
    if (tempSpendingCostList[index]) {
      tempSpendingCostList[index][event.target.name] = event.target.checked;
      this.spendingCostList = tempSpendingCostList;
    }
  };
  handleEditCost = (e) => {
    e.preventDefault();
    this.editIndex = Number(e.target.dataset.index);
    let itemToEdit = this.spendingCostList.map(this.cloneObjectFunction)[
      this.editIndex
    ];
    this.currentItem = [...this.columns].map((i) => {
      i[i.type] = true;
      return i;
    });
    this.currentItem.forEach(
      (item) => (item.value = itemToEdit[item.fieldName])
    );
    this.showModal = true;
  };
  handleDeleteCost = (event) => {
    if (this.isBlocked) {
      return;
    }
    event.preventDefault();
    let tempSpendingCostList = this.spendingCostList.map(
      this.cloneObjectFunction
    );
    let index = Number(event.target.dataset.index);
    if (tempSpendingCostList[index]) {
      let idToDelete = tempSpendingCostList[index].id;
      if (tempSpendingCostList[index].id) {
        this.toDeleteIdSet.push(tempSpendingCostList[index].id);
      }
      tempSpendingCostList.splice(index, 1);
      this.spendingCostList = tempSpendingCostList;
      this.recalcIndexes();
      this.calcTotal();
      this.sendEvent({
        newData: this.spendingCostList
      });
      if (idToDelete) {
        this.sendEvent({
          isDeleted: true,
          toDeleteIdList: idToDelete
        });
      }
    }
  };

  calcTotal() {
    this.totalCalculated = 0;
    const totalSpending = this.spendingCostList.reduce((acc,item) => acc + (Number(item.total) || 0), 0);

    if(this.paymentLimit != null) {
      this.totalCalculated = totalSpending * this.percentageLimit / 100;
    }

    if(this.totalCalculated > this.paymentLimit) {
      this.totalCalculated = this.paymentLimit > 0 ? this.paymentLimit : 0;
    }
  }
  openCreateSpendingCostModal() {
    this.currentItem = this.columns
      .map((i) => {
        i = this.cloneObjectFunction(i);
        return i;
      })
      .map((i) => {
        i[i.type] = true;
        i.value = i.type == "checkboxInputType" ? false : "";
        return i;
      });
    this.showModal = true;
  }
  abortAdding() {
    this.showModal = false;
    this.currentItem = null;
  }
  _validateForm() {
    const isInputsCorrect = [
      ...this.template.querySelectorAll("lightning-input")
    ]
      .concat([...this.template.querySelectorAll("lightning-combobox")])
      .reduce((validSoFar, inputField) => {
        inputField.reportValidity();
        return validSoFar && inputField.checkValidity();
      }, true);
    return isInputsCorrect;
  }
  addSpendingCost() {
    if (!this._validateForm()) return;
    if (!this.spendingCostList || this.spendingCostList.length == 0) {
      this.spendingCostList = [];
    }
    // this.spendingCostList.push(this.currentItem);
    // console.log(this.spendingCostList);
    // debugger;
    this.recalcIndexes();
    let tempSpendingCostList = this.spendingCostList.map(
      this.cloneObjectFunction
    );
    let o = {};
    this.currentItem.forEach(
      (i) => i.type !== "iconType" && (o[i.fieldName] = i.value)
    );
    o.index =
      this.editIndex != undefined
        ? this.editIndex
        : tempSpendingCostList.length;
    if (o.index != undefined) {
      if (typeof tempSpendingCostList[o.index] === "undefined") {
        tempSpendingCostList[o.index] = {};
      }
      for (var key in o) tempSpendingCostList[o.index][key] = o[key];
    } else {
      tempSpendingCostList.push(o);
    }
    // tempSpendingCostList.push(...this.spendingCostList);
    // tempSpendingCostList.push({ index: tempSpendingCostList.length });
    this.spendingCostList = tempSpendingCostList;
    this.sendEvent({
      newData: this.spendingCostList
    });
    this.currentItem = null;
    this.editIndex = undefined;
    this.showModal = false;
    this.recalcIndexes();
    this.calcTotal();
    //this.setupCost();
  }
  handleChange(e) {
    this.currentItem.filter((i) => i.fieldName == e.target.name)[0].value =
      e.target.type == "checkbox" ? e.target.checked : e.target.value;
    let cost = this.currentItem.filter((i) => i.fieldName == "costToDate")[0];
    let vat = this.currentItem.filter((i) => i.fieldName == "vat")[0];
    this.currentItem.filter((i) => i.fieldName == "total")[0].value =
      (cost ? +cost.value : 0) + (vat ? +vat.value : 0);
  }
  recalcIndexes() {
    let tempSpendingCostList = this.spendingCostList.map(
      this.cloneObjectFunction
    );
    tempSpendingCostList.forEach((item, index) => {
      item.index = index;
    });
    this.spendingCostList = tempSpendingCostList;
  }

  cloneObjectFunction = (item) => {
    return { ...item };
  };

  // setupCost() {
  //   if (this.spendingCostList) {
  //     this.spendingCostsData = mapSpendingCosts(
  //       this.spendingCostList.map(this.cloneObjectFunction),
  //       this.picklistData,
  //       this.handleTextChangeInList,
  //       this.handleCheckboxChangeInList,
  //       this.handleDeleteCost
  //     );
  //   }
  // }

  sendEvent(details) {
    // Creates the event with the data.
    const selectedEvent = new CustomEvent("spendingcostchanges", {
      detail: details,
      bubbles: true,
      composed: true
    });

    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }
}