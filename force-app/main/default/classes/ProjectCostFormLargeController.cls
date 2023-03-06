public with sharing class ProjectCostFormLargeController {
    @AuraEnabled
    public static string getCostRecordTypeIdByDeveloperName(
      String projectDeveloperName
    ) {
      try {
        system.debug('the developer name' + projectDeveloperName);
        String result = (String) Schema.SObjectType.Project_Cost__c.getRecordTypeInfosByDeveloperName()
          .get(projectDeveloperName)
          .getRecordTypeId();
        return result;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }
  
    @AuraEnabled
    public static string getCashRecordTypeIdByDeveloperName(
      String projectDeveloperName
    ) {
      try {
        system.debug('the developer name' + projectDeveloperName);
        String result = (String) Schema.SObjectType.Project_Income__c.getRecordTypeInfosByDeveloperName()
          .get(projectDeveloperName)
          .getRecordTypeId();
        return result;
      } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
      }
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Cost__c> getProjectCostsDevelopment(Id projectId) {
      List<Project_Cost__c> existingCosts = new List<Project_Cost__c>();
  
      List<Project_Cost__c> costs = [
        SELECT
          Id,
          Cost_Type__c,
          Cost_heading__c,
          Total_Cost__c,
          Costs__c,
          Project_Cost_Description__c,
          Vat__c,
          RecordType.Name,
          RecordType.DeveloperName,
          RecordTypeId,
          Current_Phase_Cost__c
        FROM Project_Cost__c
        WHERE
          Case__c = :projectId
          AND recordType.Name = 'Large Grants (Development)'
        ORDER BY Costs__c DESC
      ];
  
      existingCosts.addAll(costs);
  
      return existingCosts;
    }
  
    @AuraEnabled(cacheable=true)
    public static List<Project_Cost__c> getProjectCostsPotentialDelivery(
      Id projectId
    ) {
      List<Project_Cost__c> existingCosts = new List<Project_Cost__c>();
  
      List<Project_Cost__c> costs = [
        SELECT
          Cost_Type__c,
          Id,
          Cost_heading__c,
          Total_Cost__c,
          Costs__c,
          Project_Cost_Description__c,
          Vat__c,
          RecordType.Name,
          RecordType.DeveloperName,
          Current_Phase_Cost__c
        FROM Project_Cost__c
        WHERE
          Case__c = :projectId
          AND recordType.Name = 'Large Grants (Potential Delivery)'
        ORDER BY Costs__c DESC
      ];
  
      existingCosts.addAll(costs);
  
      return existingCosts;
    }
  
 
    @AuraEnabled(cacheable=true)
    public static List<Project_Income__c> getCashContributionsDevelopment(
      Id projectId
    ) {
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
          RecordType.DeveloperName,
          Case__r.RecordType.DeveloperName,
          recordTypeId
        FROM Project_Income__c
        WHERE
          Case__c = :projectId
          AND RecordType.Name = 'Large Grants (Development)'
        ORDER BY Amount_you_have_received__c DESC
      ];
  
      existingContributions.addAll(conts);
  
      return existingContributions;
    }
  
    @AuraEnabled(cacheable=true)
    public static List<Project_Income__c> getCashContributionsPotentialDelivery(
      Id projectId
    ) {
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
          RecordType.Id,
          Case__r.RecordType.DeveloperName
        FROM Project_Income__c
        WHERE
          Case__c = :projectId
          AND RecordType.Name = 'Large Grants (Potential Delivery)'
        ORDER BY Amount_you_have_received__c DESC
      ];
  
      existingContributions.addAll(conts);
  
      return existingContributions;
    }
  
    
  
}