public without sharing class CasePaperTriggerHandler {
    public CasePaperTriggerHandler() {
        
    }

    public static void beforeInsert(List<Case_Papers__c> listOfCasePapers) {
        beforeInsertUpdateProcessing(listOfCasePapers,null,true);
    }
    
    public static void beforeUpdate(map<id,Case_Papers__c> casePaperNewMap, map<id,Case_Papers__c> casePaperOldMap) {
        beforeInsertUpdateProcessing(casePaperNewMap.values(),casePaperOldMap,false);
    }

    private static void beforeInsertUpdateProcessing(List<Case_Papers__c> listCasePapers, map<id,Case_Papers__c> casePaperOldMap,boolean isInsert){
        if(casePaperOldMap == null){
            casePaperOldMap = new map<id,Case_Papers__c>();
        }
        
        User usr=[Select Id,Profile.Name from User Where Id =: UserInfo.getUserId()];

        for(Case_Papers__c casePaper : listCasePapers){
            Case_Papers__c oldCasePaper;
            if(!isInsert){
                oldCasePaper = casePaperOldMap.get(casePaper.id);

                if((oldCasePaper.Manager_s_Approval__c == 'Approved' && oldCasePaper.Stage__c == casePaper.Stage__c) && usr.Profile.Name !='System Administrator'){
                    //casePaper.addError('Case paper is already approved, no further updates are allowed.');
                }
            }

            /*if(casePaper.Line_Management__c != null && (isInsert || (!isInsert && casePaper.Line_Management__c != oldCasePaper.Line_Management__c))
               ){
                casePaper.ownerId = casePaper.Line_Management__c;
            }
            */

            if(!isInsert && casePaper.Manager_s_Approval__c == 'Return' && 
               casePaper.Manager_s_Approval__c != oldCasePaper.Manager_s_Approval__c ){
                if(casePaper.Case_Officer__c != null){
                    casePaper.ownerId = casePaper.Case_Officer__c;
                }
                casePaper.Stage__c = 'Assessment';
                //2576 - Medium Grants Process Changes
                //casePaper.Manager_s_Approval__c = null;
                casePaper.Approval_Recorded_On__c = null;
            }
        }
    }
}