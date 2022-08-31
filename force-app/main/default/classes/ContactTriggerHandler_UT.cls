/**
    * ContactTriggerHandler_UT class tests ContactTrigger and ContactTriggerHandler
    * Description - After Delete Test

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-03-12      Initial version            	Tests ContactTrigger and ContactTriggerHandler
*/


@isTest
public class ContactTriggerHandler_UT {
    
    //Merged Contacts should not be deleted if they have a Unique External ID
    //	test - both have different IDs, delete prevented
    @isTest static void contactsWithExternalIds(){
        account acc1 = TestDataFactory.createAccount_NoInsert();
		insert acc1;
        list<contact> conList = new list<contact>();
        conList.add(TestDataFactory.createContact_NoInsert(acc1.id));
        conList.add(TestDataFactory.createContact_NoInsert(acc1.id));
        conList[0].Contact_External_Id__c='1234';
        conList[1].Contact_External_Id__c='0000';
        insert conList;	
        
        
        Test.startTest();
            try{
                merge conList[0] conList[1];
            }
            catch(Exception e){
                boolean errorMsg = e.getMessage().contains('This Contact cannot be deleted as it has a unique External Id');
                system.debug('errorMsg - '+errorMsg);
                System.AssertEquals(errorMsg, true);
            }
		Test.stopTest();
		
	}
	
    //Merged Contacts should not be deleted if they have a Unique External ID
    //	test - deleted record has external ID, one being kept has not external ID, delete prevented
	@isTest static void contactDeltedWithExternalId(){
        account acc1 = TestDataFactory.createAccount_NoInsert();
		insert acc1;
        list<contact> conList = new list<contact>();
        conList.add(TestDataFactory.createContact_NoInsert(acc1.id));
        conList.add(TestDataFactory.createContact_NoInsert(acc1.id));
        conList[0].Contact_External_Id__c=null;
        conList[1].Contact_External_Id__c='0000';
        insert conList;	
        
        
        Test.startTest();
            try{
                merge conList[0] conList[1];
            }
            catch(Exception e){
                boolean errorMsg = e.getMessage().contains('This Contact cannot be deleted as it has a unique External Id');
                system.debug('errorMsg - '+errorMsg);
                System.AssertEquals(errorMsg, true);
            }
		Test.stopTest();
		
	}
    
    //Merged Contacts should not be deleted if they have a Unique External ID
    //	test - saved record has external ID, deleted no ID, delete is not prevented
    @isTest static void accountSavedWithExternalId(){
        account acc1 = TestDataFactory.createAccount_NoInsert();
		insert acc1;
        list<contact> conList = new list<contact>();
        conList.add(TestDataFactory.createContact_NoInsert(acc1.id));
        conList.add(TestDataFactory.createContact_NoInsert(acc1.id));
        conList[0].Contact_External_Id__c='0000';
        insert conList;	
        
        Test.startTest();
            merge conList[0] conList[1];

        	Contact deletedContact = [SELECT Id, IsDeleted FROM Contact WHERE Id = :conList[1].Id ALL ROWS];
			System.assert(deletedContact.IsDeleted, true);
        
		Test.stopTest();
		
	}
	
}