import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getProjectCosts from '@salesforce/apex/ProjectCostFormController.getProjectCosts';
import getCashContributions from '@salesforce/apex/ProjectCostFormController.getCashContributions';
import saveProjectCosts from '@salesforce/apex/ProjectCostFormController.saveProjectCosts';
import { refreshApex } from '@salesforce/apex';

import UserPreferencesRecordHomeSectionCollapseWTShown from '@salesforce/schema/User.UserPreferencesRecordHomeSectionCollapseWTShown';
export default class ProjectCostsForm extends LightningElement {

  _wireResultProjectCosts = {};
  _wireResultContributions = {};
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

    get projectType(){

      if (this.project && this.project.RecordType) {
        switch (this.project.RecordType.DeveloperName) {
          case this.smallGrantProject:
            return 'Small';
          case this.mediumGrantProject:
            return 'Medium';
        }}
    }
    

    get columns(){
      if (this.project && this.project.RecordType) {
        console.log('project.recordtype.developername', this.project.RecordType.DeveloperName);
        
        console.log('is it', this.smallGrantProject);
        
        console.log('or is it', this.mediumGrantProject);
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
        
      } else {
        console.log('error retrieving project')
      }
    }
    

    @wire(getCashContributions, {
      projectId: '$recordId'
    })
    wiredContributions(result){
      this._wireResultContributions = result;
      const { error, data } = result;
      if(data){
        console.log('data is', JSON.stringify(data));

        this.cashContributions = data.map((income, index) => {
          let retVal = {};
              if(income.Case__r.RecordType.DeveloperName === this.mediumGrantProject){
                retVal.Secured__c = income.Secured__c; //amount
              } else {
                retVal.Secured_non_cash_contributions__c = income.Secured_non_cash_contributions__c;
              
              }
              retVal.Description_for_cash_contributions__c = income.Description_for_cash_contributions__c;
              retVal.Amount_you_have_received__c = income.Amount_you_have_received__c;
              retVal.Id = income.Id;
              retVal.RecordTypeName = income.RecordType.Name;
              retVal.index = index;
              return retVal;
              });
    } else if (error) {
      this.projectCosts = [];
      this.error = error;
      console.log("error", error);
    }
  }

    @wire(getProjectCosts, {
      projectId: "$recordId"
    })
    wiredProjectCosts(result) {
      this._wireResultProjectCosts = result;
      const { error, data } = result;
      if (data) {
        console.log("project cost data is", JSON.stringify(data));
        this.projectCosts = data.map((cost, index) => {
          let retVal = {};
          retVal.Costs__c = cost.Costs__c; //amount
          retVal.Cost_heading__c = cost.Cost_heading__c;
          retVal.Project_Cost_Description__c = cost.Project_Cost_Description__c;
          retVal.RecordTypeName = cost.RecordType.Name;
          retVal.Id = cost.Id;
          retVal.index = index;
          if (retVal.RecordTypeName === "Medium Grants") {
            retVal.Vat__c = cost.Vat__c;
          }
          return retVal; //oi
        });
      } else if (error) {
        this.projectCosts = [];
        this.error = error;
        console.log("error", error);
      }
    }
//wtf come the f on
    getNewContributions() {
      return this.cashContributions.map((cont) => {
        let preparedContribution = {};
        preparedContribution.Amount_you_have_received__c = parseInt(cont.Amount_you_have_received__c);
        preparedContribution.Secured__c = cont.Secured__c;
        preparedContribution.Secured_non_cash_contributions__c = cont.Secured_non_cash_contributions__c;
        preparedContribution.Case__c = this.project.Id;
        //console.log('cont.Id.length ', cont.Id.length );
        if (cont.Id) {
          preparedContribution.Id = cont.Id;
        }
        preparedContribution.Description_for_cash_contributions__c = cont.Description_for_cash_contributions__c;
        console.log("colllnt", JSON.stringify(preparedContribution));
        return preparedContribution;
      });
    }

