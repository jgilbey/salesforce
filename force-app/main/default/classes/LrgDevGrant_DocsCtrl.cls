public with sharing class LrgDevGrant_DocsCtrl {
    
    /*@AuraEnabled
    public static case getProj(string uId){
        return LrgDevGrantCtrl.getProj(uId);
    }*/

    @AuraEnabled
    public static boolean isSubmitted(string projId){
        return LrgDevGrantCtrl.isSubmitted(projId);
    }
    
    @AuraEnabled
    public static list<contentDocumentLink> getFiles(string projId){
        
        list<contentDocumentLink> docList = [SELECT ContentDocumentId, ContentDocument.Title, ContentDocument.FileType, ContentDocument.CreatedDate, LinkedEntityId
                                                FROM ContentDocumentLink 
                                                WHERE LinkedEntityId =: projId];
        
        return docList;
    }
    
    @AuraEnabled
    public static void deleteFile(string fileId) {
        
        ContentDocument doc = [SELECT Id FROM ContentDocument WHERE Id =: fileId];
        delete doc;
        
    }

}