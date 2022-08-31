/**
    * LrgDevGrant_DocsCtrl_UT class tests LrgDevGrant_DocsCtrl
    * Description - Tests class which facilitate the Lightning Aura Components that are used on the SF Experience

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-05-10      Initial version             Tests LrgDevGrant_DocsCtrl
*/

@isTest
public class LrgDevGrant_DocsCtrl_UT {
    
    @isTest static void isSubmitted(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrant_DocsCtrl.isSubmitted(project.id);
        Test.stopTest();
        
    }
    @isTest static void getDocs(){ 
        
        TestDataFactory.SetupBaseTestData();
        case project = TestDataFactory.createSmallGrantCase(true);
        
        Test.startTest();
            LrgDevGrant_DocsCtrl.getFiles(project.id);        
        Test.stopTest();
        
    }
    
    @isTest static void deleteFile() {
        
       TestDataFactory.SetupBaseTestData();
        
       case project = TestDataFactory.createSmallGrantCase(true);
       
	   ContentVersion contentVersion_1 = new ContentVersion(
          Title = 'testDoc',
          PathOnClient = 'testDoc.jpg',
          VersionData = Blob.valueOf('Test Content'),
          FirstPublishLocationId = project.id
        );
        insert contentVersion_1;
        
       List<contentDocumentLink> docsList = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :project.Id LIMIT 1];
       Id docId = docsList[0].ContentDocumentId;
        system.debug('docId - '+docId);
        
       Test.startTest();
        LrgDevGrant_DocsCtrl.deleteFile(docId);
       Test.stopTest();
        
    }
    
}