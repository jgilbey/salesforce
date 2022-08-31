/**
 * @description       : Delete all EOI_Project_Enquiry__c with "Deleted" status
 * @author            : Methods
 * @group             : 
 * @last modified on  : 03-18-2021
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   03-18-2021   Methods   Initial Version
**/
global with sharing class removeProjectEnquiryBatch implements Database.Batchable<sObject>, Schedulable{
    Set<String> statusToRemove = new Set<String> {'Deleted'};

    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator( [SELECT Id FROM EOI_Project_Enquiry__c WHERE Status__c IN :statusToRemove]);
    }
    
    global void execute(Database.BatchableContext bc, List<EOI_Project_Enquiry__c> records){
        delete records;
    }

    global void finish(Database.BatchableContext bc){
        // execute any post-processing operations
    }    

    global void execute(SchedulableContext ctx) {
        Database.executeBatch(this);
    }
}