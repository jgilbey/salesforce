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
public Class EOIUpdate {
    public static boolean isBeforeTriggerExecuted = false;

    public static map<string,Group> mapOfQueues;
    public static Map<String, String> mapOfAreaToPublicGroup = new Map<String, String>{'London and South' => 'Engagement_Queue_London_and_South', 
                                                                    'Scotland' => 'Engagement_Queue_Scotland', 'Wales' => 'Engagement_Queue_Wales', 'North' => 'Engagement_Queue_North',
                                                                    'Northern Ireland' => 'Engagement_Queue_Northern_Ireland', 'Midlands and East' => 'Engagement_Queue_Midlands_and_East'};

     

    public static void beforeInsert(List<EOI_Project_Enquiry__c> eoiList) {
        fillOutRefferenceNumber(eoiList);
        EOIUpdate.updateRegion(eoiList);
        beforeInsertUpdateProcessing(eoiList,null,true);
    }
    
    public static void beforeUpdate(map<id,EOI_Project_Enquiry__c> eoiNewMap, map<id,EOI_Project_Enquiry__c> eoiOldMap) {
        Map<ID,Schema.RecordTypeInfo> rt_Map = EOI_Project_Enquiry__c.sObjectType.getDescribe().getRecordTypeInfosById();
        Set<String> groupNames = new Set<String>();
        List<GroupMember> listOfUserGroups = [select group.name, group.DeveloperName 
                                                                  from GroupMember 
                                                                  where UserOrGroupId = :UserInfo.getUserId()];
        if(!listOfUserGroups.isEmpty()){
            for (GroupMember gm : listOfUserGroups) {
                   groupNames.add(gm.group.DeveloperName);
               }
        }     

       list<EOI_Project_Enquiry__c> listofEoiRecords = new list<EOI_Project_Enquiry__c>();
      
       for(EOI_Project_Enquiry__c eoi : eoiNewMap.values()) {
            string rTName = rt_map.get(eoi.RecordTypeId).getDeveloperName();
           if(eoi.Project_PostCode__c != null && eoiNewMap.get(eoi.id).project_postcode__c != eoiOldMap.get(eoi.id).project_postcode__c) {
               listofEoiRecords.add(eoi);
           }

           if(eoi.ownerid != eoiOldMap.get(eoi.id).ownerid){
                if(rTName == 'EOI_NHMF'){
                      if(!groupNames.contains('NHMF_Managers')){
                          eoi.addError('Insufficient rights to change the owner');
                      }
                  }else if(isBeforeTriggerExecuted == false && eoi.Area__c != null && !string.isblank(eoi.Area__c) ){
                      string groupName = mapOfAreaToPublicGroup.get(eoi.Area__c);
                      if(groupName != null && !string.isblank(groupName)){
                          if(!groupNames.contains(groupName)){
                              eoi.addError('Insufficient rights to change the owner');
                          }
                      }
                }
                
            }

       }
       
        if(!listofEoiRecords.isempty()) {
            EOIUpdate.updateRegion(listofEoiRecords);
        }
        
        beforeInsertUpdateProcessing(eoiNewMap.values(),eoiOldMap,false);
    }
    public static void afterUpdate(map<id,EOI_Project_Enquiry__c> eoiNewMap, map<id,EOI_Project_Enquiry__c> eoiOldMap) {

    }
    
    public static void updateRegion(list<EOI_Project_Enquiry__c> eoiProjectEnquiryList) {
        set<string> projectPostalCodeSet = new set<string>();
        map<string,string> regionAreasMap = new map<string,string>();
        
        for(EOI_Project_Enquiry__c eoi : eoiProjectEnquiryList) {
            if(eoi.Project_PostCode__c != null) {
                projectPostalCodeSet.add(eoi.Project_PostCode__c.substring(0,2));
                projectPostalCodeSet.add(eoi.Project_PostCode__c.substring(0,1));
            }
        }
       
        for(Region_Areas__c regionArea : [select id,PostCode_Area__c, Region__c from Region_Areas__c where PostCode_Area__c in : projectPostalCodeSet]) {
            regionAreasMap.put(regionArea.PostCode_Area__c, regionArea.Region__c );
        }
        
        for(EOI_Project_Enquiry__c eoiVar : eoiProjectEnquiryList) {
            if(eoiVar.Project_PostCode__c != null) {
                  if(regionAreasMap.containskey(eoiVar.Project_PostCode__c.substring(0,2))) {
                      eoiVar.Area__c = regionAreasMap.get(eoiVar.Project_PostCode__c.substring(0,2));
                  } else if(regionAreasMap.containskey(eoiVar.Project_PostCode__c.substring(0,1))) {
                      eoiVar.Area__c = regionAreasMap.get(eoiVar.Project_PostCode__c.substring(0,1));
                  }
            }
        }
    }

    /**
    * @description 
    * Set owner based on EOI_Project_Enquiry__c Area__c
    * @author Methods | 01-04-2021 
    * @param listEOI 
    * @param eoieoiOldMap 
    * @param isInsert Boolean
    **/
    private static void beforeInsertUpdateProcessing(List<EOI_Project_Enquiry__c> listEOI, map<id,EOI_Project_Enquiry__c> eoiOldMap,boolean isInsert){
        getMapOfQueues();
        for(EOI_Project_Enquiry__c eoi : listEOI){
            EOI_Project_Enquiry__c oldEOI;
            if(!isInsert){
                oldEOI = eoiOldMap.get(eoi.id);
            }
            boolean updateOwnerRequired = (isInsert || 
                            (oldEOI != null && eoi.Area__c != oldEOI.Area__c)
                            );

            if(updateOwnerRequired){
                if(eoi.Area__c == 'North'){
                    eoi.ownerid = mapOfQueues.get('Engagement_Queue_North').id;
                }else if(eoi.Area__c == 'Scotland'){
                    eoi.ownerid = mapOfQueues.get('Engagement_Queue_Scotland').id;
                }else if(eoi.Area__c == 'Wales'){
                    eoi.ownerid = mapOfQueues.get('Engagement_Queue_Wales').id;
                }else if(eoi.Area__c == 'Northern Ireland'){
                    eoi.ownerid = mapOfQueues.get('Engagement_Queue_Northern_Ireland').id;
                }else if(eoi.Area__c == 'London and South'){
                    eoi.ownerid = mapOfQueues.get('Engagement_queue_London_and_South').id;
                }else if(eoi.Area__c == 'Midlands and East'){
                    eoi.ownerid = mapOfQueues.get('Engagement_Queue_Midlands_and_East').id;
                }
            }

        }
    }

    private static map<string,Group> getMapOfQueues(){
       mapOfQueues = new map<string,Group>();
        for(Group grp : [select Id,DeveloperNAME from Group where  Type = 'Queue' AND DeveloperNAME IN ('Engagement_Queue_Midlands_and_East','Engagement_Queue_Northern_Ireland',
            'Engagement_Queue_Scotland','Engagement_Queue_Wales','Engagement_queue_London_and_South','Engagement_Queue_North')]){
            mapOfQueues.put(grp.DeveloperNAME,grp);
        }
        return mapOfQueues;
    }

    /**
    * @description 
    * Generate Project_Reference_Number__c for EOI_Project_Enquiry__c
    * @author Methods | 01-04-2021 
    * @param eoiList 
    **/
    static void fillOutRefferenceNumber(List<EOI_Project_Enquiry__c> eoiList){
       
        decimal autoNumber;
        Integer year = Date.today().year();
        if(Date.today().month() < 4){
            year--;
        }
        String format = 'MF-' + (year - 2000);
        String searchString = format + '%';
        List<EOI_Project_Enquiry__c> lastCreatedProject = [ SELECT Id, Project_Reference_Number__c 
                                                            FROM EOI_Project_Enquiry__c 
                                                            WHERE Project_Reference_Number__c LIKE :searchString ORDER BY CreatedDate  DESC LIMIT 1 ];
        if(lastCreatedProject.size() > 0){
            
            String autoNumberString = lastCreatedProject[0].Project_Reference_Number__c.substringAfterLast('-');
            autoNumberString = autoNumberString.trim();
            autoNumber = Decimal.valueOf(autoNumberString);
        }else{
            autoNumber = 00000;
        }        
        Map<ID,Schema.RecordTypeInfo> rt_Map = EOI_Project_Enquiry__c.sObjectType.getDescribe().getRecordTypeInfosById();                                         
        for(EOI_Project_Enquiry__c eoProject_i : eoiList){
            String rTName = rt_map.get(eoProject_i.RecordTypeId).getDeveloperName();
            if(rTName == 'EOI_NHMF'){
                String autogenerated = String.valueOf(Integer.valueOf(autoNumber) + 1);
                autogenerated = autogenerated.leftPad(5,'0');
                eoProject_i.Project_Reference_Number__c = format + '-' + autogenerated;
                autoNumber++;
            }
        }
    }
}