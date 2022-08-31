@isTest
public class PersonalInformationControllerTest {
    @testsetup
    public static void setup() {
        Account genericAccount = new Account(Name='Generic Account');
        Account someOrganisation = new Account(Name='Konoha inc');
        insert genericAccount;
        
        insert new List<Community_Settings__c>{ new Community_Settings__c (Id__c = genericAccount.Id, Name = 'Generic Account')
            									};
        Generic_Account_setting__c genericaAccSettings = Generic_Account_setting__c.getOrgDefaults();
        genericaAccSettings.Account_Id__c = genericAccount.Id;
        insert genericaAccSettings;
  
    }
    
    @isTest
    public static void retrievePersonalInformationTest() {

        User admin = TestDataFactory.createAdminUser();
        
        System.runAs(admin) {
            insert new Community_Settings__c(Id__c = admin.Id, Name = 'Default Account Owner');
            Account testAccount = new Account(Name='testAcc');
            insert testAccount;

            Contact testContact = new Contact(LastName = 'TestCOntact', AccountId = testAccount.Id);
            insert testContact;
            
            User testUser = TestDataFactory.createCommunityUser('TestUser', testContact.Id);
            insert testUser;
            System.runAs(testUser) {
                String JSONData = PersonalInformationComponentController.retrievePersonalInformation(); 
                testContact.MailingStreet = 'Test';
                testContact.MailingCity = 'Test';
                testContact.MailingState = 'Test';
                testContact.MailingPostalCode = '1234123';
                testContact.Phone = '1241252511';
                testContact.Email = 'TestEmail@test.test';
                
                Account organisationAcc = new Account(Name = 'Konoha inc');
                organisationAcc.BillingCity = 'Test city';
                PersonalInformationComponentController.savePersonalInformation(JSON.serialize(testContact), JSON.serialize(organisationAcc), null); 
                System.assertEquals(1, [SELECT COUNT() FROM Contact WHERE MailingStreet = 'Test' AND MailingCity = 'Test' AND MailingPostalCode = '1234123'
                                                AND MailingState = 'Test' AND Phone = '1241252511' AND Id = :testContact.Id]);
                
                System.assertEquals(1, [SELECT COUNT() FROM Account WHERE Name = 'Konoha inc' AND BillingCity = 'Test city']);
            }
        }
    }
    
}