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
}