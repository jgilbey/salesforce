/*
* ApplicationChecksTrigger
* Description - 

History
 -------
VERSION     AUTHOR          DATE            DETAIL                      Description
1.0         Alicia          2021-04-07      Initial version             After Update Only - Prevent user editing Application Checks before owner is assigned
*/

trigger ApplicationChecksTrigger on Application_Checks__c (after update) {

    if(trigger.isAfter && trigger.isUpdate){
    
        ApplicationChecksTriggerHandler.afterUpdate(trigger.newMap);
        
    }

}