public inherited sharing class ProjectCostFormController {
  //TODO modify by to get by record type id

  private static final String MEMORIAL_RECORD_TYPE_NAME = 'Memorial';

 
  @AuraEnabled(cacheable=true)
  public static Case getProject(Id projectId) {
    Case project = [
      SELECT
        Total_Cost__c,
        Grant_Award__c,
        Grant_requested__c,
        Total_Development_Income__c,
        Total_project_VAT__c,
        Grant_Percentage__c,
        payment_percentage__c,
        Application_Stages__c,
        NHMF_grant_award__c,
        NHMF_Grant_Percentage__c,
        NHMF_grant_request__c,
        Total_amount_cost__c,
        NHMF_Total_cash_contributions__c,
        RecordType.DeveloperName,
        Grant_requested_development_delivery__c,
        Delivery_grant_request__c,
        Total_development_costs_VAT__c,
        Development_payment_percentage__c,
        Delivery_payment_percentage__c,
        Agreed_costs_development__c,
        Total_contributions_for_dev_delivery__c,
        Total_cash_contributions_for_delivery__c,
        Grant_percentage_development_delivery__c,
        Total_activity_costs__c,
        Total_other_costs__c,
        Total_cost_development_delivery__c,
        Total_costs_proposed_for_delivery__c,
        Confirm_award_amount__c
      FROM case
      WHERE Id = :projectId
    ]; //changed

    return project;
  }

  @AuraEnabled(cacheable=true)
  public static List<Project_Cost__c> getProjectCosts(Id projectId) {
    List<Project_Cost__c> existingCosts = new List<Project_Cost__c>();

    List<Project_Cost__c> costs = [
      SELECT
        Id,
        Cost_heading__c,
        Total_Cost__c,
        Costs__c,
        Project_Cost_Description__c,
        Vat__c,
        RecordType.Name,
        RecordType.DeveloperName,
        RecordTypeId
      FROM Project_Cost__c
      WHERE Case__c = :projectId
      ORDER BY Costs__c DESC
    ];

    existingCosts.addAll(costs);

    return existingCosts;
  }

  @AuraEnabled
  public static void deleteProjectCostsAndContributions(
    List<Project_Income__c> cashContributions,
    List<project_cost__c> projectCosts
  ) {
    try {
      List<SObject> toDelete = new List<SObject>();
      if (cashContributions.size() >= 1) {
        toDelete.addAll(cashContributions);
      }
      if (projectCosts.size() >= 1) {
        toDelete.addAll(projectCosts);
      }
      if (toDelete.size() >= 1) {
        delete toDelete;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static void saveProjectCosts(
    String projectId,
    String totalCost,
    String grantRequested,
    List<Project_Income__c> cashContributions,
    List<project_cost__c> projectCosts,
    List<Project_Income__c> removedCashContributions,
    List<project_cost__c> removedProjectCosts
  ) {
    /* validate then save*/
    //try{

    Case project = [
      SELECT
        Id,
        Total_Cost__c,
        Grant_Award__c,
        Grant_requested__c,
        Total_Development_Income__c,
        NHMF_Total_cash_contributions__c,
        NHMF_grant_request__c,
        Grant_Percentage__c,
        payment_percentage__c,
        Confirm_award_amount__c,
        RecordType.DeveloperName
      FROM case
      WHERE Id = :projectId
    ];

    //for small grants and nhmf grants this logic is correct
    // need to verify same for medium
    // definitely differen tfor large
    system.debug('project.confirm nhmf' + project.confirm_award_amount__c);
    system.debug('string fo total cost from backend' + project.Total_Cost__c);
    system.debug('string fo total cost from ui' + totalCost);
    system.debug('grant requested from backend' + project.Grant_requested__c);

    system.debug(
      'grant requested from backend nhmf' + project.NHMF_grant_request__c
    );
    system.debug('grant requested from ui' + grantRequested);
    system.debug(
      '*** what is the record type name' + project.RecordType.DeveloperName
    );
    Boolean isNHMF = project.RecordType.DeveloperName == 'Memorial';
    system.debug('is nhmf' + isNHMF);
    if (
      project.Confirm_award_amount__c &&
      ((project.Total_Cost__c != Decimal.valueOf(totalCost)) ||
      (!isNHMF &&
      project.Grant_requested__c != Decimal.valueOf(grantRequested)) ||
      (isNHMF &&
      project.NHMF_grant_request__c != Decimal.valueOf(grantRequested)))
    ) {
      //check that
      // the original grant percentage can't be less than the new one
      // the new total costs value can't be different to the old total costs
      //check that the grant award hasn't changed TODO
      throw new AuraHandledException(
        System.Label.Budget_Management_Save_Error //;'The grant percentage and total costs cannot change after a decision is confirmed'
      ); //move this inside try
    } else {
      system.debug('to remove cc' + removedCashContributions);

      system.debug('to remove pc' + removedProjectCosts);
      deleteProjectCostsAndContributions(
        removedCashContributions,
        removedProjectCosts
      );

      system.debug('to add cc' + cashContributions);

      system.debug('to add' + projectCosts);
      if (cashContributions.size() >= 1) {
        upsert cashContributions;
      }
      if (projectCosts.size() >= 1) {
        for (project_cost__c pc : projectCosts) {
          system.debug(
            'project costs insert' +
            pc.Cost_heading__c +
            ' ' +
            pc.RecordTypeId
          );
        }
        upsert projectCosts;
      }
    }

    //} catch(Exception e){

    //}
  }
  @AuraEnabled(cacheable=true)
  public static List<Project_Income__c> getCashContributions(Id projectId) {
    List<Project_Income__c> existingContributions = new List<Project_Income__c>();

    List<Project_Income__c> conts = [
      SELECT
        Id,
        Secured__c,
        Secured_non_cash_contributions__c,
        Evidence_for_secured_income__c,
        Description_for_cash_contributions__c,
        Amount_you_have_received__c,
        Value__c,
        Source_Of_Funding__c,
        RecordType.Name,
        Case__r.RecordType.DeveloperName
      FROM Project_Income__c
      WHERE Case__c = :projectId
      ORDER BY Amount_you_have_received__c DESC
    ];

    existingContributions.addAll(conts);

    return existingContributions;
  }
  /*  
  public class RecordTypeMappingWrapper
  {
    @AuraEnabled
    public String projectRecordTypeId;
    @AuraEnabled
    public String costRecordTypeId;
    @AuraEnabled
    public String cashRecordTypeId;
  }*/
}
