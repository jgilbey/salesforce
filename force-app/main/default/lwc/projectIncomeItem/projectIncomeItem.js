import { LightningElement, api, wire, track } from 'lwc';
import INCOME_SECURED from "@salesforce/schema/Project_Income__c.Secured_non_cash_contributions__c";
import PROJECT_INCOME_OBJECT from "@salesforce/schema/Project_Income__c";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";

export default class ProjectIncomeItem extends LightningElement {

    @api income;
    @track visible = true;
    @api disabled = false;
    @api recordId;
    @track recordTypeId;
    styleClass;
    
    @track incomeSecuredList;

    @wire(getObjectInfo, { objectApiName: PROJECT_INCOME_OBJECT })
    wiredRecord({ error,data }){
        if (data) {

            console.log('data.recordTypeInfo', JSON.stringify(data.recordTypeInfos))
    
                    if(data.recordTypeInfos) {
                        this.costRecordTypeId = Object.values(data.recordTypeInfos).find(
                            (item) => item.name === "Master"
                          ).recordTypeId;
                    }
        }
    }

    @wire(
        getPicklistValues,

        {
            recordTypeId: '$costRecordTypeId',

            fieldApiName: INCOME_SECURED
        }
    )
    incomeSecuredList({ error, data }) {
        if (data) {
        console.log('this is the data', data);
        this.incomeSecuredList = data.values;
        } else  {
        console.log('error getting picklist values', error);
        }
    }

    removeIncometItemHandler(){
        console.log('the income item is', JSON.stringify(this.income));
            this.fireEvent({
              eventName: "remove",
              details: { Id: this.income.Id, index: this.income.index }
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
        
        this.dispatchEvent(
            new CustomEvent('incomechange', { detail: { name: e.target.name, value: e.target.value, id: e.target.dataset.id } })
            );
    }

    fireEvent({ eventName, details }) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: details }))
    }

}