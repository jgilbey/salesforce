@isTest
private class HttpCreateApprovalsTest {

    @testSetup
    private static void testData(){
        
        Case cs= New Case(Description = 'Test',                             
                              Status = 'New',
                              ApplicationId__c ='725r650-e450-11e9-b3b6-212ded63c337',
                              RecordTypeId= Schema.SObjectType.Case.getRecordTypeInfosByName().get('Small Grant(3-10k)').getRecordTypeId(),
                              Grant_Expiry_Date__c = Date.today().AddDays(Integer.valueOf(Label.Grant_Expiry_Notification_Days_Before))
            );
            
            insert cs;
    }
 
     @isTest static void testCallout() {
     
         list<Case> lstCase =[Select Id from Case Where ApplicationId__c = '725r650-e450-11e9-b3b6-212ded63c337'];
         System.debug(lstCase.size());
         String requestBody='{'
                                  +'"meta": {'
                                      +'"form": "completion-report",'
                                      +'"schemaVersion": "v1.x",'
                                      +'"environment": "production",'
                                      +'"commitId": "b4ecf18eae01d34b296e9388f387cc42bf7c0f93",'
                                      +'"locale": "en",'
                                      +'"username": "example@example.com",'
                                      +'"applicationId": "725r650-e450-11e9-b3b6-212ded63c337",'
                                      +'"startedAt": "2019-05-17T15:34:13.000Z"'
                                    +'},'
                                  +'"application": {'
                                      +'"summaryOfAcheivements": ['
                                            +'{'
                                              +'"approvedPurpose": "Approved purpose 1",'
                                              +'"summaryOfAcheivements": "Acheivements"'
                                            +'},'
                                            +'{'
                                              +'"approvedPurpose": "Approved purpose 2",'
                                              +'"summaryOfAcheivements": "Acheivements"'
                                            +'}'
                                        +'],'
                                      +'"changesToApprovedPurposes": ['
                                            +'{'
                                              +'"descriptionOfChange": "Free text",'
                                              +'"dateOfRequest": "2019-01-01",'
                                              +'"dateOfReply": "2019-01-01",'
                                              +'"effectOfChange": "Changes will apply"'
                                            +'},'
                                            +'{'
                                              +'"descriptionOfChange": "Free text 2",'
                                              +'"dateOfRequest": "2019-01-01",'
                                              +'"dateOfReply": "2019-01-01",'
                                              +'"effectOfChange": "Changes"'
                                            +'}'
                                        +'],'
                                      +'"howProjectAcheivedOutcomes": "Free text",'
                                      +'"contributions": ['
                                            +'{'
                                              +'"date": "2019-01-01",'
                                              +'"taskDescription": "free text",'
                                              +'"taskCategory": "volunteer",'
                                              +'"numberOfVolunteers": 10,'
                                              +'"volunteerHours": 2000'
                                            +'},'
                                            +'{'
                                              +'"date": "2019-01-01",'
                                              +'"taskDescription": "free text",'
                                              +'"taskCategory": "volunteer",'
                                              +'"numberOfVolunteers": 10,'
                                              +'"volunteerHours": 2000'
                                            +'},'
                                            +'{'
                                              +'"date": "2019-01-01",'
                                              +'"taskDescription": "free text",'
                                              +'"taskCategory": "volunteer",'
                                              +'"numberOfVolunteers": 10,'
                                              +'"volunteerHours": 2000'
                                            +'},'
                                            +'{'
                                              +'"date": "2019-01-01",'
                                              +'"taskDescription": "free text",'
                                              +'"taskCategory": "volunteer",'
                                              +'"numberOfVolunteers": 10,'
                                              +'"volunteerHours": 2000'
                                            +'}'
                                        +'],'
                                      +'"staff": ['
                                            +'{'
                                              +'"post": "free text",'
                                              +'"dateAdvertised": "2019-01-01",'
                                              +'"dateAppointed": "2019-01-01",'
                                              +'"salary": 10000,'
                                              +'"staffLinked": "true"'
                                            +'}'
                                        +'],'
                                        
                                      +'"howCostsSpent": ['
                                            +'{'
                                              +'"costHeading": "Professional fees",'
                                              +'"invoiceReference": "free text",'
                                              +'"invoiceDate": "2019-01-01",'
                                              +'"description": "free text",'
                                              +'"totalInvoice": 1000,'
                                              +'"totalCostClaimed": 2000'
                                            +'},'
                                            +'{'
                                              +'"costHeading": "Recruitment",'
                                              +'"invoiceReference": "free text",'
                                              +'"invoiceDate": "2019-01-01",'
                                              +'"description": "free text",'
                                              +'"totalInvoice": 1000,'
                                              +'"totalCostClaimed": 2000'
                                            +'}'
                                        +'],'
                                      +'"explainSpendingChanges": "Spending Changes",'
                                      +'"fundingAcknowledgement": "Funding",'
                                      +'"completedEvaluation": "yes"'
                                    +'}'
                                +'}';
        RestRequest req = new RestRequest(); 
        req.requestBody = Blob.valueof(requestBody);
        RestResponse res = new RestResponse();
    
        req.requestURI = '/services/apexrest/loadApprovals';  // sample Endpoint
        req.httpMethod = 'POST';
        RestContext.request = req;
        RestContext.response = res;
        
        HttpCreateApprovals.uploadRecords();
        //TestService.doGet();
    }
}