import { LightningElement, api, wire, track } from 'lwc';
import INCOME_SECURED from "@salesforce/schema/Project_Income__c.Secured_non_cash_contributions__c";
import PROJECT_INCOME_OBJECT from "@salesforce/schema/Project_Income__c";
import SOURCE_OF_FUNDING from "@salesforce/schema/Project_Income__c.Source_Of_Funding__c"
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";

export default class ProjectIncomeItem extends LightningElement {

    @api income;
    @track visible = true;
    @api disabled = false;
    @api recordId;
    @track incomeRecordTypeId;
    styleClass;
    @api smallGrant;
    @api mediumGrant;
    @api nhmfGrant;
    @track incomeSecuredList;
    @track incomeSourceOfFunding;


    @wire(getObjectInfo, { objectApiName: PROJECT_INCOME_OBJECT })
    wiredRecord({ error,data }){
        if (data) {

            console.log('data.recordTypeInfo', JSON.stringify(data.recordTypeInfos))
    
                    if(data.recordTypeInfos) {
                        console.log('this.income.RecordTypeName', this.income.RecordTypeName);
                        this.incomeRecordTypeId = Object.values(data.recordTypeInfos).find(
                            (item) => item.name === this.income.RecordTypeName
                          )?.recordTypeId;
                    }
        }
    }

    @wire(
        getPicklistValues,

        {
            recordTypeId: '$incomeRecordTypeId',

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

    @wire(
        getPicklistValues,

        {
            recordTypeId: '$incomeRecordTypeId',

            fieldApiName: SOURCE_OF_FUNDING
        }
    )
    incomeSourceOfFunding({ error, data }) {
        if (data) {
        console.log('this is the data for source of funding', data);
        this.incomeSourceOfFunding = data.values;
        } else  {
        console.log('error getting picklist values', error);
        }
    }

    removeIncometItemHandler(){
        console.log('the income item is', JSON.stringify(this.income));
            this.fireEvent({
              eventName: "remove",
              details: { id: this.income.Id, index: this.income.index }
            });
            this.visible = false;
        
    }

    handleOnChange(e) {
        e.stopPropagation();
        //myList[i][e.target.name] = e.target.value;
        console.log("handling in child");
        //console.log(e.target.name); //... Field API Name
        console.log("dataset value ", e.target.value); //... value
        console.log("dataset id", JSON.stringify(e.target.dataset.id)); //...Record Id
        //console.log(JSON.stringify(e.target)); //...Record Id
        console.log("name", e.target.name);
        var incomeValue;
        if(e.target.name === 'Evidence_for_secured_income__c' || e.target.name === "Secured__c"){
            incomeValue = e.target.checked;
        } else {
            incomeValue = e.target.value;
        }
        this.dispatchEvent(
          new CustomEvent("incomechange", {
            detail: {
              name: e.target.name,
              value: incomeValue,
              id: e.target.dataset.id
            }
          })
        );
    }

    fireEvent({ eventName, details }) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: details }))
    }


}