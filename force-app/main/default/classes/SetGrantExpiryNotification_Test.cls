/*Author : Kavita Pandey @Methods
 * Date : 15-11-2019
 * Description :Test class for SetGrantExpiryNotification
 */
@isTest
private class  SetGrantExpiryNotification_Test {
	@testSetup 
    static void setup() {
        List<Account> accounts = new List<Account>();
        List<Contact> contacts = new List<Contact>();
        List<Case> casesToInsert = new List<Case>();
        
        // insert 10 accounts
        for (Integer i=0;i<5;i++) {
            accounts.add(new Account(name='Account '+i, 
                billingcity='New York', billingcountry='USA'));
        }
        insert accounts;
        // find the account just inserted. add contact for each
        for (Account account : [select id from account]) {
            contacts.add(new Contact(firstname='first', 
                lastname='last', accountId=account.id));
        }
        insert contacts;
        for(Contact ct: [select id,  AccountId from contact]){
            Case cs= New Case(Description = 'Test'+ ct.id,                             
                              Status = 'New',
                              RecordTypeId= Schema.SObjectType.Case.getRecordTypeInfosByName().get('Small Grant(3-10k)').getRecordTypeId(),
                              ContactId = ct.id,
                              AccountId = ct.AccountId,
                              Grant_Expiry_Date__c = Date.today().AddDays(Integer.valueOf(Label.Grant_Expiry_Notification_Days_Before))
            );
            casesToInsert.add(cs);
        }
        insert casesToInsert;
    }
    static testmethod void testBatch_SetGrantExpiryNotifications() {        
        Test.startTest();
        	SetGrantExpiryNotification uca = new SetGrantExpiryNotification();
        	Id batchId = Database.executeBatch(uca);
        Test.stopTest();
        // after the testing stops, assert records were updated properly
        System.assertEquals(5, [select count() from case Where Grant_Expiry_Notification__c = true ]);
    }
}