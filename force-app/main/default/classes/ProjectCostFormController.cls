public inherited sharing class ProjectCostFormController {
  //TODO modify by to get by record type id
  @AuraEnabled(cacheable=true)
  public static List<Project_Cost__c> getProjectCosts(Id projectId) {
    List<Project_Cost__c> existingCosts = new List<Project_Cost__c>();

    List<Project_Cost__c> costs = [
      SELECT Id, Cost_heading__c, Costs__c, Project_Cost_Description__c
      FROM Project_Cost__c
      WHERE Case__c = :projectId
    ];

    Project_Cost__c newCost = new Project_Cost__c(
      Costs__c = 0.00,
      Cost_heading__c = '',
      Project_Cost_Description__c = ''
    );

    existingCosts.addAll(costs);
    existingCosts.add(newCost);

    return existingCosts;
  }

  @AuraEnabled
  public static void saveProjectCosts(String projectCostsToSave) {
    //deserialize to project cost . class
  }

  @AuraEnabled
  public static void removeProjectCost(String projectCostToRemove) {
    Project_Cost__c toDelete = [
      SELECT Id
      FROM Project_cost__c
      WHERE Id = :projectCostToRemove
    ];
    try {
      delete toDelete;
    } catch (Exception e) {
      //do something
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Project_Income__c> getCashContributions(Id projectId) {
    List<Project_Income__c> existingContributions = new List<Project_Income__c>();

    List<Project_Income__c> conts = [
      SELECT Id, Secured__c, Income_Description__c, Value__c
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
