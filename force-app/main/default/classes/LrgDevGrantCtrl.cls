/**
    * LrgDevGrantCtrl 
    * Description - Facilitate the Lightning Aura Components that are used on the SF Experience

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-05-10      Initial version            	Facilitate the Lightning Aura Components that are used on the SF Experience
*/

public with sharing class LrgDevGrantCtrl {
    
    /*@AuraEnabled
    public static case getProj(string uId){
		if(uId!=null){
            user uUser = [SELECT id, contactId 
                            	FROM user 
                            	WHERE id =:uId
                            	LIMIT 1 ];
            system.debug('uUser --- '+ uUser);
            
            if(uUser.ContactId !=null){    
                
                return  [SELECT id, Application_Submitted__c, Account.Name, AccountId, ContactId FROM case 
									WHERE contactid =:uUser.ContactId 
                         				AND Internal_review_only__c=false
                                		
                                    LIMIT 1 ];
            }
            return null;
        }
        return null;
    }*/

    @AuraEnabled
    public static case getProj(string uId, string projId, string rt){
		if(uId!=null && projId!=null && rt!=null){
            user uUser = [SELECT id, contactId 
                            	FROM user 
                            	WHERE id =:uId
                            	LIMIT 1 ];
            system.debug('uUser --- '+ uUser);
            
            if(uUser.ContactId !=null){    
                
                return  [SELECT id, Application_Submitted__c, Account.Name, AccountId, ContactId, Project_Reference_Number__c, Project_Title__c,
                         				First_Application_to_NLHF__c, Does_heritage_attract_visitors__c, Delivered_by_partnership__c,
                         				Heritage_considered_to_be_at_risk__c, Any_capital_work_as_part_of_this__c, Capital_work_owner__c, Any_legal_restriction_which_may_impact__c, Project_involved_acquisition_picklist__c, Heritage_Formal_designation__c,
                         				Project_of_scale_in_the_last_5_yrs__c,
                         				Account.Are_you_VAT_registered_picklist__c, Undertaking_Governance_review__c, Account.Organisation_s_Mission_and_Objectives__c
                         			FROM case WHERE contactid =:uUser.ContactId AND id =: projId AND Internal_review_only__c=false AND RecordType.DeveloperName=:rt LIMIT 1 ];
            }
            return null;
        }
        return null;
    }
    
    @AuraEnabled
    public static list<case> getDevProjList(string uId){
        system.debug('uId --- '+ uId);
        if(uId!=null){
            user uUser = [SELECT id, contactId 
                            	FROM user 
                            	WHERE id =:uId
                            	LIMIT 1 ];
            system.debug('uUser --- '+ uUser);
            
            if(uUser.ContactId !=null){    
                
                return  [SELECT id, Application_Submitted__c, Account.Name, AccountId, ContactId, Project_Title__c FROM case WHERE contactid =:uUser.ContactId 
                                		AND Internal_review_only__c=false
                                		AND RecordType.DeveloperName='Large_Development_250_500k'];
            }
            return null;
        }
        return null;
    }
    
    @AuraEnabled
    public static list<case> getDeliveryProjList(string uId){
        system.debug('uId --- '+ uId);
        if(uId!=null){
            user uUser = [SELECT id, contactId 
                            	FROM user 
                            	WHERE id =:uId
                            	LIMIT 1 ];
            system.debug('uUser --- '+ uUser);
            
            if(uUser.ContactId !=null){    
                
                return  [SELECT id, Application_Submitted__c, Account.Name, AccountId, ContactId, Project_Title__c FROM case WHERE contactid =:uUser.ContactId 
                                		AND Internal_review_only__c=false
                                		AND RecordType.DeveloperName='Large'];
            }
            return null;
        }
        return null;
    }
    
    /*@AuraEnabled
    public static list<case> getAwardedProjList(string uId){
        system.debug('uId --- '+ uId);
        if(uId!=null){
            user uUser = [SELECT id, contactId 
                            	FROM user 
                            	WHERE id =:uId
                            	LIMIT 1 ];
            system.debug('uUser --- '+ uUser);
            
            if(uUser.ContactId !=null){    
                
                return  [SELECT id, Application_Submitted__c, Account.Name, AccountId, ContactId, Project_Title__c FROM case 
                         			WHERE contactid =:uUser.ContactId 
                                		AND Internal_review_only__c=false
                                		AND Legal_agreement_in_place__c=true
                         				AND (RecordType.DeveloperName='Large' OR RecordType.DeveloperName='Large_Development_250_500k')
                        ];
            }
            return null;
        }
        return null;
    }*/

    @AuraEnabled
    public static boolean isSubmitted(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            case project = [SELECT id, Application_Submitted__c FROM case WHERE id=:projId LIMIT 1 ];
            system.debug('project --- '+ project);

            return project.Application_Submitted__c;
        }
        return null;
    }

    @AuraEnabled
    public static void submitApplication(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            case project = [SELECT id, Application_Submitted__c FROM case WHERE id=:projId LIMIT 1 ];
            system.debug('project --- '+ project);
            
            project.Application_Submitted__c=true;
            project.Submission_Date_Time_Large__c = system.now();
            update project;
            
            CaseIncomeAndCostsCtrl.deleteBlankCostsIncome(project.id);
        }
    }
    

}