/*Author : Yamuna 
 * Date : 13-11-2019
 * Description : This class is to update the Region based on postcode
                 Case Paper will be associated to project costs , cash contributions and Non -volunteer 
 */



public Class RegionUpdateOnCase {
    
    public static void updateRegion(list<case> caselist) {
        set<string> projectPostalCodeSet = new set<string>();
        map<string,string> regionAreasMap = new map<string,string>();
        
        for(case c : caselist) {
            if(c.Project_Post_Code__c != null) {
                projectPostalCodeSet.add(c.Project_Post_Code__c.substring(0,2));
                projectPostalCodeSet.add(c.Project_Post_Code__c.substring(0,1));
            }
        }
       
        for(Region_Areas__c regionArea : [select id,PostCode_Area__c, Region__c from Region_Areas__c where PostCode_Area__c in : projectPostalCodeSet]) {
            regionAreasMap.put(regionArea.PostCode_Area__c, regionArea.Region__c );
        }

        for(case caseVar : caselist) {
            if(caseVar.Project_Post_Code__c != null) {
                  if(regionAreasMap.containskey(casevar.Project_Post_Code__c.substring(0,2))) {
                      caseVar.Region__c = regionAreasMap.get(casevar.Project_Post_Code__c.substring(0,2));
                  } else if(regionAreasMap.containskey(casevar.Project_Post_Code__c.substring(0,1))) {
                      caseVar.Region__c = regionAreasMap.get(casevar.Project_Post_Code__c.substring(0,1));
                  }
            }
        }
    }
    
    public static void CreateUpdateCasePapers(map<id,Case> caseNewMap, map<id,case> caseOldMap) {
        set<id> caseIdSet = new set<id>();
        map<id,id> casePaperMap = new map<id,id>();
        list<case_papers__c> newListofCasePapers = new list<case_papers__c>();
        list<case> listOfCases = new list<case>();
        map<id,id> caseMap = new map<id,id>();
        List<project_cost__C> listOfUpdateProjectCostRecs = new list<project_cost__C>();
        List<Project_Income__c> listOfUpdateProjectIncomeRecs = new list<Project_Income__c>();
        List<Volunteer_Non_Cash_Contributions__c> listOfUpdateVolunteerRecs = new list<Volunteer_Non_Cash_Contributions__c>();
        
        for(case c : caseNewMap.values()) {
            if(c.Application_Stages__c != null  && c.Application_Stages__c == 'Assessment' && 
                    caseNewMap.get(c.id).Application_Stages__c != caseOldMap.get(c.id).Application_Stages__c) {
                 caseIdSet.add(c.id);
            }
        }
        
        for(Case_Papers__c cp : [select id, Case__c from Case_Papers__c where Case__c in : caseIdSet]) {
            casePaperMap.put(cp.case__c, cp.id);
        }
        
        for(case c : caseNewMap.values()) {
            if(c.Application_Stages__c != null  && c.Application_Stages__c == 'Assessment' && 
                    caseNewMap.get(c.id).Application_Stages__c != caseOldMap.get(c.id).Application_Stages__c) {
                 if(casePaperMap.containskey(c.id)) {
                     c.Case_Paper__c = casePaperMap.get(c.id);
                 } else {
                     Case_Papers__c casePaper = new Case_Papers__c();
                     casePaper.case__c = c.id; 
                     //casePaper.Ownerid = c.ownerid;
                     if(string.valueOf(c.OwnerId).startsWith('005')){
                        casePaper.Case_Officer__c = c.ownerid;
                        casePaper.Ownerid = c.ownerid;
                     }
                    //  Map<String, Case_paper_record_type_mapping__c> recordTypeMap = Case_paper_record_type_mapping__c.getAll();
                     Map<String, String> recordTypeSettingsMap = new Map<String, String>();
                     for(Case_paper_record_type_mapping__c currentSetting_i : Case_paper_record_type_mapping__c.getAll().values()) {
                        recordTypeSettingsMap.put(Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get(currentSetting_i.Case_RecordType_Name__c).getRecordTypeId() , Schema.SObjectType.Case_Papers__c.getRecordTypeInfosByDeveloperName().get(currentSetting_i.Case_Paper_RecordType_Name__c).getRecordTypeId());
                     }

                     if(recordTypeSettingsMap.containsKey(c.RecordTypeId)) {
                        casePaper.recordtypeid = recordTypeSettingsMap.get(c.RecordTypeId);
                     }

                     /* if(c.recordtype.name == 'Small Grant(3-10k)') {
                          casePaper.recordtypeid = Schema.SObjectType.case_papers__c.getRecordTypeInfosByName().get('Small Grants Case Paper').getRecordTypeId();
                     }  
                     if(c.recordtype.name == 'Medium (10-250k)') {
                          casePaper.recordtypeid = Schema.SObjectType.case_papers__c.getRecordTypeInfosByName().get('Medium Grants Case paper').getRecordTypeId();
                     }                 
                     if(c.recordtype.name == 'Memorial Fund (NHMF)') {
                          casePaper.recordtypeid = Schema.SObjectType.case_papers__c.getRecordTypeInfosByName().get('NHMF Case Paper').getRecordTypeId();
                     }                  */
                     newListofCasePapers.add(casePaper);
                     listOfCases.add(c);
                 }
            }
        }
        
        if(newListofCasePapers.size() > 0) {
            insert newListofCasePapers;
        }
        
        for(integer i = 0; i < newListofCasePapers.size(); i++ ) {
          listOfCases.get(i).case_paper__c = newListofCasePapers.get(i).Id;
          caseMap.put(listOfCases.get(i).id, listOfCases.get(i).case_paper__c);
        }
        
        for(Project_Cost__c projCost : [select id,Case__c,NHMF_Case_Paper__c from Project_Cost__c where case__c in : listOfCases]) {
            projCost.NHMF_Case_Paper__c = caseMap.get(projCost.case__c);
            listOfUpdateProjectCostRecs.add(projCost);            
        }
        
        for(Project_Income__c projIncome : [select id,Case__c,NHMF_Case_Paper__c from Project_Income__c where case__c in : listOfCases]) {
            projIncome.NHMF_Case_Paper__c = caseMap.get(projIncome.case__c);
            listOfUpdateProjectIncomeRecs.add(projIncome);            
        }
        
        for(Volunteer_Non_Cash_Contributions__c projVolunteer : [select id,Case__c,NHMF_Case_Paper__c from Volunteer_Non_Cash_Contributions__c where case__c in : listOfCases]) {
            projVolunteer.NHMF_Case_Paper__c = caseMap.get(projVolunteer.case__c);
            listOfUpdateVolunteerRecs.add(projVolunteer);            
        }
        
        if(listOfUpdateProjectCostRecs.size() > 0) {
           update listOfUpdateProjectCostRecs;
        }
        
        if(listOfUpdateProjectIncomeRecs.size() > 0) {
           update listOfUpdateProjectIncomeRecs;
        }  
        
        if(listOfUpdateVolunteerRecs.size() > 0) {
           update listOfUpdateVolunteerRecs;
        }     
        
        
    }
    
}