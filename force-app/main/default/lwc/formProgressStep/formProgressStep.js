import { LightningElement, api } from 'lwc';

export default class FormProgressStep extends LightningElement {
    @api
    currentStep;
    @api
    allSteps;

    handleStepBlur(event){
        const stepIndex = event.detail.index;
        this.dispatchEvent(new CustomEvent("changestep", { detail: stepIndex }));
        debugger;
    }
}