global without sharing class SelfRegisterComponentController {
	private static final String USERNAME_SUFIX = '.nhmf';
    global SelfRegisterComponentController() {

    }    

    @TestVisible 
    private static boolean isValidPassword(String password, String confirmPassword) {
        return password == confirmPassword;
    }
    
    @TestVisible 
    private static boolean siteAsContainerEnabled(String communityUrl) {
        Auth.AuthConfiguration authConfig = new Auth.AuthConfiguration(communityUrl,'');
        return authConfig.isCommunityUsingSiteAsContainer();
    }
    
    @TestVisible 
    private static void validatePassword(User u, String password, String confirmPassword) {
        if(!Test.isRunningTest()) {
         Site.validatePassword(u, password, confirmPassword);
        }
        return;
    }
    @AuraEnabled
    public static String obtainCommunityLanguages(){
        return PersonalInformationComponentController.obtainCommunityLanguages();
    }
    
    @AuraEnabled
    global static String selfRegister(String firstname ,String lastname, String email, String password, String confirmPassword, String accountId, String regConfirmUrl, String extraFields, String startUrl, Boolean includePassword/* , String organisationName */) {
        Savepoint sp = null;
        try {
            System.debug('Start');
            sp = Database.setSavepoint();
            
            if (firstname == null || String.isEmpty(firstname)) {
                return 'First Name is required.';
            }
            if (lastname == null || String.isEmpty(lastname)) {
                return Label.Site.lastname_is_required;
            }
            
            if (email == null || String.isEmpty(email)) {
                return Label.Site.email_is_required;
            }

            if(isEmailRegistered(email)){
                return Label.Existing_email_message;
            }
            /* if (organisationName == null || String.isEmpty(organisationName)) {
                return 'Organisation Name required';
            } */
            
            User u = new User();
            u.Username = email + USERNAME_SUFIX;
            u.put('Email', email);
            
            u.FirstName = firstname;
            u.LastName = lastname;
            
            String networkId = Network.getNetworkId();

            // If using site to host the community the user should not hit s1 after logging in from mobile.
            if(networkId != null && siteAsContainerEnabled(Network.getLoginUrl(networkId))) {
                u.put('UserPreferencesHideS1BrowserUI',true);
            }
            
            String nickname = ((firstname != null && firstname.length() > 0) ? firstname.substring(0,1) : '' ) + lastname.substring(0,1);
            nickname += String.valueOf(Crypto.getRandomInteger()).substring(1,7);
            u.put('CommunityNickname', nickname);
                        
            if (extraFields != null) {
                List<Object> extraFieldsList = (List<Object>) JSON.deserializeUntyped(extraFields);        
                for (Object thisFieldObject : extraFieldsList) {
                    Map<String,Object> thisField = (Map<String,Object>) thisFieldObject;
                    Schema.SObjectField sof = Schema.SObjectType.User.fields.getMap().get((String) thisField.get('fieldPath'));
                    u.put(sof, thisField.get('value'));
                }
            }
                        
            if (includePassword) {    
                if (!isValidPassword(password, confirmPassword)) {
                    return Label.site.passwords_dont_match;
                }
                validatePassword(u, password, confirmPassword);
            }
            else {
                password = null;
            }
            
            // lastName is a required field on user, but if it isn't specified, we'll default it to the username
            System.debug('Before user creation');
            // obtainsOranisationId(organisationName)
            String userId = Site.createPortalUser(u, accountId, password);
            System.debug('After user creation');
            // create a fake userId for test.
            if (Test.isRunningTest()) {
                userId = 'fakeUserId';           
            }
            if (userId != null) { 
                ApexPages.PageReference pageRef = (password != null && password.length() > 1) ? Site.login(email, password, startUrl) : new PageReference(regConfirmUrl);
                
                if(!Test.isRunningTest()) {
                    aura.redirect(pageRef);
                }
            }
            return null;
        }
        catch (Exception ex) {
            Database.rollback(sp);
            return ex.getMessage();            
        }
    }
    
    static Boolean isEmailRegistered(String email) {
        return [SELECT count() FROM User WHERE Email = :email] > 0;
    }
	
    @TestVisible
    static String obtainsOranisationId(String organisationName) {
        Account organisationAccount = new Account(Name = organisationName);
        List<Account> organisationAccountList = [SELECT Id FROM Account WHERE Name = :organisationName];  
        if(!organisationAccountList.isEmpty()) {
            organisationAccount.Id = organisationAccountList.get(0).Id;
        } else {
            upsert organisationAccount;
        }
        return organisationAccount.Id;
    }

    @AuraEnabled
    public static Boolean reCaptchaVerify(String response){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://www.google.com/recaptcha/api/siteverify');
        request.setMethod('POST');
        request.setBody('secret=' + Community_Settings__c.getValues('Secret_Key').Key_value__c + '&response=' + response);
        HttpResponse res = http.send(request);

        if (res.getStatusCode() == 200) {
            System.debug(res.getBody());
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            Boolean isSuccess = (result.containsKey('success') && result.get('success') == true);
            return isSuccess;
        }
        
        return false;
    }
        
    @AuraEnabled
    global static List<Map<String,Object>> getExtraFields(String extraFieldsFieldSet) { 
        List<Map<String,Object>> extraFields = new List<Map<String,Object>>();
        Schema.FieldSet fieldSet = Schema.SObjectType.User.fieldSets.getMap().get(extraFieldsFieldSet);
        if(!Test.isRunningTest()) {
        if (fieldSet != null) {
            for (Schema.FieldSetMember f : fieldSet.getFields()) {
                Map<String, Object> fieldDetail = new Map<String, Object>();
                fieldDetail.put('dbRequired', f.getDBRequired());
                fieldDetail.put('fieldPath', f.getFieldPath());
                fieldDetail.put('label', f.getLabel());
                fieldDetail.put('required', f.getRequired());
                fieldDetail.put('type', f.getType());
                fieldDetail.put('value', '');   // client will populate
                extraFields.add(fieldDetail);
            }}}
        return extraFields;
    }
    
    @AuraEnabled
    global static String setExperienceId(String expId) {
        // Return null if there is no error, else it will return the error message 
        try {
            if (expId != null) {
                Site.setExperienceId(expId);   
            }
            return null; 
        } catch (Exception ex) {
            return ex.getMessage();            
        }        
    }  
    
}