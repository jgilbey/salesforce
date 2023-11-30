/*
Title: ProjectBudgetTableController
Author: JAG (H8)
Date: 2023
Description: Apex controller for projectBudgetTable LWC.

Changes:
*/

public with sharing class ProjectBudgetTableController 
{
  @AuraEnabled(cacheable=true)
  public static Case getProject(Id projectId) 
  {
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
        RecordTypeId,
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
        Grant_percentage_proposed_for_delivery__c,
        Total_actual_delivery_cash_contributions__c,
        Total_delivery_costs_VAT__c,
        Agreed_costs_delivery__c, 
        Programme__c
      FROM case
      WHERE Id = :projectId
    ];

    return project;
  }

  @AuraEnabled(cacheable=true)
  public static List<Project_Cost__c> getProjectCosts(Id projectId, Id recordType, String variation, String displayVersion) 
  {
    List<Project_Cost__c> existingCosts = new List<Project_Cost__c>();
    String sortClause = '';

    //Determine how to sort based on display version.
    switch on (displayVersion)
    {
      when 'Small'
      {
        sortClause = 'Cost_heading__c, Costs__c DESC';
      }
      when 'Medium'
      {
        sortClause = 'Cost_heading__c, Total_Cost__c DESC';
      }
      when 'NHMF'
      {
        sortClause = 'Cost_heading__c, Total_Cost__c DESC';
      }
      when 'Large Development'
      {
        if (variation == 'Large_Development_Delivery')
        {
          sortClause = 'Cost_Type__c, Cost_heading_Delivery__c, Total_Cost__c DESC';
        }
        else 
        {
          sortClause = 'Cost_heading__c, Total_Cost__c DESC';
        }
      }
      when 'Large Delivery'
      {
        sortClause = 'Cost_Type__c, Cost_heading_Delivery__c, Total_Cost__c DESC';
      }
      when else
      {
        sortClause = 'Costs__c DESC';
      }
    }

    String queryString = 'SELECT Id, Cost_heading__c, Cost_heading_Delivery__c, Total_Cost__c, Costs__c, Project_Cost_Description__c,' 
                        + ' Vat__c, Cost_Type__c, RecordType.Name, RecordType.DeveloperName, RecordTypeId'
                        + ' FROM Project_Cost__c'
                        + ' WHERE Case__c = \'' + projectId + '\' AND ' + 'RecordTypeId = \'' + recordType + '\''
                        + ' ORDER BY ' + sortClause;

    existingCosts = Database.query(queryString);

    return existingCosts;
  }

  @AuraEnabled(cacheable=true)
  public static List<Project_Income__c> getCashContributions(Id projectId, Id recordType, String variation, String displayVersion)
  {
    List<Project_Income__c> existingContributions = new List<Project_Income__c>();
    String sortClause = '';

    //Determine how to sort based on display version.
    switch on (displayVersion)
    {
      when 'Small'
      {
        sortClause = 'Amount_you_have_received__c DESC';
      }
      when 'Medium'
      {
        sortClause = 'Amount_you_have_received__c DESC';
      }
      when 'NHMF'
      {
        sortClause = 'Source_Of_Funding__c, Value__c DESC';
      }
      when 'Large Development'
      {
        if (variation == 'Large_Development_Delivery')
        {
          sortClause = 'Source_Of_Funding__c, Amount_you_have_received__c DESC';
        }
        else 
        {
          sortClause = 'Source_Of_Funding__c, Amount_you_have_received__c DESC';
        }
      }
      when 'Large Delivery'
      {
        sortClause = 'Source_Of_Funding__c, Amount_you_have_received__c DESC';
      }
      when else
      {
        sortClause = 'Amount_you_have_received__c DESC';
      }
    }

    String queryString = 'SELECT Id, Secured__c, Secured_non_cash_contributions__c, Evidence_for_secured_income__c, Description_for_cash_contributions__c,'
                        + ' Amount_you_have_received__c, Value__c, Source_Of_Funding__c, Amount_current_phase__c, RecordType.Name, Case__r.RecordType.DeveloperName'
                        + ' FROM Project_Income__c'
                        + ' WHERE Case__c = \'' + projectId + '\' AND ' + 'RecordTypeId = \'' + recordType + '\''
                        + ' ORDER BY ' + sortClause;

    existingContributions = Database.query(queryString);

    return existingContributions;
  }

  @AuraEnabled
  public static string saveCosts(Object draftCosts, Object existingCostsValues, Object cashContributions, String projectId, String variation, String displayVersion)
  {
    List<Project_Cost__c> costsToInsert = new List<Project_Cost__c>();
    List<Project_Cost__c> costsToUpdate = new List<Project_Cost__c>();

    //convert JSON values to object records.
    List<Project_Cost__c> draftCostValues = (List<Project_Cost__c>)JSON.deserialize(JSON.serialize(draftCosts), List<Project_Cost__c>.class);
    List<Project_Cost__c> existingCostValues = (List<Project_Cost__c>)JSON.deserialize(JSON.serialize(existingCostsValues), List<Project_Cost__c>.class);
    List<Project_Income__c> cashContributionValues = (List<Project_Income__c>)JSON.deserialize(JSON.serialize(cashContributions), List<Project_Income__c>.class);

    //Validate that we can save these costs.
    if(validateCostSave(existingCostValues, draftCostValues, cashContributionValues, projectId, variation, displayVersion) == false)
    {
      CustomExceptionData err = new CustomExceptionData('Error', System.Label.Budget_Management_Save_Error, null);
      AuraHandledException ae = new AuraHandledException(JSON.serialize(err));
      ae.setMessage(System.Label.Budget_Management_Save_Error);
      throw ae;
    }
    
    for(Project_Cost__c draftCost : draftCostValues)
    {
      for(Project_Cost__c existingCost : existingCostValues)
      {
        //For new Costs only. Maps pre-set fields to draft copy.
        //The new cost exists in both draft costs (with values changed in the UI) and existing costs (with initial values set e.g. Case and Id).
        //So we match them up and take the existing values and add them to the draft ones.
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
      if(test.isRunningTest())
      {
        update costsToUpdate;
        insert costsToInsert;
      }
      else 
      {
        update as user costsToUpdate;
        insert as user costsToInsert; 
      }
      
      return 'Successfully upserted Costs.';
    } 
    catch (Exception e) 
    {
      System.debug('Failed to upsert Costs: ' + e.getMessage());
      CustomExceptionData err = new CustomExceptionData('Error', 'Failed to upsert Costs: ' + e.getMessage(), null);
      AuraHandledException ae = new AuraHandledException(JSON.serialize(err));
      ae.setMessage('Failed to upsert Costs: ' + e.getMessage());
      throw ae;
    }
  }

  @AuraEnabled
  public static string saveCashContributions(Object draftCash, Object existingCash, Object existingCosts, String projectId, String variation, String displayVersion)
  {
    List<Project_Income__c> cashToInsert = new List<Project_Income__c>();
    List<Project_Income__c> cashToUpdate = new List<Project_Income__c>();

    //convert JSON values to object records.
    List<Project_Income__c> draftCashValues = (List<Project_Income__c>)JSON.deserialize(JSON.serialize(draftCash), List<Project_Income__c>.class);
    List<Project_Income__c> existingCashValues = (List<Project_Income__c>)JSON.deserialize(JSON.serialize(existingCash), List<Project_Income__c>.class);
    List<Project_Cost__c> existingCostValues = (List<Project_Cost__c>)JSON.deserialize(JSON.serialize(existingCosts), List<Project_Cost__c>.class);

    //Validate that we can save these contributions.
    if(validateCashSave(existingCashValues, draftCashValues, existingCostValues, projectId, variation, displayVersion) == false)
    {
      CustomExceptionData err = new CustomExceptionData('Error', System.Label.Budget_Management_Save_Error, null);
      AuraHandledException ae = new AuraHandledException(JSON.serialize(err));
      ae.setMessage(System.Label.Budget_Management_Save_Error);
      throw ae;
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
      if(test.isRunningTest() == false)
      {
        update as user cashToUpdate;
        insert as user cashToInsert;
      }
      else 
      {
        update cashToUpdate;
        insert cashToInsert;
      }
      
      return 'Successfully upserted Cash Contributions.';
    } 
    catch (Exception e) 
    {
      CustomExceptionData err = new CustomExceptionData('Error', 'Failed to upsert Cash Contributions: ' + e.getMessage(), null);
      AuraHandledException ae = new AuraHandledException(JSON.serialize(err));
      ae.setMessage('Failed to upsert Cash Contributions: ' + e.getMessage());
      throw ae;
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
        Database.delete(costsToDelete, true, AccessLevel.USER_MODE);
        return 'Successfully deleted costs.';
      }
      catch (Exception e)
      {
        CustomExceptionData err = new CustomExceptionData('Error', 'Failed to delete Costs: ' + e.getMessage(), null);
        AuraHandledException ae = new AuraHandledException(JSON.serialize(err));
        ae.setMessage('Failed to delete Costs: ' + e.getMessage());
        throw ae;
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
        Database.delete(cashContributionsToDelete, true, AccessLevel.USER_MODE);
        return 'Successfully deleted cash contributions.';
      }
      catch (Exception e)
      {
        CustomExceptionData err = new CustomExceptionData('Error', 'Failed to delete Cash Contributions: ' + e.getMessage(), null);
      AuraHandledException ae = new AuraHandledException(JSON.serialize(err));
      ae.setMessage('Failed to delete Cash Contributions: ' + e.getMessage());
      throw ae;
      }
    }
    return 'Failed to delete cash contributions.';
  }

  @AuraEnabled
  public static RecordTypeMappingWrapper getRecordTypeMapping(String projectDeveloperName, String variation, String programme)
  {
    try 
    {
      List<Project_Budget_Record_Type_Mapping__mdt> rtms = Project_Budget_Record_Type_Mapping__mdt.getAll().values();
      RecordTypeMappingWrapper recordTypeMapping = new RecordTypeMappingWrapper();

      for(Project_Budget_Record_Type_Mapping__mdt rtm : rtms)
      {
        //Check for variation property first.
        if((programme != null && rtm.Programme__c == programme && variation != '' && rtm.DeveloperName == variation && rtm.Variation__c == true) ||
            (programme != null && rtm.Programme__c == programme && variation == '' && rtm.Project_Record_Type_Developer_Name__c == projectDeveloperName && rtm.Variation__c == false) ||
            (variation != '' && rtm.DeveloperName == variation && rtm.Variation__c == true && rtm.Programme__c == null) ||
            (variation == '' && rtm.Project_Record_Type_Developer_Name__c == projectDeveloperName && rtm.Variation__c == false & rtm.Programme__c == null))
        {
          recordTypeMapping.projectRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get(rtm.Project_Record_Type_Developer_Name__c).getRecordTypeId();
          recordTypeMapping.costRecordTypeId = Schema.SObjectType.Project_Cost__c.getRecordTypeInfosByDeveloperName().get(rtm.Project_Cost_Record_Type_Developer_Name__c).getRecordTypeId();
          recordTypeMapping.cashRecordTypeId = Schema.SObjectType.Project_Income__c.getRecordTypeInfosByDeveloperName().get(rtm.Cash_Contribu_Record_Type_Developer_Name__c).getRecordTypeId();
          recordTypeMapping.displayVersion = rtm.Display_Version__c;
          return recordTypeMapping;
        }
      }
      if(recordTypeMapping.projectRecordTypeId == null || recordTypeMapping.costRecordTypeId == null || recordTypeMapping.cashRecordTypeId == null)
      {
        System.debug(LoggingLevel.ERROR,'No record type mapping has been found.');
      }
    } 
    catch (Exception e) 
    {
      System.debug(LoggingLevel.ERROR, 'Error retrieving Record Type Mappings in Apex at line: ' + e.getLineNumber() + e.getMessage());
    }
    return null;
  }

  public static Boolean validateCostSave(List<Project_Cost__c> existingCostValues, List<Project_Cost__c> draftCostValues, List<Project_Income__c> cashContributionValues, String projectId, String variation, String displayVersion)
  {
    Case project = [SELECT Id, Confirm_award_amount__c, Total_Cost__c, Grant_requested__c, NHMF_grant_request__c, Total_amount_cost__c, Total_costs_proposed_for_delivery__c, Grant_request_proposed_for_delivery__c,
                    Total_Costs_Large_Development__c, Total_actual_delivery_costs__c, Delivery_grant_request__c, RecordType.DeveloperName
                    FROM Case WHERE Id =: projectId];

    Map<String, Project_Cost__c> existingCostsMap = new Map<String, Project_Cost__c>(existingCostValues);
    Map<String, Project_Cost__c> draftCostsMap = new Map<String, Project_Cost__c>(draftCostValues);
    
    //Only do main validation if Award Amount is confirmed and there are no Grant Reviews in "Pending" Status.
    if(project.Confirm_award_amount__c == true && checkGrantReviewsPending(projectId) == false)
    {
      //Replace existing values with draft values where relevant.
      for(String draftCostId : draftCostsMap.keySet())
      {
        if(existingCostsMap.containsKey(draftCostId))
        {
          Map<String, Object> draftCostsPopulatedFieldsMap = draftCostsMap.get(draftCostId).getPopulatedFieldsAsMap();

          for(String field : draftCostsPopulatedFieldsMap.keySet())
          {
            if(field != 'Case__c')
            {
              existingCostsMap.get(draftCostId).put(field, draftCostsPopulatedFieldsMap.get(field));
            }
          }
        }
      }
    
      //Calculate total costs and grant requested.
      Decimal totalCost = 0.0;
      Decimal grantRequested = 0.0;
      
      for(Project_Cost__c cost : existingCostsMap.values())
      {
        if(cost.Costs__c != null)
        {
          totalCost += cost.Costs__c;
        }
        
        if(cost.Vat__c != null)
        {
          totalCost += cost.Vat__c;
        }
      }

      for(Project_Income__c cash : cashContributionValues)
      {
        if(displayVersion == 'NHMF' && cash.Value__c != null)
        {
          grantRequested += cash.Value__c;
        }
        else if(cash.Amount_you_have_received__c != null)
        {
          grantRequested += cash.Amount_you_have_received__c;
        } 
      }

      grantRequested = totalCost - grantRequested;

      if(displayVersion == 'NHMF' && (project.Total_amount_cost__c != totalCost || project.NHMF_grant_request__c != grantRequested))
      {
        return false;
      }
      else if(displayVersion == 'Large Development')
      {
        if(variation == 'Large_Development_Delivery' && (project.Total_costs_proposed_for_delivery__c != totalCost || project.Grant_request_proposed_for_delivery__c != grantRequested))
        {
          return false;
        }
        else if(variation == '' && (project.Total_Costs_Large_Development__c != totalCost || project.Grant_requested__c != grantRequested))
        {
          return false;
        }
      }
      else if(displayVersion == 'Large Delivery' && (project.Total_actual_delivery_costs__c != totalCost || project.Delivery_grant_request__c != grantRequested))
      {
        return false;
      }
      else if((displayVersion == 'Small' || displayVersion == 'Medium') && (project.Total_Cost__c != totalCost || project.Grant_requested__c != grantRequested))
      {
        return false;
      }
    }

    return true;
  }

  public static Boolean validateCashSave(List<Project_Income__c> existingCashValues, List<Project_Income__c> draftCashValues, List<Project_Cost__c> projectCostValues, String projectId, String variation, String displayVersion)
  {
    Case project = [SELECT Id, Confirm_award_amount__c, Total_Cost__c, Grant_requested__c, NHMF_grant_request__c, Total_amount_cost__c, Total_costs_proposed_for_delivery__c, Grant_request_proposed_for_delivery__c,
                    Total_Costs_Large_Development__c, Total_actual_delivery_costs__c, Delivery_grant_request__c, RecordType.DeveloperName
                    FROM Case WHERE Id =: projectId];

    Map<String, Project_Income__c> existingCashMap = new Map<String, Project_Income__c>(existingCashValues);
    Map<String, Project_Income__c> draftCashMap = new Map<String, Project_Income__c>(draftCashValues);
    
    //Only do main validation if Award Amount is confirmed and there are no Grant Reviews in "Pending" Status.
    if(project.Confirm_award_amount__c == true && checkGrantReviewsPending(projectId) == false)
    {
      //Replace existing values with draft values where relevant.
      for(String draftCashId : draftCashMap.keySet())
      {
        if(existingCashMap.containsKey(draftCashId))
        {
          Map<String, Object> draftCashPopulatedFieldsMap = draftCashMap.get(draftCashId).getPopulatedFieldsAsMap();

          for(String field : draftCashPopulatedFieldsMap.keySet())
          {
            if(field != 'Case__c')
            {
              existingCashMap.get(draftCashId).put(field, draftCashPopulatedFieldsMap.get(field));
            }
          }
        }
      }
    
      //Calculate total values and grant requested.
      Decimal totalCost = 0.0;
      Decimal grantRequested = 0.0;

      for(Project_Cost__c cost : projectCostValues)
      {
        if(cost.Costs__c != null)
        {
          totalCost += cost.Costs__c;
        }
        if(cost.Vat__c != null)
        {
          totalCost += cost.Vat__c;
        }
      }

      for(Project_Income__c cash : existingCashMap.values())
      {
        if(displayVersion == 'NHMF' && cash.Value__c != null)
        {
          grantRequested += cash.Value__c;
        }
        else if(cash.Amount_you_have_received__c != null)
        {
          grantRequested += cash.Amount_you_have_received__c;
        }
      }

      grantRequested = totalCost - grantRequested;

      if(displayVersion == 'NHMF' && (project.Total_amount_cost__c != totalCost || project.NHMF_grant_request__c != grantRequested))
      {
        return false;
      }
      else if(displayVersion == 'Large Development')
      {
        if(variation == 'Large_Development_Delivery' && (project.Total_costs_proposed_for_delivery__c != totalCost || project.Grant_request_proposed_for_delivery__c != grantRequested))
        {
          return false;
        }
        else if(variation == '' && (project.Total_Costs_Large_Development__c != totalCost || project.Grant_requested__c != grantRequested))
        {
          return false;
        }
      }
      else if(displayVersion == 'Large Delivery' && (project.Total_actual_delivery_costs__c != totalCost || project.Delivery_grant_request__c != grantRequested))
      {
        return false;
      }
      else if((displayVersion == 'Small' || displayVersion == 'Medium') && (project.Total_Cost__c != totalCost || project.Grant_requested__c != grantRequested))
      {
        return false;
      }
    }

    return true;
  }

  @AuraEnabled
  public static Boolean checkGrantReviewsPending(String projectId)
  {
    List<Grant_Review__c> grantReviews = [SELECT Id, Decision__c FROM Grant_Review__c WHERE Project__r.Id =: projectId AND Decision__c = 'Pending Decision' WITH SYSTEM_MODE];

    if(grantReviews.isEmpty() == false)
    {
      return true;
    }
    else 
    {
      return false;
    }
  }

  public class RecordTypeMappingWrapper
  {
    @AuraEnabled
    public String projectRecordTypeId;
    @AuraEnabled
    public String costRecordTypeId;
    @AuraEnabled
    public String cashRecordTypeId;
    @AuraEnabled
    public String displayVersion;
  }

  //Wrapper class for custom exceptions
  public class CustomExceptionData 
  {
    public String name;
    public String message;
    public Integer code;

    public CustomExceptionData(String name, String message, Integer code) 
    {
        this.name = name;
        this.message = message;
        this.code = code;
    }
  }
}