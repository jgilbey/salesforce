@IsTest
public with sharing class NotifyApplicantComponentControllerTest {
    
    @TestSetup
    public static void setup() {
        Account acc = new Account(Name = 'Test Acc');
        insert acc;
        
        Contact con = new Contact(firstname='first', lastname='last', accountId=acc.id, Email='test@email.com');
        insert con;

        EOI_Project_Enquiry__c projectEnquiry = new EOI_Project_Enquiry__c();
        projectEnquiry.Name_of_your_organisation__c = acc.id;
        projectEnquiry.Status__c = 'Encouraged';
        projectEnquiry.Project_PostCode__c = 'BR12345';
        projectEnquiry.Contact__c = con.id;
        //projectEnquiry.Projecttype__c  = 'Capital';
        insert projectEnquiry;
    }

    @isTest
    public static void checkProjectEnquiryStatusTest() {
        EOI_Project_Enquiry__c projectEnquiry = [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Status__c = 'Encouraged' LIMIT 1];
        Boolean resultEncouraged = NotifyApplicantComponentController.checkProjectEnquiryStatus(projectEnquiry.id);
        System.assertEquals(true, resultEncouraged);

        projectEnquiry.Status__c = 'Discouraged';
        update projectEnquiry;
        Boolean resultDiscouraged = NotifyApplicantComponentController.checkProjectEnquiryStatus(projectEnquiry.id);
        System.assertEquals(true, resultDiscouraged);

        projectEnquiry.Status__c = 'New';
        update projectEnquiry;
        Boolean resultElseStatus = NotifyApplicantComponentController.checkProjectEnquiryStatus(projectEnquiry.id);
        System.assertEquals(false, resultElseStatus);
    }

    @isTest
    public static void getProjectEnquiryStatusTest() {
        EOI_Project_Enquiry__c projectEnquiry = [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Project_PostCode__c = 'BR12345' LIMIT 1];
        System.assertEquals('Encouraged', NotifyApplicantComponentController.getProjectEnquiryStatus(projectEnquiry.id));
    }

    @isTest
    public static void sendEmailToContactTest() {
        EOI_Project_Enquiry__c projectEnquiry = [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Project_PostCode__c = 'BR12345' LIMIT 1];
        Test.startTest();
        Boolean result = NotifyApplicantComponentController.sendEmailToContact(projectEnquiry.id);
        Test.stopTest();
        System.assertEquals(true, result);
    }

    @isTest
    public static void getContactNameTest() {
        EOI_Project_Enquiry__c projectEnquiry = [SELECT Id, Status__c, Contact__r.id, Contact__r.Name FROM EOI_Project_Enquiry__c WHERE Project_PostCode__c = 'BR12345' LIMIT 1];
        System.assertEquals(projectEnquiry.Contact__r.Name, NotifyApplicantComponentController.getContactName(projectEnquiry.id));
    }

}