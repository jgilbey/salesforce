@istest(seealldata = false)
public class Test_ProjectIncomeTriggerHandler {
    public static testmethod void testProjectIncome() {
       Account acct=TestDataFactory.createAccount();
        contact cont=TestDataFactory.createContact();
        //Case c=TestDataFactory.createSmallGrantCase(true); 
       Case cs= TestDataFactory.createSmallGrantCase(true);
      
     
      
      Project_Cost__c pcost=new Project_Cost__c(case__c =cs.Id);
      insert pcost;
      
      update pcost;
        
        Case_Papers__c c=new Case_Papers__c();
        c.Manager_s_Approval__c = 'Approved';
        c.Stage__c  ='Assessment';
        c.Case_Officer__c =Userinfo.getUserId();
        c.case__C = cs.id;
        insert c;
        
        Project_Income__c p = new Project_Income__c ();
        p.Case__c = cs.id;
        insert p;
        
        update p;
        
    }
}