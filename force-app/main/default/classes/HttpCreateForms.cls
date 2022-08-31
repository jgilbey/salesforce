@RestResource(urlMapping='/loadforms/*')
global with sharing class HttpCreateForms
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
        
        Map<String,Map<String,String>> mapDynamic=new Map<String,Map<String,String>>();
        for(Portal_Application__mdt application:[Select Object__c,Label,DeveloperName,Name__c from Portal_Application__mdt]){
                Map<String,String> mapfields=new Map<String,String>();
                mapfields.put(application.Name__c,application.DeveloperName);
                if(mapDynamic.containsKey(application.Object__c)){
                    mapfields.putAll(mapDynamic.get(application.Object__c));    
                }
                mapDynamic.put(application.Object__c,mapfields);
        }
        

        System.debug(response);
        Map<String, Object> respMap = (Map<String, Object>)JSON.deserializeUntyped(response);
        Map<String, Object> meta = (Map<String, Object>)respMap.get('meta');
        Map<String, Object> application = (Map<String, Object>)respMap.get('application');
        List<Object> lstPermissions=(List<Object>)application.get('permissions');
        System.debug(lstPermissions);
        
        
        
        Forms__c form=new Forms__c();
        System.debug((String)meta.get('form'));
        String recordTypeName=(String)meta.get('form');
        System.debug((String)meta.get('applicationId'));
        
        List<Case> lstCase =[Select Id,OwnerId from Case Where ApplicationId__c = : (String)meta.get('applicationId')];
        
        //recordTypeName =recordTypeName.replace('-',' ');
        //System.debug(recordTypeName);
        if(!lstCase.isEmpty()){
            form.Case__c =lstCase[0].Id;
             if(((String)lstCase[0].OwnerId).startsWith('005')){
                form.AssignTo__c =lstCase[0].OwnerId;
            }
        }
        
        if(recordTypeName == 'BMB - Permission to Start and Payment Request'){
            form.RecordTypeId = Schema.sobjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('BMB_Permission_to_Start_and_Payment_Request').recordTypeId;
        }else{
            form.RecordTypeId = Schema.sobjectType.Forms__c.getRecordTypeInfosByDeveloperName().get('Permission_to_start_payment_request').recordTypeId;
        }
        
        Map<String,Schema.SObjectField> mapFormfields=Schema.sobjecttype.Forms__c.fields.getMap();
        
        if(mapDynamic.containskey('Forms__c')){
            Map<String,String> mapfields=mapDynamic.get('Forms__c');
            for(String sfField:mapfields.keySet()){
                String fieldType=String.valueOf(mapFormfields.get(sfField).getDescribe().getType());
                form.put(sfField,parseData(fieldType,application.get(mapfields.get(sfField))));
            }
        }
        insert form;
        
        Bank_Account__c bAccount=new Bank_Account__c();
        bAccount.Forms__c = form.Id;
        Map<String,Schema.SObjectField> mapBankfields=Schema.sobjecttype.Bank_Account__c.fields.getMap();
        if(mapDynamic.containskey('Bank_Account__c')){
            Map<String,String> mapfields=mapDynamic.get('Bank_Account__c');
            for(String sfField:mapfields.keySet()){
                String fieldType=String.valueOf(mapBankfields.get(sfField).getDescribe().getType());
                bAccount.put(sfField,parseData(fieldType,application.get(mapfields.get(sfField))));
            }
        }
        insert bAccount;
        
        List<Statutory_permission__c> lstStatutoryPermissions=new List<Statutory_permission__c>();
        for(Object per:lstPermissions){
            Statutory_permission__c sPermission=new Statutory_permission__c();
            sPermission.Forms__c=form.Id;
            Map<String,Schema.SObjectField> mapStatutorypermissionfields=Schema.sobjecttype.Statutory_permission__c.fields.getMap();
            if(mapDynamic.containskey('Statutory_permission__c')){
                Map<String,String> mapfields=mapDynamic.get('Statutory_permission__c');
                for(String sfField:mapfields.keySet()){
                    String fieldType=String.valueOf(mapStatutorypermissionfields.get(sfField).getDescribe().getType());                    
                    Map<String,Object> permissions=(Map<String,Object>)per;
                    System.debug(permissions.get(mapfields.get(sfField)));
                    sPermission.put(sfField,parseData(fieldType,permissions.get(mapfields.get(sfField))));   
                }
                lstStatutoryPermissions.add(sPermission);
            }
        }
        insert lstStatutoryPermissions;
                
        HttpCreateForms.Response resp=new HttpCreateForms.Response();
        resp.status = 'Success';
        resp.statusCode = '200';
        resp.formId = form.Id;
        resp.StatutorypermissionId =lstStatutoryPermissions[0].Id;
        
        return Json.serialize(resp);
        }catch(Exception e){
            System.debug(e.getMessage() + '-' + e.getStacktraceString());
            HttpCreateForms.Response resp=new HttpCreateForms.Response();
            resp.status = 'Failed';
            resp.statusCode = '401';
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