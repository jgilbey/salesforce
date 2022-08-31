import LightningDatatable from "lightning/datatable";
import { api } from "lwc";
import buttonInput from "./templates/buttonInput.html";
import iconInput from "./templates/iconInput.html";
import checkboxInput from "./templates/checkboxInput.html";
import dateInput from "./templates/dateInput.html";
import dateOutput from "./templates/dateOutput.html";
import numberInput from "./templates/numberInput.html";
import richTextInput from "./templates/richTextInput.html";
import textInput from "./templates/textInput.html";
import comboboxInput from "./templates/comboboxInput.html";
import actionsList from "./templates/actionsList.html";

export default class CustomDataTable extends LightningDatatable {
  static customTypes = {
    numberInputType: {
      template: numberInput,
      typeAttributes: [
        "formatter",
        "step",
        "isRequired",
        "isDisabled",
        "handler",
        "index",
        "fieldName",
        "maxLength",
      ]
    },
    richTextInputType: {
      template: richTextInput,
      typeAttributes: [
        "class",
        "isRequired",
        "isDisabled",
        "maxLength",
        "handler",
        "index",
        "fieldName",
        "keypresshandler"
      ]
    },
    textInputType: {
      template: textInput,
      typeAttributes: [
        "isRequired",
        "isDisabled",
        "handler",
        "index",
        "fieldName",
        "maxLength",
        "keypresshandler"
      ]
    },
    dateInputType: {
      template: dateInput,
      typeAttributes: [
        "isRequired",
        "isDisabled",
        "handler",
        "index",
        "fieldName"
      ]
    },
    checkboxInputType: {
      template: checkboxInput,
      typeAttributes: [
        "isRequired",
        "isDisabled",
        "handler",
        "index",
        "fieldName"
      ]
    },
    buttonType: {
      template: buttonInput,
      typeAttributes: [
        "class",
        "variant",
        "label",
        "title",
        "handler",
        "isDisabled",
        "handler",
        "index"
      ]
    },
    buttonListType: {
      template: actionsList,
      typeAttributes: [
        "index",
        "buttonList"
      ]
    },
    iconType: {
      template: iconInput,
      typeAttributes: [
        "icon",
        "variant",
        "text",
        "class",
        "title",
        "isDisabled",
        "handler",
        "index"
      ]
    },
    comboboxType: {
      template: comboboxInput,
      typeAttributes: [
        "options",
        "isDisabled",
        "isRequired",
        "handler",
        "index",
        "fieldName"
      ]
    }
  };

  @api
  validateTable(){
    let isValid = true;
    let components = [...this.template.querySelectorAll('[data-searchname="dataTableElement"]')];
    
    if (components && components.length > 0) {
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