/**
 * @description       : 
 * @author            : Methods
 * @group             : 
 * @last modified on  : 04-20-2021
 * @last modified by  : Methods
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   04-20-2021   Methods   Initial Version
**/
public without sharing class CommunityAccountCreation {
    /**
    * @description
    * Save contact and account without sharing for 
    * @author Methods | 01-04-2021 
    * @param userContact
    * @param organisationAccount
    **/
    public static void createAccount(Contact userContact, Account organisationAccount) {
        upsert organisationAccount;
        
        userContact.AccountId = organisationAccount.Id;
        update userContact;

        User userRecord = new User(Id = UserInfo.getUserId(), Email = userContact.Email, Phone = userContact.Phone, MobilePhone = userContact.OtherPhone, Title = userContact.Title,
            Street = userContact.MailingStreet, City = userContact.MailingCity, Country = userContact.MailingCountry, PostalCode = userContact.MailingPostalcode);
        update userRecord;
    }
}