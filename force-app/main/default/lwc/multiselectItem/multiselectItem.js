import { LightningElement, api } from "lwc";
import What_is_the_certificate_number from "@salesforce/label/c.What_is_the_certificate_number";
import How_many_buildings_of_this_type_are_included_in_your_project from "@salesforce/label/c.How_many_buildings_of_this_type_are_included_in_your_project";
import constants from "c/constants";
const {
  GRADE_ONE_A,
  GRADE_ONE_B,
  GRADE_ONE_C,
  HISTORIC_SHIP,
  LOCAL_LIST,
  TWO_PARK_GARDEN,
  PARK_OR_GARDEN,
  GRADE_ONE_PARK_OR_GARDEN,
  GRADE_TWO_ASTERIKS_PARK_OR_GARDEN,
  INPUTS_DATA_ARRAY
} = constants.inputsConstants;
export default class MultiselectItem extends LightningElement {
  @api index = 0;
  @api applicationFormObject = {};
  _option = {};

  inputTimeout = 0;
  inputData = {};
  NUMBER_FIELDS_MAX_LENGTH = 5;
  labels = [
    What_is_the_certificate_number,
    How_many_buildings_of_this_type_are_included_in_your_project
  ];
  @api
  get option() {
    return this._option;
  }
  set option(newOption) {
    const isCheckedChanged = this._option.isChecked !== newOption.isChecked;
    this._option = newOption;

    if (isCheckedChanged) {
      this.handleFireInputData(newOption.isChecked);
    }
  }

  get isGradeOneA() {
    return this.option.label === GRADE_ONE_A.label && this.option.isChecked;
  }

  get isGradeTwoB() {
    return this.option.label === GRADE_ONE_B.label && this.option.isChecked;
  }

  get isGradeTwoС() {
    return this.option.label === GRADE_ONE_C.label && this.option.isChecked;
  }

  get isLocalList() {
    return this.option.label === LOCAL_LIST.label && this.option.isChecked;
  }

  get isHistoricShip() {
    return this.option.label === HISTORIC_SHIP.label && this.option.isChecked;
  }

  get isTwoParkGarden() {
    return this.option.label === TWO_PARK_GARDEN.label && this.option.isChecked;
  }

  get isParkOrGarden() {
    return this.option.label === PARK_OR_GARDEN.label && this.option.isChecked;
  }

  get isRegisterNumberNeeded() {
    return (
      this.isTwoParkGarden ||
      (this.option.label === PARK_OR_GARDEN.label && this.option.isChecked) ||
      (this.option.label === GRADE_ONE_PARK_OR_GARDEN.label &&
        this.option.isChecked) ||
      (this.option.label === GRADE_TWO_ASTERIKS_PARK_OR_GARDEN.label &&
        this.option.isChecked)
    );
  }

  handleFireInputData(newChecked) {
    const input = INPUTS_DATA_ARRAY.find(
      (el) => el.label === this.option.label
    );

    if (!input) {
      return;
    }

    const checked =
      this.option.label === GRADE_ONE_B.label ? !newChecked : newChecked;

    const inputValue = checked ? this.inputData[input.name] || "" : "";

    if (!inputValue && newChecked) {
      return;
    }

    this.fireChangeInputData({ name: input.name, value: inputValue });
  }

  checkOption(event) {
    const checked = event.target.checked;

    this.dispatchEvent(
      new CustomEvent("checkoption", {
        detail: {
          index: this.index,
          checked
        }
      })
    );
  }

  handleChange(event) {
    clearTimeout(this.inputTimeout);

    const { name, value } = event.target;
    this.inputTimeout = setTimeout(() => {
      this.inputData[name] = value;
      this.fireChangeInputData({ name, value });
    }, 500);
  }

  fireChangeInputData({ name, value }) {
    this.dispatchEvent(
      new CustomEvent("changedata", {
        detail: {
          name,
          value
        }
      })
    );
  }
}