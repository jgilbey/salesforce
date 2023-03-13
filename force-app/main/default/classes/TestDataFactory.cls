/***********************************************************************************
* Name          :  TestDataFactory
* Description   :  Create Test Data
* Author        :  Gajendra Singh

Modification Log
----------------
Date                Version     Developer                  Comments 
------------------------------------------------------------------------------------
21/11/2019          1.0.0       Gajendra                   Created
10/03/2021          1.0.1       Antony                     Updated to include Custom Settings and a Contact Email Address.
13/03/2021          1.0.2       Alicia                     Updated to include no insert versions of the CreateAccount & CreateContact methods
20/09/2022          1.0.3       Rakesh                     Creating methods for all recordtypes of Grants
22/09/2022			1.0.4		Rakesh					   Creating Methods for Project Cost and Project Income
/**********************************************************************************************************************/
@isTest
public class TestDataFactory {
    public static Account testAccount;
    public static Contact testContact;  
  
    public static void SetupBaseTestData(){
        createAccount();
        createContact();
        createRegions();
    }
  
    public static Account createAccount() {
          Account acct = new Account(Name='Test Account');        
          insert acct;
          testAccount = acct;
          return testAccount;
    } 
  
    public static Contact createContact(){
        Contact cnt = new Contact(firstname='first', lastname='last', accountId=testAccount.id, email='ApexTest@ExampleTestEmail.com');
        insert cnt;
        testContact = cnt;
        return testContact;
    }

  public static Portal_Authentication__c createPortalAuthenticationSetting(){
      Portal_Authentication__c pa = new Portal_Authentication__c(EndPoint__c = 'https://my.webhookrelay.com/v1/webhooks/72b44e32-dc1e-49bc-91ec-96df547f8255',
                                                                 Password__c = 'salesforce',
                                                                 UserName__c = 'salesforce',
                                                                 SetupOwnerId=UserInfo.getOrganizationId());
      insert pa;
      return pa;
  }

  public static User createTestUser(String name, String contactId ) {
    String email = name+'@testUser' + Datetime.now().getTime() + '.com';
    User userRecord = new User(LastName = name,
                              UserName = email, Email = email                          
                              );
    return userRecord;
  }

  public static User createCommunityUser(String lastName, String contactId) {
      Profile profileRecord = [Select Id from profile where Name='Applicant Community User']; 
      
      String orgId=UserInfo.getOrganizationId(); 
      String dateString=String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','') ;
      Integer RandomId=Integer.valueOf(Math.rint(Math.random()*1000000)); 
      String uniqueName=orgId+dateString+RandomId; 
      User commnunityUser=new User(firstname = 'ABC', 
                        lastName = lastName, 
                        email = uniqueName + '@test' + orgId + '.org', 
                        Username = uniqueName + '@test' + orgId + '.org', 
                        EmailEncodingKey = 'ISO-8859-1', 
                        Alias = uniqueName.substring(18, 23), 
                        TimeZoneSidKey = 'America/Los_Angeles', 
                        LocaleSidKey = 'en_US', 
                        LanguageLocaleKey = 'en_US', 
                        ProfileId = profileRecord.Id,
                        ContactId = contactId
                      ); 
      
      
      return commnunityUser;
  } 

  public static User createAdminUser() {
    UserRole portalRole = [Select Id From UserRole Where Name = 'Head of Engagement' Limit 1];
    Profile profile1 = [Select Id from Profile where name = 'System Administrator'];
    User portalAccountOwner1 = new User(
    UserRoleId = portalRole.Id,
    ProfileId = profile1.Id,
    Username = System.now().millisecond() + 'test2@test.com',
    Alias = 'batman',
    Email='bruce.wayne@wayneenterprises.com',
    EmailEncodingKey='UTF-8',
    Firstname='Bruce',
    Lastname='Wayne',
    LanguageLocaleKey='en_US',
    LocaleSidKey='en_US',
    TimeZoneSidKey='America/Chicago'
    );
    insert portalAccountOwner1;
    return portalAccountOwner1;
  }
  
  public static String createDocument(String title, String entityId) {
    Blob bodyBlob = Blob.valueOf('Test content'); 
            
            ContentVersion contentVersionRecord = new ContentVersion(
                Title = title, 
                PathOnClient = 'SampleTitle.jpg',
                VersionData = bodyBlob
            );
            insert contentVersionRecord;
            
            contentVersionRecord = [SELECT Id, Title, ContentDocumentId 
                            FROM ContentVersion WHERE Id = :contentVersionRecord.Id LIMIT 1];
            
            ContentDocumentLink contentlink = new ContentDocumentLink();
            contentlink.LinkedEntityId = entityId;
            contentlink.contentdocumentid = contentVersionRecord.contentdocumentId;
            contentlink.ShareType = 'V';
            insert contentlink;
      return contentVersionRecord.ContentDocumentId;
  }
    
