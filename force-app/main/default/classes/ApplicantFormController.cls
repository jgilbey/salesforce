/**
 * @description       : 
 * @author            : Methods
 * @group             : 
 * @last modified on  : 01-04-2021
 * @last modified by  : Methods
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   01-04-2021   Methods   Initial Version
**/
public with sharing class ApplicantFormController {

    static final Set<String> PROJECT_ENQUIRY_OPEN_STATUSES = new Set<String>{'New', 'Awaiting further information'};
    static final Set<String> PROJECT_CASE_OPEN_STATUSES = new Set<String>{'New', 'Awaiting Further Information'};
    static final Set<String> FORM_OPEN_STATUSES = new Set<String>{'New', 'Awaiting Further Information'};
    static final String PERMISSION_ACQUISITIONS_DEV_NAME = 'NHMF_Permission_to_Start_Acquisitions';
    static final String PERMISSION_CAPITAL_DEV_NAME = 'NHMF_Permission_to_Start_Capital';
    static final String REPORT_REQUEST_ACQUISITIONS_DEV_NAME = 'NHMF_Completion_report_and_payment_request_Acquisitions';
    static final Map<String, String> FORM_RECORDTYOE_DEV_NAME_TO_FORM_TYPE_MAP = new Map<String, String>{
        'NHMF_Completion_report_and_payment_request_Acquisitions' => 'CR',
        'NHMF_Completion_Report_and_Final_Payment_Request' => 'CR',
        'NHMF_Progress_Report_Form_Capital' => 'PR',
        'NHMF_Payment_Request_Form_Capital' => 'PRF',
        'NHMF_Permission_to_Start_Acquisitions' => 'MF',
        'NHMF_Permission_to_Start_Capital' => 'MF'
    };
    static final String CURRENT_PROJECT_RISK_DEV_NAME = 'Current';
    static final String FUTURE_PROJECT_RISK_DEV_NAME = 'Future';
    static final String ELECTRONIC_DOCUMENT_PROVISION = 'Electronic';

    
  private static final Map<String, String> FILE_NAMING_MAP {
    get {
      if (FILE_NAMING_MAP == null) {
        List<Community_Form_File_Naming__mdt> filesNamingMappingList = [
            SELECT Document_Question__c, Question_Alias__c
            FROM Community_Form_File_Naming__mdt
        ];

        FILE_NAMING_MAP = new Map<String, String>();
        for (Community_Form_File_Naming__mdt naming_i : filesNamingMappingList) {
            FILE_NAMING_MAP.put(naming_i.Document_Question__c, naming_i.Question_Alias__c);
        }
      }
      return FILE_NAMING_MAP;
    }
    set;
  }

    /**
    * @description
    * Create project enquiry record for current applicant and return id of this record 
    * @author Methods | 01-04-2021 
    * @return Id 
    **/
    @AuraEnabled
    public static Id createProjectEnquiry(){
        User currentUser = [SELECT Id, ContactId, AccountId FROM User WHERE Id = : USerInfo.getUserId()];
        EOI_Project_Enquiry__c newProjectEnquiry = new EOI_Project_Enquiry__c();
        newProjectEnquiry.Contact__c = currentUser.ContactId;
        newProjectEnquiry.Name_of_your_organisation__c = currentUser.AccountId;
        newProjectEnquiry.RecordTypeId = Schema.SObjectType.EOI_Project_Enquiry__c.getRecordTypeInfosByDeveloperName().get('EOI_NHMF').getRecordTypeId();
        newProjectEnquiry.OwnerId = [SELECT Id FROM Group WHERE DeveloperName = 'NHMF_Managers' LIMIT 1].Id;

        insert newProjectEnquiry;

        return newProjectEnquiry.Id;
    }

    /**
    * @description 
    * Obtain all content documents for specific record
    * @author Methods | 01-04-2021 
    * @param entityId 
    * @return List<ContentDocument> 
    **/
    @AuraEnabled
    public static List<ContentDocument> obtainDocumentList(Id entityId){
        List<ContentDocument> documentList = new List<ContentDocument>();
        for(ContentDocumentLink link_i : [SELECT    ContentDocument.Id, 
                                                    ContentDocument.FileType, 
                                                    ContentDocument.ContentSize, 
                                                    ContentDocument.Title FROM ContentDocumentLink WHERE LinkedEntityId = :entityId AND ContentDocument.CreatedById = :UserInfo.getUserId()]){
            documentList.add(link_i.ContentDocument);
        }

        return documentList;
    }

    /**
    * @description 
    * Obtain data for specific form: project equiry, application and etc. 
    * Based on record if we can know object type which is help to collect right data
    * @author Methods | 01-04-2021 
    * @param formId 
    * @return FormWrapper 
    **/
    @AuraEnabled
    public static FormWrapper obtainFormData(Id formId){
        User currentUser = [SELECT Id, ContactId FROM User WHERE Id = : USerInfo.getUserId()];
        
        if(formId.getSObjectType() == EOI_Project_Enquiry__c.sObjectType){
            return new ProjectEnquiryForm([ SELECT  Id, 
                                                    Project_Title__c,
                                                    Project_Reference_Number__c,
                                                    Non_Profit__c,
                                                    Type_of_profit_organization__c,
                                                    Where_did_you_hear_about_us__c,
                                                    Other_hear_from_us__c,
                                                    What_is_your_project__c,
                                                    About_Project_Focus__c,
                                                    Deadline_by_which_you_need_a_decision__c,
                                                    Deadline_details__c,
                                                    Importance_to_the_national_heritage__c,
                                                    Outstanding_interest__c,
                                                    Is_Heritage_item_or_property_at_risk__c,
                                                    Memorial_character__c,
                                                    How_much_project_will_likely_cost__c,
                                                    Likely_Requested_Amount__c,
                                                    How_will_you_provide_care_for_Heritage__c,
                                                    Financial_need__c,
                                                    Does_project_have_public_access__c,
                                                    Status__c,
                                                    Name_of_your_organisation__r.Organisation_Type__c
                                            FROM EOI_Project_Enquiry__c WHERE Id = :formId], obtainDocumentList(formId));
        }
        if(formId.getSObjectType() == Case.sObjectType){
            return new ApplicationCaseForm([ SELECT  Id, CaseNumber, Status,
                                             Project_Title__c, Project_Reference_Number__c, 
                                             EOI_Project_Enquiry__c , EOI_Project_Enquiry__r.Project_Title__c, 
                                             Project_Summery__c, Project_City__c, Project_County__c, 
                                             Project_Post_Code__c, Project_Street__c,
                                             Region__c, Account.BillingAddress, 
                                             Account.BillingStreet, Account.BillingCity, 
                                             Account.BillingState, Account.BillingPostalCode,
                                             Account.BillingCountry,
                                             Is_Project_organisation_address_same__c, 
                                             Project_Address__c,
                                             Delivered_by_partnership__c,
                                             Local_Authority__c,
                                             Constituency__c, Project_Country__c,
                                             Account.Organisation_s_Legal_Status__c,
                                             Account.Organisation_s_Legal_Status_part_1__c,
                                             Account.Organisation_s_Legal_Status_part_2__c,
                                             Account.Other_Legal_Status_Type__c,
                                             Account.Organization_size_and_staff_structure__c,
                                             Account.Number_Of_Board_members_or_Trustees__c,
                                             Account.Amount_spent_in_the_last_financial_year__c,
                                             Account.level_of_unrestricted_funds__c,
                                             Account.Company_Registration_Number__c,
                                             Account.Registered_Charity_Reg_no__c,
                                             Account.Charity_Recognised_Ref_no__c,
                                             Delivery_partner_details__c,
                                             Account.Are_you_VAT_registered__c,
                                             Account.VAT_number__c,
                                             Account.Organisation_s_Main_Purpose_Activities__c,

                                             Decision_deadline__c,
                                             Deadline_by_which_you_need_a_decision__c,
                                             Do_you_want_a_grant_to_buy_Property__c,
                                             Information_about_the_value_of_property__c,
                                             Capital_work_owner__c,
                                             Capital_work_by_Organization_details__c,
                                             Capital_work_by_Project_partner_details__c,
                                             Capital_work_ownership_will_assign__c,
                                             Any_legal_restriction_which_may_impact__c,
                                             Detail_of_legal_restriction__c,
                                             Survey_in_last_5_years__c,
                                             Landscape_Projects_Survey_Grid__c,
                                             Project_involved_acquisition__c,
                                             Heritage_Formal_designation__c,
                                             Grade_I_or_A_buildings__c,
                                             Grade_II_or_B_buildings__c,
                                             Grade_II_or_C_buildings__c,
                                             Local_List__c,
                                             Registered_Historic_ship_Certificate_no__c,
                                             Grade_II_listed_park_or_garden_Inventory__c,
                                             Name_of_physical_heritage__c,
                                             Does_project_involve_physical_heritage__c,

                                             Item_of_importance_to_national_heritage__c,
                                             Property_item_of_outstanding_interest__c,
                                             Property_Details__c,
                                             Details_for_risk_of_item_or_property__c,
                                             Does_your_property_have_Memorial_connect__c,
                                             Details_of_providing_care_for_property__c,
                                             Other_measures_to_raise_funds__c,
                                             Public_access_to__c,
                                             Fixed_milestone_for_project_timetable__c,
                                             Details_for_fixed_key_milestones__c,
                                             Managing_costs_after_funding_ends__c,
                                             Details_for_facing_risks_after_complete__c,                      

                                             People_responsible_for_work_NHMF__c,
                                             Details_for_risk_of_capital__c,
                                             Project_Start_Date__c,
                                             Project_End_Date__c,
                                             How_will_you_evaluate_your_project__c,
                                             Reason_for_not_make_3_public_available__c,
                                             Consent_for_application_form__c,
                                             Contact.Name,
                                             Contact.Title,
                                             Account.Name,
                                             Behalf_of_partnership__c,
                                             Registered_Park_inventory_number__c,
                                             Total_amount_cost__c,
                                             NHMF_Total_cash_contributions__c,
                                             NHMF_grant_request__c,

                                             (SELECT Cost_heading__c, Project_Cost_Description__c, Costs__c, Vat__c, Total_Cost__c FROM Project_costs__r WHERE Case__c =: formId),
                                             (SELECT Source_Of_Funding__c, Description_for_cash_contributions__c, Secured__c, Value__c, How_will_you_secure_cash_contributions__c, Partner_Name__c, Partner_Organization__c, Partner_Contact_Title__c FROM Project_Incomes__r WHERE Case__c =: formId),
                                             (SELECT Name, Impact__c, Likelihood__c, Mitigation__c, Who_will_lead_this__c, RecordTypeId, RecordType.DeveloperName FROM Project_Risks__r WHERE Case__c =: formId),
                                             (SELECT Name, Organisation__c, Position__c, Date__c FROM Project_Partners__r WHERE Case__c =: formId),
                                             (SELECT Name, Question__c, Provision_type__c FROM Project_Documents__r WHERE Case__c =: formId)
                                    FROM Case WHERE Id = :formId]);
        }
        if(formId.getSObjectType() == Forms__c.sObjectType){
            return new MonitoringForm([SELECT Project_Title__c, Project_ref__c, Status__c,
                                            Grant_Expiry_Date__c, Grant_Awarded__c, 
                                            NHMF_Funding_acknowledgement__c, NHMF_Grant_Award__c,
                                            Lesson_learned_details__c,
                                            Total_spent_cost__c,
                                            RecordTypeId, RecordType.DeveloperName,
                                            Attaching_Bank_Account_Details__c, Attaching_a_cost_breakdown__c,
                                            Agree_with_the_statements__c, Authorised_Person1_Name__c, 
                                            Authorised_Person2_Name__c, Authorised_Person3_Name__c, 
                                            Attaching_a_fund_raising_plan__c,
                                            Attaching_a_proposed_timetable__c, How_project_risks_being_managed__c,
                                            Attaching_details_of_project_management__c, NHMF_Total_Grant_Award__c,
                                            We_have_statutory_permissions_required__c, Payment_request__c,
                                            Likely_overall_completion_date__c, Further_info_on_statutory_permissions__c,
                                            Case__c, Case__r.Grant_Expiry_Date__c, Case__r.Total_amount_cost__c, Case__r.NHMF_Grant_Percentage__c, Case__r.NHMF_grant_request__c,
                                            Case__r.NHMF_Total_cash_contributions__c, Progress_report_number__c, Project_timetable__c,
                                            Partnership_funding_since_last_report__c, Have_you_purchased_goods__c, Purchased_goods_worth_10000_details__c,
                                            Reason_not_award_to_lowest_tender__c, Is_vendor_linked__c, Explain_why_vendor_appointed__c, Substantive_changes_to_agreed_budget__c,
                                            Permissions_or_licences_information__c,
                                            (SELECT Account_Name__c, Account_Number__c, Sort_Code__c , Building_Society_Roll_Numbe__c, Code_to_use_for_payment_making__c
                                                FROM Bank_Accounts__r),
                                            (SELECT Id, Cost_Heading__c, Invoice_Reference_Number__c, Invoice_Date__c, Cost_to_date__c,
                                            Name_of_supplier__c, Description__c, VAT__c, Total__c, We_are_attaching_proof_of_expenditure__c
                                                FROM Spending_Costs__r),
                                            (SELECT Id, Secured__c, Description_of_task__c, Amount_you_expect__c, Amount_you_have_received__c, Amount_still_to_come__c, Value__c,
                                                                    Source_Of_Funding__c, Date_you_expect_this_amount__c 
                                                FROM Project_Incomes__r )
                                        FROM Forms__c WHERE Id = :formId]);
        }
        return null;
    }

    /**
    * @description 
    * Obtain and prepare picklists data for Case field and its related objects fields
    * @author Methods | 01-25-2021 
    * @return Map<String, List<Object>>
    **/
    @AuraEnabled
    public static  Map<String, List<Object>> obtainProjectCaseOptions(){
        Map<String, List<Object>> data = new Map<String, List<Object>>();
        List<OptionWrapper> options = new List<OptionWrapper>();
        List<String> caseDirectFieldsList = new List<String>{'Capital_work_owner__c'};
        Map<String, List<String>> relatedObjectsFieldsMap = new Map<String, List<String>>{
            'Account' => new List<String>{'Organisation_s_Legal_Status_part_1__c', 'Organisation_s_Legal_Status_part_2__c'}, 
            'Project_Risk__c' => new List<String>{'Impact__c', 'Likelihood__c'},
            'Project_Document__c' => new List<String>{'Provision_type__c'}
        };

        for(String field_i: caseDirectFieldsList){
            data.put(field_i, takePicklistValue('Case', field_i));
        }

        for(String rel_obj_i: relatedObjectsFieldsMap.keySet()){
            for(String field_j: relatedObjectsFieldsMap.get(rel_obj_i)){
                data.put(rel_obj_i + '.' + field_j, takePicklistValue(rel_obj_i, field_j));
            }
        }
        return data;
    }

    /**
    * @description 
    * Retrieve picklists data for Case field and its related objects fields through schema 
    * @author Methods | 01-25-2021 
    * @return List<Object>
    **/
    private static List<Object> takePicklistValue(String sObjectName, String fieldName) {
        List<Object> picklistOptions = new List<Object>();
        try{
            for( Schema.PicklistEntry pickListData : Schema.getGlobalDescribe().get(sObjectName).getDescribe().fields.getMap().get(fieldName).getDescribe().getPicklistValues()) {
                    picklistOptions.add(new OptionWrapper ( 
                        pickListData.getLabel(),
                         pickListData.getValue()
                     ));
            }
        } catch(Exception ex) {
            String errorMessage = ex.getMessage() + ' in line: ' + ex.getLineNumber();
            System.debug(errorMessage);
        }
        return picklistOptions;
    } 

    /**
    * @description 
    * Retrieve NHMF Record Ids for Case and its related objects through schema
    * @author Methods | 01-25-2021 
    * @return Map<String, String>
    **/
    @AuraEnabled
    public static  Map<String, String> obtainNHMFRecordTypeIds(){
        Map<String, String> data = new Map<String, String>();
        Map<String, String> objectsRecordTypesMap = new Map<String, String>{
            'Case' => 'Memorial', 
            'Project_cost__c' => 'NHMF',
            'Project_Income__c' => 'NHMF'
        };

        for(String obj_i: objectsRecordTypesMap.keySet()){
            data.put(obj_i, Schema.getGlobalDescribe().get(obj_i).getDescribe().getRecordTypeInfosByDeveloperName().get(objectsRecordTypesMap.get(obj_i)).getRecordTypeId());
        }
        return data;
    }

    /**
    * @description 
    * Obtain list of all form available for applicant
    * Method is related to form table component which is using on community home page
    * @author Methods | 01-04-2021 
    * @return List<ProjectDataWrapper> 
    **/
    @AuraEnabled
    public static List<ProjectDataWrapper> obtainAllForms(){
        Map<String, ProjectDataWrapper> projectDataMap = new Map<String, ProjectDataWrapper>();
        List<EOI_Project_Enquiry__c> projectEnquiryList = [SELECT  Id, Name, Status__c, Project_Title__c, Project_Reference_Number__c FROM EOI_Project_Enquiry__c WHERE Status__c != 'Deleted']; 
        SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.READABLE, projectEnquiryList);
        for(EOI_Project_Enquiry__c currentEnquiry_i : projectEnquiryList) {
            projectDataMap.put(currentEnquiry_i.Id, new ProjectDataWrapper(currentEnquiry_i));                                        
        }
        System.debug('projectDataMap: ' + projectDataMap);
        List<Case> caseProjectList = [ SELECT Id, Status, CaseNumber, ParentId, EOI_Project_Enquiry__c FROM Case WHERE EOI_Project_Enquiry__c IN :projectDataMap.KeySet()]; 
        securityDecision = Security.stripInaccessible(AccessType.READABLE, caseProjectList);
        for(Case currentCase_i : caseProjectList) {
            projectDataMap.get(currentCase_i.EOI_Project_Enquiry__c).caseId = currentCase_i.Id;     
            projectDataMap.get(currentCase_i.EOI_Project_Enquiry__c).caseStatus = currentCase_i.Status;     
        }
        return projectDataMap.values();
    }


    /**
    * @description
    * Obtain all cases with forms for current user 
    * @author Methods | 01-04-2021 
    * @return List<MonitoringWrapper> 
    **/
    @AuraEnabled
    public static List<MonitoringWrapper> obtainMonitoringFormsData(){
        Map<Id, Case> caseDataMap = new Map<Id, Case>();
        Map<Id, List<Forms__c>> caseToFormsMap = new Map<Id, List<Forms__c>>();
        List<MonitoringWrapper> fullFormDataMap = new List<MonitoringWrapper>();
        List<Forms__c> formsList = [SELECT Project_Title__c, Project_ref__c, Status__c,
                                        Form_Status__c, RecordType.Name,
                                        RecordTypeId, RecordType.DeveloperName,
                                        Case__c, Case__r.Status, Case__r.CaseNumber,
                                        Case__r.Project_Reference_Number__c, Case__r.Project_Title__c,
                                        Case__r.Total_Cost__c, Case__r.OwnerId, Case__r.Grant_Expiry_Date__c
                                    FROM Forms__c WHERE Case__c != NULL AND Case__r.Application_Stages__c = 'Monitoring' AND Case__r.EOI_Project_Enquiry__r.Status__c != 'Deleted'];
        Security.stripInaccessible(AccessType.READABLE, formsList);
        if(!formsList.isEmpty()){
            for(Forms__c form_i: formsList){
                if(!caseToFormsMap.containsKey(form_i.Case__c)){
                    caseDataMap.put(form_i.Case__c, form_i.Case__r);
                    caseToFormsMap.put(form_i.Case__c, new List<Forms__c>{form_i});
                } else {
                    caseToFormsMap.get(form_i.Case__c).add(form_i);
                }
            }
            for(Id case_id: caseDataMap.keySet()){
                fullFormDataMap.add(new MonitoringWrapper(caseDataMap.get(case_id), caseToFormsMap.get(case_id)));
            }
        }

        return fullFormDataMap;
    }

    /**
    * @description 
    * Calculate all grant paid amount
    * @author Methods | 03-10-2021 
    * @param caseId
    * @return Decimal 
    **/
    @AuraEnabled
    public static Decimal obtainAllGrandTotalPaid(String caseId) {
        Decimal result = (Decimal) [SELECT SUM(Total_Grant_Award__c) total FROM Forms__c WHERE Case__c = :caseId].get(0).get('total');
        return result != null ? result : 0;
    }

    /**
    * @description 
    * Method is using for save progress of project enquiry or finish and set record is submitted. 
    * Also if object is empty then fill out all primary field on it.
    * @author Methods | 01-04-2021 
    * @param projectEnquiry 
    * @param isFinish 
    * @return EOI_Project_Enquiry__c 
    **/
    @AuraEnabled
    public static EOI_Project_Enquiry__c submitProjectEnquiry(EOI_Project_Enquiry__c projectEnquiry, Boolean isFinish){
        if(isFinish) projectEnquiry.Status__c = 'Submitted';
        if(projectEnquiry.Id == null){
            User currentUser = [SELECT Id, ContactId, AccountId FROM User WHERE Id = : USerInfo.getUserId()];
            projectEnquiry.Contact__c = currentUser.ContactId;
            projectEnquiry.Name_of_your_organisation__c = currentUser.AccountId;
            projectEnquiry.RecordTypeId = Schema.SObjectType.EOI_Project_Enquiry__c.getRecordTypeInfosByDeveloperName().get('EOI_NHMF').getRecordTypeId();
            projectEnquiry.OwnerId = [SELECT Id FROM Group WHERE DeveloperName = 'NHMF_Managers' LIMIT 1].Id;
        }
        upsert projectEnquiry;

        return projectEnquiry;
    }

    /**
    * @description 
    * Remove porject Enquiry 
    * @author Methods | 01-22-2021 
    * @param porjectEnquiryId
    * @return Boolean 
    **/
    @AuraEnabled
    public static ResponseWrapper removeProjectEnquiry(String porjectEnquiryId) {
        ResponseWrapper response = new ResponseWrapper();
        try{
            if(Id.valueOf(porjectEnquiryId).getSObjectType().getDescribe().getName() == 'EOI_Project_Enquiry__c') {
                List<EOI_Project_Enquiry__c> projectEnquiryList = [SELECT ID FROM EOI_Project_Enquiry__c WHERE Id = :porjectEnquiryId AND Status__c = 'New' ];//new List<EOI_Project_Enquiry__c>{new EOI_Project_Enquiry__c(Id = porjectEnquiryId, Status__c = '')}; 
                SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.UPDATABLE, projectEnquiryList);
                if(projectEnquiryList.size() > 0) {
                    projectEnquiryList.get(0).Status__c = 'Deleted';
                    update projectEnquiryList;
                    response.success = true;
                } else {
                    response.message = 'You don\'t have permission to remove this Project Enquiry__c';
                }
            }
        } catch(Exception ex) {
            response.message = 'Error: ' + ex.getMessage() + ' on line: ' +ex.getLineNumber();
        }
        return response;
    }

    /**
    * @description 
    * Method is using for save progress of application form (project Case) as well as update related Objects changes
    * Also if object is empty then fill out primary field on it.
    * @author Methods | 01-22-2021 
    * @param applicationRequestDataJSON 
    * @param isFinish  
    * @return Case 
    **/
    @AuraEnabled
    public static Case submitApplicationForm(ApplicationRequestDataWrapper applicationRequestData , Boolean isFinish){      
        if(isFinish) applicationRequestData.projectCase.Status = 'Submitted';                         
        if(applicationRequestData.projectCase.Id == null){
            User currentUser = [SELECT Id, ContactId, AccountId FROM User WHERE Id = : UserInfo.getUserId()];
            applicationRequestData.projectCase.ContactId = currentUser.ContactId;
            applicationRequestData.projectCase.Organisation__c = currentUser.AccountId;
        }
        if(applicationRequestData.projectCase.Is_Project_organisation_address_same__c){
            applicationRequestData.projectCase.Project_Street__c = applicationRequestData.projectCase.Account.BillingStreet;
            applicationRequestData.projectCase.Project_City__c = applicationRequestData.projectCase.Account.BillingCity;
            applicationRequestData.projectCase.Project_County__c = applicationRequestData.projectCase.Account.BillingState;
            applicationRequestData.projectCase.Project_Post_Code__c = applicationRequestData.projectCase.Account.BillingPostalCode;
        }
        EOI_Project_Enquiry__c relatedProjectEnquiry = new EOI_Project_Enquiry__c(  Id = applicationRequestData.projectCase.EOI_Project_Enquiry__c, 
                                                                                    Project_Title__c = applicationRequestData.projectCase.Project_Title__c
                                                                                );
        upsert new List<sObject>{applicationRequestData.projectCase, applicationRequestData.projectCase.Account, applicationRequestData.projectCase.Contact, relatedProjectEnquiry};

        Map<String, Object> dataMap = new Map<String, Object>();
        List<sObject> relatedObjectForUpsert = new List<sObject>();
        List<sObject> relatedObjectForDelete = new List<sObject>();
        Set<Id> actualCostsIdsSet = new Set<Id>();
        Set<Id> actualIncomesIdsSet = new Set<Id>();
        Set<Id> actualPartnersIdsSet = new Set<Id>();
        Set<Id> actualRisksIdsSet = new Set<Id>();

        if(!applicationRequestData.projectCosts.isEmpty()){
            for(Object cost_obj_i: applicationRequestData.projectCosts){
                dataMap = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(cost_obj_i));
                Project_cost__c cost_i = new Project_cost__c();
                if(dataMap.containsKey('Id')){
                    cost_i.Id = String.valueOf(dataMap.get('Id'));
                    actualCostsIdsSet.add(cost_i.Id);
                } else {
                    cost_i.Case__c = applicationRequestData.projectCase.Id;
                }

                cost_i.Cost_heading__c = dataMap.containsKey('Cost_heading__c')? String.valueOf(dataMap.get('Cost_heading__c')): null;
                cost_i.Project_Cost_Description__c = dataMap.containsKey('Project_Cost_Description__c')? String.valueOf(dataMap.get('Project_Cost_Description__c')): null;
                cost_i.Costs__c = dataMap.containsKey('Costs__c')? Decimal.valueOf(String.valueOf(dataMap.get('Costs__c'))): null;
                cost_i.Vat__c = dataMap.containsKey('Vat__c')? Decimal.valueOf(String.valueOf(dataMap.get('Vat__c'))): null;
                relatedObjectForUpsert.add(cost_i);
            }
        }

        if(!applicationRequestData.initialProjectCostIds.isEmpty()){
            for(Id costId: applicationRequestData.initialProjectCostIds){
               if(!actualCostsIdsSet.contains(costId)){
                    Project_cost__c costForDelete = new Project_cost__c(Id=costId);
                    relatedObjectForDelete.add(costForDelete);
               }
            }
        } 

        if(!applicationRequestData.projectIncomes.isEmpty()){
            for(Object income_obj_i: applicationRequestData.projectIncomes){
                dataMap = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(income_obj_i));
                Project_Income__c income_i = new Project_Income__c();
                if(dataMap.containsKey('Id')){
                    income_i.Id = String.valueOf(dataMap.get('Id'));
                    actualIncomesIdsSet.add(income_i.Id);
                } else {
                    income_i.Case__c = applicationRequestData.projectCase.Id;
                }

                income_i.Source_Of_Funding__c = dataMap.containsKey('Source_Of_Funding__c')? String.valueOf(dataMap.get('Source_Of_Funding__c')): null;
                income_i.Description_for_cash_contributions__c = dataMap.containsKey('Description_for_cash_contributions__c')? String.valueOf(dataMap.get('Description_for_cash_contributions__c')): null;
                income_i.Secured__c = dataMap.containsKey('Secured__c')? Boolean.valueOf(String.valueOf(dataMap.get('Secured__c'))): false;
                income_i.How_will_you_secure_cash_contributions__c = dataMap.containsKey('How_will_you_secure_cash_contributions__c')? String.valueOf(dataMap.get('How_will_you_secure_cash_contributions__c')): null;
                income_i.Value__c = dataMap.containsKey('Value__c')? Decimal.valueOf(String.valueOf(dataMap.get('Value__c'))): null;
                relatedObjectForUpsert.add(income_i);
            }
        }

        if(!applicationRequestData.initialProjectIncomeIds.isEmpty()){
            for(Id incomeId: applicationRequestData.initialProjectIncomeIds){
               if(!actualIncomesIdsSet.contains(incomeId)){
                    Project_Income__c incomeForDelete = new Project_Income__c(Id=incomeId);
                    relatedObjectForDelete.add(incomeForDelete);
               }
            }
        } 

        if(!applicationRequestData.projectPartners.isEmpty()){
            for(Object partner_obj_i: applicationRequestData.projectPartners){
                dataMap = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(partner_obj_i));
                Project_Partner__c partner_i = new Project_Partner__c();
                if(dataMap.containsKey('Id')){
                    partner_i.Id = String.valueOf(dataMap.get('Id'));
                    actualPartnersIdsSet.add(partner_i.Id);
                } else {
                    partner_i.Case__c = applicationRequestData.projectCase.Id;
                }

                partner_i.Name = dataMap.containsKey('Name')? String.valueOf(dataMap.get('Name')): null;
                partner_i.Organisation__c = dataMap.containsKey('Organisation__c')? String.valueOf(dataMap.get('Organisation__c')): null;
                partner_i.Position__c = dataMap.containsKey('Position__c')? String.valueOf(dataMap.get('Position__c')): null;
                partner_i.Date__c = dataMap.containsKey('Date__c')? Date.valueOf(String.valueOf(dataMap.get('Date__c'))): null;
                relatedObjectForUpsert.add(partner_i);
            }
        }

        if(!applicationRequestData.initialPartnerIds.isEmpty()){
            for(Id partnerId: applicationRequestData.initialPartnerIds){
               if(!actualPartnersIdsSet.contains(partnerId)){
                    Project_Partner__c partnerForDelete = new Project_Partner__c(Id=partnerId);
                    relatedObjectForDelete.add(partnerForDelete);
               }
            }
        } 

        if(!applicationRequestData.currentProjectRisks.isEmpty()){
            for(Object risk_obj_i: applicationRequestData.currentProjectRisks){
                dataMap = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(risk_obj_i));
                Project_Risk__c risk_i = new Project_Risk__c();
                if(dataMap.containsKey('Id')){
                    risk_i.Id = String.valueOf(dataMap.get('Id'));
                    actualRisksIdsSet.add(risk_i.Id);
                } else {
                    risk_i.Case__c = applicationRequestData.projectCase.Id;
                }

                risk_i.Name = dataMap.containsKey('Name')? String.valueOf(dataMap.get('Name')): '';
                risk_i.Impact__c = dataMap.containsKey('Impact__c')? String.valueOf(dataMap.get('Impact__c')): null;
                risk_i.Likelihood__c = dataMap.containsKey('Likelihood__c')? String.valueOf(dataMap.get('Likelihood__c')): null;
                risk_i.Mitigation__c = dataMap.containsKey('Mitigation__c')? String.valueOf(dataMap.get('Mitigation__c')): null;
                risk_i.Who_will_lead_this__c = dataMap.containsKey('Who_will_lead_this__c')? String.valueOf(dataMap.get('Who_will_lead_this__c')): null;
                
                if(risk_i.Name!=''||risk_i.Impact__c!=null||risk_i.Likelihood__c!=null||risk_i.Mitigation__c!=null||risk_i.Who_will_lead_this__c!=null) {
                    risk_i.RecordTypeId = Schema.SObjectType.Project_Risk__c.getRecordTypeInfosByDeveloperName().get(CURRENT_PROJECT_RISK_DEV_NAME).getRecordTypeId();
                    relatedObjectForUpsert.add(risk_i);
                }

            }
        }

        if(!applicationRequestData.futureProjectRisks.isEmpty()){
            for(Object risk_obj_i: applicationRequestData.futureProjectRisks){
                dataMap = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(risk_obj_i));
                Project_Risk__c risk_i = new Project_Risk__c();
                if(dataMap.containsKey('Id')){
                    risk_i.Id = String.valueOf(dataMap.get('Id'));
                    actualRisksIdsSet.add(risk_i.Id);
                } else {
                    risk_i.Case__c =applicationRequestData.projectCase.Id;
                }

                risk_i.Name = dataMap.containsKey('Name')? String.valueOf(dataMap.get('Name')): '';
                risk_i.Impact__c = dataMap.containsKey('Impact__c')? String.valueOf(dataMap.get('Impact__c')): null;
                risk_i.Likelihood__c = dataMap.containsKey('Likelihood__c')? String.valueOf(dataMap.get('Likelihood__c')): null;
                risk_i.Mitigation__c = dataMap.containsKey('Mitigation__c')? String.valueOf(dataMap.get('Mitigation__c')): null;
                risk_i.Who_will_lead_this__c = dataMap.containsKey('Who_will_lead_this__c')? String.valueOf(dataMap.get('Who_will_lead_this__c')): null;
                
                if(risk_i.Name!=''||risk_i.Impact__c!=null||risk_i.Likelihood__c!=null||risk_i.Mitigation__c!=null||risk_i.Who_will_lead_this__c!=null) {
                    risk_i.RecordTypeId = Schema.SObjectType.Project_Risk__c.getRecordTypeInfosByDeveloperName().get(FUTURE_PROJECT_RISK_DEV_NAME).getRecordTypeId();
                    relatedObjectForUpsert.add(risk_i);
                }
            }
        } 
        if(!applicationRequestData.initialRiskIds.isEmpty()){
            for(Id riskId: applicationRequestData.initialRiskIds){
               if(!actualRisksIdsSet.contains(riskId)){
                    Project_Risk__c riskForDelete = new Project_Risk__c(Id=riskId);
                    relatedObjectForDelete.add(riskForDelete);
               }
            }
        } 

        if(!applicationRequestData.documentsData.isEmpty()){
            for(Object doc_i: applicationRequestData.documentsData){
                dataMap = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(doc_i));
                Project_Document__c document = new Project_Document__c();
                if(dataMap.containsKey('documentId')){
                    document.Id = String.valueOf(dataMap.get('documentId'));
                } else {
                    document.Case__c = applicationRequestData.projectCase.Id;
                }

                document.Question__c = dataMap.containsKey('documentQuestion')? String.valueOf(dataMap.get('documentQuestion')): null;
                document.Provision_type__c = dataMap.containsKey('provisionType')? String.valueOf(dataMap.get('provisionType')): null;
                List<Object> docsFilesList = dataMap.containsKey('documentFiles')? (List<Object>)JSON.deserializeUntyped(JSON.serialize(dataMap.get('documentFiles'))): new List<Object>();

                if(document.Provision_type__c!=ELECTRONIC_DOCUMENT_PROVISION&&docsFilesList.size()>0){
                    for(Object file_i: docsFilesList){
                        Map<String, Object> fileMap = (Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(file_i));
                        ContentDocument docFile = new ContentDocument();
                        if(fileMap.containsKey('Id')){
                            docFile.Id = String.valueOf(fileMap.get('Id'));
                            relatedObjectForDelete.add(docFile);
                        }
                    }
                }
                relatedObjectForUpsert.add(document);
            }
        } 

        if(relatedObjectForUpsert.size()>0){
            upsert relatedObjectForUpsert;
        }

        if(relatedObjectForDelete.size()>0){
            delete relatedObjectForDelete;
        }

        return applicationRequestData.projectCase;
    }

    /**
    * @description
    * Change document title: adding date (dd_MM_yy_hh_mm), counter and some prefix if needed
    * @author Methods | 01-04-2021 
    * @param uploadedFilesIdsList
    * @param question
    **/
    @AuraEnabled
    public static void updateFileTitlesOnApplicationForm(List<String> uploadedFilesIdsList, String question){
        List<ContentDocument> filesForUpdate = [SELECT Id, Title FROM ContentDocument WHERE Id IN: uploadedFilesIdsList];
        Integer counter = 0;
        for(ContentDocument doc_i: filesForUpdate){
            Datetime tempTime = Datetime.now();
            if(FILE_NAMING_MAP.containsKey(question)){
                doc_i.Title = FILE_NAMING_MAP.get(question) + '_' + doc_i.Title + '_' + Datetime.now().format('dd_MM_yy_hh_mm') + '_' + counter ;
            } else {
                doc_i.Title = doc_i.Title  + Datetime.now().format('dd_MM_yy_hh_mm')  + '_' + counter;
            }
            counter++;
        }
        update filesForUpdate;
    }

    /**
    * @description
    * Saving permission form data and related objects
    * @author Methods | 01-04-2021 
    * @param formToUpdateJSON
    * @param bankAccountsDataJSON
    * @param ApprovedPurposesJSON
    * @param projectIncomeJSON
    * @param contactJSON
    * @param organisatinJSON
    * @return Map<String, Object> inserted permision form data and related objects
    **/
    @AuraEnabled
    public static Map<String, Object> updatePermissionFormData(String formToUpdateJSON,  String bankAccountsDataJSON, String ApprovedPurposesJSON, String projectIncomeJSON, String contactJSON, String organisatinJSON){
        Map<String, Object>  result = new Map<String, Object>();
        result.put('form', updatesObject(formToUpdateJSON, 'Forms__c', false));
        result.put('bankAccount', updatesObject(bankAccountsDataJSON, 'Bank_Account__c', false));
        result.put('approvedPurposes', updatesObject(ApprovedPurposesJSON, 'List<Approved__c>', true));
        result.put('projectIncome', updatesObject(projectIncomeJSON, 'List<Project_Income__c>', true));
        result.put('contact', updatesObject(contactJSON, 'Contact', false));
        result.put('organisation', updatesObject(organisatinJSON, 'Account', false));
        return result;
    }
    
    /**
    * @description
    * Saving Completion form data and related objects
    * @author Methods | 01-04-2021 
    * @param Map<String, Map<String, String>> request
    * @return Map<String, Object> 
    **/
    @AuraEnabled
    public static Map<String, Object> updateCompletionReportFormData(Map<String, Map<String, String>> request){
        System.debug(request);
        Map<String, Object>  result = new Map<String, Object>();
        for(String returnObject_i : request.keySet()){
            for(String objectType_i : request.get(returnObject_i).keySet()){
               	result.put(returnObject_i, updatesObject(request.get(returnObject_i).get(objectType_i), objectType_i, objectType_i.startsWithIgnoreCase('list')? true: false)); 
            }
            
        }
        return result;
    }

    /**
    * @description
    * Allow saving any sObject record or sObject List records
    * @author Methods | 01-04-2021 
    * @param sObjectDataJSON
    * @param objectName
    * @param isList
    * @return Object 
    **/
    static Object updatesObject(String sObjectDataJSON, String objectName, Boolean isList) {
        Object objectToUpdate;
        if(String.isNotBlank(sObjectDataJSON)){
            if(isList) {
                List<sObject> sObjectRecordList;
                objectToUpdate = sObjectRecordList = (List<sObject>) JSON.deserialize(sObjectDataJSON, List<sObject>.Class);//Type.forName(objectName)
                upsert sObjectRecordList;
            } else {
                sObject sObjectRecord;
                objectToUpdate = sObjectRecord = (sObject) JSON.deserialize(sObjectDataJSON, sObject.Class);//Type.forName(objectName)
                upsert sObjectRecord;
            }
        }
        return objectToUpdate;
    }

    /**
    * @description
    * update existed form record
    * @author Methods | 01-04-2021 
    * @param formToUpdate
    * @return Forms__c 
    **/
    @AuraEnabled
    public static Forms__c updateFormRecord(Forms__c formToUpdate){
        update formToUpdate;
        return formToUpdate;
    }

    /**
    * @description 
    * Create or update spending Costs records (List)
    * @author Methods | 03-10-2021 
    * @param spendingCostsListJSON 
    * @return Object list of spending costs records
    **/
    @AuraEnabled
    public static Object upsertListRecords(String recordListJSON){
        System.debug('recordListJSON: ' + recordListJSON);
        List<sObject> sObjectRecordList = (List<sObject>) JSON.deserialize(recordListJSON, List<sObject>.Class);
        upsert sObjectRecordList;
        System.debug('recordListJSON: ' + recordListJSON);
        return sObjectRecordList;
    }

    /**
    * @description 
    * Calculate all grant paid amount
    * @author Methods | 03-10-2021 
    * @param caseId
    * @return Decimal 
    **/
    @AuraEnabled
    public static void deleteSpendingCostRecords(List<String> sObjectIdList) {
        List<Spending_Costs__c> spendingCostToRemoveList = new List<Spending_Costs__c>();
        for(String currentCostId : sObjectIdList) {
            spendingCostToRemoveList.add(new Spending_Costs__c(Id = currentCostId));
        }
        if (!spendingCostToRemoveList.isEmpty()) {
            delete spendingCostToRemoveList;
        }
    }

    /**
    * @description 
    * add to document title prefix 
    * @author Methods | 03-12-2021 
    * @param prefix String
    * @param documentIdList List<String> of ContentDocument Id
    **/
    @AuraEnabled
    public static List<ContentDocument> updateDocumentTitleWithPrefix(String prefix, List<String> documentIdList) {
        List<ContentDocument> documentToUpdateList = [SELECT Id, Title FROM ContentDocument WHERE Id IN :documentIdList];
        for(ContentDocument curentContentDocuemtn : documentToUpdateList) {
            curentContentDocuemtn.Title = prefix + '_' + curentContentDocuemtn.Title;
        }
        if(!documentToUpdateList.isEmpty()) {
            update documentToUpdateList; 
        }
        return documentToUpdateList;
    }

    /**
    * @description
    * Generate link for file download on permission forms from portal
    * @author Methods | 01-04-2021 
    * @param formId
    * @param formType
    * @return String 
    **/
    @AuraEnabled
    public static string generateDocumentUrl(String formId, String formType) {
        Webmerge_mapping_settings__c mappingSettings = Webmerge_mapping_settings__c.getOrgDefaults();
        String mappingId;// = 'a0N8E0000088qkRUAQ';
        if(formType == 'PermissionFormCapital') {
            mappingId = mappingSettings.Permission_Form_Capital_mapping__c;
        }
        if(formType == 'PermissionFormAcquisition') {
            mappingId = mappingSettings.Permission_Form_Acquisitions_mapping_Id__c;
        }
        return webm.WebmergeGenerator.generateDocumentGetUrl(mappingId, formId, 'Forms__c'); 
    }

    public abstract class FormWrapper{
        @AuraEnabled
        public String formType;
        @AuraEnabled
        public Boolean isBlocked;
    }

    public class ProjectEnquiryForm extends FormWrapper{
        @AuraEnabled
        public EOI_Project_Enquiry__c projectEnquiry;
        @AuraEnabled
        public List<ContentDocument> documentList;
        public ProjectEnquiryForm(){
            this.formType = 'PE';
            this.documentList = new List<ContentDocument>();
        }
        public ProjectEnquiryForm(EOI_Project_Enquiry__c projectEnquiry, List<ContentDocument> documentList){
            this();
            this.documentList = documentList;
            this.projectEnquiry = projectEnquiry;
            this.isBlocked = !PROJECT_ENQUIRY_OPEN_STATUSES.contains(projectEnquiry.Status__c);// projectEnquiry.Status__c == null || projectEnquiry.Status__c != 'New' ? true : false;
        }

    }

    
    public class ApplicationCaseForm extends FormWrapper{
        @AuraEnabled
        public Case projectCase;
        @AuraEnabled
        public List<Project_cost__c> projectCosts;
        @AuraEnabled
        public List<Project_Income__c> projectIncomes;
        @AuraEnabled
        public List<Project_Partner__c> projectPartners;
        @AuraEnabled
        public List<Project_Risk__c> currentProjectRisks;
        @AuraEnabled
        public List<Project_Risk__c> futureProjectRisks;
        @AuraEnabled
        public List<ProjectDocumentWrapper> projectDocuments;
        public ApplicationCaseForm(){
            this.formType = 'AC';
            this.projectDocuments = new List<ProjectDocumentWrapper>();
            this.projectCosts = new List<Project_cost__c>();
            this.projectIncomes = new List<Project_Income__c>();
            this.projectPartners = new List<Project_Partner__c>();
            this.currentProjectRisks = new List<Project_Risk__c>();
            this.futureProjectRisks = new List<Project_Risk__c>();
        }
        public ApplicationCaseForm(Case projectCase){
            this();
            this.projectCase = projectCase;
            this.projectCosts = projectCase.Project_costs__r;
            this.projectIncomes = projectCase.Project_Incomes__r;
            this.projectPartners = projectCase.Project_Partners__r;
            this.isBlocked = !PROJECT_CASE_OPEN_STATUSES.contains(projectCase.Status);
            if(!projectCase.Project_Risks__r.isEmpty()){
                for(Project_Risk__c risk_i: projectCase.Project_Risks__r){
                    if(risk_i.RecordType.DeveloperName==CURRENT_PROJECT_RISK_DEV_NAME){
                        currentProjectRisks.add(risk_i);
                    } else if(risk_i.RecordType.DeveloperName==FUTURE_PROJECT_RISK_DEV_NAME){
                        futureProjectRisks.add(risk_i);
                    }
                }
            }
            if(!projectCase.Project_Documents__r.isEmpty()){
                Set<Id> docIdsSet = new Set<Id>();
                for(Project_Document__c doc_i: projectCase.Project_Documents__r){
                    docIdsSet.add(doc_i.Id);
                }
                Map<Id,List<ContentDocument>> documentIdToContentList = new Map<Id,List<ContentDocument>>();
                for(ContentDocumentLink link_i : [SELECT    ContentDocument.Id, 
                                                            ContentDocument.FileType, 
                                                            ContentDocument.ContentSize, 
                                                            LinkedEntityId,
                                                            ContentDocument.Title FROM ContentDocumentLink WHERE LinkedEntityId IN :docIdsSet ]){
                    if(documentIdToContentList.containsKey(link_i.LinkedEntityId)){
                        documentIdToContentList.get(link_i.LinkedEntityId).add(link_i.ContentDocument);
                    } else {
                        documentIdToContentList.put(link_i.LinkedEntityId, new List<ContentDocument>{link_i.ContentDocument});
                    }                                                                                
                }

                for(Project_Document__c doc_i: projectCase.Project_Documents__r){
                    this.projectDocuments.add(new ProjectDocumentWrapper(doc_i.Id, doc_i.Question__c, doc_i.Provision_type__c,
                    (doc_i.Provision_type__c==ELECTRONIC_DOCUMENT_PROVISION), (documentIdToContentList.containsKey(doc_i.Id)? documentIdToContentList.get(doc_i.Id): new List<ContentDocument>())));
                }
            }
        }

    }

    public class MonitoringForm extends FormWrapper{
        @AuraEnabled
        public Map<String, Object> formData;
        
        public MonitoringForm(){
            this.formType = 'MF';
            this.formData = new Map<String, Object>();
        }
        public MonitoringForm(Forms__c formObject){
            this();
            this.isBlocked = !FORM_OPEN_STATUSES.contains(formObject.Status__c);
            Set<String> picklistOptions = new Set<String>();
            List<Approved__c > approvedPurposeList = new List<Approved__c >();
            List<Project_Income__c > projectIncomes = new List<Project_Income__c >();
            if(formObject.RecordTypeId!=null && FORM_RECORDTYOE_DEV_NAME_TO_FORM_TYPE_MAP.containsKey(formObject.RecordType.DeveloperName)/*  == REPORT_REQUEST_ACQUISITIONS_DEV_NAME */){
                this.formType = FORM_RECORDTYOE_DEV_NAME_TO_FORM_TYPE_MAP.get(formObject.RecordType.DeveloperName);//'CR';
                List<Project_cost__c> caseCostsList = [SELECT Cost_heading__c, Costs__c FROM Project_cost__c WHERE Case__c =: formObject.Case__c];
                if(!caseCostsList.isEmpty()){
                    for(Project_cost__c cost_i: caseCostsList){
                        picklistOptions.add(cost_i.Cost_heading__c);
                    }
                }

                approvedPurposeList = [SELECT Id, Name, Final_summery_of_achievements__c, Approved_Purposes__c FROM Approved__c  WHERE Project__c =: formObject.Case__c];
                projectIncomes = [ SELECT  Id, Secured__c, Description_for_cash_contributions__c, Description_of_task__c, 
                                    Amount_you_expect__c, Amount_you_have_received__c, Amount_still_to_come__c, Value__c,
                                    Source_Of_Funding__c, Date_you_expect_this_amount__c, Amount_secured__c, attaching_proof_of_partnership_funding__c 
                                    FROM Project_Income__c WHERE Case__c =: formObject.Case__c];
            }
            List<ContentDocument> documentList = new List<ContentDocument>();
            User userData = [SELECT ContactId, Contact.Name, Contact.Title, Contact.AccountId, Contact.Account.Name FROM User WHERE Id = :UserInfo.getUserId()];
            /* for(ContentDocumentLink link_i : [SELECT    ContentDocument.Id, 
                                                        ContentDocument.FileType, 
                                                        ContentDocument.ContentSize, 
                                                        ContentDocument.Title FROM ContentDocumentLink WHERE LinkedEntityId =: formObject.Case__c  AND ContentDocument.CreatedById = :UserInfo.getUserId()]){
                documentList.add(link_i.ContentDocument);
            } */
            Decimal allPaiment = (Decimal) [SELECT SUM(Total__c) totalPaid FROM Spending_Costs__c WHERE Forms__c != :formObject.Id AND  Forms__r.Case__c = :formObject.Case__c].get(0).get('totalPaid');
            this.formData = new Map<String, Object>{
                'formObject' => formObject,
                'costsHeaders' => new List<String>(picklistOptions),
                'userData' => userData,
                'docsData' => obtainDocumentList(formObject.Case__c),
                'formDocuments' => obtainDocumentList(formObject.Id),
                'approvedPurposeList' => approvedPurposeList,
                'projectIncomes'=>projectIncomes,
                'alreadyPayed'=> allPaiment != null ? allPaiment : 0,
                'projectIncomePicklist' => takePicklistValue('Project_Income__c', 'Source_Of_Funding__c')
            };
        }
    }

    public class MonitoringWrapper{
        @AuraEnabled
        public Case caseObject;
        @AuraEnabled
        public List<Forms__c> formsList;
        
        public MonitoringWrapper(Case caseObject, List<Forms__c> formsList){
            this.caseObject = caseObject;
            this.formsList = formsList;
        }
    }

    public class ProjectDataWrapper{
        @AuraEnabled
        public String Id;
        @AuraEnabled
        public String Name;
        @AuraEnabled
        public String projectNumber;
        @AuraEnabled
        public String Status;
        @AuraEnabled
        public Boolean noContinued;
        @AuraEnabled
        public String caseId;
        @AuraEnabled
        public String caseStatus;
        
        public projectDataWrapper(String Id, String Name, String projectNumber, String Status, Boolean isContinued){
            this.Id = Id;
            this.Name = Name;
            this.Status = Status;
            this.noContinued = isContinued;
            this.projectNumber = projectNumber;
        }   

        public projectDataWrapper(EOI_Project_Enquiry__c projectEnquiry){
            this.Id = projectEnquiry.Id;
            this.projectNumber = projectEnquiry.Project_Reference_Number__c;
            this.Status = projectEnquiry.Status__c;
            this.Name = projectEnquiry.Project_Title__c;
            this.noContinued = !PROJECT_ENQUIRY_OPEN_STATUSES.contains(projectEnquiry.Status__c);
        }   
        public projectDataWrapper(Case caseData){
            this.Id = caseData.Id;
            this.projectNumber = caseData.CaseNumber;
            this.Status = caseData.Status;
            this.noContinued = !PROJECT_CASE_OPEN_STATUSES.contains(this.Status);
        }   

    }

    public class OptionWrapper{
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String value;

        public OptionWrapper(){}

        public OptionWrapper(String label, String value){
            this.label = label;
            this.value = value;
        }        
    }

    public class ProjectDocumentWrapper{
        @AuraEnabled
        public String documentId;
        @AuraEnabled
        public String documentQuestion;
        @AuraEnabled
        public String provisionType;
        @AuraEnabled
        public Boolean isElectronic = false;
        @AuraEnabled
        public List<ContentDocument> documentFiles;

        public ProjectDocumentWrapper(String documentId, String documentQuestion, String provisionType){
            this.documentId = documentId;
            this.documentQuestion = documentQuestion;
            this.provisionType = provisionType;
            this.isElectronic = false;
        }

        public ProjectDocumentWrapper(String documentId, String documentQuestion, String provisionType, Boolean isElectronic, List<ContentDocument> documentFiles){
            this.documentId = documentId;
            this.documentQuestion = documentQuestion;
            this.provisionType = provisionType;
            this.isElectronic = isElectronic;
            this.documentFiles = documentFiles;
        }
    }

    public class ApplicationRequestDataWrapper{
        @AuraEnabled
        public Case projectCase {get;set;}
        @AuraEnabled
        public  List<Object> projectCosts {get;set;}
        @AuraEnabled
        public  List<Object> projectIncomes {get;set;}
        @AuraEnabled
        public  List<Id> initialProjectCostIds {get;set;}
        @AuraEnabled
        public List<Id> initialProjectIncomeIds {get;set;}
        @AuraEnabled
        public List<Object> projectPartners {get;set;}
        @AuraEnabled
        public  List<Object> currentProjectRisks {get;set;}
        @AuraEnabled
        public  List<Object> futureProjectRisks {get;set;}
        @AuraEnabled
        public List<Id> initialPartnerIds {get;set;}
        @AuraEnabled
        public  List<Id> initialRiskIds {get;set;} 
        @AuraEnabled
        public  List<Object> documentsData {get;set;}
    }
    
}