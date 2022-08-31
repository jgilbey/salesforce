global with sharing class ProfileMenuController {
    global ProfileMenuController() {
        
    }
    
    @AuraEnabled
    public static ResponseWrapper obtainUserInfo() {
        Map<String, Object> result = new Map<String, Object>();
        ResponseWrapper response = new ResponseWrapper();
        List<User> userList = [SELECT Id, Name, SmallPhotoUrl, Contact.accountId FROM User
                               WHERE Id =: UserInfo.getUserId()];

        
        if (userList.size() > 0) {

            User u = userList.get(0);
            response.success = true;
            result.put('userInfo', u);
            result.put('isGeneric', u.Contact != null && u.Contact.AccountId == Community_Settings__c.getValues('Generic Account').Id__c);
            response.result = result;
        }

        return response;
    }

    /**
    * @description 
    * Check if we have froms to allow show monitoring tab
    * @author Methods | 01-04-2021 
    * @return boolean 
    **/
    @AuraEnabled
    public static boolean hasForms(){
        Boolean result = false;
        List<Forms__c> formList = [SELECT Id FROM Forms__c WHERE Case__r.Application_Stages__c = 'Monitoring' AND Case__r.EOI_Project_Enquiry__r.Status__c != 'Deleted'];
        Security.stripInaccessible(AccessType.READABLE, formList);
        result = !formList.isEmpty();
        return result; 
    }
}