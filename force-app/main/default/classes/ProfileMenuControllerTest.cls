@isTest
public class ProfileMenuControllerTest {
	@isTest
    static void obtainUserInfoTest() {
        ProfileMenuController controller = new ProfileMenuController();
        ResponseWrapper response = ProfileMenuController.obtainUserInfo();
        System.assert(response.success);
    }
	
    @isTest
    static void hasFormsTest() {
        System.assert(!ProfileMenuController.hasForms());
        
        Case testCase = new Case(Subject = 'Some Case Subject', Confirm_award_amount__c = true, RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Medium').getRecordTypeId() );//Application_Stages__c = 'Monitoring', Total_Cost__c = 105 
        insert testCase;
        testCase.Application_Stages__c = 'Monitoring';
        update testCase;
        Forms__c caseForm = new Forms__c(Case__c = testCase.id, RecordTypeId = Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Capital').getRecordTypeId());
        insert caseForm;
		System.assert(ProfileMenuController.hasForms());
    }

}