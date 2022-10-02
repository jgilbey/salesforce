import { LightningElement, api } from 'lwc';

export default class ProjectIncomeItem extends LightningElement {

    @api income;

    removeIncometItemHandler(){
        console.log('the cost item is', JSON.stringify(this.cost));
            this.fireEvent({
              eventName: "remove",
              details: { Id: this.income.Id }
            });
            this.visible = false;
        
    }

    fireEvent({ eventName, details }) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: details }))
    }

}