@isTest
public with sharing class CSVExport_UT {
    
	static testMethod void testPaymentFormImport(){
        
        // create test data
        id paymentRTid = Schema.SObjectType.forms__c.getRecordTypeInfosByDeveloperName().get('Auto_calculated_Payment_Form').getRecordTypeId();
        TestDataFactory.SetupBaseTestData();
        case smallProject = TestDataFactory.createSmallGrantCase(true);
        forms__c paymentForm = new forms__c(case__c= smallProject.id, 
                                            recordTypeId=paymentRTid, 
                                            Payment_Request_From_Applicant__c=2000, 
                                            Amount_Authorised__c=2000, 
                                            Approver__c=userInfo.getUserId(),
                                           	Approvers_Decision__c='Approved',
                                            Form_Status__c='Finance review'
                                           );
        insert paymentForm;
        id csvExportRTid = Schema.SObjectType.CSV_Export__c.getRecordTypeInfosByDeveloperName().get('Payment').getRecordTypeId();
        CSV_Export__c csvExport = new CSV_Export__c(recordTypeId=csvExportRTid);
        insert csvExport;
        List<CSVExport_Constants.ExportRecord> listOfExports = new List<CSVExport_Constants.ExportRecord>();
        CSVExport_Constants.ExportRecord ceii = new CSVExport_Constants.ExportRecord();
        ceii.recordId = csvExport.Id;
        ceii.developerName = 'Payment';
        listOfExports.add(ceii);

        // perform test
        test.startTest();
            CSVExport_ImportInvocable.importRecordsForExport(listOfExports);
        test.stopTest();
        
        // verify process worked
        System.assertEquals(1, [SELECT COUNT() FROM forms__c WHERE CSV_Export__c=:csvexport.Id], 'Expected number of forms linked');
        
    }
    
    static testMethod void testPaymentFormExport(){
        
        // create test data
        id paymentRTid = Schema.SObjectType.forms__c.getRecordTypeInfosByDeveloperName().get('Auto_calculated_Payment_Form').getRecordTypeId();
        TestDataFactory.SetupBaseTestData();
        case smallProject = TestDataFactory.createSmallGrantCase(true);
        forms__c paymentForm = new forms__c(case__c= smallProject.id, 
                                            recordTypeId=paymentRTid, 
                                            Payment_Request_From_Applicant__c=2000, 
                                            Amount_Authorised__c=2000, 
                                            Approver__c=userInfo.getUserId(),
                                           	Approvers_Decision__c='Approved',
                                            Form_Status__c='Finance review'
                                           );
        insert paymentForm;
        id csvExportRTid = Schema.SObjectType.CSV_Export__c.getRecordTypeInfosByDeveloperName().get('Payment').getRecordTypeId();
        CSV_Export__c csvExport = new CSV_Export__c(recordTypeId=csvExportRTid);
        insert csvExport;
        
        List<CSVExport_Constants.ExportRecord> listOfExports = new List<CSVExport_Constants.ExportRecord>();
        CSVExport_Constants.ExportRecord ceii = new CSVExport_Constants.ExportRecord();
        ceii.recordId = csvExport.Id;
        ceii.developerName = 'Payment';
        listOfExports.add(ceii);

        // perform test
        test.startTest();
        	CSVExport_ImportInvocable.importRecordsForExport(listOfExports);
            CSVExport_ExportInvocable.generateExportFiles(listOfExports);
        	CSVExport_ExportInvocable.generateExportFiles(listOfExports);
        test.stopTest();
        
        // verify process worked
        System.assertEquals(1, [SELECT COUNT() FROM Forms__c WHERE CSV_Export__c=:csvexport.Id], 'Expected number of forms linked');

    }

}