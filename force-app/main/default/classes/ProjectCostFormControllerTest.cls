@isTest
public with sharing class ProjectCostFormControllerTest {
    
    
    @TestSetup
    static void makeData(){
        //should modify TestDataFactory instead
        Database.DMLOptions dmo = new Database.DMLOptions();
        dmo.assignmentRuleHeader.useDefaultRule= true;
        case smallProject = TestDataFactory.createSmallGrantCase(false);
        smallProject.setOptions(dmo);
        insert smallProject;
        
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