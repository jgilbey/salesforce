/*
* ContactTrigger
* Description -

History
 -------
VERSION     AUTHOR          DATE            DETAIL                      Description
1.0         Alicia          2021-03-11      Initial version             After Delete Only - Prevent deletion of contact records with duplicated External Id
*/

trigger ContactTrigger on contact (after delete) {

    if(trigger.isAfter && trigger.isDelete) {
    
        ContactTriggerHandler.afterDelete(trigger.oldMap);

    }
    
}