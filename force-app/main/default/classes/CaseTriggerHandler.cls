/**
* CaseTriggerHandler class handles trigger for CaseTrigger
* Description - Sending updates from salesforce to portal before releasing forms on portal
- 
* @author      Gajendra
* @version     1.0
* @since       20/11/2019

 History
 -------
VERSION     AUTHOR          DATE            DETAIL                      Description
1.0         Gajendra        2019-11-20      Initial version
1.1         Alicia          2021-03-06      Withdrawn Status            Allow Admin Users to reset a Withdrawn Project(case) to another status (Trello card 1043)
1.2			Alicia			2021-03-30		Additional Address Info		Populate Local Authority/Constituency/Ward from Postcode. Calls postcodes.io via PostCodeDataAPICtrl class. (Trello 2550)
*/


public Class CaseTriggerHandler {
    public static boolean isBeforeTriggerExecuted = false;
    public static boolean isBeforeInsertTriggerExecuted = false;
    public static boolean isNotFormCreated = true;
    
    public static map<string,Group> mapOfQueues;
    // Public groups
    public static Map<String, String> mapOfAreaToPublicGroup = new Map<String, String>{'London and South' => 'London_and_South', 
        'Scotland' => 'Scotland', 'Wales' => 'Wales', 'North' => 'North',
        'Northern Ireland' => 'Northern_Ireland', 'Midlands and East' => 'Midlands_and_East'}; 
            
            
    public static void afterUpdate(Map<Id,Case> mapOldRecords){
        List<Id> lstCaseId=new List<Id>();
        Set<Id> postcodeChangeCaseId = new Set<Id>();
        Set<Id> setRecordTypeId=new Set<Id>(); 
        Set<String> setRecordtypeNames=new Set<String>{'Small_Grant_3_10k','Medium'};
            for(String recordtype:setRecordtypeNames){
                setRecordTypeId.add(Schema.SobjectType.Case.getRecordTypeInfosByDeveloperName().get(recordtype).getRecordTypeId());
            }
        
        for(Case cas:(List<Case>)Trigger.new){
            
            
            
            // When Permission to start is marked as true send updates to release the form on portal 
            if((cas.Release_Permission_to_start__c != mapOldRecords.get(cas.Id).Release_Permission_to_start__c && cas.Release_Permission_to_start__c) 
                || (cas.RecordTypeId != mapOldRecords.get(cas.Id).RecordTypeId && setRecordTypeId.contains(cas.RecordTypeId))){
                    lstCaseId.add(cas.Id);
            }
            //2550: 2021/03/30 Additional Address Info
            //PostCode change requires new LA/Constituency/Ward from postcode.io API call
            if(cas.Project_Post_Code__c!=null && cas.Project_Post_Code__c != mapOldRecords.get(cas.Id).Project_Post_Code__c){
                postcodeChangeCaseId.add(cas.Id);
            }
        }
        
        if(!lstCaseId.isEmpty()){
            CaseTriggerHandler.parseObject(lstCaseId);
        }
        transferProjectName(Trigger.new, (Map<Id, Case>)Trigger.oldMap);
        if(isNotFormCreated){
            createForms(Trigger.new, (Map<Id, Case>)Trigger.oldMap);
        }
        //2550: 2021/03/30 Additional Address Info
        if(!postcodeChangeCaseId.isEmpty()){
            //trigger future method API call to get LA/Constituency/Ward
            PostCodeDataAPICtrl.setProjectAddrInfo(postcodeChangeCaseId, false);
        }
    }
    
    
    
    @Future(callout=true)
    public static void parseObject(List<Id> lstCaseId){
        processPortalCallout(lstCaseId,null);
    }

    public static void processPortalCallout(List<Id> lstCaseId, Id errorLogId){
        boolean isSuccess = false;
        String errormessage;
        Error_Log__c objErrorLog = new Error_Log__c();

        try{
             if(lstCaseId.size() > 1){
                return;
            }

            Integer retryCount = 3;
            objErrorLog.Project__c = lstCaseId.get(0);
            objErrorLog.Callout_Request__c = true;

            if(errorLogId != null){
                retryCount = 1;
                objErrorLog.id = errorLogId;
            }else{
                List<Error_Log__c> lstErrorLog = [select id,Project__c,Resolved__c 
                                        from Error_Log__c 
                                        where Project__c =:objErrorLog.Project__c AND Resolved__c=false
                                        AND Callout_Request__c = true
                                        order by createddate desc Limit 1];
                if(!lstErrorLog.isEmpty()){
                    objErrorLog.id = lstErrorLog.get(0).id;
                }
            }

            // Custom setting to hold Authentication details
            Portal_Authentication__c auth=Portal_Authentication__c.getOrgDefaults();
        
            HttpRequest req = new HttpRequest();
            req.setEndpoint(auth.EndPoint__c);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');        
            
            Blob headerValue = Blob.valueOf(auth.UserName__c + ':' + auth.Password__c);
            String authorizationHeader = 'Basic ' +
                EncodingUtil.base64Encode(headerValue);
            req.setHeader('Authorization', authorizationHeader);
            
            
            // Quering fields from case , contact , cash contributions and Income
            List<Case> lstUpdCase=new List<Case>();
            String body='';
            List<Case> lstCases=[Select Id,Status,ApplicationId__c,Approved_by_Finance__c,Application_Stages__c,Grant_Decision__c,Contact.Name,Contact.Email,Account.Name,Account.Account_External_ID__c,
                                 (Select Id,Name,ProjectCost_Ref_ID__c, Cost_heading__c,Total_cost_claiming__c,Costs__c from Project_Costs__r),
                                 (Select Id,Description_for_cash_contributions__c, Secured_non_cash_contributions__c,Amount_you_have_received__c,Contributions_ID__c from Project_Incomes__r),
                                 (Select Id,Name,Grant_Expiry_Date__c from Forms__r Where RecordType.Name ='BMA - Permission to start and Payment Request') from Case Where Id IN : lstCaseId];
            
            List<Id> lstform=new List<Id>();
            for(Case cas:lstCases){
                //if(cas.Application_Stages__c == 'Enter Approved Purposes'){
                for(Forms__c pcost:cas.Forms__r){
                    lstform.add(pcost.Id);
                }
                //}
            }
            
            Map<String,List<Approved__c>> mapApproved=new Map<String,List<Approved__c>>();
            for(Approved__c apprvd:[Select Id,Approved_Purposes__c,Forms__c,Final_summery_of_achievements__c from Approved__c Where Forms__c IN : lstform]){
                List<Approved__c> lst=new List<Approved__c>();
                lst.add(apprvd);
                if(mapApproved.containsKey(apprvd.Forms__c)){
                    lst.addAll(mapApproved.get(apprvd.Forms__c));
                }
                mapApproved.put(apprvd.Forms__c,lst);
            }
            
            // Mapping fields on case 
            for(Case cas:lstCases){            
                SerializeObj obj=new SerializeObj();
                obj.Status =cas.Status; 
                obj.ApplicationId=cas.ApplicationId__c;
                obj.ContactName=cas.Contact.Name;
                obj.Email=cas.Contact.Email;
                obj.AccountName=cas.Account.Name;
                obj.AccountExternalID=cas.Account.Account_External_ID__c;
                obj.ApplicationStages=cas.Application_Stages__c;
                obj.GrantDecision =cas.Grant_Decision__c;
                if(cas.Approved_by_Finance__c){
                    obj.ApprovedbyFinance =cas.Approved_by_Finance__c;
                }
                
                objErrorLog.Project_Ref__c = cas.ApplicationId__c;

                // Mapping fields from project costs
                List<projectCosts> lstprojectCost=new List<projectCosts>();
                Map<String,List<ApprovedPurpose>> mapa=new Map<String,List<ApprovedPurpose>>();
                for(Project_Cost__c pcost:cas.Project_Costs__r){
                    projectCosts pCosts=new projectCosts();
                    pCosts.Name =pcost.Name;
                    pCosts.ProjectCostRefID =pcost.ProjectCost_Ref_ID__c;
                    pCosts.Costheading =pcost.Cost_heading__c;
                    pCosts.Totalcostclaiming =pcost.Total_cost_claiming__c;
                    pCosts.Costs =pcost.Costs__c;
                    lstprojectCost.add(pCosts);
                }
                
                // Mapping from project income 
                List<ProjectIncome> lstprojectIncome=new List<ProjectIncome>();
                for(Project_Income__c caspIncome:cas.Project_Incomes__r){
                    ProjectIncome pincome=new ProjectIncome();
                    pincome.Description=caspIncome.Description_for_cash_contributions__c;
                    pincome.Secured=caspIncome.Secured_non_cash_contributions__c;
                    pincome.Amount=caspIncome.Amount_you_have_received__c;
                    pincome.Contributions=caspIncome.Contributions_ID__c;
                    lstprojectIncome.add(pincome);
                }
                
                
                // Pulling from form object and sending to Portal
                
                List<forms> lstforms=new List<forms>();
                for(Forms__c form:cas.Forms__r){
                    forms frm=new forms();
                    frm.GrantExpiryDate =String.valueOf(form.Grant_Expiry_Date__c);
                    lstforms.add(frm);
                    
                    if(mapApproved.containsKey(form.Id)){
                        List<ApprovedPurpose> lstA=new List<ApprovedPurpose>();
                        for(Approved__c approved:mapApproved.get(form.Id)){
                            ApprovedPurpose aPurpose=new ApprovedPurpose();
                            aPurpose.ApprovedPurposes =approved.Approved_Purposes__c;
                            if(cas.Approved_by_Finance__c){
                                aPurpose.Finalsummeryofachievements =approved.Final_summery_of_achievements__c;
                            }
                            lstA.add(aPurpose);
                        }
                        mapa.put(form.Name,lstA);
                    }
                    
                }
                obj.forms = lstforms;
                obj.ApprovedPurpose =mapa;
                obj.ProjectCosts=lstprojectCost;
                obj.ProjectIncome=lstprojectIncome;
                body=JSON.serialize(obj);
                System.debug(body);
                cas.description =body;
                lstUpdCase.add(cas);
                
                
            }
            

            req.setbody(body);
            Integer statusCode;
            for(Integer i=1;i<=retryCount;i++){
                Http http = new Http();
                HTTPResponse res = http.send(req);
                System.debug('responseBody-->' + res.getBody());
                statusCode = res.getStatusCode();
                objErrorLog.Response_Status_Code__c = string.valueof(statusCode);
                if(statusCode >= 200 && statusCode <= 299){
                    isSuccess = true;
                    break;
                }else{
                    isSuccess = false;
                    errormessage = res.getBody();
                    if(errormessage == null || errormessage == ''){
                        errormessage = res.getStatus();
                    }
                }
                
            }

            objErrorLog.Resolved__c = isSuccess ? true : false;
            
            if(!lstUpdCase.isEmpty()){
                update lstUpdCase;
            }
        }catch(Exception e){
            errormessage=e.getMessage() + '-' + e.getStacktraceString();
            system.debug('exception-->' + errormessage);
            objErrorLog.Response_Status_Code__c = '000';
            objErrorLog.Resolved__c = false;
        }

        if(!isSuccess || objErrorLog.id != null){
            if(errormessage != null && errormessage.length() > 200){
                errormessage = errormessage.subString(0,200); 
            }
            if(!isSuccess){
                objErrorLog.Error__c = errormessage;
            }
            
            upsert objErrorLog;
        }
    }


    
    public static void beforeInsert(List<Case> listOfCases) {
        RegionUpdateOnCase.updateRegion(listOfCases);
        beforeInsertUpdateProcessing(listOfCases,null,true);
    }

    //2550: 2021/03/30 Additional Address Info
    public static void afterInsert(map<id,Case> mapOfCases){
        //Ids required for future method - trigger cannot call API directly
        PostCodeDataAPICtrl.setProjectAddrInfo(mapOfCases.keySet(), true);
        CaseIncomeAndCostsCtrl.insertedProjects(mapOfCases.values());
        
    }
    
    public static void beforeUpdate(map<id,Case> caseNewMap, map<id,case> caseOldMap) {
        Set<String> groupNames = new Set<String>();
        List<GroupMember> listOfUserGroups = [select group.name, group.DeveloperName 
                                              from GroupMember 
                                              where UserOrGroupId = :UserInfo.getUserId()];
        if(!listOfUserGroups.isEmpty()){
            for (GroupMember gm : listOfUserGroups) {
                groupNames.add(gm.group.DeveloperName);
            }
        }
        
        //2021-03-06 Not Used
        /*map<id,User> mapOfUsers = new map<id,User>();
        set<Id> setOfUserIds = new set<Id>();
        for(case c : caseNewMap.values()){
            Case oldcase = caseOldMap.get(c.id);
            if(c.ownerid != oldcase.ownerid && string.valueOf(c.OwnerId).startsWith('005') ){
                setOfUserIds.add(c.ownerid);
            }
            // When case is withdrawn no further updates are allowed.
            if(isBeforeTriggerExecuted == false && oldcase.Status =='Withdrawn' ){ 
                c.addError('Case is withdrawn, no further updates are allowed.');
            }
        }                                                                 
        if(!setOfUserIds.isEmpty()){
            mapOfUsers = new map<id,User>([Select Id,UserRoleId, UserRole.DeveloperName  from User where Id IN: setOfUserIds]);
        }*/
        
        //2021-03-06 Withdrawn Status Cases
        String userProfileName = [select Name from profile where id =: userinfo.getProfileId()].Name;
        for(case c : caseNewMap.values()){
            
            Case oldcase = caseOldMap.get(c.id);
            Case newcase = caseNewMap.get(c.id);
            
            //Withdrawn Case - Allow Admin to change Status ONLY
            if(isBeforeTriggerExecuted == false && oldcase.Status =='Withdrawn' && newcase.Status=='Withdrawn'  && userProfileName=='System Administrator'){
                c.addError('Project is withdrawn. To allow edits, System Administrators can update the Status of withdrawn projects.');
            }
            //Withdrawn Case - No edits by non Admin users
            else if(isBeforeTriggerExecuted == false && oldcase.Status =='Withdrawn' && userProfileName!='System Administrator'){ 
                c.addError('Project is withdrawn. No further updates are allowed.');
            }
            
        }
        Id rtId_Memorial = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Memorial').getRecordTypeId();
        list<case> listofCases = new list<case>();
        for(case c : caseNewMap.values()) {
            Case oldcase = caseOldMap.get(c.id);
            if(c.Project_Post_Code__c != null && caseNewMap.get(c.id).project_post_code__c != oldcase.project_post_code__c) {
                listofCases.add(c);
            }
            
            if(c.recordTypeId != rtId_Memorial &&  c.Region__c != null && !string.isblank(c.Region__c) && c.ownerid != oldcase.ownerid){
                string caseGroupName = mapOfAreaToPublicGroup.get(c.Region__c);
                if(isBeforeInsertTriggerExecuted == false && isBeforeTriggerExecuted == false && caseGroupName != null && !string.isblank(caseGroupName)){
                    if(!groupNames.contains(caseGroupName)){
                        c.addError('Insufficient rights to change the owner');
                    }
                }
            }
            
            if(c.ownerid != oldcase.ownerid && string.valueOf(oldcase.OwnerId).startsWith('00G') && string.valueOf(c.OwnerId).startsWith('005') ){
                c.Allocated_by__c = UserInfo.getUserId();
                
            }
        }
        if(!listofCases.isempty()) {
            RegionUpdateOnCase.updateRegion(listofCases);
        }
        
        beforeInsertUpdateProcessing(caseNewMap.values(),caseOldMap,false);
        setDefaultFormPickListValue(caseNewMap.values(), caseOldMap);
    }
    
    private static void beforeInsertUpdateProcessing(List<Case> listCases, map<id,case> caseOldMap,boolean isInsert){
        Id rtId_Memorial = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Memorial').getRecordTypeId();
        getMapOfQueues();
        for(case c : listCases){
            Case oldCase;
            if(!isInsert){
                oldCase = caseOldMap.get(c.id);
            }
            boolean updateOwnerRequired = (isInsert || 
                                           (oldCase != null && (c.Supporting_documents_provided__c != oldCase.Supporting_documents_provided__c || c.Name_on_the_application_form_accord_wit__c != oldCase.Name_on_the_application_form_accord_wit__c ||
                                                                c.Income_applied_towards_it_objects__c != oldCase.Income_applied_towards_it_objects__c || c.Agree_to_distribute_assets_to_charity__c != oldCase.Agree_to_distribute_assets_to_charity__c || 
                                                                c.Region__c != oldCase.Region__c)
                                           )
                                          );
            // When Application Stage is Allocation and based on postcode , Region will be updated on project.
            if (c.recordTypeId != rtId_Memorial && !isInsert && c.Application_Stages__c == 'Allocation' && oldCase.Application_Stages__c != c.Application_Stages__c
                
                
               ){
                   if(c.Region__c == 'North'){
                       c.ownerid = mapOfQueues.get('North').id;
                   }else if(c.Region__c == 'Scotland'){
                       c.ownerid = mapOfQueues.get('Scotland').id;
                   }else if(c.Region__c == 'Wales'){
                       c.ownerid = mapOfQueues.get('Wales').id;
                   }else if(c.Region__c == 'Northern Ireland'){
                       c.ownerid = mapOfQueues.get('Northern_Ireland').id;
                   }else if(c.Region__c == 'London and South'){
                       c.ownerid = mapOfQueues.get('London_and_South').id;
                   }else if(c.Region__c == 'Midlands and East'){
                       c.ownerid = mapOfQueues.get('Midlands_and_East').id;
                   }
               }
            
            if(!isInsert && c.Grant_Expiry_Notification__c == true && oldCase.Grant_Expiry_Date__c != c.Grant_Expiry_Date__c){
                c.Grant_Expiry_Notification__c = false;
            }
            
            if(!isInsert && c.Application_Stages__c == 'Confirm Decision' && oldCase.Application_Stages__c != c.Application_Stages__c){
                c.Decision_Recorded_by__c   = UserInfo.getUserId();
            }
            
            if(isInsert){
                c.Grant_Type__c = c.RecordTypeId == rtId_Memorial ? 'M' : 'L';
            }
        }
    }
    
    /**
    * @description 
    * On case project title update set this new title to EOI_Project_Enquiry__c under this case 
    * @author Methods | 03-10-2021 
    * @param newCaseList 
    * @param oldCaseMap 
    **/
    static void transferProjectName(List<Case> newCaseList, Map<Id, Case> oldCaseMap) {
        Map<String, EOI_Project_Enquiry__c> projectEnquiryMap = new Map<String, EOI_Project_Enquiry__c>();

        for(Case currentCase_i : newCaseList) {
            if(currentCase_i.Project_Title__c != null && String.isNotBlank(currentCase_i.EOI_Project_Enquiry__c) && (oldCaseMap == null || oldCaseMap.get(currentCase_i.Id).Project_Title__c != currentCase_i.Project_Title__c)) {
                projectEnquiryMap.put(currentCase_i.EOI_Project_Enquiry__c, new EOI_Project_Enquiry__c(Id = currentCase_i.EOI_Project_Enquiry__c, Project_Title__c = currentCase_i.Project_Title__c));
            }
        }
        if(projectEnquiryMap.size()>0) {
            update projectEnquiryMap.values();
        }
    }

    /**
    * @description 
    * On case Application_Stages__c "Monitoring" set defualt values('Pending creation') for Acquisition_forms_status_action__c, Capital_forms_status_action__c fields
    * @author Methods | 03-10-2021 
    * @param newCaseList 
    * @param oldCaseMap 
    **/
    static void setDefaultFormPickListValue(List<Case> newCaseList, Map<Id, Case> oldCaseMap) {
        for(Case currentCase_i : newCaseList){
            if(currentCase_i.Application_Stages__c == 'Monitoring' && oldCaseMap.get(currentCase_i.Id).Application_Stages__c != 'Monitoring') {
                currentCase_i.Acquisition_forms_status_action__c = 'Pending creation';
                currentCase_i.Capital_forms_status_action__c = 'Pending creation';
            }
        }
    }

    /**
    * @description 
    * Create forms for case in Monitoring stage if it has:
    * Capital_forms_status_action__c is equals to "Create" and Capital_Monitoring_Forms__c not null OR 
    * Acquisition_forms_status_action__c is equals to "Create" and Acquisition_Monitoring_Forms__c not null
    * use Case_Paper_Record_Type_Creation_Mapping__mdt for Form record type assigning
    * @author Methods | 03-10-2021 
    * @param newCaseList 
    * @param oldCaseMap 
    **/
    static void createForms(List<Case> newCaseList, Map<Id, Case> oldCaseMap) {
        List<Case> caseList = new List<Case>();
        Map<String, String> recordTypeNameMap = new Map<String, String> ();
        for(Case_Paper_Record_Type_Creation_Mapping__mdt currentRecordTypeMapping_i : [SELECT Case_picklist_value__c, Case_Paper_record_type__c FROM Case_Paper_Record_Type_Creation_Mapping__mdt]) {
            recordTypeNameMap.put(currentRecordTypeMapping_i.Case_picklist_value__c, currentRecordTypeMapping_i.Case_Paper_record_type__c);
        }
        List<Forms__c> formList = new List<Forms__c> ();
        for(Case currentCase_i : newCaseList) {
            if(currentCase_i.Application_Stages__c == 'Monitoring') {
                List<Forms__c> capitalFormsList = obtainFormList(currentCase_i.Capital_forms_status_action__c, currentCase_i.Capital_Monitoring_Forms__c, currentCase_i, recordTypeNameMap);
                List<Forms__c> acquisitionFormsList = obtainFormList(currentCase_i.Acquisition_forms_status_action__c, currentCase_i.Acquisition_Monitoring_Forms__c, currentCase_i, recordTypeNameMap);
                formList.addAll(capitalFormsList);
                formList.addAll(acquisitionFormsList);
                if(!capitalFormsList.isEmpty() || !acquisitionFormsList.isEmpty()) {
                    Case caseToUpdate = new Case(Id = currentCase_i.Id);
                    if(!capitalFormsList.isEmpty()) {
                        caseToUpdate.Capital_Monitoring_Forms__c = null;
                        caseToUpdate.Capital_forms_status_action__c = 'Pending creation';
                    }
                    if(!acquisitionFormsList.isEmpty()) {
                        caseToUpdate.Acquisition_Monitoring_Forms__c = null;
                        caseToUpdate.Acquisition_forms_status_action__c = 'Pending creation';
                    }
                    caseList.add(caseToUpdate);
                }
            }
        }

        if(!formList.isEmpty()) {
            try{
                isNotFormCreated = false;
                insert formList;
            }catch(DmlException e){
                String msg = '';
                for (Integer i = 0; i < e.getNumDml(); i++) {
                    //Get Validation Rule & Trigger Error Messages
                    msg =+ e.getDmlMessage(i) +  '\n' ;
                }
                newCaseList.get(0).addError(msg);
            }
           
            update caseList;
        }
    
    }
    
    /**
    * @description 
    * Create specific Forms record based on picklist value 
    * @author Methods | 03-10-2021 
    * @param status 
    * @param formMultiPicklist 
    * @param caseData 
    * @param recordTypeNameMap map based on Case_Paper_Record_Type_Creation_Mapping__mdt
    * @return List<Forms__c> 
    **/
    static List<Forms__c> obtainFormList(String status, String formMultiPicklist, Case caseData, Map<String, String> recordTypeNameMap) {
        List<Forms__c> formList = new List<Forms__c>(); 
        if(status == 'Create' && String.isNotBlank(formMultiPicklist)) {
            for(String formType_i : formMultiPicklist.split(';')){
                formList.add(createForm(caseData, getFormRecordTypeId(recordTypeNameMap.get(formType_i) )));
            }
        }
        return formList;
    }
    
    /**
    * @description 
    * Create Forms with specific record type and assign to Case 
    * @author Methods | 03-10-2021 
    * @param caseData 
    * @param recordTypeId
    * @return Forms__c
    **/
    static Forms__c createForm(Case caseData, String recordTypeId) {
        return new Forms__c(
            Case__c = caseData.Id,
            RecordTypeId = recordTypeId,
            Grant_Expiry_Date__c = caseData.Grant_Expiry_Date__c
        );
    }

    /**
    * @description 
    * Obtain forms__c record type Id by record type Developer Name
    * @author Methods | 03-10-2021 
    * @param recordTypeDeveloperName 
    * @return String
    **/
    static String getFormRecordTypeId(String recordTypeDeveloperName) {
        return Schema.SObjectType.Forms__c.getRecordTypeInfosByDeveloperName().get(recordTypeDeveloperName).getRecordTypeId();
    }

    private static map<string,Group> getMapOfQueues(){
        mapOfQueues = new map<string,Group>();
        for(Group grp : [select Id,DeveloperNAME from Group where  Type = 'Queue' AND DeveloperNAME IN ('London_and_South','Midlands_and_East','North','Northern_Ireland','Scotland','Wales')]){
            mapOfQueues.put(grp.DeveloperNAME,grp); // Queue names and Group which are allocated 
        }
        return mapOfQueues;
    }
    


    public class forms {
        public String GrantExpiryDate;
    }
    
    public class projectCosts{
        public String Name;
        public String ProjectCostRefID;
        public String Costheading;
        public Decimal Totalcostclaiming;
        public Decimal Costs;
    }
    
    public class ProjectIncome{
        public String Description;
        public String Secured;
        public Decimal Amount;
        public String Contributions;
    }
    
    public class ApprovedPurpose{
        public String ApprovedPurposes;
        public String Finalsummeryofachievements;
    }
    
    // This is used for sending salesforce fields for Permission to start or End of report as part of integration
    public class SerializeObj {
        
        public String Status;
        public String ApplicationId;
        public String ContactName;
        public String Email;
        public String AccountName;
        public String AccountExternalID;
        public String ApplicationStages;
        public String GrantDecision;
        public Boolean ApprovedbyFinance;
        public List<projectCosts> ProjectCosts;
        public List<ProjectIncome> ProjectIncome;
        public List<forms> forms;
        public Map<String,List<ApprovedPurpose>> ApprovedPurpose;
    }
}