import { LightningElement, api, wire } from 'lwc';

import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getProjectCosts from '@salesforce/apex/ProjectCostFormController.getProjectCosts';
import getCashContributions from '@salesforce/apex/ProjectCostFormController.getCashContributions';
//import saveProjectCosts from '@salesforce/apex/ProjectCostFormController.saveProjectCosts';
import deleteProjectCost from '@salesforce/apex/ProjectCostFormController.removeProjectCost';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProjectCostsForm extends LightningElement {
    project = [];
    projectCosts = [];
    cashContributions = [];
    columns = [
        {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c'},
        {label: 'Project Description', editable: true, fieldName: 'Project_Cost_Description__c'},
        {label: 'Amount', editable: true, fieldName: 'Costs__c'}
        
    ];

    mediumColumns = [
        {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c'},
        {label: 'Project Description', editable: true, fieldName: 'Project_Cost_Description__c'},
        {label: 'Amount', editable: true, fieldName: 'Costs__c'},
        {label: 'VAT', editable: true, fieldName: 'VAT__C'}
        
    ];
    
    contributionColumns = [
        {label: 'Description', editable: true, fieldName: 'Cost_heading__c'},
        {label: 'Is this cash contribution secured?', editable: true, fieldName: 'Project_Cost_Description__c'},
        {label: 'Amount', editable: true, fieldName: 'Costs__c'}
        
    ];
    
    @api recordId;
    @api columnWidthsMode = 'fixed';

    @wire(getProject, {projectId: '$recordId'})
    wiredProject({error, data}){
      if(data){
        this.project = data;
        console.log('project', data);
      } else {
        console.log('error retrieving project')
      }
    }

    @wire(getCashContributions, {
      projectId: '$recordId'
    })
    wiredContributions({error, data}){

      if(data){
        console.log('data is', JSON.stringify(data));
        let preparedRows = [];
            let i = 0;
            data.forEach(income => {
              let preparedRow = {};
              //Secured__c, Income_Description__c, Value__c
              preparedRow.Secured__c = income.Secured__c; //amount
              preparedRow.Description_for_cash_contributions__c = income.Description_for_cash_contributions__c;
              preparedRow.Amount_you_have_received__c = income.Amount_you_have_received__c;
              preparedRow.Id = income.Id;
              preparedRow.index = i;
              preparedRows.push(preparedRow);
              i++;
             });  
             this.cashContributions = preparedRows;
             console.log('costs',this.cashContributions);
        
      }
      else{
        this.cashContributions = undefined;
      }
    }

    get cashContributions(){
      return this.cashContributions;
    }

    @wire(getProjectCosts, {
        projectId: '$recordId'
      })
      wiredProjects({ error, data }) {
        if (data) {
            console.log('data is', JSON.stringify(data));
            let preparedRows = [];
            let i = 0;
            data.forEach(cost => {
              let preparedRow = {};
              preparedRow.Costs__c = cost.Costs__c; //amount
              preparedRow.Cost_heading__c = cost.Cost_heading__c;
              preparedRow.Project_Cost_Description__c = cost.Project_Cost_Description__c;
              //preparedRow.Vat__c = cost.Vat__c;
              preparedRow.Id = cost.Id ? cost.Id : null;
              //preparedRow.allowRemoving = true;
              preparedRow.index = i;
              preparedRows.push(preparedRow);
              i++;
             });  
             this.projectCosts = preparedRows;
             console.log('costs',this.projectCosts);
        } else if (error) {
          this.projectCosts = [];
          this.error = error;
          console.log('error', error);
        }
      }
  
    handleSave(event) {
        //this.saveDraftValues = event.detail.draftValues;
        //need to update the values of data with the draft values    
    }

    @api
    handleSaveProjectCosts() {

        /*var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();  
        console.log('the revenues'+selectedRecords);
        createForecastRevenue({forecastList: selectedRecords})  
        .then(result=>{  
            console.log('handle created done', result);
         //return refreshApex(this.oppList);  
       });  */
       /*console.log(this.projectCosts)

       let projectCostsWithoutIds = [];
       this.projectCosts.forEach(projectCost => { 
           let preparedCosts = {};
           preparedCosts.Costs__c = parseInt(projectCost.Costs__c);
           preparedCosts.Cost_heading__c = projectCost.Cost_heading__c;
           projectCostsWithoutIds.push(preparedCosts);
       });
       this.projectCosts = projectCostsWithoutIds;
       console.log('before sending', this.projectCosts)
       saveProjectCosts({projectCosts: this.projectCosts})  
        .then(result=>{  
            console.log('handle created done', result);
         //return refreshApex(this.oppList);  
       }); */
        // then navigate to placement page and refresh?
    }

    buildChangeEventDetail(e){
        const { id } = e.target.dataset;
        return { 
            cost: {
                ...cost,
                [id]: e.detail.value
            }
        };
    }

    handleAddProjectCost(){

    }

    handleChange(e){/*
        e.stopPropagation();
        console.log('handling in parent');
        console.log(e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log(e.detail.id); //...Record Id
        this.projecCosts[e.detail.id][e.detail.name] = e.detail.value;*/
    }

    handleRemove(e) {
        console.log('in handle remove', e.detail.Id);
        this.deleteCostProject(e.detail.Id);
    }

    deleteCostProject(projectId){
        //delete controller method
        console.log('in delete project cost', projectId);
        deleteProjectCost({projectCostToRemove: projectId})
        .then(response=>{
          if(response.success) {
            //this.retrieveData();
            console.log('successfully removed project cost')
          } else {
            this.showToast('error', 'Removing failed', this.errorMessageHandler(response.message));
            console.log('Delete fail: ' + response.message);
          }
        })
        .catch(error=>{
          this.showToast('error', 'Removing failed', this.errorMessageHandler(JSON.stringify(error)));
          console.log(JSON.stringify(error));
        })
        .finally(()=>{
          this.isDialogVisible = false;
        });
        
    }
}