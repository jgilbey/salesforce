import { LightningElement, track, api, wire } from 'lwc';
import COST_HEADING from "@salesforce/schema/Project_Cost__c.Cost_heading__c";
import PROJECT_COST_OBJECT from "@salesforce/schema/Project_Cost__c";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
export default class ProjectCostItem extends LightningElement {
    
    @api cost;
    @api allowremoving;
    @api recordTypeId;
    @track objectInfo;
    
@wire(getObjectInfo, { objectApiName: PROJECT_COST_OBJECT })
wiredRecord({ error,data }){
    if (data) {
        this.objectInfo = data;
    }
}

    get recordTypeId() {
        // Returns a map of record type Ids 
        if(this.objectInfo){
            if(this.objectInfo.data){
                if(this.objectInfo.data.recordTypeInfos) {
                    const rtis = this.objectInfo.data.recordTypeInfos;
                    return Object.keys(rtis).find(rti => rtis[rti].name === 'Project_Inc');
                }
            }
        }
    }

    @wire(
        getPicklistValues,

        {
            recordTypeId: "0124J000000t4QnQAI",

            fieldApiName: COST_HEADING
        }
    )
    costHeadingList({ error, data }) {
        if (data) {
        console.log('this is the data', data);
        this.costHeadingList = data.values;
        } else  {
        console.log('error getting picklist values', error);
        }
    }
    costHeadingList;
 

   handleOnChange(e) {
        e.stopPropagation();
        //myList[i][e.target.name] = e.target.value;
        console.log('handling in child');
        //console.log(e.target.name); //... Field API Name
        console.log(e.target.value); //... value
        console.log('dataset',JSON.stringify(e.target.dataset.id)); //...Record Id
        console.log(JSON.stringify(e.target)); //...Record Id
        console.log(e.target.name);
        this.dispatchEvent(
            new CustomEvent('change', { detail: { name: e.target.name, value: e.target.value, id: e.target.dataset.id } })
          );
    }

    removeCostItemHandler(){
        console.log('the cost item', this.cost);
            this.fireEvent({
              eventName: "remove",
              details: { id: this.cost.Id }
            });
        
    }

    fireEvent({ eventName, details }) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: details }));
    }       
}