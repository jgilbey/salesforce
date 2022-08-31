@RestResource(urlMapping='/loadApprovals/*')
global with sharing class HttpCreateApprovals
{
    public class Response{
        public String status;
        public String statusCode;
        public String formId;
        public String StatutorypermissionId;
    }
    
    public static object parseData(String fieldType,Object data){
        
        if(data == null){
            return null;
        }
        if(fieldType =='STRING' || fieldType =='TEXTAREA' || fieldType =='PICKLIST'){
            return (String)data;
        }else if(fieldType == 'BOOLEAN'){
            return Boolean.valueOf(data);
        }else if(fieldType == 'CURRENCY' || fieldType == 'DOUBLE'){
            return (Double)data;
        }else if(fieldType == 'DATE'){
            return Date.valueOf((String)data);
        }
        
        return null;
    }
    
    @HttpPost
    global static String uploadRecords(){
        try{
        RestRequest req = RestContext.request;
        RestResponse res = Restcontext.response;
        String response =req.requestBody.toString();
        //savepoint sp=Database.setSavePoint();

        Map<String,Map<String,String>> mapDynamic=new Map<String,Map<String,String>>();
        
        for(Portal_Application__mdt application:[Select Object__c,Label,DeveloperName,Name__c from Portal_Application__mdt]){
                Map<String,String> mapfields=new Map<String,String>();
                mapfields.put(application.Name__c,application.DeveloperName);
                if(mapDynamic.containsKey(application.Object__c)){
                    mapfields.putAll(mapDynamic.get(application.Object__c));    
                }
                mapDynamic.put(application.Object__c,mapfields);
        }
        Map<String,Map<String,List<Map<String,String>>>> mapDynamicFields=new Map<String,Map<String,List<Map<String,String>>>>();
        Map<String,List<Map<String,String>>> mapfieldList=new Map<String,List<Map<String,String>>>();
        for(Portal_Mappings__mdt mapping:[Select Object__c,Portal_Value__c,DeveloperName,Task_Category_Value__c,FieldName__c from Portal_Mappings__mdt]){
                Map<String,List<Map<String,String>>> mapfields=new Map<String,List<Map<String,String>>>();
                Map<String,String> mapfieldsValues=new Map<String,String>();
                List<Map<String,String>> lst=new List<Map<String,String>>();
                if(mapfieldList.containsKey(mapping.FieldName__c)){
                    lst.addAll(mapfieldList.get(mapping.FieldName__c));
                }
                Map<String,String> mapFieldMapping=new Map<String,String>();
                mapFieldMapping.put(mapping.Portal_Value__c,mapping.Task_Category_Value__c);
                lst.add(mapFieldMapping);
                mapfieldList.put(mapping.FieldName__c,lst);
                
                if(mapDynamicFields.containsKey(mapping.Object__c)){
                    mapfieldList.putAll(mapDynamicFields.get(mapping.Object__c));    
                }
                mapDynamicFields.put(mapping.Object__c,mapfieldList);
        }
        

        System.debug(response);
        Map<String, Object> respMap = (Map<String, Object>)JSON.deserializeUntyped(response);
        Map<String, Object> meta = (Map<String, Object>)respMap.get('meta');
        Map<String, Object> application = (Map<String, Object>)respMap.get('application');
        List<Object> acheivements=(List<Object>)application.get('summaryOfAcheivements');
        List<Object> ApprovedPurposes=(List<Object>)application.get('changesToApprovedPurposes');
        List<Object> contributions=(List<Object>)application.get('contributions');
        List<Object> staff=(List<Object>)application.get('staff');
        List<Object> howCostsSpent=(List<Object>)application.get('howCostsSpent');
        
        
        Forms__c form=new Forms__c();
        System.debug((String)meta.get('form'));
        System.debug((String)meta.get('applicationId'));
        
        List<Case> lstCase =[Select Id,OwnerId from Case Where ApplicationId__c = : (String)meta.get('applicationId')];
        if(!lstCase.isEmpty()){
            form.Case__c =lstCase[0].Id; 
            if(((String)lstCase[0].OwnerId).startsWith('005')){
                form.AssignTo__c =lstCase[0].OwnerId;
            }
        }
        form.Spent_grant_details__c =String.valueOf(application.get('explainSpendingChanges'));
        form.Funding_acknowlgement_public_relations__c =String.valueOf(application.get('fundingAcknowledgement'));
        form.Amount_Spent__c = Double.valueOf(application.get('totalCostsClaimed'));
        if(String.valueOf(application.get('completedEvaluation')) == 'Yes'){
            form.Have_you_completed_evaluation_report__c =true;
        }
        form.RecordTypeId = Schema.sobjectType.Forms__c.getRecordTypeInfosByName().get('BMA-End of grant').recordTypeId;
        insert form;
        
        /*Approved__c bAccount=new Approved__c();
        bAccount.Forms__c = form.Id;
        Map<String,Schema.SObjectField> mapApprovedfields=Schema.sobjecttype.Approved__c.fields.getMap();
        if(mapDynamic.containskey('Approved__c')){
            Map<String,String> mapfields=mapDynamic.get('Approved__c');
            for(String sfField:mapfields.keySet()){
                String fieldType=String.valueOf(mapApprovedfields.get(sfField).getDescribe().getType());
                bAccount.put(sfField,parseData(fieldType,application.get(mapfields.get(sfField))));
            }
        }
        insert bAccount;*/
        
        
        List<Approved__c> lstDmlApproved=new List<Approved__c>();
        for(Object approved:acheivements){
            Approved__c approval=new Approved__c();
            approval.Forms__c=form.Id;
            Map<String,Schema.SObjectField> mapStatutorypermissionfields=Schema.sobjecttype.Approved__c.fields.getMap();
            if(mapDynamic.containskey('Approved__c')){
                Map<String,String> mapfields=mapDynamic.get('Approved__c');
                for(String sfField:mapfields.keySet()){
                    String fieldType=String.valueOf(mapStatutorypermissionfields.get(sfField).getDescribe().getType());                    
                    Map<String,Object> approvals=(Map<String,Object>)approved;
                    System.debug(approvals.get(mapfields.get(sfField)));
                    approval.put(sfField,parseData(fieldType,approvals.get(mapfields.get(sfField))));   
                }
                lstDmlApproved.add(approval);
            }
        }
        insert lstDmlApproved;
        
        List<Progress_Report_Changes__c> lstProgressReport=new List<Progress_Report_Changes__c>();
        for(Object approved:ApprovedPurposes){
            Progress_Report_Changes__c approval=new Progress_Report_Changes__c();
            approval.Forms__c=form.Id;
            Map<String,Schema.SObjectField> mapStatutorypermissionfields=Schema.sobjecttype.Progress_Report_Changes__c.fields.getMap();
            if(mapDynamic.containskey('Progress_Report_Changes__c')){
                Map<String,String> mapfields=mapDynamic.get('Progress_Report_Changes__c');
                for(String sfField:mapfields.keySet()){
                    String fieldType=String.valueOf(mapStatutorypermissionfields.get(sfField).getDescribe().getType());                    
                    Map<String,Object> approvals=(Map<String,Object>)approved;
                    System.debug(approvals.get(mapfields.get(sfField)));
                    approval.put(sfField,parseData(fieldType,approvals.get(mapfields.get(sfField))));   
                }
                lstProgressReport.add(approval);
            }
        }
        insert lstProgressReport;
        
        List<Volunteer_Non_Cash_Contributions__c> lstProjectIncome=new List<Volunteer_Non_Cash_Contributions__c>();
        Id volunteerrecordtypeId=Schema.sobjecttype.Volunteer_Non_Cash_Contributions__c.getRecordTypeInfosByDeveloperName().get('Volunteers').recordTypeId;
        for(Object approved:contributions){
            Volunteer_Non_Cash_Contributions__c approval=new Volunteer_Non_Cash_Contributions__c();
            approval.Forms__c=form.Id;
            approval.RecordTypeId =volunteerrecordtypeId;
            Map<String,Schema.SObjectField> mapStatutorypermissionfields=Schema.sobjecttype.Volunteer_Non_Cash_Contributions__c.fields.getMap();
            if(mapDynamic.containskey('Volunteer_Non_Cash_Contributions__c')){
                Map<String,String> mapfields=mapDynamic.get('Volunteer_Non_Cash_Contributions__c');
                
                
                for(String sfField:mapfields.keySet()){
                    if(mapDynamicFields.containsKey('Volunteer_Non_Cash_Contributions__c')){
                        Map<String,List<Map<String,String>>> mapdynfields=mapDynamicFields.get('Volunteer_Non_Cash_Contributions__c');
                        if(mapdynfields.containskey(sfField)){
                            List<Map<String,String>> lstpickMapping=mapdynfields.get(sfField);
                            
                            for(integer i=0;i<lstpickMapping.size();i++){
                                Map<String,String> mappickVal=lstpickMapping[i];
                                Map<String,Object> approvals=(Map<String,Object>)approved;
                                if(mappickVal.containsKey((String)approvals.get(mapfields.get(sfField)))){
                                    approval.put(sfField,mappickVal.get((string)approvals.get(mapfields.get(sfField))));
                                }
                                //System.debug(approvals.get(mapfields.get(sfField)));
                            }
                        }else{
                            String fieldType=String.valueOf(mapStatutorypermissionfields.get(sfField).getDescribe().getType());                    
                            Map<String,Object> approvals=(Map<String,Object>)approved;
                            System.debug(approvals.get(mapfields.get(sfField)));
                            approval.put(sfField,parseData(fieldType,approvals.get(mapfields.get(sfField))));
                        }
                        //
                    }
                       
                }
                 approval.Case__c =lstCase[0].Id; 
                lstProjectIncome.add(approval);
            }
        }
        
        System.debug(lstProjectIncome);
        insert lstProjectIncome;
        
        /*database.rollback(sp);
        return null;*/
        
        List<Recruitment_of_staff__c> lstRecruitmentofstaff=new List<Recruitment_of_staff__c>();
        for(Object approved:staff){
            Recruitment_of_staff__c approval=new Recruitment_of_staff__c();
            approval.Forms__c=form.Id;
            Map<String,Schema.SObjectField> mapStatutorypermissionfields=Schema.sobjecttype.Recruitment_of_staff__c.fields.getMap();
            if(mapDynamic.containskey('Recruitment_of_staff__c')){
                Map<String,String> mapfields=mapDynamic.get('Recruitment_of_staff__c');
                for(String sfField:mapfields.keySet()){
                    String fieldType=String.valueOf(mapStatutorypermissionfields.get(sfField).getDescribe().getType());                    
                    Map<String,Object> approvals=(Map<String,Object>)approved;
                    System.debug(approvals.get(mapfields.get(sfField)));
                    approval.put(sfField,parseData(fieldType,approvals.get(mapfields.get(sfField))));   
                }
                lstRecruitmentofstaff.add(approval);
            }
        }
        insert lstRecruitmentofstaff;
        
        List<Project_Cost__c> lstDMLProjectCost=new List<Project_Cost__c>();
        map<String,Id> mapProjectcost=new Map<String,Id>();
        for(Project_Cost__c pcost:[Select Id,ProjectCost_Ref_ID__c from Project_Cost__c Where Case__c = : lstCase[0].Id]){
            mapProjectcost.put(pcost.ProjectCost_Ref_ID__c,pcost.Id);
        }
        
        for(Object approved:howCostsSpent){
            Project_Cost__c approval=new Project_Cost__c();
            approval.Forms__c=form.Id;
            Map<String,Schema.SObjectField> mapProjectCostFields=Schema.sobjecttype.Project_Cost__c.fields.getMap();
            if(mapDynamic.containskey('Project_Cost__c')){
                Map<String,String> mapfields=mapDynamic.get('Project_Cost__c');
                for(String sfField:mapfields.keySet()){
                    String fieldType=String.valueOf(mapProjectCostFields.get(sfField).getDescribe().getType());                    
                    Map<String,Object> approvals=(Map<String,Object>)approved;
                    System.debug(approvals.get(mapfields.get(sfField)));
                    System.debug(approvals.get(mapfields.get(sfField)) != '' && approvals.get(mapfields.get(sfField)) != null);
                    if(approvals.get(mapfields.get(sfField)) != '' && approvals.get(mapfields.get(sfField)) != null){
                        approval.put(sfField,parseData(fieldType,approvals.get(mapfields.get(sfField)))); 
                    }  
                }
                Map<String,Object> costSpent=(Map<String,Object>)approved;
                if(mapProjectcost.containsKey((String)costSpent.get('projectCostId'))){
                    approval.Id =mapProjectcost.get((String)costSpent.get('projectCostId')); 
                }else{
                    approval.Case__c =lstCase[0].Id;
                }
                System.debug(approval);
                lstDMLProjectCost.add(approval);
            }
        }
        system.debug(lstDMLProjectCost);
        upsert lstDMLProjectCost;
        
        HttpCreateApprovals.Response resp=new HttpCreateApprovals.Response();
        resp.status = 'Success';
        resp.statusCode ='200';
        resp.formId = form.Id;
        resp.StatutorypermissionId =lstDmlApproved[0].Id;
        
        return Json.serialize(resp);
        }catch(Exception e){
            System.debug(e.getMessage() + '-' + e.getStacktraceString());
            HttpCreateApprovals.Response resp=new HttpCreateApprovals.Response();
            resp.status = 'Failed';
            resp.statusCode ='401';
            Error_Log__c log=new Error_Log__c();
            String errormessage=e.getMessage() + '-' + e.getStacktraceString();
            if(errormessage.length() > 200){
               errormessage = errormessage.subString(0,200); 
            }
            log.Error__c = errormessage;
            insert log;
            //resp.errorMessage =e.getMessage() + '-' + e.getStacktraceString();
            return Json.serialize(resp);
        }
   }
}