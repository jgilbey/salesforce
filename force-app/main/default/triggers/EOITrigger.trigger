trigger EOITrigger on EOI_Project_Enquiry__c (before insert, before update, after update) {
    if(trigger.isbefore && trigger.isinsert) {
        EOIUpdate.beforeInsert(trigger.new);
    }
    
    if(trigger.isbefore && trigger.isUpdate) {
        EOIUpdate.beforeUpdate(trigger.newMap, trigger.oldMap);
        EOIUpdate.isBeforeTriggerExecuted = true;
    }

    if(trigger.isafter && trigger.isUpdate) {
        EOIUpdate.afterUpdate(trigger.newMap, trigger.oldMap);
    }
}