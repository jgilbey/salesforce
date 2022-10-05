import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getProjectCosts from '@salesforce/apex/ProjectCostFormController.getProjectCosts';
import getCashContributions from '@salesforce/apex/ProjectCostFormController.getCashContributions';
//import saveProjectCosts from '@salesforce/apex/ProjectCostFormController.saveProjectCosts';
import deleteProjectCost from '@salesforce/apex/ProjectCostFormController.removeProjectCost';
import deleteProjectIncome from '@salesforce/apex/ProjectCostFormController.removeIncomeItem';

import UserPreferencesRecordHomeSectionCollapseWTShown from '@salesforce/schema/User.UserPreferencesRecordHomeSectionCollapseWTShown';
export default class ProjectCostsForm extends LightningElement {
    @track project = {};
    realTimeProject = {};
    totalCosts = 0;
    totalCost = 0;
    totalCashContributions = 0;
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

        //let local = data;
        Object.keys(data).forEach(field => 
          {
            this.project[field] = data[field];
          })

          console.log('the project is ',this.project);
        
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

      //perform validation on server side

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

    handleIncomeChange(e){
      e.stopPropagation();
        console.log('handling in parent');
        console.log(e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log(e.detail.id); //...Record Id
        this.cashContributions[e.detail.id][e.detail.name] = e.detail.value;
        //if the field was the amount - recalculate totals
        this.totalCashContributions = 0;
        this.calculateContributions();
        var fieldName = 'Total_Development_Income__c';
        console.log('the development income', this.project[fieldName]);
        this.project[fieldName] = this.totalCashContributions;
    }

    handleCostChange(e){
      e.stopPropagation();
        console.log('handling cost change in parent');
        console.log(e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log(e.detail.id); //...Record Id
        this.projectCosts[e.detail.id][e.detail.name] = e.detail.value;
        //if the field was the amount - recalculate totals
        this.totalCosts = 0;
        this.calculateCosts();
        var fieldName = 'Total_Cost__c';
        console.log('the total costs plus contributions', this.project[fieldName]);
        this.project[fieldName] = this.totalCosts;
    }

    calculateContributions(){
      for(var cont in this.cashContributions){
        this.totalCashContributions += parseInt(this.cashContributions[cont].Amount_you_have_received__c);
        
      }
    }

    calculateCosts(){
      for(var cost in this.projectCosts){
        this.totalCosts += parseInt(this.projectCosts[cost].Costs__c);
      }
    }


    handleAddProjectCost(){
    }


    
    handleRemoveIncome(e) {
      console.log('in handle remove income', e.detail.Id);
      this.deleteProjectIncome(e.detail.Id);
  }

    handleRemoveCost(e) {
        console.log('in handle remove cost', e.detail.Id);
        this.deleteCostProject(e.detail.Id);
    }
    
    deleteCostProject(projectCostToRemove){
        //delete controller method
        console.log('in delete project cost', projectCostToRemove);
        deleteProjectCost({projectId: this.project.Id, projectCostToRemove: projectCostToRemove, 
          grantPercentage: this.project.Grant_Percentage__c, 
          totalCost: this.project.Total_Cost__c})
        .then(response=>{
          if(response.success) {
            //this.retrieveData();
            console.log('successfully removed project cost')
          } else {
            console.log('Delete fail: ' + response.message);
            this.showToast('error', 'Removing failed', this.errorMessageHandler(response.message));
            
          }
        })
        .catch(error=>{
          console.log('error ',JSON.stringify(error));
          let variant = 'error'
          let title = 'Removed failed'
          let message = this.errorMessageHandler(error.message);
          this.dispatchEvent(
            new ShowToastEvent({variant, title, message})
          );
        
          //this.showToast('error', 'Removing failed', this.errorMessageHandler(JSON.stringify(error)));
          
        })
        .finally(()=>{
          //this.isDialogVisible = false;
        });

        
      this.recalculateCostsSummary();
        
    }
    
    
  // handlers functins --start
  showToast(variant, title, message) {
    this.dispatchEvent(
      new ShowToastEvent({variant, title, message})
    );
  }
    
    deleteProjectIncome(incomeId){
      //delete controller method
      console.log('in delete project cost', incomeId);
      deleteProjectIncome({projectId: '$recordId', projectIncomeToRemove: incomeId, grantPercentage: this.project.Grant_Percentage__c, totalCost: this.project.Total_Cost__c})
      .then(response=>{
        if(response.success) {
          //this.retrieveData();
          console.log('successfully removed project income')
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

      recalculateCostsSummary();
      
  }

  recalculateCostsSummary(){
    this.calculateContributions();
    this.calculateCosts();
  }

}