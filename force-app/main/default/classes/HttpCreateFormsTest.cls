@isTest
private class HttpCreateFormsTest {

    @testSetup
    static void createTestData(){
    
        Case cas=new Case();
        cas.ApplicationId__c ='9453d770-e450-11e9-b3b6-212ded63c337';
        insert cas;
    }
 
     @isTest static void testCallout() {
     
         String requestBody='{'
                              +'"meta": {'
                                  +'"form": "Permission-to-start",'
                                  +'"schemaVersion": "v1.x",'
                                  +'"environment": "production",'
                                  +'"commitId": "b4ecf18eae01d34b296e9388f387cc42bf7c0f93",'
                                  +'"locale": "en",'
                                  +'"username": "example@example.com",'
                                  +'"applicationId": "9453d770-e450-11e9-b3b6-212ded63c337",'
                                  +'"startedAt": "2019-05-17T15:34:13.000Z"'
                                +'},'
                              +'"application": {'
                                  +'"proposedChanges": "freeText",'
                                  +'"permissions": ['
                                        +'{"permissionType": "free text","anticipatedDate": "2019-01-01","receivedDate": "2019-01-02"},'
                                        +'{"permissionType": "free text 2","anticipatedDate": "2019-01-01","receivedDate": null}'
                                        +'],'
                                      +'"bankAccountName": "free text",'
                                      +'"bankAccountNumber": "12345678" ,'
                                      +'"buildingSocietyNumber": "12345678",'
                                      +'"bankAccountsortCode": "12345678",'
                                      +'"paymentReference": "free text",'            
                                      +'"signatory1": "Jane",'
                                      +'"signatory2": "John",'
                                      +'"signatory3": "David",'
                                      +'"securedPartnershipFunding": "Yes",'
                                      +'"willAdvertise": "notApplicable",'
                                      +'"hasStatutoryPermissions": "Yes",'
                                      +'"agreeTerms": true,'
                                      +'"termsPersonName": "Jane",'
                                      +'"termsPersonOrganisation": "foo charity",'
                                      +'"termsPersonPosition": "free text",'
                                      +'"terms1": true,'                                                           
                                      +'"terms2": true,'                                                          
                                      +'"terms3": true,'                                                           
                                      +'"terms4": true,'                                                           
                                      +'"terms5": true,'                                                           
                                      +'"terms6": true,'
                                      +'"onBehalfOfPartnership": true'
                                +'}'
                            +'}';
        RestRequest req = new RestRequest(); 
        req.requestBody = Blob.valueof(requestBody);
        RestResponse res = new RestResponse();
    
        req.requestURI = '/services/apexrest/loadApprovals';  // sample Endpoint
        req.httpMethod = 'POST';
        RestContext.request = req;
        RestContext.response = res;
        
        HttpCreateForms.uploadRecords();
        //TestService.doGet();
    }
}