import { LightningElement, track, api, wire } from 'lwc';
import COST_HEADING from "@salesforce/schema/Project_Cost__c.Cost_heading__c";
import PROJECT_COST_OBJECT from "@salesforce/schema/Project_Cost__c";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
export default class ProjectCostItem extends LightningElement {
    
    @api cost;
    @api allowremoving;
    @api recordTypeId;
    @track visible = true;
    @track disabled = false;
    @track costHeadingList;
    @api styleClass; //= "slds-popover";
    @api objectApiName;
    @track costRecordTypeId;
    @track totalCost = 0;
    error;
    
@wire(getObjectInfo, { objectApiName: PROJECT_COST_OBJECT })
wiredRecord({ error,data }){
    if (data) {

                if(data.recordTypeInfos) {
                    console.log('the reti',JSON.stringify(data.recordTypeInfos));
                    this.costRecordTypeId = Object.values(data.recordTypeInfos).find(
                        (item) => item.name === this.cost.RecordTypeName
                      ).recordTypeId;
                }
                
            this.error = undefined;
    
            } else if (error) {
                this.error = error;
                this.assetRecordTypeId = undefined;
              }
}


    @wire(
        getPicklistValues,

        {
            recordTypeId: '$costRecordTypeId',

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

   handleOnChange(e) {
        e.stopPropagation();
        //myList[i][e.target.name] = e.target.value;
        console.log('handling in child');
        //console.log(e.target.name); //... Field API Name
        console.log('dataset value ',e.target.value); //... value
        console.log('dataset id',JSON.stringify(e.target.dataset.id)); //...Record Id
        //console.log(JSON.stringify(e.target)); //...Record Id
        console.log('name',e.target.name);
        this.dispatchEvent(
            new CustomEvent('costchange', { detail: { name: e.target.name, value: e.target.value, id: e.target.dataset.id } })
            );
            
        this.calculateTotalCost();
    }

    renderedCallback() {
        this.calculateTotalCost();
    }

    removeCostItemHandler(){
        console.log('the cost item is', JSON.stringify(this.cost));
            this.fireEvent({
              eventName: "remove",
              details: { Id: this.cost.Id, index: this.cost.index }
            });
            this.visible = false;
        
    }

    calculateTotalCost(){
        if(this.cost.Vat__c) {
            this.totalCost = Number(this.cost.Costs__c) + Number(this.cost.Vat__c);
        }
        
    }


    fireEvent({ eventName, details }) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: details }))
    }       
}