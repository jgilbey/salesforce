import { LightningElement, api } from 'lwc';

export default class ProjectCostsFormTotals extends LightningElement {

    @api project;
    visible = false;
    
    get isMediumProject(){
        if(this.project.recordType.Name === 'Medium'){
            this.visible= true;
        }
    }

}