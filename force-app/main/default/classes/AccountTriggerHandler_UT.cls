/**
    * AccountTriggerHandler_UT class tests AccountTrigger and AccountTriggerHandler
    * Description - After Delete Test

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-03-12      Initial version            	Tests AccountTrigger and AccountTriggerHandler
*/

@isTest
public class AccountTriggerHandler_UT {
    
    //Merged Accounts should not be deleted if they have a Unique External ID
    //	test - both have different IDs, delete prevented
    @testSetup
    private static void setup(){
        
        
        Automation_Settings__c setting = new Automation_Settings__c();
        insert setting;
    }
    //	
    @isTest static void accountsWithExternalIds(){
        list<account> accList = new list<account>();
        accList.add( TestDataFactory.createAccount_NoInsert() );
		accList.add( TestDataFactory.createAccount_NoInsert() );
        accList[1].name='Test Account 2';
        accList[0].Account_External_Id__c='1234';
        accList[1].Account_External_Id__c='0000';
		insert accList;
        
        
        Test.startTest();
            try{
                merge accList[0] accList[1];
            }
            catch(Exception e){
                boolean errorMsg = e.getMessage().contains('This Organisation cannot be deleted as it has a unique External Id');
                system.debug('errorMsg - '+errorMsg);
                System.AssertEquals(errorMsg, true);
            }
		Test.stopTest();
		
	}
	
    //Merged Accounts should not be deleted if they have a Unique External ID
    //	test - deleted record has external ID, one being kept has not external ID, delete prevented
    @isTest static void accountDeletedWithExternalId(){
        list<account> accList = new list<account>();
        accList.add( TestDataFactory.createAccount_NoInsert() );
		accList.add( TestDataFactory.createAccount_NoInsert() );
        accList[1].name='Test Account 2';
        accList[0].Account_External_Id__c=null;
        accList[1].Account_External_Id__c='0000';
		insert accList;
        
        
        Test.startTest();
            try{
                merge accList[0] accList[1];
            }
            catch(Exception e){
                boolean errorMsg = e.getMessage().contains('This Organisation cannot be deleted as it has a unique External Id');
                system.debug('errorMsg - '+errorMsg);
                System.AssertEquals(errorMsg, true);
            }
		Test.stopTest();
		
	}
    
    //Merged Accounts should not be deleted if they have a Unique External ID
    //	test - saved record has external ID, deleted no ID, delete is not prevented
    @isTest static void accountSavedWithExternalId(){
        list<account> accList = new list<account>();
        accList.add( TestDataFactory.createAccount_NoInsert() );
		accList.add( TestDataFactory.createAccount_NoInsert() );
        accList[1].name='Test Account 2';
        accList[0].Account_External_Id__c='0000';
		insert accList;
        
        
        Test.startTest();
            merge accList[0] accList[1];

        	Account deletedAccount = [SELECT Id, IsDeleted FROM Account WHERE Id = :accList[1].Id ALL ROWS];
			System.assert(deletedAccount.IsDeleted, true);
        
		Test.stopTest();
		
	}
}