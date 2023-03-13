trigger CasePaperTrigger on Case_Papers__c (before insert, before update) {
      if(trigger.isbefore && trigger.isinsert) {
          CasePaperTriggerHandler.beforeInsert(trigger.new);
      }

      if(trigger.isbefore && trigger.isUpdate) {
          CasePaperTriggerHandler.beforeUpdate(trigger.newMap, trigger.oldMap);
      }
}