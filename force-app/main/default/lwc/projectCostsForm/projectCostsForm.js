import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getProjectCosts from '@salesforce/apex/ProjectCostFormController.getProjectCosts';
import getCashContributions from '@salesforce/apex/ProjectCostFormController.getCashContributions';
import saveProjectCosts from '@salesforce/apex/ProjectCostFormController.saveProjectCosts';
import { refreshApex } from '@salesforce/apex';
import SAVE_SUCCESSFUL from '@salesforce/label/c.Budget_Management_Save';
import Saved from "@salesforce/label/c.Saved";
import Success from "@salesforce/label/c.Success";
import Error from "@salesforce/label/c.Error";

export default class ProjectCostsForm extends LightningElement {

  _wireResultProjectCosts = {};
  _wireResultContributions = {};
  _wireResultProject;
  loading = false;
  activeSections = ['A', 'B'];
  activeSectionsMessage = '';
  smallGrantProject = "Small_Grant_3_10k";
  mediumGrantProject = "Medium";
  nhmfGrantProject = "Memorial";
  largeGrantDevelopmentProject = "Large_Development_250_500k"
  largeGrantDeliveryProject = "Large"
  smallGrant = false;
  mediumGrant = false;
  largeGrant = false;
  nhmfGrant = false;

  labels = {
    Saved,
    SAVE_SUCCESSFUL,
    Success,
    Error 
  }

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

    nhmfContributionColumns = [
      {label: 'Source of Funding', editable: true, fieldName: 'Cost_heading__c'}, 
      {label: 'Description', editable: true, fieldName: 'Project_Cost_Description__c'}, 
      {label: 'Value', editable: true, fieldName: 'Costs__c'}, 
      {label: 'Secured', editable: true, fieldName: 'Secured__c'}, 
      {label: 'Evidence Secured', editable: true, fieldName: 'Evidence_for_secured_income__c'} 
      
  ];   

    get columns(){
      if (this.project && this.project.RecordType) {
        switch (this.project.RecordType.DeveloperName) {
          case this.smallGrantProject:
            return this.smallCols;
          case this.mediumGrantProject:
            return this.mediumColumns;
          case this.nhmfGrantProject:
            return this.mediumColumns;
          case this.largeGrantDevelopmentProject:
            return this.mediumColumns;
          case this.largeGrantDeliveryProject:
            return this.mediumColumns;
        }
      }
    }

    @api recordId;
    @api columnWidthsMode = 'fixed';

