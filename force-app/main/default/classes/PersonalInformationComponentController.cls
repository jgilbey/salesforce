/**
 * @description       : 
 * @author            : Methods
 * @group             : 
 * @last modified on  : 04-20-2021
 * @last modified by  : Methods
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   01-04-2021   Methods   Initial Version
**/
public with sharing class PersonalInformationComponentController {

    @AuraEnabled
    public static String obtainCommunityLanguages(){
        Set<String> availableCommunityLangluages = Enabled_Community_Languages__c.getAll().keySet();
        Schema.DescribeFieldResult fieldResult = User.LanguageLocaleKey.getDescribe();

        List<Schema.PicklistEntry> picklistValues = fieldResult.getPicklistValues();
        List<Schema.PicklistEntry> availablePicklistValues = new List<Schema.PicklistEntry>();
        for (Schema.PicklistEntry picklistEntry : picklistValues) {
            if(availableCommunityLangluages.contains(picklistEntry.getvalue())){
                availablePicklistValues.add(picklistEntry);
            }
        }
        return JSON.serialize(availablePicklistValues);
    }

    /**
    * @description
    * retrieve contact and Account for current user
    * @author Methods | 01-04-2021 
    * @return String JSON data contactInfo, organisationInfo
    **/
    @AuraEnabled
    public static String retrievePersonalInformation(){
        Map<String, Object> result = new Map<String, Object>();
        try {
            User currentUser = [SELECT Id, ContactId, Contact.AccountId, LanguageLocaleKey FROM User WHERE Id = :UserInfo.getUserId()];
            result.put('contactInfo', retrieveContactData(currentUser.ContactId));
            result.put('organisationInfo', retrieveOrganisationAccountData(currentUser.Contact.AccountId));
            result.put('currentUser', currentUser);
        } catch (Exception e) {
            System.debug('Error: '+e.getMessage()+ ' in line: ' + e.getLineNumber());
            throw new AuraHandledException(e.getMessage());
        }
        return JSON.serialize(result);
    }

    /**
    * @description
    * retrieve contact data by ID
    * @author Methods | 01-04-2021 
    * @param contactId
    * @return Contact
    **/
    static Contact retrieveContactData(String contactId) {
        Contact userContact = new Contact();
        if(String.isNotBlank(contactId)){
            userContact =  [SELECT Id, FirstName, LastName, Title, AccountId,
                            MailingStreet, MailingCity, MailingCountry, MailingPostalcode, MailingState,
                            Phone, OtherPhone, Email, 
                            Birthdate 
                            FROM Contact WHERE Id = :contactId];
        }
        return userContact;
    }

    /**
    * @description
    * retrieve Account data by ID
    * @author Methods | 01-04-2021 
    * @param accontId
    * @return Account
    **/
    static Account retrieveOrganisationAccountData(String accontId) {
        Account orgainsationAccount = new Account();
        Community_Settings__c genericAccountSettings = Community_Settings__c.getValues('Generic Account');
        if(String.isNotBlank(accontId) && genericAccountSettings.Id__c != accontId){
            orgainsationAccount =  [SELECT Id, Name, 
                                    BillingStreet, BillingCity, BillingCountry, BillingPostalCode, BillingState
                                    FROM Account WHERE Id = :accontId];
        }
        return orgainsationAccount;
    }


    /**
    * @description
    * Save contact and Account data from personal information
    * @author Methods | 01-04-2021 
    * @param userContactJSON
    * @param organisationAccountJSON
    **/
    @AuraEnabled
    public static void savePersonalInformation(String userContactJSON, String organisationAccountJSON, String langluage){
        try {
            Contact userContact = (Contact) JSON.deserialize(userContactJSON, Contact.class);
            Account organisationAccount = (Account) JSON.deserialize(organisationAccountJSON, Account.class);
            if(String.isNotEmpty(langluage)) update new User(Id = UserInfo.getUserId(), LanguageLocaleKey = langluage);

            if(String.isBlank(organisationAccount.Id)) {
                List<Account> accountList = [SELECT Id FROM Account WHERE Name = :organisationAccount.Name];
                if(!accountList.isEmpty()) {
                    organisationAccount.Id = accountList.get(0).Id;
                }
            }
            
            Community_Settings__c defaultAccountOwnerSettings = Community_Settings__c.getValues('Default Account Owner');
            organisationAccount.OwnerId = defaultAccountOwnerSettings.Id__c; 
            CommunityAccountCreation.createAccount(userContact, organisationAccount);
            removeRelationToAccount(new List<String>{userContact.Id}, Community_Settings__c.getValues('Generic Account').Id__c);
        } catch (Exception e) {
            system.debug(e.getMessage() + e.getStackTraceString());
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
    * @description
    * Remove accountContactRelation for contacts and Account
    * @author Methods | 01-04-2021 
    * @param contactIdList
    * @param AccountId
    **/
    static void removeRelationToAccount(List<String> contactIdList, String AccountId) {
        List<AccountContactRelation> existedAccountContactRelationList = [SELECT Id FROM AccountContactRelation WHERE ContactId IN :contactIdList AND AccountId = :AccountId];
        if(!existedAccountContactRelationList.isEmpty()) {
            delete existedAccountContactRelationList;
        }

    }
}