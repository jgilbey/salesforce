/**
* This is a test classcovering the test for CaseTrigger and  handler class
*/

@isTest
public class Test_CaseTriggerHandler {
    
    @isTest static void TestMethod1(){
        TestDataFactory.SetupBaseTestData();
        map<string,Group> mapOfQueues = new map<string,Group>();
        for(Group grp : [select Id,DeveloperNAME from Group where  Type = 'Queue' AND DeveloperNAME IN ('London_and_South','Midlands_and_East','North','Northern_Ireland','Scotland','Wales')]){
            mapOfQueues.put(grp.DeveloperNAME,grp);
        }
        
        //TestDataFactory.createPortalAuthenticationSetting();
        Case cs= TestDataFactory.createSmallGrantCase(true);
        TestDataFactory.createPortalAuthenticationSetting();
        
        Forms__c form=new Forms__c(Case__c =cs.Id);
        form.RecordTypeId=Schema.SobjectType.Forms__c.getRecordTypeInfosBydeveloperName().get('Permission_to_start_payment_request').getRecordTypeId();
        form.Grant_Expiry_Date__c =System.today();
        form.Mark_as_Paid__c =true;
        insert form;
        
        Approved__c app=new Approved__c(Forms__c =form.Id);
        insert app;
        
        Project_Cost__c pcost=new Project_Cost__c(case__c =cs.Id);
        insert pcost;
        
        cs.Project_Post_Code__c = 'AB12345';
        cs.Supporting_documents_provided__c = true;
        cs.Name_on_the_application_form_accord_wit__c = 'Yes';
        cs.Income_applied_towards_it_objects__c = 'Yes';
        cs.Agree_to_distribute_assets_to_charity__c = 'Yes';
        
        //cs.Grant_Decision__c = 'Awarded';
        Id recordTypeId =Schema.SobjectType.Case.getRecordTypeInfosByDeveloperName().get('Medium').getRecordTypeId();
        cs.Release_Permission_to_start__c =true;
        cs.recordtypeId=recordTypeId;
        
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new CaseTriggerHandlerMockImpl());
        update cs;
        
        cs.Application_Stages__c = 'Assessment';
        //cs.OwnerId =UserInfo.getUserId();
        try{
            update cs;
            
            CaseTriggerHandler.SerializeObj obj=new CaseTriggerHandler.SerializeObj();
            
        }catch(exception e){}
        
        test.stopTest();
        
        Case updatedCase = [Select id,ownerid from Case where id =: cs.id];
        //System.assertEquals(mapOfQueues.get('Scotland').id,updatedCase.ownerid);
        
    }
    
}