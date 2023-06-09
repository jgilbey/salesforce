/**
    * ApplicationChecksTriggerHandler_UT class tests ApplicationChecksTriggerHandler and ApplicationChecksTrigger
    * Description - After Delete Test

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-04-07      Initial version              Tests ApplicationChecksTriggerHandler and ApplicationChecksTrigger
*/

@isTest
public class ApplicationChecksTriggerHandler_UT {
    
    //Application Checks cannot be edited if the Project is owned by the queue
    //  test - application checks are owned by the queue
    //  
    private static Boolean automationSetting = false;
    
    @testSetup
    private static void setup(){
        //create the custom setting required to test the trigger
       	Automation_Settings__c setting = new Automation_Settings__c();
        insert setting;
    }
    
    @isTest static void checksOwnedByQueue(){
        TestDataFactory.SetupBaseTestData();
        
        Database.DMLOptions dmo = new Database.DMLOptions();
        dmo.assignmentRuleHeader.useDefaultRule= true;
        case smallProject = TestDataFactory.createSmallGrantCase(false);
        smallProject.setOptions(dmo);
        insert smallProject;
        
        List<application_checks__c> check = [SELECT id, Status__c, Project__r.OwnerId FROM application_checks__c WHERE Project__c=: smallProject.id LIMIT 1];
		
        Test.startTest();            
            try{
                check[0].Status__c='Pending';
                update check[0];
            }
            catch(Exception e){
                boolean errorMsg = e.getMessage().contains('Please assign an owner to the Project before completing Application Checks.');
                system.debug('errorMsg - '+errorMsg);
                System.AssertEquals(errorMsg, true);
            }
            
        Test.stopTest();
    
  }
  
  //Application Checks cannot be edited if the Project is owned by the queue
    //  test - application checks are owned by the user
    @isTest static void checksOwnedByUser(){
        TestDataFactory.SetupBaseTestData();
        
        case smallProject = TestDataFactory.createSmallGrantCase(true);
        smallProject.ownerid= userInfo.getUserId();
        update smallProject;
        
        List<application_checks__c> check = [SELECT id, Status__c, Project__r.OwnerId FROM application_checks__c WHERE Project__c=: smallProject.id LIMIT 1];        
        Test.startTest();      
            check[0].Status__c='Pending';
            update check[0];
            
        	//no error thrown in insert
            System.Assert(check[0].Status__c=='Pending');
        Test.stopTest();
  }
}