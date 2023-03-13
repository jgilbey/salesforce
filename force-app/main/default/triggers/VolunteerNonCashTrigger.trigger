trigger VolunteerNonCashTrigger on Volunteer_Non_Cash_Contributions__c (before insert) {
    if(trigger.isbefore && trigger.isinsert) {
          VolunteerNonCashTriggerHandler.beforeInsert(trigger.new);
     }
}