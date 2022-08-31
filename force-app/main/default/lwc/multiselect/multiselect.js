import { LightningElement, api } from "lwc";
import constants from "c/constants";
import If_applicable_what_is_the_registration_or_inventory_number_s from "@salesforce/label/c.If_applicable_what_is_the_registration_or_inventory_number_s";

const {
  TWO_PARK_GARDEN,
  PARK_OR_GARDEN,
  GRADE_ONE_PARK_OR_GARDEN,
  GRADE_TWO_ASTERIKS_PARK_OR_GARDEN,
  INPUTS_DATA_ARRAY
} = constants.inputsConstants;

export default class Multiselect extends LightningElement {
  @api options = [];
  @api applicationFormObject = {};

  labels = [If_applicable_what_is_the_registration_or_inventory_number_s]

  get isRegisterNumberNeeded(){
    let atLeastOneChecked = this.options.map(option => {
      if((option.label === TWO_PARK_GARDEN.label && option.isChecked)||
      (option.label === PARK_OR_GARDEN.label && option.isChecked) ||
      (option.label === GRADE_ONE_PARK_OR_GARDEN.label && option.isChecked) ||
      (option.label === GRADE_TWO_ASTERIKS_PARK_OR_GARDEN.label && option.isChecked)){
        return true;
      }
    });
    return atLeastOneChecked.includes(true);
  }

  handleCheckOption(event) {
    this.dispatchEvent(
        new CustomEvent('selectoption', {detail: event.detail})
    )
  }
  handleChangeData(event) {
    this.dispatchEvent(
        new CustomEvent('changedata', {detail: (event.detail.name? event.detail: event.target)})
    )
  }
}