trigger ProjectCostTrigger on Project_Cost__c (before insert) {
     if(trigger.isbefore && trigger.isinsert) {
          ProjectCostTriggerHandler.beforeInsert(trigger.new);
      }

}