public class ProjectIncomeTriggerHandler {
    public static void beforeInsert(List<Project_Income__c> lstOfProjectIncomeRecs) {
        set<id> caseIdSet = new set<id>();
        map<id,id> caseMap = new map<id,id>();
        for(Project_Income__c projIncome : lstOfProjectIncomeRecs) {
            if(projIncome.Case__c != null) {
                caseIdSet.add(projIncome.Case__c);
            }
        }
        
        for(case c : [select id,Case_Paper__c from case where id in : caseIdSet]) {
            caseMap.put(c.id,c.Case_Paper__c);
        }
        
        for(Project_Income__c projIncomeRec : lstOfProjectIncomeRecs) {
            if(projIncomeRec.Case__c != null && caseMap.containskey(projIncomeRec.case__c) && caseMap.get(projIncomeRec.case__c) != null) {
                projIncomeRec.NHMF_Case_Paper__c = caseMap.get(projIncomeRec.case__c);
            }
        }
    }
}