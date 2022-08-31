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
public with sharing class CreateCaseComponentController {
    public static Set<String> statusesForNotify = new Set<String>{'Encouraged', 'Discouraged'};

    /**
    * @description
    * Check if case can be created
    * @author Methods | 01-04-2021 
    * @param projectEnquiryId
    * @return ResponseWrapper
    **/
    @AuraEnabled
    public static ResponseWrapper checkProjectEnquiryStatusAndCases(Id projectEnquiryId) {
        ResponseWrapper response = new ResponseWrapper();
        List<EOI_Project_Enquiry__c> currentProjectEnquiryList = [SELECT Id, Status__c FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId];
        EOI_Project_Enquiry__c currentProjectEnquiry = currentProjectEnquiryList.size() > 0 ? currentProjectEnquiryList[0] : null;
        if(currentProjectEnquiry != null && currentProjectEnquiry.Status__c != null && statusesForNotify.contains(currentProjectEnquiry.Status__c)) {
            response.encouraged = true;
            Id currentPEid = currentProjectEnquiry.id;
            List<Case> cases = [SELECT Id FROM Case WHERE EOI_Project_Enquiry__c = :currentPEid];
            if(cases.size() == 0) {
                response.casesDoNotExist = true;
            }
        }
        return response;
    }

    /**
    * @description
    * Create Case record for project Enquirue 
    * @author Methods | 01-04-2021 
    * @param projectEnquiryId
    * @return String
    **/
    @AuraEnabled
    public static String createCaseForPE(Id projectEnquiryId) {
        List<EOI_Project_Enquiry__c> currentProjectEnquiryList = [SELECT Id, Status__c, Contact__r.Name, Contact__r.id, Contact__r.Email, Project_Title__c, Project_Reference_Number__c, OwnerId FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId];
        EOI_Project_Enquiry__c currentProjectEnquiry = currentProjectEnquiryList.size() > 0 ? currentProjectEnquiryList[0] : null;
        if(currentProjectEnquiry != null) {
            Case caseToInsert = new Case(
                Status = 'New',
                ContactId = currentProjectEnquiry.Contact__r.id,
                EOI_Project_Enquiry__c = currentProjectEnquiry.id,
                Project_Title__c = currentProjectEnquiry.Project_Title__c,
                Project_Reference_Number__c = currentProjectEnquiry.Project_Reference_Number__c,
                RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Memorial').getRecordTypeId(),
                OwnerId = currentProjectEnquiry.OwnerId//[SELECT Id FROM Group WHERE DeveloperName = 'NHMF_Managers' LIMIT 1].Id
            );
            try{
                insert caseToInsert;
            }
            catch(Exception e) {
                system.debug('EX: ' + e.getMessage());
                if(e.getMessage().contains('OnCreate: Internal notifications')) {
                    return 'EOI / Project Enquiry must have Queue OwnerId' ;
                }
                return e.getMessage();
            }
            return 'true';
        }
        return 'false';
    }

        /**
    * @description
    * Save contact and account without sharing for 
    * @author Methods | 01-04-2021 
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
    
    /**
    * @description
    * send Email To Contact about case creation
    * @author Methods | 01-04-2021 
    * @param projectEnquiryId
    * @return String
    **/
    @AuraEnabled
    public static Boolean sendEmailToContact(Id projectEnquiryId) {
        List<EOI_Project_Enquiry__c> currentProjectEnquiryList = [SELECT Id, Status__c, Contact__r.Name, Contact__r.id, Contact__r.Email FROM EOI_Project_Enquiry__c WHERE Id = :projectEnquiryId];
        EOI_Project_Enquiry__c currentProjectEnquiry = currentProjectEnquiryList.size() > 0 ? currentProjectEnquiryList[0] : null;
        if(currentProjectEnquiry != null && currentProjectEnquiry.Contact__r.Email != null) {
            EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'PE Project created - notify applicant'];

            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            String[] toAddresses = new String[] {currentProjectEnquiry.Contact__r.Email};
            mail.setTargetObjectId(currentProjectEnquiry.Contact__r.id); 
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
    }

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
    public class ResponseWrapper {
        @AuraEnabled
        public Boolean encouraged;
        @AuraEnabled
        public Boolean casesDoNotExist;

        public ResponseWrapper() {
            this.encouraged = false;
            this.casesDoNotExist = false;
        }
    }
}