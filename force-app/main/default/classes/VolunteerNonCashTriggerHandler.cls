public class VolunteerNonCashTriggerHandler {
    public static void beforeInsert(List<Volunteer_Non_Cash_Contributions__c > lstOfVolNonCashRecs) {
        set<id> caseIdSet = new set<id>();
        map<id,id> caseMap = new map<id,id>();
        for(Volunteer_Non_Cash_Contributions__c  vol : lstOfVolNonCashRecs) {
            if(vol.Case__c != null) {
                caseIdSet.add(vol.Case__c);
            }
        }
        
        for(case c : [select id,Case_Paper__c from case where id in : caseIdSet]) {
            caseMap.put(c.id,c.Case_Paper__c);
        }
        
        for(Volunteer_Non_Cash_Contributions__c  volRec : lstOfVolNonCashRecs) {
            if(volRec.Case__c != null && caseMap.containskey(volRec.case__c) && caseMap.get(volRec.case__c) != null) {
                volRec.NHMF_Case_Paper__c = caseMap.get(volRec.case__c);
            }
        }
    }
}