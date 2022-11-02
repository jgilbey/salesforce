import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getProjectCosts from '@salesforce/apex/ProjectCostFormController.getProjectCosts';
import getCashContributions from '@salesforce/apex/ProjectCostFormController.getCashContributions';
import saveProjectCosts from '@salesforce/apex/ProjectCostFormController.saveProjectCosts';
import deleteProjectCost from '@salesforce/apex/ProjectCostFormController.removeProjectCost';
import deleteProjectIncome from '@salesforce/apex/ProjectCostFormController.removeIncomeItem';
import { refreshApex } from '@salesforce/apex';

import UserPreferencesRecordHomeSectionCollapseWTShown from '@salesforce/schema/User.UserPreferencesRecordHomeSectionCollapseWTShown';
export default class ProjectCostsForm extends LightningElement {

  loading = false;
  activeSections = ['A', 'B'];
  activeSectionsMessage = '';
  smallGrantProject = "Small_Grant_3_10k";
  mediumGrantProject = "Medium";

  handleSectionToggle(event) {
      const openSections = event.detail.openSections;

      if (openSections.length === 0) {
          this.activeSectionsMessage = '';
      } else {
          this.activeSectionsMessage =
              'Open sections: ' + openSections.join(', ');
      }
    }
   @api objectApiName
    @track project = {};
    realTimeProject = {};
    totalCosts = 0;
    totalCost = 0;
    totalCashContributions = 0;
    totalVAT = 0;
    @track projectCosts = [];
    @track cashContributions = [];
    @track removedProjectCosts = [];
    @track removedContributions = [];
    smallCols = [
        {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c'},
        {label: 'Project Description', editable: true, fieldName: 'Project_Cost_Description__c'},
        {label: 'Amount', editable: true, fieldName: 'Costs__c'}
        
    ];

    mediumColumns = [
        {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c'},
        {label: 'Project Description', editable: true, fieldName: 'Project_Cost_Description__c'},
        {label: 'Amount', editable: true, fieldName: 'Costs__c'},
        {label: 'VAT', editable: true, fieldName: 'VAT__C'},
        {label: 'Total Cost', editable: true, fieldName: ''},
        
    ];
    
    contributionColumns = [
        {label: 'Description', editable: true, fieldName: 'Cost_heading__c'},
        {label: 'Is this cash contribution secured?', editable: true, fieldName: 'Project_Cost_Description__c'},
        {label: 'Amount', editable: true, fieldName: 'Costs__c'}
        
    ];
    

    get columns(){
      if (this.project && this.project.RecordType) {
        switch (this.project.RecordType.DeveloperName) {
          case this.smallGrantProject:
            return this.smallCols;
          case this.mediumGrantProject:
            return this.mediumColumns;
        }}
    }

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

          console.log('the project is ',JSON.stringify(this.project));
        
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
              preparedRow.Secured_non_cash_contributions__c = income.Secured_non_cash_contributions__c;
              preparedRow.Description_for_cash_contributions__c = income.Description_for_cash_contributions__c;
              preparedRow.Amount_you_have_received__c = income.Amount_you_have_received__c;
              preparedRow.Id = income.Id;
              preparedRow.RecordTypeName = income.RecordType.Name;
              preparedRow.index = i;
              preparedRows.push(preparedRow);
              i++;
             });  
             this.cashContributions = preparedRows;
             console.log('cash',this.cashContributions);
        
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
            console.log('project cost data is', JSON.stringify(data));
            let preparedRows = [];
            let i = 0;
            data.forEach(cost => {
              let preparedRow = {};
              preparedRow.Costs__c = cost.Costs__c; //amount
              preparedRow.Cost_heading__c = cost.Cost_heading__c;
              preparedRow.Project_Cost_Description__c = cost.Project_Cost_Description__c;
              preparedRow.RecordTypeName = cost.RecordType.Name;
              console.log('record type ', cost.RecordType);
              console.log('record type name', cost.RecordType.Name);
              if(cost.RecordType.Name === 'Medium Grants'){
                preparedRow.Vat__c = cost.Vat__c;
              }
              //preparedRow.Vat__c = cost.Vat__c;
              preparedRow.Id = cost.Id ? cost.Id : null;
              //preparedRow.allowRemoving = true;
              preparedRow.index = i;
              preparedRows.push(preparedRow);
              console.log('preparedRow', preparedRow);
              i++;
             });  
             this.projectCosts = preparedRows;
            // console.log('costs',this.projectCosts);
        } else if (error) {
          this.projectCosts = [];
          this.error = error;
          console.log('error', error);
        }
      }

    
    handleSaveProjectCosts() {

      //send the items to be saved to back end
      console.log('project cost before save',JSON.stringify(this.projectCosts));
      this.loading = true;
      let newProjectCosts = [];
      this.projectCosts.forEach(cost => { 
          let preparedCost = {};
          preparedCost.Costs__c = parseInt(cost.Costs__c);
          preparedCost.Project_Cost_Description__c = cost.Project_Cost_Description__c;
          preparedCost.Cost_heading__c = cost.Cost_heading__c;
          if(cost.Id.length != 0){preparedCost.Id = cost.Id}; 
          preparedCost.Case__c = this.project.Id;
          newProjectCosts.push(preparedCost);
          
          console.log('cont', JSON.stringify(preparedCost));
      });
      //this.projectCosts = newProjectCosts; //hmm

      let newCashContributions = [];
      this.cashContributions.forEach(cont => { 
          let preparedContribution = {};
          preparedContribution.Amount_you_have_received__c = parseInt(cont.Amount_you_have_received__c);
          preparedContribution.Secured__c = cont.Secured__c;
          preparedContribution.Secured_non_cash_contributions__c = cont.Secured_non_cash_contributions__c;
          preparedContribution.Case__c = this.project.Id;
          //console.log('cont.Id.length ', cont.Id.length );
          if(cont.Id && cont.Id.length != 0) {preparedContribution.Id = cont.Id;};
          preparedContribution.Description_for_cash_contributions__c = cont.Description_for_cash_contributions__c;
          newCashContributions.push(preparedContribution);
          console.log('cont', JSON.stringify(preparedContribution));
      });
      //this.cashContributions = newCashContributions;
      console.log('before sending', JSON.stringify(this.projectCosts));
      saveProjectCosts({projectId: this.project.Id, totalCost: this.project.Total_Cost__c, 
        cashContributions: newCashContributions, projectCosts: newProjectCosts, 
        removedCashContributions: this.removedContributions, removedProjectCosts: this.removedProjectCosts}) 
       .then(result=>{  
           console.log('handle created done', result);
           let variant = 'success';
          let title = 'Project Saved';
          let message = 'Project costs were saved successfully';
          this.dispatchEvent(
            new ShowToastEvent({variant, title, message})
          );
          refreshApex(this.projectCosts);
          refreshApex(this.cashContributions);
          this.loading = false;
          })
          .catch(error=>{
            console.log('error ',JSON.stringify(error));
            let variant = 'error';
            let title = 'Save failed';
            let message = error.body.message;
            this.dispatchEvent(
              new ShowToastEvent({variant, title, message})
            );
            this.loading = false;
          })
        //return refreshApex(this.oppList);  ; 
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
        console.log('handling in parent', JSON.stringify(e.detail));
        console.log(e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log(e.detail.id); //...Record Id
        this.cashContributions[e.detail.id][e.detail.name] = e.detail.value;
        //if the field was the amount - recalculate totals
        this.totalCashContributions = 0;
        this.recalculateCostsSummary();
        var fieldName = 'Total_Development_Income__c';
        console.log('the development income', this.project[fieldName]);
        this.project[fieldName] = this.totalCashContributions;
        
    }

    @api
    handleCostChange(e){
      e.stopPropagation();
        console.log('project costs', this.projectCosts);
        console.log('handling cost change in parent');
        console.log(e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log(e.detail.id); //...Record Id
        this.projectCosts[e.detail.id][e.detail.name] = e.detail.value;
        console.log('the project costs are now', JSON.stringify(this.projectCosts));
        //if the field was the amount - recalculate totals
        this.totalCosts = 0;
        this.recalculateCostsSummary();
        var fieldName = 'Total_project_VAT__c'
        this.project[fieldName] = this.totalVAT;
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
      var newTotalCosts = 0;
      var newVATTotal = 0;
      for(var cost in this.projectCosts){
        newTotalCosts += parseInt(this.projectCosts[cost].Costs__c);
        newVATTotal += parseInt(this.projectCosts[cost].Vat__c);
        
      }
      this.totalCosts = newTotalCosts;
      this.totalVAT = newVATTotal;
    }


    handleAddProjectCost(){      
      let newProjectCosts = this.projectCosts;
      let preparedRow = {};
      preparedRow.Costs__c = 0; //amount
      preparedRow.Cost_heading__c = 'Select heading';
      preparedRow.Project_Cost_Description__c = '';
      //preparedRow.Vat__c = cost.Vat__c;
      preparedRow.Id = '';
      preparedRow.index = this.projectCosts.length;
      newProjectCosts.push(preparedRow);
      
      this.projectCosts = newProjectCosts;
      console.log('the project costs with new row', JSON.stringify(this.projectCosts));
    }
    

    
    handleAddCashContribution(){
      
      let preparedRow = {};
      //Secured__c, Income_Description__c, Value__c
      preparedRow.Secured__c = 0; //amount
      preparedRow.Description_for_cash_contributions__c = '';
      preparedRow.Amount_you_have_received__c = 0;
      if(this.cashContributions.length < 1) {
        preparedRow.index = 0;
      } else {
        preparedRow.index = this.cashContributions.length;
      }
      this.cashContributions.push(preparedRow);
      this.cashContributions = this.cashContributions;

    }

    
    handleRemoveIncome(e) {
      console.log('in handle remove income', e.detail.Id);
      this.deleteProjectIncome(e.detail.Id, e.detail.index);
  }

    handleRemoveCost(e) {
        console.log('in handle remove cost', e.detail.Id);
        
        console.log('in handle remove cost', e.detail.index);
        this.deleteCostProject(e.detail.Id, e.detail.index);
    }
    
    deleteCostProject(projectCostToRemove, projectIndex){
        //delete controller method
        console.log('in delete project cost', projectCostToRemove);
       /* deleteProjectCost({projectId: this.project.Id, projectCostToRemove: projectCostToRemove, 
          grantPercentage: this.project.Grant_Percentage__c, 
          totalCost: this.project.Total_Cost__c})
        .then(response=>{
            //this.retrieveData();
            console.log('successfully removed project cost', JSON.stringify(this.projectCosts));
            //remove from ui list
            /*this.projectCosts = this.projectCosts.filter(function (element) { 
              return parseInt(element.id) !== accessKey;
            });*/
            const index = this.projectCosts.indexOf(projectIndex);
            let array = this.projectCosts;
            console.log('the array', JSON.stringify(array));
            this.removedProjectCosts.push(this.removedProjectCosts.at(projectIndex));
            console.log('the index', JSON.stringify(index));
            if (index <= -1) { // only splice array when item is found
              console.log('splicing', true)
              array.splice(projectIndex, 1); // 2nd parameter means remove one item only
            }
            console.log('spliced array is', JSON.stringify(array));
            this.projectCosts = array;
           // console.log('response', JSON.stringify(response));
            console.log('****the costs are now', JSON.stringify(this.projectCosts));
        /*
            console.log('Delete fail: ' + response.message);
            this.showToast('error', 'Removing failed', response.message);
            
          */
        /*})
        .catch(error=>{
          console.log('error ',JSON.stringify(error));
          let variant = 'error';
          let title = 'Removed failed';
          let message = error.message;
          this.dispatchEvent(
            new ShowToastEvent({variant, title, message})
          );
          return false;
          
        })
        .finally(()=>{
          //this.isDialogVisible = false;
        });*/

        
      this.recalculateCostsSummary();
        
    }
    
    deleteProjectIncome(incomeId, incomeIndex){
      //delete controller method
      console.log('in delete project income', incomeId);
      if(incomeId){
        /*deleteProjectIncome({projectId: this.project.Id, projectIncomeToRemove: incomeId, 
          grantPercentage: this.project.Grant_Percentage__c, totalCost: this.project.Total_Cost__c})
        .then(response=>{
        */
          const index = this.cashContributions.indexOf(incomeIndex);
          let array = this.cashContributions;
          console.log('the array', JSON.stringify(array));
          console.log('trying to delete', JSON.stringify(this.cashContributions.at(incomeIndex)));
          this.removedContributions.push(this.cashContributions.at(incomeIndex));
          console.log('the index', JSON.stringify(index));
          if (index <= -1) { // only splice array when item is found
            console.log('splicing', true)
            array.splice(incomeIndex, 1); // 2nd parameter means remove one item only
          }
          console.log('spliced array is', JSON.stringify(array));
          this.cashContributions = array;
          //console.log('response', JSON.stringify(response));
          console.log('****the cash are now', JSON.stringify(this.cashContributions));
        /*})
        .catch(error=>{
          //this.showToast('error', 'Removing failed', this.errorMessageHandler(JSON.stringify(error)));
          console.log('error ',JSON.stringify(error));
          let variant = 'error'
          let title = 'Removed failed'
          let message = error.message;
          this.dispatchEvent(
            new ShowToastEvent({variant, title, message})
          );
        })
        .finally(()=>{*/
          //this.isDialogVisible = false;
          
          this.recalculateCostsSummary();
       // });
      }
      
  }

  recalculateCostsSummary(){
    this.calculateContributions();
    this.calculateCosts();
  }

}