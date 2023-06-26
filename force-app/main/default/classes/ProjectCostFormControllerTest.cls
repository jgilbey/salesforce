@isTest
public with sharing class ProjectBudgetTableControllerTest {
    
    
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
    
    /*@isTest
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
    */
    
    @isTest
    private static void testDeleteCosts(){
        //set up projectcosts for project
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        List<Project_Cost__c> projectCosts = TestDataFactory.createProjectCost(project.Id, 3);
        insert projectCosts;
        List<Project_Cost__c> deletedCosts = [select Id from Project_Cost__c where Case__c =: project.Id];
        System.assertEquals(3, deletedCosts.size());
        //serialize them
        //start test run cont method
        Test.startTest();
            ProjectCostFormController.deleteCosts(deletedCosts);
        Test.stopTest();
        //assert deleted
        deletedCosts = [select Id from Project_Cost__c where Case__c =: project.Id];
        System.assertEquals(0, deletedCosts.size());
    }
    
    @isTest
    private static void deleteCash(){
        
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        List<Project_Income__c> projectCosts = TestDataFactory.createProjectIncome(project.Id, 3);
        insert projectCosts;
        List<Project_Income__c> deletedCash = [select Id from Project_Income__c where Case__c =: project.Id];
        System.assertEquals(3, deletedCash.size());
        //serialize them
        //start test run cont method
        Test.startTest();
            ProjectCostFormController.deleteCash(deletedCash);
        Test.stopTest();
        //assert deleted
        deletedCash = [select Id from Project_Income__c where Case__c =: project.Id];
        System.assertEquals(0, deletedCash.size());
    }
        
    @isTest
    private static void testValidateCostSave(){
        
        //method mostly used if decision is confirmed..
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        project.Confirm_award_amount__c = true;
        project.Decision_Recorded_by__c = System.UserInfo.getUserId();
        upsert project;
        
        List<Project_Cost__c> existingCosts = TestDataFactory.createProjectCost(project.Id, 3);
        insert existingCosts;
        
        List<Project_Income__c> existingIncomes = TestDataFactory.createProjectIncome(project.Id, 2);
        insert existingIncomes;
        
        List<Project_Cost__c> draftCosts = new List<Project_Cost__c>();
        Project_Cost__c changedCostObj = existingCosts.get(0);
        changedCostObj.Costs__c = changedCostObj.Costs__c + 100;
        draftCosts.add(changedCostObj);
        Boolean saveError = false;
        Boolean isValid;
        Test.startTest();
        //try{
            isValid = ProjectCostFormController.validateCostSave(existingCosts, draftCosts, existingIncomes, project.Id);   
       // } catch(Exception e){
       // this currently always throws a save error.. there is some issue with put on case__c which is dealt with in save but not in validate method
            //saveError = true;
        //}
        
        Test.stopTest();
       //   System.assertEquals(false, saveError);   
        System.assertEquals(false, isValid);   
    }
    
    @isTest
    private static void testValidateCashSave(){
        
        //method mostly used if decision is confirmed..
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        project.Confirm_award_amount__c = true;
        project.Decision_Recorded_by__c = System.UserInfo.getUserId();
        upsert project;
        
        List<Project_Cost__c> existingCosts = TestDataFactory.createProjectCost(project.Id, 3);
        insert existingCosts;
        
        List<Project_Income__c> existingIncomes = TestDataFactory.createProjectIncome(project.Id, 2);
        insert existingIncomes;
        
        List<Project_Income__c> draftIncome = new List<Project_Income__c>();
        Project_Income__c changedIncome = existingIncomes.get(0);
        changedIncome.Amount_you_have_received__c = changedIncome.Amount_you_have_received__c + 100;
        draftIncome.add(changedIncome);
        Boolean saveError = false;
        Boolean isValid;
        Test.startTest();
            isValid = ProjectCostFormController.validateCashSave(existingIncomes, draftIncome, existingCosts, project.Id);  
        
        Test.stopTest();
       System.assertEquals(true, isValid);   
    }
    
    @isTest
    private static void testGetRecordTypeMapping() {
        // Create test data
        Project_Budget_Record_Type_Mapping__mdt rtm1 = new Project_Budget_Record_Type_Mapping__mdt();
            rtm1.DeveloperName = 'Memorial';
            rtm1.Variation__c = true;
            rtm1.Project_Record_Type_Developer_Name__c = 'Memorial';
            rtm1.Project_Cost_Record_Type_Developer_Name__c = 'NHMF';
            rtm1.Cash_Contribu_Record_Type_Developer_Name__c = 'NHMF';
       
        Project_Budget_Record_Type_Mapping__mdt rtm2 = new Project_Budget_Record_Type_Mapping__mdt();
            rtm2.DeveloperName = 'Medium';
            rtm2.Variation__c = false;
            rtm2.Project_Record_Type_Developer_Name__c = 'Medium';
            rtm2.Project_Cost_Record_Type_Developer_Name__c = 'Medium';
            rtm2.Cash_Contribu_Record_Type_Developer_Name__c = 'Medium';
       
        Test.startTest();
        ProjectCostFormController.RecordTypeMappingWrapper result1 = ProjectCostFormController.getRecordTypeMapping('Memorial', 'Memorial');
        Test.stopTest();
        System.assertNotEquals(null, result1.projectRecordTypeId);
        System.assertNotEquals(null, result1.costRecordTypeId);
        System.assertNotEquals(null, result1.cashRecordTypeId);

        ProjectCostFormController.RecordTypeMappingWrapper result2 = ProjectCostFormController.getRecordTypeMapping('Medium', 'Medium');
        System.assertNotEquals(null, result2.projectRecordTypeId);
        System.assertNotEquals(null, result2.costRecordTypeId);
        System.assertNotEquals(null, result2.cashRecordTypeId);

        ProjectCostFormController.RecordTypeMappingWrapper result3 = ProjectCostFormController.getRecordTypeMapping('ProjectType3', 'RTM3');
        System.assertEquals(null, result3);
    }
    
     @IsTest
    static void testSaveCashContributions() {
       
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        Object draftCash = new List<Project_Income__c>();
        List<Project_Income__c> oldIncomes = TestDataFactory.createProjectIncome(project.Id, 3);
        insert oldIncomes;
        List<Project_Income__c> changedIncomes = new List<Project_Income__c>();
        Project_Income__c changedIncomeObject = oldIncomes.get(0);
        changedIncomeObject.Amount_you_have_received__c = changedIncomeObject.Amount_you_have_received__c + 100;
        changedIncomes.add(changedIncomeObject);
        Object existingCosts = new List<Project_Cost__c>();
        
        
        Test.startTest();
        
        try {
            String result = ProjectCostFormController.saveCashContributions(changedIncomes, oldIncomes, existingCosts, project.Id);
            
            System.assertEquals('Successfully upserted Cash Contributions.', result);
            
            
        } catch (AuraHandledException e) {
            System.assert(false, 'Expected exception was thrown: ' + e.getMessage());
        } catch (Exception e) {
            System.assert(false, 'An unexpected exception occurred: ' + e.getMessage());
        }
        
        Test.stopTest();
    }
    
    @IsTest
    static void testDeleteCash() {

        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        Project_Income__c projIncome= New Project_Income__c();
                                projIncome.case__c = project.Id;
                                projIncome.Secured__c = false;                          
                                projIncome.Amount_you_have_received__c =500;
                                projIncome.Description_for_cash_contributions__c = 'CC1';
        insert projIncome;
        List<Project_Income__c> toDelete = new List<Project_Income__c>(); 
        toDelete.add(projIncome);

        Test.startTest();
        
        try {

            String result = ProjectCostFormController.deleteCash(toDelete);
            
            System.assertEquals('Successfully deleted cash contributions.', result);
            
        } catch (AuraHandledException e) {
            System.assert(false, 'Expected exception was thrown: ' + e.getMessage());
        } catch (Exception e) {
            System.assert(false, 'An unexpected exception occurred: ' + e.getMessage());
        }
        
        Test.stopTest();
    }
    
    
     @isTest
    static void testSaveCosts() {
        // Create test data
        
        Case project = [select Id, Total_Cost__c, Grant_Requested__c from Case limit 1];
        Project_Cost__c projCost= New Project_Cost__c();
                                projCost.case__c = project.Id;
                                projCost.Cost_heading__c = 'Professional fees';                          
                                projCost.Costs__c =1000;
                                projCost.project_Cost_Description__c = 'some professioanl fees description';
        List<Object> draftCosts = new List<Object>();
        List<Project_Cost__c> existingCostValues = TestDataFactory.createProjectCost(project.Id, 2);
        insert existingCostValues;
        String fifteencharId= String.valueOf(existingCostValues[0].Id).substring(0, 15);
        projCost.Id = fifteencharId;
        draftCosts.add((Object) projCost);
            //TestDataFactory.createProjectCost(project.Id, 1);
        
        draftCosts.add(existingCostValues[0]);
        List<Project_Income__c> cashContributions = TestDataFactory.createProjectIncome(project.Id,2);
        insert cashContributions;

        Test.startTest();
        // Call the method under test
        ProjectCostFormController.saveCosts(
            draftCosts,
            existingCostValues,
            cashContributions,
            project.Id
        );
        Test.stopTest();
        
        // Verify that the correct records were inserted and updated
        //List<Project_Cost__c> insertedCosts = [SELECT Id FROM Project_Cost__c Where Case__c = :project.Id];
        //List<Project_Cost__c> updatedCosts = [SELECT Id FROM Project_Cost__c where Case__c = :project.Id];
        
        //System.assertEquals(draftCosts.size() - existingCostValues.size(), insertedCosts.size());
        //System.assertEquals(existingCostValues.size(), updatedCosts.size());
        
        // Verify that the correct error is thrown when validation fails
        try {
            // Call the method with invalid data
            ProjectCostFormController.saveCosts(
                draftCosts,
                existingCostValues,
                cashContributions,
                null  // Invalid project Id
            );
            // If the previous line didn't throw an exception, fail the test
            System.assert(false, 'Expected AuraHandledException was not thrown');
        } catch (AuraHandledException ex) {
            ProjectCostFormController.CustomExceptionData errorData = (ProjectCostFormController.CustomExceptionData)JSON.deserialize(ex.getMessage(), ProjectCostFormController.CustomExceptionData.class);
            //System.assertEquals('Error', errorData.type);
            //System.assertEquals(System.Label.Budget_Management_Save_Error, errorData.message);
            System.assertEquals(null, errorData);
        }
    }
       
}