trigger FormTrigger on Forms__c (before insert,before update,after insert,after update) {
    
    if(Trigger.isafter && !Trigger.isDelete){
        FormTriggerHandler handler=new FormTriggerHandler();
        handler.afterUpdate(Trigger.oldMap);
        if(Trigger.isInsert){
            handler.afterInsert(Trigger.newMap, Trigger.oldMap);
        }
    }
    
    /*if(Trigger.isbefore && !Trigger.isDelete){
        FormTriggerHandler handler=new FormTriggerHandler();
        handler.beforeUpdate(Trigger.oldMap);
    }*/
}