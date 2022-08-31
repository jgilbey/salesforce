/*Test coverage foe ActionFramework*/

@isTest
private class Test_ActionFramework {
    
    @Testsetup
    static void createData(){
        Account acct=TestDataFactory.createAccount();
        contact cont1=TestDataFactory.createContact();
        Id recordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByDeveloperName().get('ROSS_Consultant').getRecordTypeId();
        Contact cont = new Contact(RecordTypeId= recordTypeId,firstname='first', lastname='last', accountId=acct.id);
        insert cont;

        Case c=TestDataFactory.createSmallGrantCase(false); 
        c.ContactId = cont.id;
        insert c;

        Ross_Consultant__c rcons=new Ross_Consultant__c();
        rcons.PO_Number__c =10.0;
        rcons.Consultant__c=cont.Id;
        rcons.Case__c =c.Id;
        insert rcons;
        
        Ross_Consultant__c rcons1=new Ross_Consultant__c();
        //rcons1.PO_Number__c =10.0;
        rcons1.Consultant__c=cont.Id;
        rcons1.Case__c =c.Id;
        insert rcons1;
        //ActionFramework.generatePONumber('');
    }
    
    @isTest
    private static void processActin(){
        Ross_Consultant__c rcon=[Select Id,PO_Number__c from Ross_Consultant__c Where PO_Number__c=null];
        ActionFramework.generatePONumber(rcon.Id);

        Case objCase = [Select id from case limit 1];
        Error_Log__c objErrorLog = new Error_Log__c(Project__c = objCase.id, Resolved__c = false, Callout_Request__c = true);
        insert objErrorLog;

        ActionFramework.processErrorLog(objErrorLog.id);

    }
}