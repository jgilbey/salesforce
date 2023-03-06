import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProject from '@salesforce/apex/ProjectCostFormController.getProject';
import getProjectCostsDevelopment from '@salesforce/apex/ProjectCostFormController.getProjectCostsDevelopment';
import getProjectCostsPotentialDelivery from '@salesforce/apex/ProjectCostFormController.getProjectCostsPotentialDelivery';
import getCashContributions from '@salesforce/apex/ProjectCostFormController.getCashContributionsDevelopment';
import getCashContributionsPotentialDelivery from '@salesforce/apex/ProjectCostFormController.getCashContributionsPotentialDelivery';
import getCostRecordTypeIdByDeveloperName from '@salesforce/apex/ProjectCostFormController.getCostRecordTypeIdByDeveloperName';
import getCashRecordTypeIdByDeveloperName from '@salesforce/apex/ProjectCostFormController.getCashRecordTypeIdByDeveloperName';
import saveProjectCosts from '@salesforce/apex/ProjectCostFormController.saveProjectCosts';
import { refreshApex } from '@salesforce/apex';
import SAVE_SUCCESSFUL from '@salesforce/label/c.Budget_Management_Save';
import Saved from "@salesforce/label/c.Saved";
import Success from "@salesforce/label/c.Success";
import Error from "@salesforce/label/c.Error";
import PROJECT_COST_OBJECT from "@salesforce/schema/Project_Cost__c";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

export default class ProjectCostsFormLarge extends LightningElement {

  recordTypeMapping;
  _wireObjectResult = {};
  _wireResultProjectCostsDevelopment = {};
  _wireResultProjectCostsPotentialDelivery = {};
  _wireResultContributions = {};
  _wireResultContributionsPotentialDelivery = {};
  _wireResultProject;
  loading = false;
  activeSections = ['A', 'B'];
  activeSectionsMessage = '';
  smallGrantProject = "Small_Grant_3_10k";
  mediumGrantProject = "Medium";
  nhmfGrantProject = "Memorial";
  largeGrantDevelopmentProject = "Large_Development_250_500k"
  largeGrantDeliveryProject = "Large Grants (Potential Delivery)"
  largeProject = false;
  smallGrant = false;
  mediumGrant = false;
  largeGrantDev = false;
  largeGrantDel = false;
  nhmfGrant = false;
  decisionConfirmed = false;