    @wire(getProject, {projectId: '$recordId'})
    wiredProject({error, data}){
      
      this._wireResultProject = data;
      if(data){

        Object.keys(data).forEach(field => 
          {
            this.project[field] = data[field];
          })

          //console.log('the record develper name', this.project.RecordType.DeveloperName );
        
          if(this.project.RecordType.DeveloperName === this.smallGrantProject){
            this.smallGrant = true;
          } else if(this.project.RecordType.DeveloperName === this.mediumGrantProject){
            this.mediumGrant = true;
          } else if(this.project.RecordType.DeveloperName === this.nhmfGrantProject){
            this.nhmfGrant = true;
          } else if(this.project.RecordType.DeveloperName === this.largeGrantDeliveryProject){
            this.largeGrantDel = true;
            this.largeProject = true;
          }
          else if(this.project.RecordType.DeveloperName === this.largeGrantDevelopmentProject){
            this.largeGrantDev = true;
            this.largeProject = true;
          }

        //  console.log(JSON.stringify(this.project));

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
        this.cashContributions = data.map((income, index) => {
          let retVal = {};
              if(this.nhmfGrant){
                retVal.Secured__c = (income.Secured__c === "true" || income.Secured__c === true) ? true : false; 
              } else {
                retVal.Secured_non_cash_contributions__c = income.Secured_non_cash_contributions__c;
              
              }
              
              retVal.Evidence_for_secured_income__c = (income.Evidence_for_secured_income__c === "true" || income.Evidence_for_secured_income__c === true) ? true : false;
              retVal.Description_for_cash_contributions__c = income.Description_for_cash_contributions__c;
              retVal.Amount_you_have_received__c = income.Amount_you_have_received__c;
              retVal.Id = income.Id;
              retVal.Source_Of_Funding__c = income.Source_Of_Funding__c;
              retVal.RecordTypeName = income.RecordType.Name;
              retVal.index = index;
              retVal.Value__c = income.Value__c;
              return retVal;
              });
              console.log('cash cont',JSON.stringify(this.cashContributions));
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
          retVal.Total_Cost__c = cost.Total_Cost__c;
          retVal.Vat__c = cost.Vat__c;
          retVal.Id = cost.Id;
          retVal.index = index;
          
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
        preparedContribution.Amount_you_have_received__c = parseFloat(cont.Amount_you_have_received__c);
        preparedContribution.Value__c = parseFloat(cont.Value__c);
        preparedContribution.Secured__c = cont.Secured__c;
        preparedContribution.Evidence_for_secured_income__c = cont.Evidence_for_secured_income__c === true;
        preparedContribution.Source_Of_Funding__c = '';
        console.log('cont.Evidence_for_secured_income__c', cont.Evidence_for_secured_income__c);
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
        this.calculateCosts();
        let newProjectCosts = this.getNewCosts();
        let newCashContributions = this.getNewContributions();
    
      //  console.log("***********mmm**** before sending", newCashContributions);
      console.log("***********mmm**** before sending grant reeq ", this.project.Grant_requested__c);

      console.log("***********mmm**** before sending total costs this ", this.totalCosts);
      
      console.log("***********mmm**** before sending total costs this ", this.project.Total_Cost__c);
      
      console.log("***********mmm**** before sending total costs this ", parseFloat(this.project.Total_amount_cost__c));
      
      
        console.log("*************** before deleting", JSON.stringify(this.removedProjectCosts));
        
       console.log("*************** before deleting new project costs", JSON.stringify(newProjectCosts));
        
        
       console.log("*************** before deleting new project costs", JSON.stringify(newCashContributions));
        
//          totalCostAmount = this.project.Total_Cost__c;
        var grantRequest = this.nhmfGrant ? this.project.NHMF_grant_request__c : this.project.Grant_requested__c;
        var totalCost = this.smallGrant ? this.project.Total_Cost__c : this.project.Total_amount_cost__c;
      console.log("***********mmm**** before sending", grantRequest);
        saveProjectCosts({
          projectId: this.project.Id,
          totalCost: totalCost,
          grantRequested: grantRequest,
          cashContributions: newCashContributions,
          projectCosts: newProjectCosts,
          removedCashContributions: this.removedContributions,
          removedProjectCosts: this.removedProjectCosts
        })
          .then((result) => {
            console.log("handle created done", result);
            let variant = this.labels.Success;
            let title = this.labels.Saved;
            let message = this.labels.SAVE_SUCCESSFUL;
            this.dispatchEvent(new ShowToastEvent({ variant, title, message }));
            this.removedContributions = [];
            this.removedProjectCosts = [];
            refreshApex(this._wireResultProject);
            refreshApex(this._wireResultProjectCosts);
            refreshApex(this._wireResultContributions);
            this.loading = false;
          })
          .catch((error) => {
            console.log("error ", JSON.stringify(error));
            let variant = this.labels.Error;
            let title = "Save failed";
            let message = error.body.message;
            this.dispatchEvent(new ShowToastEvent({ variant, title, message }));
            this.loading = false;
          });
      }

    getNewCosts() {
      console.log('get new costs', JSON.stringify(this.projectCosts));
      return this.projectCosts.map((cost) => {
        console.log('the cost', cost.Costs__c);
        let preparedCost = {};
        preparedCost.Costs__c = parseFloat(cost.Costs__c);
        preparedCost.Project_Cost_Description__c = cost.Project_Cost_Description__c;
        preparedCost.Cost_heading__c = cost.Cost_heading__c;
        preparedCost.Vat__c = parseFloat(cost.Vat__c);
        preparedCost.Total_Cost__c = parseFloat(cost.Total_Cost__c);
        if (cost.Id) {
          preparedCost.Id = cost.Id;
        }
        preparedCost.Case__c = this.project.Id;
        return preparedCost;
        // }
      });
    }

    renderedCallback(){
      this.recalculateCostsSummary();
    }

    @api
    handleIncomeChange(e){
      e.stopPropagation();
        console.log('handling in parent income change', JSON.stringify(e.detail));
        console.log('the cash value change',e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log('the cash id', e.detail.id); //...Record Id
        this.cashContributions[e.detail.id][e.detail.name] = e.detail.value;
        //if the field was the amount - recalculate totals
        this.totalCashContributions = 0;
        this.project.Total_Development_Income__c = this.totalCashContributions;
        this.project.NHMF_Total_cash_contributions__c = this.totalCashContributions;
        this.recalculateCostsSummary();
        
    }

    @api
    handleCostChange(e) {
      e.stopPropagation();
      this.projectCosts[e.detail.id][e.detail.name] = e.detail.value;
      //this.project.Total_project_VAT__c = this.totalVAT;
      //this.project.Total_Cost__c = this.totalCosts;
      this.recalculateCostsSummary();
    }

    calculateContributions(){
      this.totalCashContributions = 0;
      for(var cont in this.cashContributions){
        if(!this.nhmfGrant){
          
          this.totalCashContributions += parseFloat(this.cashContributions[cont].Amount_you_have_received__c) || 0;
        } else{
          this.totalCashContributions += parseFloat(this.cashContributions[cont].Value__c) || 0;
        }
      }
      this.project.Total_Development_Income__c = this.totalCashContributions;
      this.project.NHMF_Total_cash_contributions__c = this.totalCashContributions;
    }
    

    calculateCosts(){
      var newTotalCosts = 0;
      var newVATTotal = 0;
      for(var cost in this.projectCosts){
        if(parseFloat(this.projectCosts[cost].Costs__c) )
        newTotalCosts += parseFloat(this.projectCosts[cost].Costs__c) || 0;
        newVATTotal += parseFloat(this.projectCosts[cost].Vat__c) || 0;
        
      }
      this.totalCosts = newTotalCosts;
      this.totalVAT = newVATTotal;
      if(!this.nhmfGrant){
        this.project.Total_Cost__c = parseFloat(this.totalCosts) + parseFloat(this.totalVAT);
        console.log('new total cost', this.project.Total_Cost__c);
        this.project.Total_amount_cost__c = parseFloat(this.totalCosts);
        
        console.log('new cost minus vat', this.project.Total_amount_cost__c);
      } else {
        this.project.Total_amount_cost__c = parseFloat(this.totalCosts) + parseFloat(this.totalVAT);
        
        this.project.Total_Cost__c = parseFloat(this.totalCosts);
        
        console.log('new cost minus vat total_cost __c is ', this.project.Total_Cost__c);
        console.log('new total amount cost with vat is ', this.project.Total_amount_cost__c);
      }
      this.project.Total_project_VAT__c = this.totalVAT;
      console.log('new total vat', this.project.Total_project_VAT__c)
     
    }


    
    handleAddProjectCost() {
    let preparedRow = {};
    preparedRow.Costs__c = 0; //amount
    preparedRow.Cost_heading__c = "Select heading";
    preparedRow.Project_Cost_Description__c = "";
    preparedRow.RecordTypeName = this.getProjectCostRecordType();
    preparedRow.Vat__c = 0;
    preparedRow.Id = "";
      //console.log('before add', JSON.stringify(this.projectCosts));
    this.projectCosts = [...this.projectCosts, preparedRow];
    
    console.log('after add', JSON.stringify(this.projectCosts));
    this.recalcIndexes(this.projectCosts);
  }

  
  //replace with more robust 
  getProjectIncomeRecordType(){
    //toodo
    if (this.project && this.project.RecordType) {
      switch (this.project.RecordType.DeveloperName) {
        case this.smallGrantProject:
          return 'Small grants';
        case this.mediumGrantProject:
          return 'Delivery';
        case this.nhmfGrantProject:
          return 'NHMF';
        case this.largeGrantDevelopmentProject:
          return 'Large'; //todo fix this name
        case this.largeGrantDeliveryProject:
          return 'Large_Grants_Actual_Delivery';
      }
    }

  }

  //replace with more robust 
  getProjectCostRecordType(){
    //toodo
    if (this.project && this.project.RecordType) {
      switch (this.project.RecordType.DeveloperName) {
        case this.smallGrantProject:
          return 'Small Grants';
        case this.mediumGrantProject:
          return 'Medium Grants';
        case this.nhmfGrantProject:
          return 'NHMF';
        case this.largeGrantDevelopmentProject:
          return 'Large Grants'; //todo fix this name
        case this.largeGrantDeliveryProject:
          return 'Large_Grants_Actual_Delivery';
      }
    }

  }

    
    handleAddCashContribution(){
      
      let preparedRow = {};
      preparedRow.Secured_non_cash_contributions__c ='Select';
      preparedRow.Secured__c =false;
      preparedRow.Evidence_for_secured_income__c =false;
      preparedRow.Description_for_cash_contributions__c = '';
      preparedRow.Amount_you_have_received__c = 0;
      preparedRow.RecordTypeName = this.getProjectIncomeRecordType();
      this.cashContributions =  [...this.cashContributions, preparedRow];
      this.recalcIndexes(this.cashContributions);
    }

    
    handleRemoveIncome(e) {
      this.deleteProjectIncome(e.detail.id, e.detail.index);
  }

    handleRemoveCost(e) {
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
      if(incomeId){
          this.removedContributions.push(this.cashContributions[incomeIndex]);
          
      }
      this.cashContributions.splice(incomeIndex, 1);
      this.cashContributions = [...this.cashContributions];
      
      this.recalcIndexes(this.cashContributions);
      this.recalculateCostsSummary();
      
  }

  recalcIndexes(arr) {
    arr.forEach((row, i) => (row.index = i));
  }


  calculateGrantPercentage(){
      if(this.project && this.project.Grant_requested__c && this.project.Total_Cost__c){
        this.project.Grant_Percentage__c = parseFloat(this.project.Grant_requested__c)/parseFloat(this.project.Total_Cost__c);
        console.log('the grant req',this.project.Grant_requested__c);
        
        console.log('the total cost ',this.project.Total_Cost__c);
      } else {

        this.project.Grant_Percentage__c = 0;
      }
  }

   calculateNHMFGrantPercentage(){
    console.log('calculating new NHMF grant percentage', this.project.NHMF_grant_request__c);
    
    console.log('divided by ', this.project.Total_amount_cost__c);
      if(this.project && this.project.NHMF_grant_request__c && this.project.Total_amount_cost__c) {
          this.project.NHMF_Grant_Percentage__c = parseFloat(this.project.NHMF_grant_request__c)/parseFloat(this.project.Total_amount_cost__c);
      } else {
          this.project.NHMF_Grant_Percentage__c = 0;
      }
  }

  calculateGrantAward(){
    console.log('the grant rquested is  ', this.project.Grant_requested__c)
    this.project.Grant_requested__c = parseFloat(this.project.Total_Cost__c) - parseFloat(this.project.Total_Development_Income__c);
    console.log('the grant rquested is now ', this.project.Grant_requested__c)
  }
  calculateNHMFGrantAward(){
    
    console.log('the total amount cost is :  ', this.project.Total_amount_cost__c);
    console.log('minus this', this.project.NHMF_Total_cash_contributions__c);
    this.project.NHMF_grant_request__c = parseFloat(this.project.Total_amount_cost__c) - parseFloat(this.project.NHMF_Total_cash_contributions__c); //TODO fix total cash cont.. some issue
    console.log('the grant rquested is changed to now ', this.project.NHMF_grant_request__c)
  }

  recalculateCostsSummary(){
    this.calculateContributions();
    this.calculateCosts();
    this.calculateGrantAward();
    this.calculateNHMFGrantAward();
    this.calculateNHMFGrantPercentage();
    this.calculateGrantPercentage();
  }

}