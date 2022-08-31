/**
* ActionFramework class handles Ross Consultant 
*
* @author      Gajendra
* @version     1.0
* @since       04/05/2019
*/

public with sharing class ActionFramework {
    public ActionFramework() {
        
    }
    
    @AuraEnabled
    public static string generatePONumber(Id sobjectRecordId){
        Ross_Consultant__c objRossConsultant = [Select id, PO_Number__c FROM Ross_Consultant__c
                                                Where Id =: sobjectRecordId];
        if(objRossConsultant.PO_Number__c == null){
            list<aggregateResult> aggResults = [SELECT MAX(PO_Number__c) myMax FROM Ross_Consultant__c];
            if(aggResults != null && aggResults.size() > 0){
                decimal num  = (decimal) aggResults[0].get('myMax');
                num = num == null ? 0 : num;
                objRossConsultant.PO_Number__c = num + 1;
                update objRossConsultant;
            }
            
        }
        
        return string.valueOf(objRossConsultant.PO_Number__c); 
    }

    @AuraEnabled
    public static string processErrorLog(Id errorLogId){
      string errorMessage='';  
      Error_Log__c objErrorLog = [select id,Project__c,Resolved__c,Callout_Request__c from Error_Log__c where id =: errorLogId];
      if(objErrorLog.Callout_Request__c && objErrorLog.Resolved__c == false && objErrorLog.Project__c != null){
        List<Id> listCaseId = new List<Id>();
        listCaseId.add(objErrorLog.Project__c);
        processCallout(listCaseId,objErrorLog.id);
      }else{
        errorMessage = 'Callout is already processed';
      }

      return errorMessage;
    } 

    @Future(callout=true)
    public static void processCallout(List<Id> lstCaseId, Id errorLogId){
        CaseTriggerHandler.processPortalCallout(lstCaseId,errorLogId);
    }
}