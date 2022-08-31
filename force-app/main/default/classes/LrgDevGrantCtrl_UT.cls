/**
    * LrgDevGrantCtrl_UT class tests LrgDevGrantCtrl
    * Description - Tests class which facilitate the Lightning Aura Components that are used on the SF Experience

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-05-10      Initial version             Tests LrgDevGrantCtrl
*/

@isTest
public class LrgDevGrantCtrl_UT {

    @isTest static void getProjectId(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrantCtrl.getProj(userInfo.getUserId(), project.id, 'Large_Development_250_500k');
            LrgDevGrantCtrl.getProj(null, null, null);
        
        Test.stopTest();
        
    }
    
    @isTest static void isSubmitted(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrantCtrl.isSubmitted(project.id);
            LrgDevGrantCtrl.isSubmitted(null);
        
        Test.stopTest();
        
    }
    
    @isTest static void submit(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrantCtrl.submitApplication(project.id);
            LrgDevGrantCtrl.submitApplication(null);
        
        Test.stopTest();
        
    }
    
    @isTest static void getProjectLists(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrantCtrl.getDevProjList(userInfo.getUserId());
            LrgDevGrantCtrl.getDevProjList(null);
       		LrgDevGrantCtrl.getDeliveryProjList(userInfo.getUserId());
            LrgDevGrantCtrl.getDeliveryProjList(null);
        
        Test.stopTest();
        
    }
    
}