    public static Case createNHMFProject() {
		  return new Case(Subject = 'Some Case Subject', Confirm_award_amount__c = true, RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Memorial').getRecordTypeId() );
    }

      
    public static account createAccount_NoInsert(){
        Account acc = new Account(Name='Test Account');  
        return acc;
    }
      
    public static contact createContact_NoInsert(id accId){
        Contact con = new Contact(firstname='first', lastname='last', accountId=accId, email='ApexTest@ExampleTestEmail.com');
        return con;
    }
  
    public static void createRegions(){
        List<Region_Areas__c> listRegions = new List<Region_Areas__c>();
        listRegions.add(new Region_Areas__c(PostCode_Area__c = 'AB', PostCode_Area_Name__c = 'Aberdeen', Region__c = 'Scotland'));
        listRegions.add(new Region_Areas__c(PostCode_Area__c = 'BI', PostCode_Area_Name__c = 'Birmingham', Region__c = 'Wales'));
        listRegions.add(new Region_Areas__c(PostCode_Area__c = 'BR', PostCode_Area_Name__c = 'Bradford', Region__c = 'North'));
        insert listRegions;
    }
  
    public static Case createSmallGrantCase(boolean isInsert){
      Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Small_Grant_3_10k').getRecordTypeId();
      Case cs= New Case(Description = 'Test Case',                             
                                Status = 'New',
                                RecordTypeId= recordTypeId,
                                //AccountId = testAccount.id,
                                //ContactId = testContact.id,                                
                                Project_Post_Code__c = 'BR12345',
                                Grant_Expiry_Date__c = Date.today().AddDays(5)
                                );
  
      if(isInsert){
          insert cs;
      }
      return cs;
    }
    
    //Creating project cost for given project and number of project costs to be created 
    public static List<Project_Cost__c> createProjectCost(id projectId , integer noOfProjCosts)
    {
        List<Project_Cost__c> prjCostLst = new List<Project_Cost__c>();
        for(integer pc = 1 ; pc <= noOfProjCosts ; pc++){
        Project_Cost__c projCost= New Project_Cost__c();
            					projCost.case__c = projectId;
            					projCost.Cost_heading__c = 'Professional fees';                          
                                projCost.Costs__c =1000;
                                projCost.project_Cost_Description__c = 'some professioanl fees description';
            					prjCostLst.add(projCost);
        }
                                
        return prjCostLst;
        
         
    }
    
    ////Creating project Cash contribution for given project and number of project cash contribution to be created
    public static List<Project_Income__c> createProjectIncome(id projectId , integer noOfProjIncome)
    {
        List<Project_Income__c> prjIncomeLst = new List<Project_Income__c>();
        for(integer pi = 1 ; pi <= noOfProjIncome ; pi++){
        Project_Income__c projIncome= New Project_Income__c();
            					projIncome.case__c = projectId;
            					projIncome.Secured__c = false;                          
                                projIncome.Amount_you_have_received__c =500;
                                projIncome.Description_for_cash_contributions__c = 'CC1';
            					prjIncomeLst.add(projIncome);
        }
                                
        return prjIncomeLst;
        
         
    }
    
    
    public static Case createLargeGrantCase(boolean isInsert){
      Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Large_Development_250_500k').getRecordTypeId();
      Case cs= New Case(Description = 'Test Case Large Grant',                             
                                Status = 'New',
                                RecordTypeId= recordTypeId,
                                //ContactId = testContact.id,
                                //AccountId = testAccount.id,
                                Project_Post_Code__c = 'BR12345',
                                Grant_Expiry_Date__c = Date.today().AddDays(5)
                                );
  
      if(isInsert){
          insert cs;
      }
      return cs;
    }
    public static Case createMemorial(boolean isInsert){
      Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Memorial').getRecordTypeId();
      Case cs= New Case(Description = 'Test Case Memorial',                             
                                Status = 'New',
                                RecordTypeId= recordTypeId,
                                ContactId = testContact.id,
                                AccountId = testAccount.id,
                                Project_Post_Code__c = 'BR12345',
                                Grant_Expiry_Date__c = Date.today().AddDays(5)
                                );
  
      if(isInsert){
          insert cs;
      }
      return cs;
    }
    public static Case createMedium(boolean isInsert){
      Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Medium').getRecordTypeId();
      Case cs= New Case(Description = 'Test Case Medium',                             
                                Status = 'New',
                                RecordTypeId= recordTypeId,
                                ContactId = testContact.id,
                                AccountId = testAccount.id,
                                Project_Post_Code__c = 'BR12345',
                                Grant_Expiry_Date__c = Date.today().AddDays(5)
                                );
  
      if(isInsert){
          insert cs;
      }
      return cs;
    }
    public static Case createLarge(boolean isInsert){
      Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Large').getRecordTypeId();
      Case cs= New Case(Description = 'Test Case Large',                             
                                Status = 'New',
                                RecordTypeId= recordTypeId,
                                //ContactId = testContact.id,
                                //AccountId = testAccount.id,
                                Project_Post_Code__c = 'BR12345',
                                Grant_Expiry_Date__c = Date.today().AddDays(5)
                                );
  
      if(isInsert){
          insert cs;
      }
      return cs;
    }
        
    public static EOI_Project_Enquiry__c createEOI_ProjectEnquiry(boolean isInsert){
      Id recordTypeId = Schema.SObjectType.EOI_Project_Enquiry__c.getRecordTypeInfosByDeveloperName().get('EOI_NHMF').getRecordTypeId();//Project_Enquiry
      EOI_Project_Enquiry__c eoi= New EOI_Project_Enquiry__c(
                                RecordTypeId= recordTypeId,
                                Name_of_your_organisation__c = testAccount.id,
                                Project_PostCode__c = 'BR12345'
                                );
  
      if(isInsert){
          insert eoi;
      }
      return eoi;
    }
    
  
  }