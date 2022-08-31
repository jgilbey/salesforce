/**
 * @description       : 
 * @author            : Methods
 * @group             : 
 * @last modified on  : 04-20-2021
 * @last modified by  : Methods
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   04-20-2021   Methods   Initial Version
**/
public with sharing class NotifyApplicantComponentController {
    public static Set<String> statusesForNotify = new Set<String>{'Encouraged', 'Discouraged'};

    /**
    * @description
    * Check if we allow to create Case for selected EOI_Project_Enquiry__c
    * @author Methods | 04-20-2021 
    * @param projectEnquiryId
    * @return Boolean: true if allowed
    **/
    @AuraEnabled
    public static Boolean checkProjectEnquiryStatus(Id projectEnquiryId) {
        List<EOI_Project_Enquiry__c> currentProjectEnquiryList = [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId];
        EOI_Project_Enquiry__c currentProjectEnquiry = currentProjectEnquiryList.size() > 0 ? currentProjectEnquiryList[0] : null;
        if(currentProjectEnquiry != null && currentProjectEnquiry.Status__c != null && statusesForNotify.contains(currentProjectEnquiry.Status__c)) {
            return true;
        }
        return false;
    }

    /**
    * @description
    * Return selected EOI_Project_Enquiry__c Status
    * @author Methods | 04-20-2021 
    * @param projectEnquiryId
    * @return String
    **/
    @AuraEnabled
    public static String getProjectEnquiryStatus(Id projectEnquiryId) {
        List<EOI_Project_Enquiry__c> currentProjectEnquiryList = [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId];
        EOI_Project_Enquiry__c currentProjectEnquiry = currentProjectEnquiryList.size() > 0 ? currentProjectEnquiryList[0] : null;
        return currentProjectEnquiry.Status__c;
    }

    /**
    * @description
    * Send emial for selected EOI_Project_Enquiry__c Contact
    * @author Methods | 04-20-2021 
    * @param projectEnquiryId
    * @return Boolean: true if success
    **/
    @AuraEnabled
    public static Boolean sendEmailToContact(Id projectEnquiryId) {
        List<EOI_Project_Enquiry__c> currentProjectEnquiryList = [SELECT Id, Status__c, Contact__r.Name, Contact__r.id, Contact__r.Email FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId];
        EOI_Project_Enquiry__c currentProjectEnquiry = currentProjectEnquiryList.size() > 0 ? currentProjectEnquiryList[0] : null;
        if(currentProjectEnquiry != null && currentProjectEnquiry.Contact__r.Email != null && currentProjectEnquiry.Status__c != null) {
            EmailTemplate emailTemplate = new EmailTemplate();
            if(currentProjectEnquiry.Status__c == 'Encouraged') {
                emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'Encouraged PE form'];
            }
            if(currentProjectEnquiry.Status__c == 'Discouraged') {
                emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'Discouraged PE form'];
            }

            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            String[] toAddresses = new String[] {currentProjectEnquiry.Contact__r.Email};
            mail.setTargetObjectId(currentProjectEnquiry.Contact__r.id); 
            mail.setWhatId(currentProjectEnquiry.Id);
            mail.setToAddresses(toAddresses);
            mail.setTemplateID(emailTemplate.Id);

            Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {mail};
            Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
            if (results[0].success) 
            {
                return true;
            }
        }
        return false;
        //return true;
    }

    /**
    * @description
    * Return selected EOI_Project_Enquiry__c Contact Name
    * @author Methods | 04-20-2021 
    * @param projectEnquiryId
    * @return String
    **/
    @AuraEnabled
    public static String getContactName(Id projectEnquiryId) {
        List<EOI_Project_Enquiry__c> currentProjectEnquiryList = [SELECT Id, Status__c, Contact__r.Name, Contact__r.id, Contact__r.Email FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId];
        EOI_Project_Enquiry__c currentProjectEnquiry = currentProjectEnquiryList.size() > 0 ? currentProjectEnquiryList[0] : null;
        if(currentProjectEnquiry != null) {
            return currentProjectEnquiry.Contact__r.Name;
        }
        return null;
    }

}