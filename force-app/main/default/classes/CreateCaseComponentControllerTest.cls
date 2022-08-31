@IsTest
public with sharing class CreateCaseComponentControllerTest {
   
    @TestSetup
    public static void setup() {
        Group g = new Group(Type='Queue', Name='Queue name');
		insert g;
        
        QueueSObject q = new QueueSObject(SobjectType='Case', QueueId=g.Id);
		insert q;
    }

    @isTest
    public static void caseComponentTest() {
        Contact con = new Contact(firstName = 'test', lastName = 'Test', Email = '134@test.com');
        insert con;
        
        Group g = [SELECT Id, Name FROM Group WHERE Name='Queue name' LIMIT 1];
        
        EOI_Project_Enquiry__c projectEnquiry = new EOI_Project_Enquiry__c(
        	Project_Title__c = 'Test project',
            Status__c = 'Encouraged',
            Project_PostCode__c = 'BR12345',
            //Projecttype__c = 'Capital',
            Contact__c = con.id,
            OwnerId = g.id
        );
        insert projectEnquiry;
        
        Case c= new Case(
            Description = 'Test',                             
            Status = 'New',
            ApplicationId__c ='725r650-e450-11e9-b3b6-212ded63c337',
            RecordTypeId= Schema.SObjectType.Case.getRecordTypeInfosByName().get('Small Grant(3-10k)').getRecordTypeId(),
            Grant_Expiry_Date__c = Date.today().AddDays(Integer.valueOf(Label.Grant_Expiry_Notification_Days_Before)),
            Project_Post_Code__c = 'BR12345',
            EOI_Project_Enquiry__c = projectEnquiry.id
        );
        insert c;
        
        // check cases exist
        System.assertEquals(false, CreateCaseComponentController.checkProjectEnquiryStatusAndCases(projectEnquiry.id).casesDoNotExist);
        delete c;
        System.assertEquals(true, CreateCaseComponentController.checkProjectEnquiryStatusAndCases(projectEnquiry.id).casesDoNotExist);
        
        // create case test
        String createCaseResult = CreateCaseComponentController.createCaseForPE(projectEnquiry.id);
        List<Case> cases = [SELECT Id FROM Case WHERE EOI_Project_Enquiry__c = :projectEnquiry.id];
        System.assert(cases.size() == 1);
        
        // get contact name test
        System.assertEquals('test Test', CreateCaseComponentController.getContactName(projectEnquiry.id));
        
        // send email test 
        Test.startTest();
        Boolean result = CreateCaseComponentController.sendEmailToContact(projectEnquiry.id);
        Test.stopTest();
        System.assertEquals(true, result);
        
        // check status test
        CreateCaseComponentController.ResponseWrapper resultEncouraged = CreateCaseComponentController.checkProjectEnquiryStatusAndCases(projectEnquiry.id);
        System.assertEquals(true, resultEncouraged.encouraged);

        projectEnquiry.Status__c = 'New';
        update projectEnquiry;
        CreateCaseComponentController.ResponseWrapper resultElseStatus = CreateCaseComponentController.checkProjectEnquiryStatusAndCases(projectEnquiry.id);
        System.assertEquals(false, resultElseStatus.encouraged);
    }
}