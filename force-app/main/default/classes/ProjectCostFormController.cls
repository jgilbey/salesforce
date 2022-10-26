public inherited sharing class ProjectCostFormController {
  //TODO modify by to get by record type id

  @AuraEnabled(cacheable=true)
  public static Case getProject(Id projectId) {
    Case project = [
      SELECT
        Total_Cost__c,
        Grant_Award__c,
        Grant_requested__c,
        Total_Development_Income__c,
        NHMF_Total_cash_contributions__c,
        Grant_Percentage__c,
        payment_percentage__c,
        Application_Stages__c
      FROM case
      WHERE Id = :projectId
    ];

    return project;
  }

  @AuraEnabled(cacheable=true)
  public static List<Project_Cost__c> getProjectCosts(Id projectId) {
    List<Project_Cost__c> existingCosts = new List<Project_Cost__c>();

    List<Project_Cost__c> costs = [
      SELECT Id, Cost_heading__c, Costs__c, Project_Cost_Description__c
      FROM Project_Cost__c
      WHERE Case__c = :projectId
    ];

    /*  Project_Cost__c newCost = new Project_Cost__c(
      Costs__c = 0.00,
      Cost_heading__c = '',
      Project_Cost_Description__c = ''
    );
*/
    existingCosts.addAll(costs);
    //existingCosts.add(newCost);

    return existingCosts;
  }

  @AuraEnabled
  public static void deleteProjectCostsAndContributions(
    List<Project_Income__c> cashContributions,
    List<project_cost__c> projectCosts
  ) {
    try {
      List<SObject> toDelete = new List<SObject>();
      toDelete.addAll(cashContributions);
      toDelete.addAll(projectCosts);
      delete toDelete;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static void saveProjectCosts(
    String projectId,
    String totalCost,
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
        Grant_Percentage__c,
        payment_percentage__c,
        Confirm_award_amount__c
      FROM case
      WHERE Id = :projectId
    ];

    if (
      project.Confirm_award_amount__c &&
      (String.valueOf(project.Total_Cost__c) != totalCost)
    ) {
      //check that
      // the original grant percentage can't be less than the new one
      // the new total costs value can't be different to the old total costs
      throw new AuraHandledException(
        'The grant percentage and total costs cannot change after a decision is confirmed'
      ); //move this inside try
    } else {
      deleteProjectCostsAndContributions(removedCashContributions, removedProjectCosts);
      upsert cashContributions;
      upsert projectCosts;
    }

    //} catch(Exception e){

    //}
  }

  @AuraEnabled
  public static void removeIncomeItem(
    String projectId,
    String projectIncomeToRemove,
    String grantPercentage,
    String totalCost
  ) {
    Case project = [
      SELECT
        Id,
        Total_Cost__c,
        Grant_Award__c,
        Grant_requested__c,
        Total_Development_Income__c,
        NHMF_Total_cash_contributions__c,
        Grant_Percentage__c,
        payment_percentage__c,
        Confirm_award_amount__c
      FROM case
      WHERE Id = :projectId
    ];

    //for small grants
    if (
      project.Confirm_award_amount__c &&
      (String.valueOf(project.Grant_Percentage__c) != grantPercentage) &&
      (String.valueOf(project.Total_Cost__c) != totalCost)
    ) {
      //check that
      // the original grant percentage can't be less than the new one
      // the new total costs value can't be different to the old total costs
      throw new AuraHandledException(
        'The grant percentage and total costs cannot change after a decision is confirmed'
      ); //move this inside try
    } else {
      try {
        Project_Income__c toDelete = [
          SELECT Id
          FROM Project_Income__c
          WHERE Id = :projectIncomeToRemove
        ];
        delete toDelete;
      } catch (Exception e) {
        //do something
        throw new AuraHandledException(
          'There was a problem deleting the record'
        ); //move this inside try
      }
    }
  }

  @AuraEnabled
  public static void removeProjectCost(
    String projectId,
    String projectCostToRemove,
    String grantPercentage,
    String totalCost
  ) {
    Case project = [
      SELECT
        Id,
        Total_Cost__c,
        Grant_Award__c,
        Grant_requested__c,
        Total_Development_Income__c,
        NHMF_Total_cash_contributions__c,
        Grant_Percentage__c,
        payment_percentage__c,
        Confirm_award_amount__c
      FROM case
      WHERE Id = :projectId
    ];

    //for small projects
    if (
      project.Confirm_award_amount__c &&
      (String.valueOf(project.Grant_Percentage__c) != grantPercentage) &&
      (String.valueOf(project.Total_Cost__c) != totalCost)
    ) {
      throw new AuraHandledException(
        'The grant percentage and total costs cannot change after a decision is confirmed'
      );
    } else {
      try {
        Project_Cost__c toDelete = [
          SELECT Id
          FROM Project_cost__c
          WHERE Id = :projectCostToRemove
        ];
        delete toDelete;
      } catch (Exception e) {
        //do something
      }
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Project_Income__c> getCashContributions(Id projectId) {
    List<Project_Income__c> existingContributions = new List<Project_Income__c>();

    List<Project_Income__c> conts = [
      SELECT
        Id,
        Secured__c,
        Secured_non_cash_contributions__c,
        Description_for_cash_contributions__c,
        Amount_you_have_received__c
      FROM Project_Income__c
      WHERE Case__c = :projectId
    ];

    /* Project_Cost__c newCost = new Project_Cost__c(
      Costs__c = 0.00,
      Cost_heading__c = '',
      Project_Cost_Description__c = ''
    );*/

    existingContributions.addAll(conts);
    //existingContributions.add(newCost);

    return existingContributions;
  }
}
