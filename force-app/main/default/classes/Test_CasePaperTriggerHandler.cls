@isTest
private class Test_CasePaperTriggerHandler
{
    @Testsetup
    static void testData(){
        //Case__c    
        Case_Papers__c c=new Case_Papers__c();
        c.Manager_s_Approval__c = 'Approved';
        c.Stage__c  ='Assessment';
        c.Case_Officer__c =Userinfo.getUserId();
        insert c;
    }
    
    @isTest
    static void casepaperProcessing(){
        Case_Papers__c c=[select Manager_s_Approval__c,Stage__c from Case_Papers__c];
        c.Stage__c ='Approval';
        c.Line_Management__c =Userinfo.getUserId();
        try{
        update c;
        }catch(exception e){
            System.debug(e.getstackTraceString());
        }
        
        c.Manager_s_Approval__c ='Return';
        update c;
        
    } 
}