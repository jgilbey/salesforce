/*
* AccountTrigger
* Description -

History
 -------
VERSION     AUTHOR          DATE            DETAIL                      Description
1.0         Alicia          2021-03-11      Initial version             After Delete Only - Prevent deletion of account records with duplicated External Id
*/

trigger AccountTrigger on Account (after delete) {

    if(trigger.isAfter && trigger.isDelete) {
    
        AccountTriggerHandler.afterDelete(trigger.oldMap);

    }
    
}