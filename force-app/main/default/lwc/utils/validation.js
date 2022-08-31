import form_error from "@salesforce/label/c.Error";
import InputTooLong from "@salesforce/label/c.InputTooLong";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const validateComponents = (componentsName, context) => {
    let isValid = true;

    const components = [...context.template.querySelectorAll(componentsName)];
    if (components) {
      isValid = components.reduce((validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      }, true);
    }
    
    return isValid;
  }

const validateInput = (event, context) => {
  let isValid = true;
  var inputValue = event.target.value;
  var maxLength = event.currentTarget.dataset.maxlength;
  if(maxLength != null){
    if(inputValue.length >= maxLength){
      isValid = false;
      const evt = new ShowToastEvent({
          title: form_error,
          message: InputTooLong + ' ' + maxLength + '.',
          variant: 'error',
          mode: 'dismissable'
      });
      context.dispatchEvent(evt);
    }
  }

  return isValid;
}

export { validateComponents,validateInput};