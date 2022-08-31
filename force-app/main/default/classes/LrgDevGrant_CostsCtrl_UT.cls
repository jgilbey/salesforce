/**
    * LrgDevGrant_CostsCtrl_UT class tests LrgDevGrant_CostsCtrl
    * Description - Tests class which facilitate the Lightning Aura Components that are used on the SF Experience

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-05-10      Initial version             Tests LrgDevGrant_CostsCtrl
*/

@isTest
public class LrgDevGrant_CostsCtrl_UT {
    
    @isTest static void isSubmitted(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrant_CostsCtrl.isSubmitted(project.id);
        Test.stopTest();
        
    }
    
    @isTest static void getCostAndIncome(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrant_CostsCtrl.getDevCosts(project.id);
            LrgDevGrant_CostsCtrl.getDelCosts(project.id); 
            LrgDevGrant_CostsCtrl.getDevIncome(project.id); 
            LrgDevGrant_CostsCtrl.getDelIncome(project.id); 
        	LrgDevGrant_CostsCtrl.getActualDelCosts(project.id); 
        	LrgDevGrant_CostsCtrl.getActualDelIncome(project.id); 
            LrgDevGrant_CostsCtrl.getDevCosts(null);
            LrgDevGrant_CostsCtrl.getDelCosts(null); 
            LrgDevGrant_CostsCtrl.getDevIncome(null); 
            LrgDevGrant_CostsCtrl.getActualDelCosts(null); 
        	LrgDevGrant_CostsCtrl.getActualDelIncome(null); 
        Test.stopTest();
        
    }
    
    @isTest static void saveCostAndIncome(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrant_CostsCtrl.updateCosts(null);
            LrgDevGrant_CostsCtrl.updateIncome(null); 
        Test.stopTest();
        
    }
}