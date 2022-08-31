/*Author : Kavita Pandey @Methods
 * Date : 15-11-2019
 * Description : This batch class will update all cases whose grant expiry date 
 * is 30 days away. This 30 days is set under Custom Label.
 * Once Grant_Expiry_Notification__c is set true this will make a process builder
 * to run and create bell notification
 */
global class SetGrantExpiryNotification implements 
    Database.Batchable<sObject>, Database.Stateful {
    
    // instance member to retain state across transactions
    global Integer recordsProcessed = 0;
    global Database.QueryLocator start(Database.BatchableContext bc) {
        Integer daysToAdd = Integer.valueOf(Label.Grant_Expiry_Notification_Days_Before);
        
        Date expiryDateForWhere = Date.today().AddDays(daysToAdd);
        System.debug('expiryDateForWhere = ' + expiryDateForWhere);
        return Database.getQueryLocator(
            [Select ID,	Grant_Expiry_Notification__c,Grant_Expiry_Date__c
			 From case where Grant_Expiry_Date__c =:expiryDateForWhere]
        );
    }
    global void execute(Database.BatchableContext bc, List<Case> scope){
        // process each batch of records
        List<Case> casesToUpdate = new List<Case>();

        for (Case cs : scope) {
                         
            cs.Grant_Expiry_Notification__c = true;
            casesToUpdate.add(cs);
            System.debug('Case for Batch Processing =' + cs);
        }        

        updateRecords(casesToUpdate);
        //update casesToUpdate;
    }    
    global void finish(Database.BatchableContext bc){
        
    }    

    private void updateRecords(List<Case> casesToProcess){
        Database.SaveResult[] srList = database.update(casesToProcess, false);        
        // Iterate through each returned result
        String ErrorMessages = '';
        for (Database.SaveResult sr : srList) {
            if (!(sr.isSuccess())) {
               // Operation failed, so get all errors                
               for(Database.Error err : sr.getErrors()) {
                    ErrorMessages += '\n\nERROR ';                
                    ErrorMessages += ': ' + err.getMessage() + '\n';
                    ErrorMessages += 'Fields affected: ' + err.getFields();
                    system.debug(ErrorMessages);
               }
            }
		}
        if (ErrorMessages.length() > 0) {
            utilitySendEmailToAdmin.sendEmailToAdmin(ErrorMessages);
        }
    }
}