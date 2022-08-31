/**
    * ContactTriggerHandler class handles trigger for ContactTrigger
    * Description - Before Delete Only - Prevent deletion of contact records with duplicated External Id

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-03-11      Initial version             After Delete Only - Prevent deletion of contact records with duplicated External Id (Trello Card 2422)
*/


public Class ContactTriggerHandler{
    
    public static void afterDelete(Map<Id,contact> triggerOldMap){
        
        //2422
        //If Contact is being deleted due to a Duplicate Merge, get the Master Contact's Id linked to the deleted Contact
        map<id, id> MasterToDeleteIdMap = new map<id, id>();
        for(contact con: triggerOldMap.values()){
            MasterToDeleteIdMap.put(con.id, con.MasterRecordId);
        }
        
        map<id,contact> MasterConMap = new map<id,contact>([SELECT Id, Contact_External_ID__c FROM contact WHERE id IN: MasterToDeleteIdMap.values()]);
        //Check for Unique External ids and prevent them being delete due to a Duplicate Merge
        for(contact conDelete: triggerOldMap.values()){
            contact conMaster = MasterConMap.get(conDelete.MasterRecordId);
            if(conMaster!=null){
                if(conDelete.Contact_External_ID__c != null && conDelete.Contact_External_ID__c!= conMaster.Contact_External_ID__c){
                    conDelete.addError('This Contact cannot be deleted as it has a unique External Id.');
                }
            }
        }
		//END 2422
    }

 
}