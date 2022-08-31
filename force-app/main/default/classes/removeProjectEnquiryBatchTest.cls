@isTest
public class removeProjectEnquiryBatchTest {
    @isTest
    static void removeProjectTest() {
        EOI_Project_Enquiry__c projectEnquiry = new EOI_Project_Enquiry__c( Status__c = 'Deleted');
        insert projectEnquiry;
        Test.startTest();
        Database.executeBatch(new removeProjectEnquiryBatch());
        Test.stopTest();
        System.assertEquals(0, [SELECT Id FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiry.Id].size());
    }

    @isTest 
    static void scheduleTest() {
        Test.startTest();
        String chron = '0 0 23 * * ?';        
        System.Schedule('Test Sched', chron, new removeProjectEnquiryBatch());
        Test.stopTest();    
    }
}