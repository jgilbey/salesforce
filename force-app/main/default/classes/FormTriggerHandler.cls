/**
 * @description       : Hadler class for form trigger. Add methods for each type of trigger event and hadler it with your logic
 * @author            : Methods
 * @group             : 
 * @last modified on  : 03-18-2021
 * @last modified by  : Methods
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   03-18-2021   Methods   Initial Version
**/
public class FormTriggerHandler{

    /**
    * @description 
    * Run method after insert event
    * @author Methods | 03-18-2021 
    * @param newFormMap 
    * @param oldFormMap 
    **/
    public void afterInsert(Map<Id,Forms__c> newFormMap, Map<Id,Forms__c> oldFormMap){
        nhmfFormValidationAfterInsert(newFormMap.values());
    }
    
    /**
    * @description 
    * Run method after update event
    * @author Methods | 03-18-2021 
    * @param mapOldforms 
    **/
    public void afterUpdate(Map<Id,Forms__c> mapOldforms){
        System.debug(mapOldforms);
        set<Id> setCaseIds=new Set<Id>();
        Id recordtypeId =Schema.sobjecttype.Forms__c.getRecordtypeInfosByName().get('BMA - Permission to start and Payment Request').getrecordTypeId();
        for(Forms__c form:(List<Forms__c>)Trigger.new){
            if(form.Mark_as_Paid__c && (mapOldforms == null || (form.Mark_as_Paid__c != mapOldforms.get(form.Id).Mark_as_Paid__c))){
                setCaseIds.add(form.Case__c);
            }
        }
        
        if(!setCaseIds.isEmpty()){
            list<Id> lstIds=new List<Id>();
            lstIds.addAll(setCaseIds);
            CaseTriggerHandler.parseObject(lstIds);
        }
    }

    /**
    * @description 
    * Prevent creation form if form is created with record type payment, completion or progress and permission to start is not created. 
    * Or if one of this form is creating and similar already exist and not completed.
    * @author Methods | 03-18-2021 
    * @param newFromList 
    **/
    static void nhmfFormValidationAfterInsert(List<Forms__c> newFromList){
        Set<Id> caseIdSet = new Set<Id>();
        for(Forms__c form_i : newFromList){
            caseIdSet.add(form_i.Case__c);
        }
        Set<Id> recodTypesSimilarSet = new Set<Id>{
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Completion_Report_and_Final_Payment_Request').getRecordTypeId(),
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Completion_report_and_payment_request_Acquisitions').getRecordTypeId(),
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Payment_Request_Form_Capital').getRecordTypeId(),
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Progress_Report_Form_Capital').getRecordTypeId(),
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Acquisitions').getRecordTypeId(),
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Capital').getRecordTypeId()
        
        };
        Set<Id> recodTypesWhichShouldStartedBefore = new Set<Id>{
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Acquisitions').getRecordTypeId(),
            Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('NHMF_Permission_to_Start_Capital').getRecordTypeId()
        };
        
        Map<Id, Set<Id>> caseIdWithOpenFormIdMap = new Map<Id, Set<Id>>();
        for(AggregateResult result_i : [SELECT count(Id), Case__c, RecordTypeId FROM Forms__c WHERE Form_Status__c != 'Complete' AND Case__c IN :caseIdSet AND RecordTypeId IN :recodTypesSimilarSet AND Id NOT IN: newFromList GROUP BY Case__c, RecordTypeId ]){
            Id caseId = (Id) result_i.get('Case__c');
            if(!caseIdWithOpenFormIdMap.containsKey(caseId)){
                caseIdWithOpenFormIdMap.put(caseId, new Set<Id>());
            }
            caseIdWithOpenFormIdMap.get(caseId).add((Id)result_i.get('RecordTypeId'));
        }
        Set<Id> caseIdWithStartedPermissionFormSet = new Set<Id>();
        for(AggregateResult result_i : [SELECT count(Id), Case__c FROM Forms__c WHERE Case__c IN :caseIdSet AND RecordTypeId IN :recodTypesWhichShouldStartedBefore GROUP BY Case__c]){
            caseIdWithStartedPermissionFormSet.add((Id) result_i.get('Case__c'));
        }

        for(Forms__c form_i : newFromList){
            if(recodTypesSimilarSet.contains(form_i.recordTypeId) && !caseIdWithStartedPermissionFormSet.contains(form_i.Case__c)){
                form_i.addError(Label.You_cannot_start_this_form_without_permission_start_form);
            }
            if(recodTypesSimilarSet.contains(form_i.recordTypeId) &&  caseIdWithOpenFormIdMap.containsKey(form_i.Case__c) && caseIdWithOpenFormIdMap.get(form_i.Case__c).contains(form_i.recordTypeId) ){
                form_i.addError(Label.You_cannot_start_this_form_until_finish_previous);
            }
        }
    }
}