  labels = {
    Saved,
    SAVE_SUCCESSFUL,
    Success,
    Error 
  }

  
@wire(getObjectInfo, { objectApiName: PROJECT_COST_OBJECT })
wiredRecord({ error,data }){
    if (data) {

                if(data.recordTypeInfos) {
                    console.log('the reti',JSON.stringify(data.recordTypeInfos));
                    //this.RecordTypeId = Object.values(this._wireObjectResult.recordTypeInfos).find(
                    //  (item) => item.name === this.cost.RecordTypeName
                    //)?.recordTypeId;
                    this._wireObjectResult = data;
                }
                
            this.error = undefined;
    
            } else if (error) {
                this.error = error;
              }
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
    @track projectCostsPotentialDelivery = [];
    @track cashContributions = [];
    @track cashContributionsPotentialDelivery = [];
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

  largeColsCashCont = [
    {label: 'Source of Funding', editable: true, fieldName: 'Cost_heading__c'},
    {label: 'Description', editable: true, fieldName: 'Project_Cost_Description__c'},
    {label: 'Secured', editable: true, fieldName: 'Secured__c'},
    {label: 'Evidence of Secured', editable: true, fieldName: 'Evidence_for_secured_income__c'},
    {label: 'Amount', editable: true, fieldName: 'Amount__c'}
    
];

  projectCostDeliveryCols = [
    
    {label: 'Cost Type', editable: true, fieldName: 'Cost_Type__c'},
    {label: 'Cost Heading', editable: true, fieldName: 'Cost_heading__c'},
    {label: 'Project Description', editable: true, fieldName: 'Project_Cost_Description__c'},
    {label: 'Amount', editable: true, fieldName: 'Costs__c'},
    {label: 'VAT', editable: true, fieldName: 'VAT__C'},
    {label: 'Total Cost', editable: true, fieldName: ''},

  ]

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

    get largeGrantDevPotDelColumns() {
      return this.projectCostDeliveryCols;
    }

    @api recordId;
    @api columnWidthsMode = 'fixed';

    @wire(getProject, {projectId: '$recordId'})
    async wiredProject({error, data}){
      
      this._wireResultProject = data;
      if(data){

        Object.keys(data).forEach(field => 
          {
            this.project[field] = data[field];
          })

          console.log('***** the record develper name', this.project.RecordType.DeveloperName );
        
          if(this.project.RecordType.DeveloperName === this.smallGrantProject){
            this.smallGrant = true;
          } else if(this.project.RecordType.DeveloperName === this.mediumGrantProject){
            this.mediumGrant = true;
          } else if(this.project.RecordType.DeveloperName === this.nhmfGrantProject){
            this.nhmfGrant = true;
          }  else if(this.project.RecordType.DeveloperName === this.largeGrantDeliveryProject){
            this.largeGrantDel = true;
            this.largeProject = true;
          }
          else if(this.project.RecordType.DeveloperName === this.largeGrantDevelopmentProject){
            this.largeGrantDev = true;
            this.largeProject = true;
          }

          if(this.project){
            
            this.decisionConfirmed = (this.project.Confirm_award_amount__c === "true" ||  this.project.Confirm_award_amount__c === true) ? true : false;
          
          }

          //var projectRecordTypeDeveloperName = this.project.RecordType.DeveloperName;
          //this.recordTypeMapping = await getRecordTypeMappings({projectDeveloperName: projectRecordTypeDeveloperName}).then((result) => {
          //console.log('*** RECORD TYPE MAPPING', JSON.stringify(this.recordTypeMapping));
          //}
          //)

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
      this.cashContributions = [];
      this.error = error;
      console.log("error", error);
    }
  }

  
  @wire(getCashContributionsPotentialDelivery, {
    projectId: '$recordId'
  })
  wiredContributionsPotentialDelivery(result){
    this._wireResultContributionsPotentialDelivery = result;
    const { error, data } = result;
    if(data){
      this.cashContributionsPotentialDelivery = data.map((income, index) => {
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
            console.log('cash cont',JSON.stringify(this.cashContributionsPotentialDelivery));
  } else if (error) {
    this.projectCosts = [];
    this.error = error;
    console.log("error", error);
  }
}


    @wire(getProjectCostsDevelopment, {
      projectId: "$recordId"
    })
    wiredProjectCostsDevelopment(result) {
      this._wireResultProjectCostsDevelopment = result;
      const { error, data } = result;
      if (data) {
        console.log("project cost development datadata is", JSON.stringify(data));
        this.projectCosts = data.map((cost, index) => {
          let retVal = {};
          retVal.Costs__c = cost.Costs__c; //amount
          retVal.Cost_heading__c = cost.Cost_heading__c;
          retVal.Project_Cost_Description__c = cost.Project_Cost_Description__c;
          retVal.RecordTypeName = cost.RecordType.Name;
          retVal.Cost_Type__c = cost.Cost_Type__c;
          //retVal.RecordType = { DeveloperName: cost.RecordType.DeveloperName }; // chhhh
          retVal.Total_Cost__c = cost.Total_Cost__c;
          retVal.Vat__c = cost.Vat__c;
          retVal.Id = cost.Id;
          retVal.index = index;
          
          return retVal; //oi
        });

        

      } else if (error) {
        this.projectCosts = [];
        this.error = error;
        console.log("error getting development project", error);
      }
    }

    @wire(getProjectCostsPotentialDelivery, {
      projectId: "$recordId"
    })
    wiredProjectCostsPotentialDelivery(result) {
      this._wireResultProjectCostsPotentialDelivery = result;
      const { error, data } = result;
      if (data) {
        console.log("project pot del cost data is", JSON.stringify(data));
        this.projectCostsPotentialDelivery = data.map((cost, index) => {
          let retVal = {};
          retVal.Costs__c = cost.Costs__c; //amount
          retVal.Cost_Type__c = cost.Cost_Type__c; //amount
          retVal.Cost_heading__c = cost.Cost_heading__c;
          retVal.Project_Cost_Description__c = cost.Project_Cost_Description__c;
          retVal.RecordTypeName = cost.RecordType.Name;
          retVal.Total_Cost__c = cost.Total_Cost__c;
          retVal.Current_Phase_Cost__c = cost.Current_Phase_Cost__c;
          retVal.Vat__c = cost.Vat__c;
          retVal.Id = cost.Id;
          retVal.index = index;
          
          return retVal; //oi
        });

        

      } else if (error) {
        this.projectCostsPotentialDelivery = [];
        this.error = error;
        console.log("error potential delivery ", error);
      }
    }

    getNewContributions() {
      var cashContrs = this.cashContributions.map((cont) => {
        let preparedContribution = {};
        preparedContribution.Amount_you_have_received__c = parseInt(cont.Amount_you_have_received__c);
        preparedContribution.Value__c = parseInt(cont.Value__c);
        preparedContribution.Secured__c = cont.Secured__c;
        preparedContribution.Evidence_for_secured_income__c = cont.Evidence_for_secured_income__c === true;
        preparedContribution.Source_Of_Funding__c = cont.Source_Of_Funding__c;
        console.log('cont.Evidence_for_secured_income__c', cont.Evidence_for_secured_income__c);
        preparedContribution.Secured_non_cash_contributions__c = cont.Secured_non_cash_contributions__c;
        preparedContribution.Case__c = this.project.Id;
        preparedContribution.RecordTypeId = cont.RecordTypeId;
        //console.log('cont.Id.length ', cont.Id.length );
        if (cont.Id) {
          preparedContribution.Id = cont.Id;
        }
        preparedContribution.Description_for_cash_contributions__c = cont.Description_for_cash_contributions__c;
        console.log("colllnt", JSON.stringify(preparedContribution));
        return preparedContribution;
      });

      var cashContrsDel = this.cashContributionsPotentialDelivery.map((cont) => {
        let preparedContribution = {};
        preparedContribution.Amount_you_have_received__c = parseInt(cont.Amount_you_have_received__c);
        preparedContribution.Value__c = parseInt(cont.Value__c);
        preparedContribution.Secured__c = cont.Secured__c;
        preparedContribution.Evidence_for_secured_income__c = cont.Evidence_for_secured_income__c === true;
        preparedContribution.c = cont.Source_Of_Funding__c;
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

      var allContributions = [...cashContrsDel, ...cashContrs];
      return allContributions;
    }

      handleSaveProjectCosts() {
        this.loading = true;
        this.calculateCosts();
        this.calculateDeliveryCosts();
        let newProjectCosts = this.getNewCosts(); //need to do for both dev and delivery
        let newCashContributions = this.getNewContributions();
    
      //  console.log("***********mmm**** before sending", newCashContributions);
      console.log("***********mmm**** before sending", this.project.Grant_requested__c);
      
      console.log("***********mmm**** before sending", this.project.Total_Cost__c);
      
        console.log("*************** before deleting", JSON.stringify(this.removedProjectCosts));
        
        console.log("*************** before deleting", JSON.stringify(this.newProjectCosts));
        


//          totalCostAmount = this.project.Total_Cost__c;

        saveProjectCosts({
          projectId: this.project.Id,
          totalCost: this.project.Total_Cost__c,
          grantRequested: this.project.Grant_requested__c,
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
            refreshApex(this._wireResultProjectCostsDevelopment);
            refreshApex(this._wireResultProjectCostsPotentialDelivery);
            refreshApex(this._wireResultContributions);
            refreshApex(this._wireResultContributionsPotentialDelivery);
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

      var newProjectCosts = this.projectCosts.map((cost) => {
        let preparedCost = {};
        preparedCost.Costs__c = parseInt(cost.Costs__c);
        preparedCost.Cost_Type__c = cost.Cost_Type__c;
        preparedCost.Project_Cost_Description__c = cost.Project_Cost_Description__c;
        preparedCost.Cost_heading__c = cost.Cost_heading__c;
        preparedCost.Vat__c = cost.Vat__c;
        preparedCost.Total_Cost__c = cost.Total_Cost__c;
        preparedCost.RecordTypeId = cost.RecordTypeId;
        if (cost.Id) {
          preparedCost.Id = cost.Id;
        }
        preparedCost.Case__c = this.project.Id;
        return preparedCost;
        // }
      });

      var newProjectCostsDel = this.projectCostsPotentialDelivery.map((cost) => {
        let preparedCost = {};
        preparedCost.Costs__c = parseInt(cost.Costs__c);
        preparedCost.Cost_Type__c = cost.Cost_Type__c;
        preparedCost.Project_Cost_Description__c = cost.Project_Cost_Description__c;
        preparedCost.Cost_heading__c = cost.Cost_heading__c;
        preparedCost.Vat__c = cost.Vat__c;
        preparedCost.Total_Cost__c = cost.Total_Cost__c;
        preparedCost.RecordTypeId = cost.RecordTypeId;
        if (cost.Id) {
          preparedCost.Id = cost.Id;
        }
        preparedCost.Case__c = this.project.Id;
        return preparedCost;
        // }
      });
      
      var allCosts = [... newProjectCostsDel, ...newProjectCosts];
      return allCosts;;
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
        console.log('the cash id', e.detail.name); //...Record Id
        this.cashContributions[e.detail.id][e.detail.name] = e.detail.value;
        //if the field was the amount - recalculate totals
        this.totalCashContributions = 0;
        this.project.Total_Development_Income__c = this.totalCashContributions;
        
        //this.project.Grant_requested__c = parseInt(this.totalCosts) - parseInt(this.totalCashContributions);
        this.recalculateCostsSummary();
    }
    
    @api
    handleDelIncomeChange(e){
      e.stopPropagation();
        console.log('handling in parent income change', JSON.stringify(e.detail));
        console.log('the cash value change',e.detail.value); //... Field API Name
        //console.log(e.detail.value); //... value
        console.log('the cash id', e.detail.id); //...Record Id
        this.cashContributionsPotentialDelivery[e.detail.id][e.detail.name] = e.detail.value;
        //if the field was the amount - recalculate totals
        this.totalCashContributions = 0;
        this.project.Total_Development_Income__c = this.totalCashContributions; //todo change
        this.recalculateCostsSummary();
        
    }

    @api
    handleCostChange(e) {
      e.stopPropagation();
      
      //this is where we need to be careful and figure out the correct map
      this.projectCosts[e.detail.id][e.detail.name] = e.detail.value;
      //this.project.Total_project_VAT__c = this.totalVAT;
      //this.project.Total_Cost__c = this.totalCosts;
      this.recalculateCostsSummary();
    }

    @api
    handleDelCostChange(e) {
      e.stopPropagation();
      this.projectCostsPotentialDelivery[e.detail.id][e.detail.name] = e.detail.value;
      //this.project.Total_project_VAT__c = this.totalVAT;
      //this.project.Total_Cost__c = this.totalCosts;
      this.recalculateCostsSummary();
    }
    
    calculateContributions(){
      this.totalCashContributions = 0;
      for(var cont in this.cashContributions){
        if(!this.nhmfGrant){
          
          this.totalCashContributions += parseInt(this.cashContributions[cont].Amount_you_have_received__c) || 0;
        } else{
          this.totalCashContributions += parseInt(this.cashContributions[cont].Value__c) || 0;
        }
      }
      this.project.Total_Development_Income__c = this.totalCashContributions;
    }

    calculateDeliveryContributions(){
      this.totalCashContributions = 0;
      for(var cont in this.cashContributionsPotentialDelivery){
        this.totalCashContributions += parseFloat(this.cashContributionsPotentialDelivery[cont].Amount_you_have_received__c) || 0;
        
      }
      this.project.Total_cash_contributions_for_delivery__c = this.totalCashContributions;
      console.log('total dev income ', this.project.Total_Development_Income__c);
      console.log('total del income ', this.project.Total_cash_contributions_for_delivery__c);
      this.project.Total_contributions_for_dev_delivery__c = parseFloat(this.project.Total_cash_contributions_for_delivery__c) + parseFloat(this.project.Total_Development_Income__c);
      //this.project.NHMF_Total_cash_contributions__c = this.totalCashContributions;
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
      this.project.Total_Cost__c = parseFloat(this.totalCosts) + parseFloat(this.totalVAT);
      console.log('new total cost', this.project.Total_Cost__c);
      this.project.Total_amount_cost__c = parseFloat(newTotalCosts);
        
      console.log('new cost minus vat', this.project.Total_amount_cost__c);
     // this.project.Total_costs_proposed_for_delivery__c = 0;
      this.project.Agreed_costs_development__c = newTotalCosts;
      this.project.Total_development_costs_VAT__c = this.totalVAT;
      console.log('new total vat', this.project.Total_development_costs_VAT__c)
     
    }

    
    calculateDeliveryCosts(){

      //calculate other costs - cost type = other
      var newTotalCosts = 0;
      var newVATTotal = 0;
      var newOtherCostsTotal = 0;
      var newActivityCostTotal = 0;
      var newTotalsForPhase = 0;

      for(var cost in this.projectCostsPotentialDelivery){
        if(parseFloat(this.projectCostsPotentialDelivery[cost].Costs__c) ) {
        newTotalCosts += parseFloat(this.projectCostsPotentialDelivery[cost].Costs__c) || 0;
        }
        newVATTotal += parseFloat(this.projectCostsPotentialDelivery[cost].Vat__c) || 0;

        if(this.projectCostsPotentialDelivery[cost].Cost_Type__c == 'Other cost') {
          newOtherCostsTotal += parseFloat(this.projectCostsPotentialDelivery[cost].Costs__c);
        }
        
        if(this.projectCostsPotentialDelivery[cost].Cost_Type__c == 'Activity cost') {
          newActivityCostTotal += parseFloat(this.projectCostsPotentialDelivery[cost].Costs__c);
        }

        console.log('the phase', this.projectCostsPotentialDelivery[cost].Current_Phase_Cost__c);
        if(this.projectCostsPotentialDelivery[cost].Current_Phase_Cost__c == 'No'){
          var costAndVAT = parseFloat(this.projectCostsPotentialDelivery[cost].Costs__c) +  parseFloat(this.projectCostsPotentialDelivery[cost].Vat__c); 
          newTotalsForPhase += costAndVAT;
        }

        this.project.Total_amount_cost__c = newTotalCosts;

      }

      
      this.project.Total_costs_proposed_for_delivery__c = newTotalsForPhase;
      console.log('totals for phase', newTotalsForPhase);
      //this activity costs TODO
      this.project.Total_other_costs__c	= newOtherCostsTotal;
      this.project.Total_activity_costs__c = newActivityCostTotal;


      console.log('*** the agreed cost dev ', this.project.Agreed_costs_development__c);
     // this.project.Total_costs_proposed_for_delivery__c = parseFloat(newTotalCosts) + parseFloat(newVATTotal) + parseFloat(this.project.Agreed_costs_development__c); // probably chanfge this
      
    //  console.log('**** the total costs prop deli', this.project.Total_costs_proposed_for_delivery__c); // probably chanfge this
      console.log('new total cost', this.project.Total_Cost__c);
      this.project.Total_amount_cost__c = parseFloat(newTotalCosts); //todo change to delivery total
      
      console.log('new cost minus vat', this.project.Total_amount_cost__c);
      this.project.Total_project_VAT__c = newVATTotal; //total change to vat delivery total
      console.log('new total vat', this.project.Total_project_VAT__c)
     
    }


    
    async handleAddProjectCost() {
    let preparedRow = {};
    preparedRow.Costs__c = 0; //amount
    preparedRow.Cost_heading__c = "Select heading";
    preparedRow.Project_Cost_Description__c = "";
    preparedRow.RecordTypeName = this.getProjectCostRecordType();
    const recordTypeName = 'Large_Grants_Development';
    preparedRow.RecordTypeId = await getCostRecordTypeIdByDeveloperName({projectDeveloperName: recordTypeName});
    preparedRow.Vat__c = 0;
    preparedRow.Id = "";
      //console.log('before add', JSON.stringify(this.projectCosts));
    this.projectCosts = [...this.projectCosts, preparedRow];
   // preparedRow.RecordType.Name = this.getProjectCostRecordType();
    console.log('after add new project cost', JSON.stringify(this.projectCosts));
    this.recalcIndexes(this.projectCosts);
  }

  
  async handleAddProjectCostDel() {
    let preparedRow = {};
    preparedRow.Costs__c = 0; //amount
    preparedRow.Cost_heading__c = "Select heading";
    preparedRow.Project_Cost_Description__c = "";
    preparedRow.RecordTypeName = this.getProjectCostRecordType();
    const recordTypeName = 'Large_Grants_Delivery';
    preparedRow.recordTypeId = await getCostRecordTypeIdByDeveloperName({projectDeveloperName: recordTypeName});
    preparedRow.Vat__c = 0;
    preparedRow.Cost_Type__c = 'Select'
    preparedRow.Id = "";
      //console.log('before add', JSON.stringify(this.projectCosts));
    this.projectCostsPotentialDelivery = [...this.projectCostsPotentialDelivery, preparedRow];
    console.log('*** prepared new cost rt', preparedRow.RecordTypeName);
    //console.log('after add', JSON.stringify(this.projectCosts));
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
          return 'Large Grants (Development)'; //todo fix this name
        case this.largeGrantDeliveryProject:
          return 'Large Grants (Potential Delivery)'; //todo fix
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
          return 'Large Grants (Development)'; 
        case this.largeGrantDeliveryProject:
          return 'Large Grants (Potential Delivery)';
      }
    }

    console.log('***what is the record type' + this.project.RecordType);
    
    //console.log('what is the record type' + this.project.RecordType);

  }

    
    async handleAddCashContribution(){
      
      let preparedRow = {};
      preparedRow.Secured_non_cash_contributions__c ='Select';
      preparedRow.Secured__c =false;
      preparedRow.Evidence_for_secured_income__c =false;
      preparedRow.Description_for_cash_contributions__c = '';
      preparedRow.Amount_you_have_received__c = 0;
      preparedRow.RecordTypeName = this.getProjectIncomeRecordType();
      const recordTypeName = 'Large_Development';
      preparedRow.RecordTypeId = await getCashRecordTypeIdByDeveloperName({projectDeveloperName: recordTypeName});
      this.cashContributions =  [...this.cashContributions, preparedRow];
      this.recalcIndexes(this.cashContributions);
      
    }

    
    async handleAddCashContributionDel(){
      
      let preparedRow = {};
      preparedRow.Secured_non_cash_contributions__c ='Select';
      preparedRow.Secured__c =false;
      preparedRow.Evidence_for_secured_income__c =false;
      preparedRow.Description_for_cash_contributions__c = '';
      preparedRow.Amount_you_have_received__c = 0;
      preparedRow.RecordTypeName = this.getProjectIncomeRecordType();
      const recordTypeName = 'Large_Grants_Delivery';
      preparedRow.RecordTypeId = await getCashRecordTypeIdByDeveloperName({projectDeveloperName: recordTypeName});
      console.log('**** cash record type name', preparedRow.RecordTypeName);
      this.cashContributionsPotentialDelivery =  [...this.cashContributionsPotentialDelivery, preparedRow];
      this.recalcIndexes(this.cashContributionsPotentialDelivery);
    }
    
    handleRemoveIncome(e) {
      this.deleteProjectIncome(e.detail.id, e.detail.index);
  }

  
  handleRemoveIncomeDel(e) {
    this.deleteProjectIncomeDel(e.detail.id, e.detail.index);
}

    handleRemoveCost(e) {
        this.deleteCostProject(e.detail.id, e.detail.index);
    }

    
    handleRemoveCostDel(e) {
      this.deleteCostProjectDel(e.detail.id, e.detail.index);
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

    deleteCostProjectDel(projectCostId, projectIndex) {
      //delete controller method
      if (projectCostId) {
        this.removedProjectCosts.push(this.projectCostsPotentialDelivery[projectIndex]);
      }
      this.projectCostsPotentialDelivery.splice(projectIndex, 1);
      this.projectCostsPotentialDelivery = [...this.projectCostsPotentialDelivery];
      this.recalcIndexes(this.projectCostsPotentialDelivery);
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

  

  deleteProjectIncomeDel(incomeId, incomeIndex){
    //delete controller method
    if(incomeId){
        this.removedContributions.push(this.cashContributionsPotentialDelivery[incomeIndex]);
        
    }
    this.cashContributionsPotentialDelivery.splice(incomeIndex, 1);
    this.cashContributionsPotentialDelivery = [...this.cashContributionsPotentialDelivery];
    
    this.recalcIndexes(this.cashContributionsPotentialDelivery);
    this.recalculateCostsSummary();
    
}

  recalcIndexes(arr) {
    arr.forEach((row, i) => (row.index = i));
  }


  calculateAgreedDevelopmentCosts(){
    //for each project cost development ONLY
    //if heading is not Non-cash contributions, Volunteer time
    //add values
    var newADCCost = 0;
    var newADCVAT = 0;
      for(var cost in this.projectCosts){
        if(parseFloat(this.projectCosts[cost].Costs__c) && !(this.projectCosts[cost].Cost_heading__c == 'Non-cash contributions') && !(this.projectCosts[cost].Cost_heading__c == 'Volunteer time') )
        { newADCCost += parseFloat(this.projectCosts[cost].Costs__c) || 0;
        newADCVAT += parseFloat(this.projectCosts[cost].Vat__c) || 0; 
        }
      }
      this.project.Agreed_costs_development__c = parseFloat(newADCCost) + parseFloat(newADCVAT);
      console.log('new adc', this.project.Agreed_costs_development__c);
  }


  calculateGrantPercentage(){
      if(this.project && this.project.Grant_requested__c && this.project.Total_Cost__c){
        this.project.Grant_Percentage__c = parseInt(this.project.Grant_requested__c)/parseInt(this.project.Total_Cost__c);
        console.log('the grant req',this.project.Grant_requested__c);
        
        console.log('the total cost ',this.project.Total_Cost__c);
      } else {

        this.project.Grant_Percentage__c = 0;
      }

      
  }

  calculateGrantAward(){
    console.log('the grant rquested is  ', this.project.Grant_requested__c)
    this.project.Grant_requested__c = parseInt(this.project.Total_Cost__c) - parseInt(this.project.Total_Development_Income__c);
    console.log('the grant rquested is now ', this.project.Grant_requested__c)
  }

 /* calculateCombinedCost(){

    this.project.Grant_percentage_development_delivery__c = 0; //todo
    this.project.Total_contributions_for_dev_delivery__c = 0; //todo
    this.project.Grant_requested_development_delivery__c = 0; //todo

  }*/

  calculateGrantRequested(){
    // add all cont, all amounts.
  //  parseFloat(this.project.Total_cost_development_delivery__c) - parseFloat(this.project.Total_contributions_for_dev_delivery__c);
    //this.project.Total_cost_development_delivery__c = parseFloat(this.project.tot)
    this.project.Total_cost_development_delivery__c = this.project.Total_Cost__c + this.project.Total_costs_proposed_for_delivery__c;
    var grant =  parseFloat(this.project.Total_cost_development_delivery__c) - parseFloat(this.project.Total_contributions_for_dev_delivery__c);
    console.log('***total cost dev del', this.project.Total_cost_development_delivery__c);
    console.log('total con', this.project.Total_contributions_for_dev_delivery__c);
    console.log('request', grant);
    this.project.Grant_requested_development_delivery__c = grant;
  }

  calculateGrantDevDelPercentage(){

      /// Total_cost_development_delivery__c = Total_costs_proposed_for_delivery__c + total_cost__c
      console.log('*Grant_requested_development_delivery__c', this.project.Grant_requested_development_delivery__c);
      console.log('* Total_cost_development_delivery__c',  this.project.Total_cost_development_delivery__c);
      this.project.Grant_percentage_development_delivery__c = parseFloat(this.project.Grant_requested_development_delivery__c) / parseFloat(this.project.Total_cost_development_delivery__c);

  }

  recalculateCostsSummary(){

      //Grant_percentage_development_delivery__c
      //calculate grant requested
      //calculate total cost dev delivery
      //Grant_requested_development_delivery__c / Total_cost_development_delivery__c
      //calculate other costs - cost type = other

    this.calculateContributions();
    this.calculateCosts();
    this.calculateDeliveryContributions();
    this.calculateDeliveryCosts();
    this.calculateGrantAward();
    this.calculateGrantPercentage();
    this.calculateAgreedDevelopmentCosts();
    this.calculateGrantRequested();
    this.calculateGrantDevDelPercentage();
    //this.calculateCombinedCost();
  }

}