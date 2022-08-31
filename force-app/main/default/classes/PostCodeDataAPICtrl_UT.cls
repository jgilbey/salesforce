/**
    * PostCodeDataAPICtrl_UT class tests PostCodeDataAPICtrl
    * Description - After Insert and Update of Project tests

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-03-30      Initial version            	Tests PostCodeDataAPICtrl
*/


@isTest
public class PostCodeDataAPICtrl_UT{
    
    static testMethod void insertProjectwithPC(){
	
		TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(false);
        project.Project_Post_Code__c = 'WD189RN';
        
        Test.startTest();
        
            insert project;
			
		Test.stopTest();
		
		
		case projectUpdated = [SELECT id, Local_Authority__c, Constituency__c, Ward__c, Original_Local_Authority__c, Original_Constituency__c, Original_Ward__c
									FROM case WHERE id=: project.Id];
									
		system.debug('projectUpdated - '+projectUpdated);
		
		System.assert(projectUpdated.Local_Authority__c!=null, true);
		System.assert(projectUpdated.Original_Local_Authority__c!=null, true);
		System.assert(projectUpdated.Constituency__c!=null, true);
		System.assert(projectUpdated.Original_Constituency__c!=null, true);
		System.assert(projectUpdated.Ward__c!=null, true);
		System.assert(projectUpdated.Original_Ward__c!=null, true);
        
    }
	
	static testMethod void updateProjectwithPC(){
	
		TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(false);
        project.Project_Post_Code__c = 'WD189RN';
		insert project;
		
        Test.startTest();
        
            project.Project_Post_Code__c = 'M12HY';
			update project;
			
		Test.stopTest();
		
		
		case projectUpdated = [SELECT id, Local_Authority__c, Constituency__c, Ward__c, Original_Local_Authority__c, Original_Constituency__c, Original_Ward__c
									FROM case WHERE id=: project.Id];
									
		system.debug('projectUpdated - '+projectUpdated);
		
		System.assert(projectUpdated.Local_Authority__c!=null, true);
		System.assert(projectUpdated.Constituency__c!=null, true);
		System.assert(projectUpdated.Ward__c!=null, true);
        
    }
	
}