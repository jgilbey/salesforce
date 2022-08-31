/**
    * ApplicationChecksTriggerHandler class handles trigger for ApplicationChecksTrigger
    * Description - After Update Only - Prevent user editing Application Checks before owner is assigned

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-04-07      Initial version             After Update Only - Prevent user editing Application Checks before owner is assigned
*/


public Class ApplicationChecksTriggerHandler{
    
    public static void afterUpdate(Map<Id,Application_Checks__c> triggerNewMap){
        
        //2572
        //Check Project(case) is not still owned by a queue when application checks are edited.
        list<Application_Checks__c> checkList = [SELECT id, Project__r.ownerId FROM Application_Checks__c WHERE id IN: triggerNewMap.keyset()];
    
        for(Application_Checks__c check: checkList){
            if( string.valueOf(check.Project__r.ownerId).left(3) !='005'){
                Application_Checks__c newCheck = triggerNewMap.get(check.id);
                newCheck.addError('Please assign an owner to the Project before completing Application Checks.');
            }
        
        }
        //END 2572

    }
  

 
}