@isTest
private class Test_EOIUpdate {
    
    @isTest static void test_method_one() {
        TestDataFactory.SetupBaseTestData();
        map<string,Group> mapOfQueues = new map<string,Group>();
        for(Group grp : [select Id,DeveloperNAME from Group where  Type = 'Queue' AND DeveloperNAME IN ('Engagement_Queue_Midlands_and_East','Engagement_Queue_Northern_Ireland',
            'Engagement_Queue_Scotland','Engagement_Queue_Wales','Engagement_queue_London_and_South','Engagement_Queue_North')]){
            mapOfQueues.put(grp.DeveloperNAME,grp);
        }

         EOI_Project_Enquiry__c eoi= TestDataFactory.createEOI_ProjectEnquiry(true);

        eoi.Project_PostCode__c = 'AB12345'; 
        
        update eoi;
        
        EOI_Project_Enquiry__c updatedEoi = [Select id,ownerid,Area__c from EOI_Project_Enquiry__c where id =: eoi.id];
        System.assertEquals('Scotland',updatedEoi.Area__c);
        System.assertEquals(mapOfQueues.get('Engagement_Queue_Scotland').id,updatedEoi.ownerid);
        
        eoi.OwnerId =Userinfo.getUserId();
        eoi.Area__c ='Midlands and East';
        //isBeforeTriggerExecuted
        try{
            update eoi;
        }catch(Exception e){
        }

        
    }
    
    
    
}