      handleSaveProjectCosts() {
        this.loading = true;
        let newProjectCosts = this.getNewCosts();
        let newCashContributions = this.getNewContributions();
    
        console.log("***********mmm**** before sending", JSON.stringify(this.projectCosts));
        console.log("*************** before deleting", JSON.stringify(this.removedProjectCosts));
    
        saveProjectCosts({
          projectId: this.project.Id,
          totalCost: this.project.Total_Cost__c,
          cashContributions: newCashContributions,
          projectCosts: newProjectCosts,
          removedCashContributions: this.removedContributions,
          removedProjectCosts: this.removedProjectCosts
        })
          .then((result) => {
            console.log("handle created done", result);
            let variant = "success";
            let title = "Project Saved";
            let message = "Project costs were saved successfully";
            this.dispatchEvent(new ShowToastEvent({ variant, title, message }));
            refreshApex(this._wireResultProjectCosts);
            refreshApex(this._wireResultContributions);
            this.loading = false;
          })
          .catch((error) => {
            console.log("error ", JSON.stringify(error));
            let variant = "error";
            let title = "Save failed";
            let message = error.body.message;
            this.dispatchEvent(new ShowToastEvent({ variant, title, message }));
            this.loading = false;
          });
      }
    getNewCosts() {
      return this.projectCosts.map((cost) => {
        let preparedCost = {};
        preparedCost.Costs__c = parseInt(cost.Costs__c);
        preparedCost.Project_Cost_Description__c = cost.Project_Cost_Description__c;
        preparedCost.Cost_heading__c = cost.Cost_heading__c;
        if (cost.Id) {
          preparedCost.Id = cost.Id;
        }
        preparedCost.Case__c = this.project.Id;
        return preparedCost;
        // }
      });
    }

    @api
    handleIncomeChange(e){
      e.stopPropagation();
        console.log('handling in parent', JSON.stringify(e.detail));
        console.log('the cash value',e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log('the cash id', e.detail.id); //...Record Id
        this.cashContributions[e.detail.id][e.detail.name] = e.detail.value;
        //if the field was the amount - recalculate totals
        this.totalCashContributions = 0;
        this.recalculateCostsSummary();
        this.project.Total_Development_Income__c = this.totalCashContributions;
        
    }

    @api
    handleCostChange(e) {
      e.stopPropagation();
      this.projectCosts[e.detail.id][e.detail.name] = e.detail.value;
      this.recalculateCostsSummary();
      this.project.Total_project_VAT__c = this.totalVAT;
      this.project.Total_Cost__c = this.totalCosts;
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


    
    handleAddProjectCost() {
    let preparedRow = {};
    preparedRow.Costs__c = 0; //amount
    preparedRow.Cost_heading__c = "Select heading";
    preparedRow.Project_Cost_Description__c = "";
    preparedRow.RecordTypeName = 'Small Grants'
    //preparedRow.Vat__c = cost.Vat__c;
    preparedRow.Id = "";

    this.projectCosts = [...this.projectCosts, preparedRow];
    this.recalcIndexes(this.projectCosts);
  }
    
    handleAddCashContribution(){
      
      let preparedRow = {};
      if(this.project.RecordType.DeveloperName === this.mediumGrantProject)
      {
        preparedRow.Secured_non_cash_contributions__c ='Select';
      } else {
        preparedRow.Secured__c ='';
      }
      preparedRow.Description_for_cash_contributions__c = '';
      preparedRow.Amount_you_have_received__c = 0;
      preparedRow.RecordTypeName = 'Delivery'
      this.cashContributions =  [...this.cashContributions, preparedRow];
      this.recalcIndexes(this.cashContributions);

    }

    
    handleRemoveIncome(e) {
      console.log('in handle remove income', e.detail.id);
      this.deleteProjectIncome(e.detail.id, e.detail.index);
  }

    handleRemoveCost(e) {
        console.log('in handle remove cost', e.detail.id);
        console.log('in handle remove cost', e.detail.index);
        this.deleteCostProject(e.detail.id, e.detail.index);
    }

    deleteCostProject(projectCostId, projectIndex) {
      //delete controller method
      if (projectCostId) {
        this.removedProjectCosts.push(this.projectCosts[projectIndex]);
      }
      this.projectCosts.splice(projectIndex, 1);
      this.projectCosts = [...this.projectCosts];
      this.recalcIndexes(this.projectCosts);
      this.recalculateCostsSummary();
    }
    
    deleteProjectIncome(incomeId, incomeIndex){
      //delete controller method
      console.log('in delete income the income id is ', incomeId);
      
      console.log('in delete income the index is ', incomeIndex);
      if(incomeId){
          this.removedContributions.push(this.cashContributions[incomeIndex]);
          console.log('removed contributions are now', JSON.stringify(this.removedContributions));
          
      }
      this.cashContributions.splice(incomeIndex, 1);
      this.cashContributions = [...this.cashContributions];
      
      console.log('cash contributions are now', JSON.stringify(this.cashContributions));
      this.recalcIndexes(this.cashContributions);
      this.recalculateCostsSummary();
      
  }

  recalcIndexes(arr) {
    arr.forEach((row, i) => (row.index = i));
  }

  recalculateCostsSummary(){
    this.calculateContributions();
    this.calculateCosts();
  }

}