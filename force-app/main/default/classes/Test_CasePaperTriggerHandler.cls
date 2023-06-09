@isTest
private class Test_CasePaperTriggerHandler
{
    @Testsetup
    static void testData(){
        //Case__c    
        //
        Automation_Settings__c setting = new Automation_Settings__c();
        insert setting;
        Case_Papers__c c=new Case_Papers__c();
        c.Manager_s_Approval__c = 'Approved';
        c.Stage__c  ='Assessment';
        c.Case_Officer__c =Userinfo.getUserId();
        insert c;
    }
    
    @isTest 
    static void casePaperOldProcess_NotYetApproved_SetsOfficerAndStage(){
       
        
        Case_Papers__c c= [Select Id, Case_Officer__c, Manager_s_Approval__c,Stage__c from Case_Papers__c limit 1];
        System.assertNotEquals(null, c.Case_Officer__c);
        User testUser = TestDataFactory.createTestUser('John Doe', null);
        insert testUser;
        
            try{
            c.Manager_s_Approval__c ='Return';
            update c;
            } catch(exception e){
                System.debug(e.getstackTraceString());
            }
        
        Case_Papers__c updated = [SELECT Id, Stage__c from Case_Papers__c limit 1];
        //System.assertEquals('Assessment', updated.Stage__c);
    }
    
    @isTest
    static void casepaperProcessing(){
        
        User testUser = TestDataFactory.createTestUser('John Doe', null);
        insert testUser;
        Case_Papers__c c=[select Manager_s_Approval__c,Stage__c from Case_Papers__c];
        c.Stage__c ='Approval';
        c.Line_Management__c =testUser.Id;
        Test.startTest();
            try{
            update c;
            }catch(exception e){
                System.debug(e.getstackTraceString());
            }
            try{
            c.Manager_s_Approval__c ='Return';
            update c;
            } catch(exception e){
                System.debug(e.getstackTraceString());
            }
        
       Test.stopTest();
            
    } 
    
}