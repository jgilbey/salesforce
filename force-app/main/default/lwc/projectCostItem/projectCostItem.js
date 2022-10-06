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
    @track visible = true;
    @track disabled = false;
    
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
        console.log('the name', JSON.stringify(e.target.name));
        
        //console.log('the field name', JSON.stringify(e.target.dataset.field));
        this.dispatchEvent(
            new CustomEvent('costchange', { detail: { name: e.target.name, value: e.target.value, id: e.target.dataset.id } })
          );
    }

    removeCostItemHandler(){
        console.log('the cost item is', JSON.stringify(this.cost));
            this.fireEvent({
              eventName: "remove",
              details: { Id: this.cost.Id, index: this.cost.index }
            });
            this.visible = false;
        
    }

    fireEvent({ eventName, details }) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: details }))
    }       
}