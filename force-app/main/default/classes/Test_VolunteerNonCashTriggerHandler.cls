@istest(seealldata = false)
public class Test_VolunteerNonCashTriggerHandler {
    public static testmethod void testVolNonCash() {
       Account acct=TestDataFactory.createAccount();
        contact cont=TestDataFactory.createContact();
        //Case c=TestDataFactory.createSmallGrantCase(true); 
       Case cs= TestDataFactory.createSmallGrantCase(true);
      
     
      
      Project_Cost__c pcost=new Project_Cost__c(case__c =cs.Id);
      insert pcost;
        
        Case_Papers__c c=new Case_Papers__c();
        c.Manager_s_Approval__c = 'Approved';
        c.Stage__c  ='Assessment';
        c.Case_Officer__c =Userinfo.getUserId();
        c.case__C = cs.id;
        insert c;
        
        Volunteer_Non_Cash_Contributions__c v = new Volunteer_Non_Cash_Contributions__c();
        v.Case__c = cs.id;
        insert v;
        
    }
}