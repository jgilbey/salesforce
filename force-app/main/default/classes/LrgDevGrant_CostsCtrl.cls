public with sharing class LrgDevGrant_CostsCtrl {

    /*@AuraEnabled
    public static case getProj(string uId){
        return LrgDevGrantCtrl.getProj(uId);
    }*/

    @AuraEnabled
    public static boolean isSubmitted(string projId){
        return LrgDevGrantCtrl.isSubmitted(projId);
    }
    
    @AuraEnabled
    public static list<Project_Cost__c> getDevCosts(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            list<Project_Cost__c> devCosts = [SELECT id, Costs__c, Vat__c, Cost_heading__c, Project_Cost_Description__c, Total_Cost__c
                                                FROM Project_Cost__c 
                                                WHERE Case__c =: projId 
                                                    AND RecordType.DeveloperName = 'Large_Grants_Development'];
            system.debug('devCosts --- '+ devCosts);
            
            return devCosts;
            
        }
        return new list<Project_Cost__c>();
    }
    
    @AuraEnabled
    public static list<Project_Cost__c> getDelCosts(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            list<Project_Cost__c> delCosts = [SELECT id, Costs__c, Vat__c, Cost_heading__c, Cost_Type__c, Project_Cost_Description__c, Total_Cost__c
                                                FROM Project_Cost__c 
                                                WHERE Case__c =: projId 
                                                    AND RecordType.DeveloperName = 'Large_Grants_Delivery'
                                             	ORDER BY Cost_Type__c];
            system.debug('delCosts --- '+ delCosts);
            
            return delCosts;
            
        }
        return new list<Project_Cost__c>();
    }

    @AuraEnabled
    public static list<Project_Cost__c> getActualDelCosts(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            list<Project_Cost__c> delCosts = [SELECT id, Costs__c, Vat__c, Cost_heading__c, Cost_Type__c, Project_Cost_Description__c, Total_Cost__c
                                                FROM Project_Cost__c 
                                                WHERE Case__c =: projId 
                                                    AND RecordType.DeveloperName = 'Large_Grants_Actual_Delivery'
                                             	ORDER BY Cost_Type__c];
            system.debug('delCosts --- '+ delCosts);
            
            return delCosts;
            
        }
        return new list<Project_Cost__c>();
    }
    
    @AuraEnabled
    public static list<Project_Cost__c> updateCosts(list<Project_Cost__c> costList){
        system.debug('costList --- '+ costList);
        if(costList!=null){
            update costList;
            return costList;
        }
        return new list<Project_Cost__c>();
    }
    
    @AuraEnabled
    public static list<Project_Income__c> getDevIncome(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            list<Project_Income__c> devIncome = [SELECT id, Source_Of_Funding__c, Description_for_cash_contributions__c, Secured__c, 
                                                    Evidence_for_secured_income__c,Amount_you_have_received__c
                                                FROM Project_Income__c  
                                                WHERE Case__c =: projId 
                                                    AND RecordType.DeveloperName = 'Large_Development'];
            system.debug('devIncome --- '+ devIncome);
            
            return devIncome;
            
        }
        return new list<Project_Income__c>();
    }
    
    @AuraEnabled
    public static list<Project_Income__c> getDelIncome(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            list<Project_Income__c> delIncome = [SELECT id, Source_Of_Funding__c, Description_for_cash_contributions__c, Secured__c, 
                                                    Evidence_for_secured_income__c,Amount_you_have_received__c
                                                FROM Project_Income__c 
                                                WHERE Case__c =: projId 
                                                    AND RecordType.DeveloperName = 'Large_Grants_Delivery'];
            system.debug('delIncome --- '+ delIncome);
            
            return delIncome;
            
        }
        return new list<Project_Income__c>();
    }

    @AuraEnabled
    public static list<Project_Income__c> getActualDelIncome(string projId){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            list<Project_Income__c> delIncome = [SELECT id, Source_Of_Funding__c, Description_for_cash_contributions__c, Secured__c, 
                                                    Evidence_for_secured_income__c,Amount_you_have_received__c
                                                FROM Project_Income__c 
                                                WHERE Case__c =: projId 
                                                    AND RecordType.DeveloperName = 'Large_Grants_Actual_Delivery'];
            system.debug('delIncome --- '+ delIncome);
            
            return delIncome;
            
        }
        return new list<Project_Income__c>();
    }
    
    @AuraEnabled
    public static list<Project_Income__c> updateIncome(list<Project_Income__c> incomeList){
        system.debug('IncomeList --- '+ IncomeList);
        if(IncomeList!=null){
            update IncomeList;
            return IncomeList;
        }
        return new list<Project_Income__c>();
    }
    

}