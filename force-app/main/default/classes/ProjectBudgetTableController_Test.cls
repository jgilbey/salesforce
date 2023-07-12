/*
Title: ProjectBudgetTableController_Test
Author: JAG (H8)
Date: July 2023
Description: Test class for ProjectBudgetTableController.

Changes:
*/

@isTest
public with sharing class ProjectBudgetTableController_Test 
{
    @isTest
    public static void getProject_Test() 
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createSmallGrantCase(true).Id);

        Assert.isNotNull(projectRetrieved);
    }

    @isTest
    public static void getProjectCosts_Test() 
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createSmallGrantCase(true).Id);

        Assert.isNotNull(projectRetrieved);

        List<Project_Cost__c> pcs = TestDataFactory.createProjectCost(projectRetrieved.Id, 3);
        insert pcs;

        List<Project_Cost__c> pcsInserted = [SELECT Id, RecordTypeId FROM Project_Cost__c];

        List<Project_Cost__c> pcsRetrieved = ProjectBudgetTableController.getProjectCosts(projectRetrieved.Id, pcsInserted[0].RecordTypeId, '');

        Assert.areEqual(3, pcs.size());
        Assert.isNotNull(pcsRetrieved[0].Cost_heading__c);
    }

    @isTest
    public static void getCashContributions_Test() 
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createSmallGrantCase(true).Id);

        Assert.isNotNull(projectRetrieved);

        List<Project_Income__c> ccs = TestDataFactory.createProjectIncome(projectRetrieved.Id, 3);
        insert ccs;

        List<Project_Income__c> ccsInserted = [SELECT Id, RecordTypeId FROM Project_Income__c];

        List<Project_Income__c> ccsRetrieved = ProjectBudgetTableController.getCashContributions(projectRetrieved.Id, ccsInserted[0].RecordTypeId);

        Assert.areEqual(3, ccs.size());
        Assert.isNotNull(ccsRetrieved[0].Secured__c);
    }

    @isTest
    public static void saveCosts_Test()
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createSmallGrantCase(true).Id);

        Assert.isNotNull(projectRetrieved);

        List<Project_Cost__c> existingpcs = TestDataFactory.createProjectCost(projectRetrieved.Id, 3);
        insert existingpcs;

        //Create a new cost and add to existing and draft costs to mimic a new cost row added and then saved.
        List<Project_Cost__c> draftpcs = new List<Project_Cost__c>();

        Project_Cost__c newpc = new Project_Cost__c();
        newpc.Case__c = projectRetrieved.Id;
        newpc.project_Cost_Description__c = 'testdesc';
        existingpcs.add(newpc);

        Project_Cost__c newpcDraft = new Project_Cost__c();
        newpcDraft.Case__c = projectRetrieved.Id;
        newpcDraft.Costs__c = 10;
        draftpcs.add(newpcDraft);

        //Add temporary Ids
        List<Object> draftpcsWithIds = addTemporaryIds(draftpcs, 'Project_Cost__c', existingpcs.size());
        List<Object> existingpcsWithIds = addTemporaryIds(existingpcs, 'Project_Cost__c', 1);

        ProjectBudgetTableController.saveCosts(draftpcsWithIds, existingpcsWithIds, new List<Project_Income__c>(), projectRetrieved.Id);

        List<Project_Cost__c> pcsAfterInsert = [SELECT Id, Cost_heading__c, Costs__c, Case__c FROM Project_Cost__c WHERE Case__r.Id =: projectRetrieved.Id ORDER BY Costs__c];

        Assert.areEqual(4, pcsAfterInsert.size());

        draftpcs.clear();

        //Update the newly inserted cost to mimic a row entering draft and being saved.
        Project_Cost__c updatepc = pcsAfterInsert[0];
        updatepc.Cost_heading__c = 'Recruitment';
        draftpcs.add(updatepc);

        draftpcsWithIds = addTemporaryIds(draftpcs, 'Project_Cost__c', existingpcs.size());
        existingpcsWithIds = addTemporaryIds(pcsAfterInsert, 'Project_Cost__c', 1);

        ProjectBudgetTableController.saveCosts(draftpcs, pcsAfterInsert, new List<Project_Income__c>(), projectRetrieved.Id);

        Project_Cost__c updatedpc = [SELECT Id, Costs__c, Cost_heading__c FROM Project_Cost__c WHERE Id =: draftpcs[0].Id];

        Assert.areEqual('Recruitment', updatedpc.Cost_heading__c);
    }

    @isTest
    public static void saveCosts_Test_FailValidate()
    {
        Case projectRetrieved = TestDataFactory.createSmallGrantCase(false);
        projectRetrieved.Confirm_award_amount__c = true;
        insert projectRetrieved;

        projectRetrieved = ProjectBudgetTableController.getProject(projectRetrieved.Id);

        Assert.isNotNull(projectRetrieved);

        List<Project_Cost__c> existingpcs = TestDataFactory.createProjectCost(projectRetrieved.Id, 3);
        insert existingpcs;

        List<Project_Income__c> existingccs = TestDataFactory.createProjectIncome(projectRetrieved.Id, 3);
        insert existingccs;
        
        //Create a new cost and add to existing pcs.
        Project_Cost__c newpc = new Project_Cost__c();
        newpc.Case__c = projectRetrieved.Id;
        existingpcs.add(newpc);

        //Give the same cost a value in a field and add to draft costs to mimic a draft value entered.
        List<Project_Cost__c> draftpcs = new List<Project_Cost__c>();
        newpc.Costs__c = 20;
        draftpcs.add(newpc);

        //Add temporary Ids
        List<Object> draftpcsWithIds = addTemporaryIds(draftpcs, 'Project_Cost__c', existingpcs.size());
        List<Object> existingpcsWithIds = addTemporaryIds(existingpcs, 'Project_Cost__c', 1);
        List<Object> existingccsWithIds = addTemporaryIds(existingccs, 'Project_Income__c', existingccs.size());

        try 
        {
            ProjectBudgetTableController.saveCosts(draftpcsWithIds, existingpcsWithIds, existingccsWithIds, projectRetrieved.Id);
        } 
        catch (AuraHandledException e) 
        {
            Assert.areEqual(System.Label.Budget_Management_Save_Error, e.getMessage());
        }
    }

    @isTest
    public static void saveCashContributions_Test()
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createSmallGrantCase(true).Id);

        Assert.isNotNull(projectRetrieved);

        List<Project_Income__c> existingccs = TestDataFactory.createProjectIncome(projectRetrieved.Id, 3);
        insert existingccs;

        //Create a new cash and add to existing and draft cash to mimic a new cash row added and then saved.
        List<Project_Income__c> draftccs = new List<Project_Income__c>();

        Project_Income__c newcc = new Project_Income__c();
        newcc.Case__c = projectRetrieved.Id;
        newcc.Description_for_cash_contributions__c = 'TestDesc';
        existingccs.add(newcc);

        Project_Income__c newccDraft = new Project_Income__c();
        newccDraft.Amount_you_have_received__c = 10;
        draftccs.add(newccDraft);

        //Add temporary Ids
        List<Object> draftccsWithIds = addTemporaryIds(draftccs, 'Project_Income__c', existingccs.size());
        List<Object> existingccsWithIds = addTemporaryIds(existingccs, 'Project_Income__c', 1);

        ProjectBudgetTableController.saveCashContributions(draftccsWithIds, existingccsWithIds, new List<Project_Cost__c>(), projectRetrieved.Id);

        List<Project_Income__c> ccsAfterInsert = [SELECT Id, Case__c, Amount_you_have_received__c, Description_for_cash_contributions__c FROM Project_Income__c WHERE Case__r.Id =: projectRetrieved.Id ORDER BY Amount_you_have_received__c];

        Assert.areEqual(4, ccsAfterInsert.size());

        draftccs.clear();

        //Update the newly inserted cash to mimic a row entering draft and being saved.
        Project_Income__c updatecc = ccsAfterInsert[0];
        updatecc.Description_for_cash_contributions__c = 'testtest';
        draftccs.add(updatecc);

        //Add temporary Ids
        draftccsWithIds = addTemporaryIds(draftccs, 'Project_Income__c', existingccs.size());
        existingccsWithIds = addTemporaryIds(ccsAfterInsert, 'Project_Income__c', 1);

        ProjectBudgetTableController.saveCashContributions(draftccs, ccsAfterInsert, new List<Project_Cost__c>(), projectRetrieved.Id);

        Project_Income__c updatedcc = [SELECT Id, Description_for_cash_contributions__c FROM Project_Income__c WHERE Id =: ccsAfterInsert[0].Id];

        Assert.areEqual('testtest', updatedcc.Description_for_cash_contributions__c);
    }

    @isTest
    public static void saveCashContributions_Test_FailValidate()
    {
        Case projectRetrieved = TestDataFactory.createSmallGrantCase(false);
        projectRetrieved.Confirm_award_amount__c = true;
        insert projectRetrieved;

        projectRetrieved = ProjectBudgetTableController.getProject(projectRetrieved.Id);

        Assert.isNotNull(projectRetrieved);

        List<Project_Income__c> existingccs = TestDataFactory.createProjectIncome(projectRetrieved.Id, 3);
        insert existingccs;

        List<Project_Cost__c> existingpcs = TestDataFactory.createProjectCost(projectRetrieved.Id, 3);
        insert existingpcs;

        //Create a new cash contribution and add to existing ccs.
        Project_Income__c newcc = new Project_Income__c();
        newcc.Case__c = projectRetrieved.Id;
        existingccs.add(newcc);

        //Give the same cc a value in a field and add to draft ccs to mimic a draft value entered.
        List<Project_Income__c> draftccs = new List<Project_Income__c>();
        newcc.Amount_you_have_received__c = 20;
        draftccs.add(newcc);

        //Add temporary Ids
        List<Object> draftccsWithIds = addTemporaryIds(draftccs, 'Project_Income__c', existingccs.size());
        List<Object> existingccsWithIds = addTemporaryIds(existingccs, 'Project_Income__c', 1);
        List<Object> existingpcsWithIds = addTemporaryIds(existingpcs, 'Project_Cost__c', existingpcs.size());

        try 
        {
            ProjectBudgetTableController.saveCashContributions(draftccsWithIds, existingccsWithIds, existingpcsWithIds, projectRetrieved.Id);
        } 
        catch (AuraHandledException e) 
        {
            Assert.areEqual(System.Label.Budget_Management_Save_Error, e.getMessage());
        }
    }

    @isTest
    public static void deleteCosts_Test()
    {
        Case projectRetrieved = TestDataFactory.createSmallGrantCase(true);

        Assert.isNotNull(projectRetrieved);

        List<Project_Cost__c> pcs = TestDataFactory.createProjectCost(projectRetrieved.Id, 3);
        insert pcs;

        Assert.areEqual(3, [SELECT Id FROM Project_Cost__c].size());

        ProjectBudgetTableController.deleteCosts(pcs);

        Assert.areEqual(0, [SELECT Id FROM Project_Cost__c].size());
    }

    @isTest
    public static void deleteCash_Test()
    {
        Case projectRetrieved = TestDataFactory.createSmallGrantCase(true);

        Assert.isNotNull(projectRetrieved);

        List<Project_Income__c> ccs = TestDataFactory.createProjectIncome(projectRetrieved.Id, 3);
        insert ccs;

        Assert.areEqual(3, [SELECT Id FROM Project_Income__c].size());

        ProjectBudgetTableController.deleteCash(ccs);

        Assert.areEqual(0, [SELECT Id FROM Project_Income__c].size());
    }

    @isTest
    public static void getRecordTypeMapping_Test()
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createSmallGrantCase(true).Id);
        
        ProjectBudgetTableController.RecordTypeMappingWrapper rtms = ProjectBudgetTableController.getRecordTypeMapping(projectRetrieved.RecordType.DeveloperName, '');

        Assert.areEqual(projectRetrieved.RecordTypeId, rtms.projectRecordTypeId);
    }

    @isTest
    public static void getRecordTypeMapping_Test_Variation()
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createLargeGrantCase(true).Id);
        
        ProjectBudgetTableController.RecordTypeMappingWrapper rtms = ProjectBudgetTableController.getRecordTypeMapping(projectRetrieved.RecordType.DeveloperName, 'Large_Development_Delivery');

        Assert.areEqual(projectRetrieved.RecordTypeId, rtms.projectRecordTypeId);
    }


    public static List<Object> addTemporaryIds(List<SObject> records, String objectName, Integer numberOfExisting)
    {
        List<Object> recordsWithIds = new List<Object>();

        for(Integer i = 0; i < records.size(); i++)
        {
            String draftString = JSON.serialize(records[i]);

            if(draftString.contains('"Id":"') == false)
            {
                draftString = draftString.removeEnd('}') + ',"' + 'Id' + '":"' + 'costrow-' + String.valueOf(i+numberOfExisting) + '"}';
            }

            Object recordWithId;

            if(objectName == 'Project_Cost__c')
            {
                recordWithId = JSON.deserialize(draftString, Project_Cost__c.class);
            }
            else if(objectName == 'Project_Income__c')
            {
                recordWithId = JSON.deserialize(draftString, Project_Income__c.class);
            }

            recordsWithIds.add(recordWithId);
        }

        return recordsWithIds;
    }


    /*@isTest
    public static void saveCashContributions_Test()
    {
        Case projectRetrieved = ProjectBudgetTableController.getProject(TestDataFactory.createSmallGrantCase(true).Id);

        Assert.isNotNull(projectRetrieved);

        List<Project_Income__c> existingccs = TestDataFactory.createProjectIncome(projectRetrieved.Id, 3);
        insert existingccs;

        //Create a new cash contribution and add to existing ccs.
        Project_Income__c newcc = new Project_Income__c();
        newcc.Case__c = projectRetrieved.Id;
        existingccs.add(newcc);

        //Give the same cc a value in a field and add to draft ccs to mimic a draft value entered.
        List<Project_Income__c> draftccs = new List<Project_Income__c>();
        newcc.Description_for_cash_contributions__c = 'testtest';
        draftccs.add(newcc);

        ProjectBudgetTableController.saveCashContributions(draftccs, existingccs, new List<Project_Cost__c>(), projectRetrieved.Id);
    }*/
}