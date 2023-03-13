trigger ProjectIncomeTrigger on Project_Income__c (before insert) {
    if(trigger.isbefore && trigger.isinsert) {
          ProjectIncomeTriggerHandler.beforeInsert(trigger.new);
      }
}