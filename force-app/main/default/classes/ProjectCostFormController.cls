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
        Total_actual_other_costs__c,
        Total_cost_development_delivery__c,
        Total_costs_proposed_for_delivery__c,
        Confirm_award_amount__c,
        Total_Costs_Large_Development__c,
        Total_actual_delivery_costs__c,
        Delivery_grant_award__c,
        Development_grant_award__c,
        Total_capital_costs__c,
        Total_actual_capital_costs__c,
        Grant_request_proposed_for_delivery__c,
        Total_actual_activity_costs__c,
        Delivery_grant_percentage__c,
        Grant_percentage_proposed_for_delivery__c
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

  @AuraEnabled(cacheable=true)
  public static List<Project_Cost__c> getProjectCosts2(Id projectId, Id recordType, String variation) 
  {
    List<Project_Cost__c> existingCosts = new List<Project_Cost__c>();
    String rtName = Schema.getGlobalDescribe().get('Project_Cost__c').getDescribe().getRecordTypeInfosById().get(recordType).getDeveloperName();
    String sortClause = '';

    if((rtName == 'Large_Grants_Delivery' && variation == 'Large_Development_Delivery') || rtName == 'Large_Grants_Actual_Delivery')
    {
      sortClause = 'Cost_Type__c, Total_Cost__c DESC';
    }
    else
    {
      sortClause = 'Costs__c DESC';
    }

    String queryString = 'SELECT Id, Cost_heading__c, Cost_heading_Delivery__c, Total_Cost__c, Costs__c, Project_Cost_Description__c,' 
                        + 'Vat__c, Cost_Type__c, RecordType.Name, RecordType.DeveloperName, RecordTypeId'
                        + ' FROM Project_Cost__c'
                        + ' WHERE Case__c = \'' + projectId + '\' AND ' + 'RecordTypeId = \'' + recordType + '\''
                        + ' ORDER BY ' + sortClause;

    existingCosts = Database.query(queryString);

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

  @AuraEnabled(cacheable=true)
  public static List<Project_Income__c> getCashContributions2(Id projectId, Id recordType) {
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
        Amount_current_phase__c,
        RecordType.Name,
        Case__r.RecordType.DeveloperName
      FROM Project_Income__c
      WHERE Case__c = :projectId AND RecordTypeId =: recordType
      ORDER BY Amount_you_have_received__c DESC
    ];

    existingContributions.addAll(conts);

    return existingContributions;
  }

  @AuraEnabled
  public static string saveCosts(Object draftCosts, Object existingCostsValues, Object cashContributions, String projectId)
  {
    List<Project_Cost__c> costsToInsert = new List<Project_Cost__c>();
    List<Project_Cost__c> costsToUpdate = new List<Project_Cost__c>();

    List<Project_Cost__c> draftCostValues = (List<Project_Cost__c>)JSON.deserialize(JSON.serialize(draftCosts), List<Project_Cost__c>.class);
    List<Project_Cost__c> existingCostValues = (List<Project_Cost__c>)JSON.deserialize(JSON.serialize(existingCostsValues), List<Project_Cost__c>.class);
    List<Project_Income__c> cashContributionValues = (List<Project_Income__c>)JSON.deserialize(JSON.serialize(cashContributions), List<Project_Income__c>.class);

    if(validateCostSave(existingCostValues, draftCostValues, cashContributionValues, projectId) == false)
    {
      throw new AuraHandledException(System.Label.Budget_Management_Save_Error);
    }
    
    for(Project_Cost__c draftCost : draftCostValues)
    {
      for(Project_Cost__c existingCost : existingCostValues)
      {
        //For new Costs only. Maps pre-set fields to draft copy.
        if(draftCost.Id == existingCost.Id && String.valueOf(draftCost.Id).length() != 18)
        {
          Map<String, Object> draftCostsMap = draftCost.getPopulatedFieldsAsMap();
          Map<String, Object> existingCostsMap = existingCost.getPopulatedFieldsAsMap();

          for(String field : existingCostsMap.keySet())
          {
            //Required as .put cannot set non-rewritable parent (Case__c).
            if(field == 'Case__c')
            {
              String draftCostJson = JSON.serialize(draftCost);
              draftCostJson = draftCostJson.removeEnd('}') + ',"' + field + '":"' + existingCostsMap.get(field) + '"}';
              draftcost = (Project_Cost__c)JSON.deserialize(draftCostJson, Project_Cost__c.class);
            }
            //Do not overwrite draft field with default unless draft does not have a value.
            else if(draftCostsMap.keySet().contains(field) == false)
            {
              draftCost.put(field, existingCostsMap.get(field));
            }
          }
        }
      }
      
      if(String.valueOf(draftCost.Id).length() == 18 && draftCost.Id.getSObjectType() == Schema.Project_Cost__c.SObjectType)
      {
        costsToUpdate.add(draftCost);
      }
      else
      {
        draftCost.Id = null;
        costsToInsert.add(draftCost);
      }
    }

    try 
    {
      update costsToUpdate;
      insert costsToInsert;
      return 'Successfully upserted Costs.';
    } 
    catch (Exception e) 
    {
      throw new AuraHandledException('Failed to upsert Costs: ' + e.getMessage());
      //return 'Failed to upsert Costs: ' + e.getMessage();
    }
  }

  @AuraEnabled
  public static string saveCashContributions(Object draftCash, Object existingCash, Object existingCosts, String projectId)
  {
    List<Project_Income__c> cashToInsert = new List<Project_Income__c>();
    List<Project_Income__c> cashToUpdate = new List<Project_Income__c>();

    List<Project_Income__c> draftCashValues = (List<Project_Income__c>)JSON.deserialize(JSON.serialize(draftCash), List<Project_Income__c>.class);
    List<Project_Income__c> existingCashValues = (List<Project_Income__c>)JSON.deserialize(JSON.serialize(existingCash), List<Project_Income__c>.class);
    List<Project_Cost__c> existingCostValues = (List<Project_Cost__c>)JSON.deserialize(JSON.serialize(existingCosts), List<Project_Cost__c>.class);

    if(validateCashSave(existingCashValues, draftCashValues, existingCostValues, projectId) == false)
    {
      throw new AuraHandledException(System.Label.Budget_Management_Save_Error);
    }

    for(Project_Income__c draftCashCont : draftCashValues)
    {
      for(Project_Income__c existingCashCont : existingCashValues)
      {
        //For new Cash Contributions only. Maps pre-set fields to draft copy.
        if(draftCashCont.Id == existingCashCont.Id && String.valueOf(draftCashCont.Id).length() != 18)
        {
          Map<String, Object> draftCashMap = draftCashCont.getPopulatedFieldsAsMap();
          Map<String, Object> existingCashMap = existingCashCont.getPopulatedFieldsAsMap();

          for(String field : existingCashMap.keySet())
          {
            //Required as .put cannot set non-rewritable parent (Case__c).
            if(field == 'Case__c')
            {
              String draftCashJson = JSON.serialize(draftCashCont);
              //Manually add Case field to JSON.
              draftCashJson = draftCashJson.removeEnd('}') + ',"' + field + '":"' + existingCashMap.get(field) + '"}';
              draftCashCont = (Project_Income__c)JSON.deserialize(draftCashJson, Project_Income__c.class);
            }
            //Do not overwrite draft field with default unless draft does not have a value.
            else if(draftCashMap.keySet().contains(field) == false)
            {
              draftCashCont.put(field, existingCashMap.get(field));
            }
          }
        }
      }
      
      if(String.valueOf(draftCashCont.Id).length() == 18 && draftCashCont.Id.getSObjectType() == Schema.Project_Income__c.SObjectType)
      {
        cashToUpdate.add(draftCashCont);
      }
      else
      {
        draftCashCont.Id = null;
        cashToInsert.add(draftCashCont);
      }
    }

    try 
    {
      update cashToUpdate;
      insert cashToInsert;
      return 'Successfully upserted Cash Contributions.';
    } 
    catch (Exception e) 
    {
      throw new AuraHandledException('Failed to upsert Cash Contributions: ' + e.getMessage());
    }
  }

  @AuraEnabled
  public static String deleteCosts(Object pCostsToDelete)
  {
    List<Project_Cost__c> costsToDelete = (List<Project_Cost__c>)JSON.deserialize(JSON.serialize(pCostsToDelete), List<Project_Cost__c>.class);

    if(costsToDelete.isEmpty() == false)
    {
      try
      {
        Database.delete(costsToDelete);
        return 'Successfully deleted costs.';
      }
      catch (Exception e)
      {
        throw new AuraHandledException('Failed to delete Costs: ' + e.getMessage());
      }
    }
    return 'Failed to delete Costs.';
  }

  @AuraEnabled
  public static String deleteCash(Object cashToDelete)
  {
    List<Project_Income__c> cashContributionsToDelete = (List<Project_Income__c>)JSON.deserialize(JSON.serialize(cashToDelete), List<Project_Income__c>.class);

    if(cashContributionsToDelete.isEmpty() == false)
    {
      try
      {
        Database.delete(cashContributionsToDelete);
        return 'Successfully deleted cash contributions.';
      }
      catch (Exception e)
      {
        throw new AuraHandledException('Failed to delete Cash Contributions: ' + e.getMessage());
      }
    }
    return 'Failed to delete cash contributions.';
  }

  @AuraEnabled
  public static RecordTypeMappingWrapper getRecordTypeMapping(String projectDeveloperName, String variation)
  {
    try 
    {
      List<Project_Budget_Record_Type_Mapping__mdt> rtms = Project_Budget_Record_Type_Mapping__mdt.getAll().values();

      for(Project_Budget_Record_Type_Mapping__mdt rtm : rtms)
      {
        if(variation != null && rtm.DeveloperName == variation && rtm.Variation__c == true)//Check against variation property first.
        {
          RecordTypeMappingWrapper recordTypeMapping = new RecordTypeMappingWrapper();
          recordTypeMapping.projectRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get(rtm.Project_Record_Type_Developer_Name__c).getRecordTypeId();
          recordTypeMapping.costRecordTypeId = Schema.SObjectType.Project_Cost__c.getRecordTypeInfosByDeveloperName().get(rtm.Project_Cost_Record_Type_Developer_Name__c).getRecordTypeId();
          recordTypeMapping.cashRecordTypeId = Schema.SObjectType.Project_Income__c.getRecordTypeInfosByDeveloperName().get(rtm.Cash_Contribu_Record_Type_Developer_Name__c).getRecordTypeId();
          return recordTypeMapping;
        }
        else if(rtm.Project_Record_Type_Developer_Name__c == projectDeveloperName && rtm.Variation__c == false)
        {
          RecordTypeMappingWrapper recordTypeMapping = new RecordTypeMappingWrapper();
          recordTypeMapping.projectRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get(rtm.Project_Record_Type_Developer_Name__c).getRecordTypeId();
          recordTypeMapping.costRecordTypeId = Schema.SObjectType.Project_Cost__c.getRecordTypeInfosByDeveloperName().get(rtm.Project_Cost_Record_Type_Developer_Name__c).getRecordTypeId();
          recordTypeMapping.cashRecordTypeId = Schema.SObjectType.Project_Income__c.getRecordTypeInfosByDeveloperName().get(rtm.Cash_Contribu_Record_Type_Developer_Name__c).getRecordTypeId();
          return recordTypeMapping;
        }
      }
    } 
    catch (Exception e) 
    {
      System.debug(LoggingLevel.ERROR, 'Error retrieving Record Type Mappings in Apex at line: ' + e.getLineNumber() + e.getMessage());
    }
    return null;
  }

  public static Boolean validateCostSave(List<Project_Cost__c> existingCostValues, List<Project_Cost__c> draftCostValues, List<Project_Income__c> cashContributionValues, String projectId)
  {
    Case project = [SELECT Id, Confirm_award_amount__c, Total_Cost__c, Grant_requested__c, NHMF_grant_request__c, RecordType.DeveloperName
                      FROM Case WHERE Id =: projectId];

    Map<String, Project_Cost__c> existingCostsMap = new Map<String, Project_Cost__c>(existingCostValues);
    Map<String, Project_Cost__c> draftCostsMap = new Map<String, Project_Cost__c>(draftCostValues);
    
    if(project.Confirm_award_amount__c == true)
    {
      //Replace existing values with draft values where relevant.
      for(String draftCostId : draftCostsMap.keySet())
      {
        if(existingCostsMap.containsKey(draftCostId))
        {
          Map<String, Object> draftCostsPopulatedFieldsMap = draftCostsMap.get(draftCostId).getPopulatedFieldsAsMap();

          for(String field : draftCostsPopulatedFieldsMap.keySet())
          {
            existingCostsMap.get(draftCostId).put(field, draftCostsPopulatedFieldsMap.get(field));
          }
        }
      }
    
      //Calculate total costs and grant requested.
      Decimal totalCost = 0.0;
      Decimal grantRequested = 0.0;

      for(Project_Cost__c cost : existingCostsMap.values())
      {
        totalCost += cost.Costs__c;
        totalCost += cost.Vat__c;
      }

      for(Project_Income__c cash : cashContributionValues)
      {
        if(project.RecordType.DeveloperName == 'Memorial')
        {
          grantRequested += cash.Value__c;
        }
        else
        {
          grantRequested += cash.Amount_current_phase__c;
        } 
      }

      grantRequested = totalCost - grantRequested;

      if(project.Total_Cost__c != totalCost ||
        (project.RecordType.DeveloperName != 'Memorial' && project.Grant_requested__c != grantRequested) ||
        (project.RecordType.DeveloperName == 'Memorial' && project.NHMF_grant_request__c != grantRequested))
      {
        return false;
      }
    }

    return true;
  }

  public static Boolean validateCashSave(List<Project_Income__c> existingCashValues, List<Project_Income__c> draftCashValues, List<Project_Cost__c> projectCostValues, String projectId)
  {
    Case project = [SELECT Id, Confirm_award_amount__c, Total_Cost__c, Grant_requested__c, NHMF_grant_request__c, RecordType.DeveloperName
                      FROM Case WHERE Id =: projectId];

    Map<String, Project_Income__c> existingCashMap = new Map<String, Project_Income__c>(existingCashValues);
    Map<String, Project_Income__c> draftCashMap = new Map<String, Project_Income__c>(draftCashValues);
    
    if(project.Confirm_award_amount__c == true)
    {
      //Replace existing values with draft values where relevant.
      for(String draftCashId : draftCashMap.keySet())
      {
        if(existingCashMap.containsKey(draftCashId))
        {
          Map<String, Object> draftCashPopulatedFieldsMap = draftCashMap.get(draftCashId).getPopulatedFieldsAsMap();

          for(String field : draftCashPopulatedFieldsMap.keySet())
          {
            existingCashMap.get(draftCashId).put(field, draftCashPopulatedFieldsMap.get(field));
          }
        }
      }
    
      //Calculate total values and grant requested.
      Decimal totalCost = 0.0;
      Decimal grantRequested = 0.0;

      for(Project_Cost__c cost : projectCostValues)
      {
        totalCost += cost.Costs__c;
        totalCost += cost.Vat__c;
      }

      for(Project_Income__c cash : existingCashMap.values())
      {
        if(project.RecordType.DeveloperName == 'Memorial')
        {
          grantRequested += cash.Value__c;
        }
        else 
        {
          grantRequested += cash.Amount_you_have_received__c;
        }
      }

      grantRequested = totalCost - grantRequested;

      if(project.Total_Cost__c != totalCost ||
        (project.RecordType.DeveloperName != 'Memorial' && project.Grant_requested__c != grantRequested) ||
        (project.RecordType.DeveloperName == 'Memorial' && project.NHMF_grant_request__c != grantRequested))
      {
        return false;
      }
    }

    return true;
  }

  public class RecordTypeMappingWrapper
  {
    @AuraEnabled
    public String projectRecordTypeId;
    @AuraEnabled
    public String costRecordTypeId;
    @AuraEnabled
    public String cashRecordTypeId;
  }
}
