import { LightningElement, track, api } from "lwc";
import utils from "c/utils";
const ValidationUtils = utils.validation;

export default class MultilineInput extends LightningElement {
  @api name = "";
  @api isDisabled = false;
  @api isRequired = false;
  @api id = "";
  @api maxLength = 255;
  _value = "";

  @track isFocused = false;

  @api
  get value() {
    return this._value;
  }
  set value(newValue) {
    this._value = newValue;
  }

  get textarea() {
    return this.template.querySelector("lightning-textarea");
  }

  get textareaClass() {
    return !this.isFocused ? "multiline-input" : "multiline-textarea";
  }

  handleFocus() {
    this.isFocused = true;
  }

  handleBlur() {
    //move the cursor to the top of textarea
    const value = this._value;
    this._value = "";
    setTimeout(() => (this._value = value));

    this.isFocused = false;
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.fireChangedData(value);
  }

  fireChangedData(newValue) {
    const newData = {
      name: this.name,
      value: newValue,
      id: this.id
    };

    this.dispatchEvent(
      new CustomEvent("datachange", {
        detail: newData
      })
    );
  }

  @api
  validation() {
    let isValid = true;
    let components = [...this.template.querySelectorAll("lightning-textarea")];
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
}