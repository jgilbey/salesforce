/**
    * AccountTriggerHandler class handles trigger for AccountTrigger
    * Description - Before Delete Only - Prevent deletion of records with duplicated External Id

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-03-11      Initial version             Before Delete Only - Prevent deletion of records with duplicated External Id (Trello Card 2422)
*/


public Class AccountTriggerHandler{
    
    public static void afterDelete(Map<Id,account> triggerOldMap){
        
        //2422
        //If Account is being deleted due to a Duplicate Merge, get the Master Account's Id linked to the deleted Account
        map<id, id> MasterToDeleteIdMap = new map<id, id>();
        for(account acc: triggerOldMap.values()){
            MasterToDeleteIdMap.put(acc.id, acc.MasterRecordId);
        }
        
        map<id,account> MasterAccMap = new map<id,account>([SELECT Id, Account_External_ID__c FROM account WHERE id IN: MasterToDeleteIdMap.values()]);
        //Check for Unique External ids and prevent them being delete due to a Duplicate Merge
        for(account accDelete: triggerOldMap.values()){
            account accMaster = MasterAccMap.get(accDelete.MasterRecordId);
            if(accMaster!=null){
                if(accDelete.Account_External_ID__c != null && accDelete.Account_External_ID__c != accMaster.Account_External_ID__c){
                    accDelete.addError('This Organisation cannot be deleted as it has a unique External Id.');
                }
            }
        }
        //END 2422

    }
	

 
}