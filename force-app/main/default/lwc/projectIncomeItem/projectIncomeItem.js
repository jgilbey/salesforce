import { LightningElement, api } from 'lwc';

export default class ProjectIncomeItem extends LightningElement {

    @api income;
    @api visible;

    removeIncometItemHandler(){
        console.log('the income item is', JSON.stringify(this.income));
            this.fireEvent({
              eventName: "remove",
              details: { Id: this.income.Id }
            });
            this.visible = false;
        
    }

    handleOnChange(e) {
        e.stopPropagation();
        //myList[i][e.target.name] = e.target.value;
        console.log('handling in child');
        //console.log(e.target.name); //... Field API Name
        console.log('value',e.target.value); //... value
        console.log('dataset id',JSON.stringify(e.target.dataset.id)); //...Record Id
        console.log(JSON.stringify(e.target)); //...Record Id
        console.log('name',e.target.name);
        
        this.fireEvent({
            eventName: "incomechange", 
            details: { name: e.target.name, 
                value: e.target.value, 
                id: e.target.dataset.id }
        } );
        
    }

    fireEvent({ eventName, details }) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: details }))
    }

}