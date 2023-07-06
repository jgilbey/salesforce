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

        //Create a new cost and add to existing costs.
        Project_Cost__c newpc = new Project_Cost__c();
        newpc.Case__c = projectRetrieved.Id;
        existingpcs.add(newpc);

        //Give the same cost a value in a field and add to draft costs to mimic a draft value entered.
        List<Project_Cost__c> draftpcs = new List<Project_Cost__c>();
        newpc.Cost_heading__c = 'Recruitment';
        draftpcs.add(newpc);

        ProjectBudgetTableController.saveCosts(draftpcs, existingpcs, new List<Project_Income__c>(), projectRetrieved.Id);
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

        //Create a new cost and add to existing costs.
        Project_Cost__c newpc = new Project_Cost__c();
        newpc.Case__c = projectRetrieved.Id;
        existingpcs.add(newpc);

        //Give the same cost a value in a field and add to draft costs to mimic a draft value entered.
        List<Project_Cost__c> draftpcs = new List<Project_Cost__c>();
        newpc.Cost_heading__c = 'Recruitment';
        draftpcs.add(newpc);

        try 
        {
            ProjectBudgetTableController.saveCosts(draftpcs, existingpcs, existingccs, projectRetrieved.Id);
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

        //Create a new cash contribution and add to existing ccs.
        Project_Income__c newcc = new Project_Income__c();
        newcc.Case__c = projectRetrieved.Id;
        existingccs.add(newcc);

        //Give the same cc a value in a field and add to draft ccs to mimic a draft value entered.
        List<Project_Income__c> draftccs = new List<Project_Income__c>();
        newcc.Description_for_cash_contributions__c = 'testtest';
        draftccs.add(newcc);

        ProjectBudgetTableController.saveCashContributions(draftccs, existingccs, new List<Project_Cost__c>(), projectRetrieved.Id);
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
}