/**
    * CaseIncomeAndCostsCtrl_UT class tests CaseIncomeAndCostsCtrl
    * Description - Tests class which facilitate the Lightning Aura Components that are used on the SF Experience

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-05-10      Initial version             Tests CaseIncomeAndCostsCtrl
*/

@isTest
public class CaseIncomeAndCostsCtrl_UT {

    @isTest static void createAll(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(false);
        string lrgProjectRTid = Schema.SobjectType.Case.getRecordTypeInfosByDeveloperName().get('Large_Development_250_500k').getRecordTypeId();
        project.recordTypeId=lrgProjectRTid;
        

        
        Test.startTest();
            //CaseIncomeAndCostsCtrl.createCosts(project.id);
            //CaseIncomeAndCostsCtrl.createIncome(project.id);
            insert project;
        
        Test.stopTest();
        
    }
    
    @isTest static void deleteAll(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            CaseIncomeAndCostsCtrl.deleteBlankCostsIncome(project.id);
        
        Test.stopTest();
        
    }
    
}