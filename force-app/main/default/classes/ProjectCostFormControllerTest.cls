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
    }

    @isTest
    private static void testGetCashContributions(){

        
        Case project = [select Id from Case limit 1];
       	insert TestDataFactory.createProjectIncome(project.Id, 3);
        Test.startTest();
		List<Project_Income__c> incomes = ProjectCostFormController.getCashContributions(project.Id);
        Test.stopTest();
        system.assertEquals(3, incomes.size());
    }

    @isTest
    private static void testGetProjectCosts(){

        
        Case project = [select Id from Case limit 1];
		
		insert TestDataFactory.createProjectCost(project.Id, 3);
        Test.startTest();
        List<Project_Cost__c> costs = ProjectCostFormController.getProjectCosts(project.Id);
        Test.stopTest();
        system.assertEquals(3, costs.size());

    }
    
    @isTest 
    private static void testSaveProjectCosts_SavesChangedIncome(){
        
        //insert project
        //insert costs()
        //insert income
        //assert cost value, assert income value
        //change value
        //save
        //assert saved successfully
        
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
       	List<Project_Income__c> oldIncomes = TestDataFactory.createProjectIncome(project.Id, 3);
        insert oldIncomes;
        
        project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        List<Project_Income__c> changedIncomes = new List<Project_Income__c>();
        Project_Income__c changedIncomeObject = oldIncomes.get(0);
        changedIncomeObject.Amount_you_have_received__c = changedIncomeObject.Amount_you_have_received__c + 100;
        changedIncomes.add(changedIncomeObject);
        Boolean saveError = false;
        test.startTest();
        try{
        ProjectCostFormController.saveProjectCosts(project.Id, 
                                                   String.valueOf(project.Total_Cost__c), 
                                                   String.valueOf(project.Grant_Requested__c), 
                                                   changedIncomes, 
                                                   new List<Project_Cost__c>(), 
                                                   new List<Project_Income__c>(), 
                                                   new List<Project_Cost__c>());
        } catch(Exception e){
            saveError = true;
        }
        test.stopTest();
        system.assertEquals(false, saveError);
        
        //select the income that changed and check the amount is plus 100
    }
    
    
    @isTest 
    private static void testSaveProjectCosts_DeletesCosts(){
        
        //insert project
        //insert costs
        //insert income
        //assert cost value, assert income value
        //delete costs - add to list give to save function
        //save
        //assert saved successfully
        /*ProjectCostFormController.saveProjectCosts(projectId, 
                                                   totalCost, 
                                                   grantRequested, 
                                                   newcashContributions, 
                                                   newprojectCosts, 
                                                   removedCashContributions, 
                                                   removedProjectCosts);*/
          Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
       	List<Project_Income__c> oldIncomes = TestDataFactory.createProjectIncome(project.Id, 3);
        insert oldIncomes;
        List<Project_Cost__c> projectCosts = TestDataFactory.createProjectCost(project.Id, 3);
        insert projectCosts;
        project = ProjectCostFormController.getProject(project.Id);
        Boolean saveError = false;
        test.startTest();
        try{
            
        List<Project_Cost__c> costs = ProjectCostFormController.getProjectCosts(project.Id);
        List<Project_Income__c> conts = ProjectCostFormController.getCashContributions(project.Id);
        List<Project_Income__c> toDelete = new List<Project_Income__c>();
        toDelete.add(conts.get(0));
        ProjectCostFormController.saveProjectCosts(project.Id, 
                                                   String.valueOf(project.Total_Cost__c), 
                                                   String.valueOf(project.Grant_Requested__c), 
                                                   new List<Project_Income__c>(), 
                                                   new List<Project_Cost__c>(), 
                                                   toDelete, 
                                                   costs);
        } catch(Exception e){
            saveError = true;
        }
        test.stopTest();
        system.assertEquals(false, saveError);
        List<Project_Income__c> projectIncomes = [select Id from Project_Income__c where Case__c =: project.Id];
        System.assertEquals(2, projectIncomes.size());
        
    }
    
    @isTest
    private static void testCannotSaveSmallProject_WhenDecisionConfirmed_AndGrantReqOrTotalCostChanged(){
        
        //insert project
        //insert costs()
        //insert income
        //assert cost value, assert income value
        //change value
        //save
        //assert saved successfully
        
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
       	List<Project_Income__c> oldIncomes = TestDataFactory.createProjectIncome(project.Id, 3);
        insert oldIncomes;
        
        project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        project.Confirm_award_amount__c = true;
        project.Decision_Recorded_by__c = System.UserInfo.getUserId();
        upsert project;
        
        List<Project_Income__c> changedIncomes = new List<Project_Income__c>();
        Project_Income__c changedIncomeObject = oldIncomes.get(0);
        changedIncomeObject.Amount_you_have_received__c = changedIncomeObject.Amount_you_have_received__c + 100;
        changedIncomes.add(changedIncomeObject);
        Boolean saveError = false;
        test.startTest();
        try{
            ProjectCostFormController.saveProjectCosts(project.Id, 
                                                       String.valueOf(project.Total_Cost__c - 100), 
                                                       String.valueOf(project.Grant_Requested__c), 
                                                       changedIncomes, 
                                                       new List<Project_Cost__c>(), 
                                                       new List<Project_Income__c>(), 
                                                       new List<Project_Cost__c>());
        } catch(Exception e){
            saveError = true;
        }
        test.stopTest();
        system.assertEquals(true, saveError);
        
        //select the income that changed and check the amount is plus 100
    
    }
    
    
    @isTest
    private static void testCannotSaveNHMFProject_WhenDecisionConfirmed(){
        
    }

}