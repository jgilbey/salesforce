public Class ProjectCostTriggerHandler {
    public static void beforeInsert(List<project_cost__c> lstOfProjectCostRecs) {
        set<id> caseIdSet = new set<id>();
        map<id,id> caseMap = new map<id,id>();
        for(project_cost__c projCost : lstOfProjectCostRecs) {
            if(projCost.Case__c != null) {
                caseIdSet.add(projCost.Case__c);
            }
        }
        
        for(case c : [select id,Case_Paper__c from case where id in : caseIdSet]) {
            caseMap.put(c.id,c.Case_Paper__c);
        }
        
        for(project_cost__c projCostrec : lstOfProjectCostRecs) {
            if(projCostrec.Case__c != null && caseMap.containskey(projCostrec.case__c) && caseMap.get(projCostrec.case__c) != null) {
                projCostrec.NHMF_Case_Paper__c = caseMap.get(projCostrec.case__c);
            }
        }
    }
}