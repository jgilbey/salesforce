@isTest
public with sharing class ProjectCostFormControllerTest {
    
    
    
    @TestSetup
    static void makeData(){
        //should modify TestDataFactory instead
       /* Database.DMLOptions dmo = new Database.DMLOptions();
        dmo.assignmentRuleHeader.useDefaultRule= true;
        case smallProject = TestDataFactory.createSmallGrantCase(false);
        smallProject.setOptions(dmo);
        insert smallProject;*/

        createSmallGrantCase(true);        
    }


    @is@TestSetup
    static void testSaveSmallProjectCosts_ForAddProjectCost_DecisionConfirmedStatus_ThrowsErrorMessage(){
        //@AuraEnabled
        //public static void saveProjectCosts(
        //  String projectId,
        //  String totalCost,
        //  List<Project_Income__c> cashContributions,
        //  List<project_cost__c> projectCosts,
        //  List<Project_Income__c> removedCashContributions,
        //  List<project_cost__c> removedProjectCosts
        Id recordTypeIdSmall = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Small_Grant_3_10k').getRecordTypeId();
        //create a small project
        Case smallProject = [select Id from Case where RecordTypeId =: recordTypeIdSmall limit 1];

        system.assertNotEquals(null, smallProject); //got the project


        //create costs

        //change costs via ProjectCostFormController and save

        //check that error was thrown is true


        
    }


    @isTest
    private static void testGetProject(){
        Case project = [select Id from Case limit 1];

        ProjectCostFormController.getProjectCosts(project.Id);
    }

    @isTest
    private static void testGetProjectCosts(){

        
        Case project = [select Id from Case limit 1];

        ProjectCostFormController.getCashContributions(project.Id);
    }

    @isTest
    private static void testGetCashContributions(){

        
        Case project = [select Id from Case limit 1];

        ProjectCostFormController.getProjectCosts(project.Id);

    }

}
