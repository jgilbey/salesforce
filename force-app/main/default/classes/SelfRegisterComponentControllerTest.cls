@isTest
public class SelfRegisterComponentControllerTest {
	
    @isTest
    static void selfRegistrationTest() {
        SelfRegisterComponentController newInstance = new SelfRegisterComponentController();
        SelfRegisterComponentController.selfRegister('firstname', 'lastname', 'email@test.test', null, null, null, null, null, null, false);
        SelfRegisterComponentController.selfRegister('firstname', 'lastname', 'email@test2.test', 'test', 'test', null, null, null, null, true);
        SelfRegisterComponentController.selfRegister('firstname', 'lastname', 'email@test3.test', 'test', 'tes123t', null, null, null, null, true);
        List<Map<String, Object>> filedList = new List<Map<String, Object>>{new Map<String, Object>{'fieldPath'=>'City', 'value'=>'Test'}};
        SelfRegisterComponentController.selfRegister('firstname', 'lastname', 'email@test4.test', 'test', 'tes123t', null, null, JSON.serialize(filedList), null, true);
    }
    
    @isTest
    static void validationTest() {
        System.assert(SelfRegisterComponentController.isValidPassword('test', 'test'));
        System.assert(!SelfRegisterComponentController.isValidPassword('test', 'te231st'));
        System.assert(!SelfRegisterComponentController.siteAsContainerEnabled('https://google.com/estt'));
        SelfRegisterComponentController.validatePassword(null, null, null);
    }
	
    @isTest
    static void setExperienceIdTest() {
        System.assertEquals(null, SelfRegisterComponentController.setExperienceId(null));
		SelfRegisterComponentController.setExperienceId('test21412r21da');
    }
    
    @isTest
    static void reCaptchaVerifyTest() {
        
        insert new Community_Settings__c(Name = 'Secret_Key', Key_value__c = '12412451251251');
        Test.setMock(HttpCalloutMock.class, new reCaptchaMockup());
        Test.startTest();
		System.assert(SelfRegisterComponentController.reCaptchaVerify('еуыеуеыеф'));
        Test.stopTest();
    }
    
    @isTest
    static void obtainsOranisationIdTest() {
        
		Account organisation = new Account(Name = 'TestOrg');
        insert organisation;
		System.assertEquals(organisation.Id, SelfRegisterComponentController.obtainsOranisationId('TestOrg'));
        System.assert(organisation.Id != SelfRegisterComponentController.obtainsOranisationId('NewOrg'));
    }

    @isTest
    static void langluageTest() {
        insert new Enabled_Community_Languages__c(name = 'en_US');
        SelfRegisterComponentController.obtainCommunityLanguages();
    }
    
}