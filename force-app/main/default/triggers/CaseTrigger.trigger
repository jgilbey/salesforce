trigger CaseTrigger on Case (after update, before insert, before update, after insert) {

    if(Trigger.isAfter && Trigger.isInsert){
        CaseTriggerHandler.afterInsert(trigger.newMap);
    }
    
    if(Trigger.isAfter && Trigger.isUpdate){
        CaseTriggerHandler.afterUpdate(trigger.oldMap);
    }
    
    if(trigger.isbefore && trigger.isinsert) {
        CaseTriggerHandler.beforeInsert(trigger.new);
        CaseTriggerHandler.isBeforeInsertTriggerExecuted = true;
    }
    
    if(trigger.isbefore && trigger.isUpdate) {
        CaseTriggerHandler.beforeUpdate(trigger.newMap, trigger.oldMap);
        RegionUpdateOnCase.CreateUpdateCasePapers(trigger.newMap, trigger.oldMap);
        CaseTriggerHandler.isBeforeTriggerExecuted = true;
    }
}