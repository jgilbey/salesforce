@isTest
public with sharing class ApplicantFormControllerTest {
	
    @testsetup
    public static void setup(){
        Case testCase = new Case(Subject = 'Some Case Subject', Confirm_award_amount__c = true, RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Medium').getRecordTypeId() );//Application_Stages__c = 'Monitoring', Total_Cost__c = 105 
        insert testCase;
        Project_Cost__c projectCost = new Project_Cost__c(Case__c = testCase.Id);
        insert projectCost; 
        testCase.Application_Stages__c = 'Monitoring';
        update testCase;
        Forms__c caseForm = new Forms__c(Case__c = testCase.id, RecordTypeId = Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Capital').getRecordTypeId());
        insert caseForm;
    }
    
    @isTest
    public static void createProjectEnquiryTest() {
        String projectEnquiryId = ApplicantFormController.createProjectEnquiry();   
        System.assert([SELECT Id FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId].size() == 1); 
    }

    @isTest
    public static void obtainFormDataProjectEnquiryTest() {
        String projectEnquiryId = ApplicantFormController.createProjectEnquiry();   
        ApplicantFormController.FormWrapper data = ApplicantFormController.obtainFormData(projectEnquiryId);   

        System.assertEquals('PE', data.formType); 
    }
    
    @isTest
    public static void obtainFormDataCaseTest() {
        Case testCase = new Case(Subject = 'TestCase'); 
        insert testCase;
        Project_Document__c caseDocument = new Project_Document__c(Case__c = testCase.Id, Question__c = 'Alibaba');
        insert caseDocument;
        TestDataFactory.createDocument('Test doc', caseDocument.Id);
        ApplicantFormController.FormWrapper data = ApplicantFormController.obtainFormData(testCase.Id);   

        System.assertEquals('AC', data.formType); 
    }
    
    @isTest
    public static void obtainFormDataFormTest() {
        Case testCase = new Case(Subject = 'TestCase'); 
        insert testCase;
        Forms__c caseForm = new Forms__c(Case__c = testCase.id, RecordTypeId = Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Capital').getRecordTypeId());
        insert caseForm;
        ApplicantFormController.FormWrapper data = ApplicantFormController.obtainFormData(caseForm.Id);   

        System.assertEquals('MF', data.formType); 
    }
    
    
    
    @isTest
    public static void submitProjectEnquiryTest() {
        EOI_Project_Enquiry__c projectEnquiry = ApplicantFormController.submitProjectEnquiry(new EOI_Project_Enquiry__c(), false);
		ApplicantFormController.submitProjectEnquiry(projectEnquiry, true);
        System.assertEquals('Submitted', [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiry.Id LIMIT 1].Status__c);
    }
    
    @isTest
    public static void removeProjectEnquiryTest() {
        EOI_Project_Enquiry__c projectEnquiry = ApplicantFormController.submitProjectEnquiry(new EOI_Project_Enquiry__c(), false);
		ApplicantFormController.removeProjectEnquiry(projectEnquiry.Id);
        System.assertEquals('Deleted', [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiry.Id LIMIT 1].Status__c);         
    }
    	
   	@isTest 
    public static void obtainAllGrandTotalPaidTest() {
        Case testCase = new Case(Subject = 'TestCase'); 
        insert testCase;
        Project_Cost__c projectCost = new Project_Cost__c(Case__c = testCase.Id, Costs__c=200);
        insert projectCost; 
        Forms__c caseForm = new Forms__c(Case__c = testCase.id, RecordTypeId = Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Capital').getRecordTypeId());
        insert caseForm;
        Decimal totalCasePaid = ApplicantFormController.obtainAllGrandTotalPaid(caseForm.Id);
        System.assertEquals(0, totalCasePaid);
    }
    
    @isTest
    public static void updateDocumentTitleWithPrefixTest() {
		Case testCase = new Case(Subject = 'TestCase'); 
        insert testCase;
        String documentId = TestDataFactory.createDocument('Test doc', testCase.Id);
        ApplicantFormController.updateDocumentTitleWithPrefix('Prefix', new List<String>{documentId});
        System.assertEquals('Prefix_Test doc', [SELECT Title FROM ContentDocument WHERE Id = :documentId LIMIT 1].Title);
    }
    
    @isTest
    public static void obtainDataMethodTest() {
        String projectEnquiryId = ApplicantFormController.createProjectEnquiry();  
        // ApplicantFormController.obtainMetadataInfo();
        ApplicantFormController.obtainProjectCaseOptions();
        ApplicantFormController.obtainNHMFRecordTypeIds();
        ApplicantFormController.obtainAllForms();
        ApplicantFormController.obtainMonitoringFormsData();
    }
	
    @isTest
    public static void upsertListRecordsTest() {    
        List<Account> accountList = new List<Account> {
            new Account(Name = 'Test Account For list upsert 1'),
            new Account(Name = 'Test Account For list upsert 2')
        };
        List<Account> upsertedList = (List<Account>) ApplicantFormController.upsertListRecords(JSON.serialize(accountList));
        for(Account currentAcc_i : upsertedList) {
            System.assert(String.isNotBlank(currentAcc_i.Id));
        }
    }
    
    @isTest
    public static void deleteSpendingCostRecordsTest() {    
        Case testCase = new Case(Subject = 'Some Case Subject', Confirm_award_amount__c = true, RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Medium').getRecordTypeId() );//Application_Stages__c = 'Monitoring', Total_Cost__c = 105 
        insert testCase;
        Forms__c caseForm = new Forms__c(Case__c = testCase.id, RecordTypeId = Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Capital').getRecordTypeId());
        insert caseForm;
        List<Spending_Costs__c> spendingCostsList = new List<Spending_Costs__c> {
            new Spending_Costs__c(Forms__c = caseForm.id),
            new Spending_Costs__c(Forms__c = caseForm.id)
        };
        insert spendingCostsList;
        
        List<String> spedningCostIdList = new List<String>();
        for(Spending_Costs__c currentSpendingCost_i : spendingCostsList) {
            spedningCostIdList.add(currentSpendingCost_i.Id);
        }
        ApplicantFormController.deleteSpendingCostRecords(spedningCostIdList);
        System.assert([SELECT Id FROM Spending_Costs__c WHERE Id IN :spedningCostIdList].isEmpty());
    }
	
    @isTest
    public static void submitApplicationFormTest() {
        ApplicantFormController.ApplicationRequestDataWrapper applicationData = createApplicantRequestData();
        Case testCase = ApplicantFormController.submitApplicationForm(applicationData, false);
        Project_Cost__c projectCost = new Project_Cost__c(Case__c = testCase.Id);
        Project_Cost__c projectCostToDelete = new Project_Cost__c(Case__c = testCase.Id);
        
        insert new List<Project_Cost__c>{projectCost, projectCostToDelete}; 
        
        Project_Income__c projectIncToDelete = new Project_Income__c(Case__c = testCase.Id);
        insert projectIncToDelete; 
		applicationData.projectCosts = new List<Project_Cost__c>{projectCost};
		applicationData.initialProjectCostIds = new List<Id>{projectCostToDelete.Id};
        applicationData.projectIncomes = new List<Project_Income__c>{new Project_Income__c(Case__c=testCase.Id)};
        applicationData.initialProjectIncomeIds = new List<Id>{projectIncToDelete.Id};
            
        applicationData.projectPartners = new List<Project_Partner__c>{new Project_Partner__c(Case__c = testCase.Id)};
        Project_Partner__c projectPartnerToDelete = new Project_Partner__c(Case__c = testCase.Id);
        insert projectPartnerToDelete; 
        applicationData.initialPartnerIds = new List<Id>{projectPartnerToDelete.Id};
            
        applicationData.currentProjectRisks = new List<Project_Risk__c>{new Project_Risk__c(Case__c = testCase.Id)};
        applicationData.futureProjectRisks = new List<Project_Risk__c>{new Project_Risk__c(Case__c = testCase.Id)};
        Project_Risk__c projectRiskToDelete = new Project_Risk__c(Case__c = testCase.Id);
        insert projectRiskToDelete; 
        applicationData.initialRiskIds = new List<Id>{projectRiskToDelete.Id};
            
        applicationData.documentsData = new List<Project_Document__c>{new Project_Document__c(Case__c = testCase.Id, Question__c = 'Alibaba')};
        test.startTest();
        ApplicantFormController.submitApplicationForm(applicationData, true);
        test.stopTest();
    }
    
    @isTest
    static void updateFileTitlesOnApplicationFormTest() {
        Case testCase = TestDataFactory.createNHMFProject(); 
        insert testCase;
        String docId = TestDataFactory.createDocument('Test doc', testCase.Id);
        ApplicantFormController.updateFileTitlesOnApplicationForm(new List<String>{docId}, 'test');
        System.assertEquals('Test doc' + Datetime.now().format('dd_MM_yy_hh_mm')  + '_' + 0, [SELECT Title FROM ContentDocument WHERE ID = :docId LIMIT 1].Title);
    }
    @isTest
    static void updatePermissionFormDataTest() {
        
        Case testCase = TestDataFactory.createNHMFProject(); 
        insert testCase;
    	ApplicantFormController.updatePermissionFormData(JSON.serialize(new Forms__c(Case__c = testCase.Id, recordTypeId = Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Acquisitions').getRecordTypeId())), null, null, null, null, null);
    }
    
    static ApplicantFormController.ApplicationRequestDataWrapper createApplicantRequestData() {
        ApplicantFormController.ApplicationRequestDataWrapper objectData = new ApplicantFormController.ApplicationRequestDataWrapper();
        EOI_Project_Enquiry__c projectEnquiry = ApplicantFormController.submitProjectEnquiry(new EOI_Project_Enquiry__c(), false);
        Account testAcc = new Account(Name = 'Test Acc');
        insert testAcc;
        Contact testContact = new Contact(LastName='Test Contact', AccountId = testAcc.Id);
        insert testContact;
      	Case testCase = TestDataFactory.createNHMFProject(); 
        //insert testCase;
        objectData.projectCase = testCase;
        objectData.projectCase.Account = testAcc;
        objectData.projectCase.Contact = testContact;
        objectData.projectCase.EOI_Project_Enquiry__c = projectEnquiry.Id;
        objectData.projectCase.Is_Project_organisation_address_same__c = true;
        
        /*Project_Cost__c projectCost = new Project_Cost__c(Case__c = testCase.Id);
        insert projectCost; 
        */
		objectData.projectCosts = new List<Project_Cost__c>();//{projectCost};
        
        objectData.projectIncomes = new List<Project_Income__c>();
        objectData.initialProjectCostIds = new List<Id>();
        objectData.initialProjectIncomeIds = new List<Id>();
        objectData.projectPartners = new List<Project_Partner__c>();
        objectData.currentProjectRisks = new List<Project_Risk__c>();
        objectData.futureProjectRisks = new List<Project_Risk__c>();
        objectData.initialPartnerIds = new List<Id>();
        objectData.initialRiskIds = new List<Id>();
        objectData.documentsData = new List<Map<String, Object>>();
        return objectData;
    }    
}