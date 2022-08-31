public with sharing class CaseIncomeAndCostsCtrl {
    
    public static void insertedProjects(List<Case> listOfCases){
        
        list<Project_Cost__c> costList = new list<Project_Cost__c>();
        list<Project_Income__c> incomeList = new list<Project_Income__c>();
        
        string lrgProjectRTidDev = Schema.SobjectType.Case.getRecordTypeInfosByDeveloperName().get('Large_Development_250_500k').getRecordTypeId();
        string lrgProjectRTidDel = Schema.SobjectType.Case.getRecordTypeInfosByDeveloperName().get('Large').getRecordTypeId();
        for(case newProject: listOfCases){
            if(newProject.recordTypeid==lrgProjectRTidDev || newProject.recordTypeid==lrgProjectRTidDel){
                list<Project_Cost__c> newCostList = createCosts(newProject.id, false, newProject.recordTypeid, lrgProjectRTidDev);
                list<Project_Income__c> newIncomeList = createIncome(newProject.id, false, newProject.recordTypeid, lrgProjectRTidDev);
                
                costList.addAll(newCostList);
                incomeList.addAll(newIncomeList);
            }
        }
        insert costList;
        insert incomeList;
        
    }
    
    @AuraEnabled
    public static list<Project_Cost__c> createCosts(string projId, boolean forInsert, string recordTypeId, string lrgProjectRTidDev){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            
            list<Project_Cost__c> costList = new list<Project_Cost__c>();
            
            string devCostRTid = Schema.SobjectType.Project_Cost__c.getRecordTypeInfosByDeveloperName().get('Large_Grants_Development').getRecordTypeId();
            string delPropCostRTid = Schema.SobjectType.Project_Cost__c.getRecordTypeInfosByDeveloperName().get('Large_Grants_Delivery').getRecordTypeId();
            
            string delCostRTid = Schema.SobjectType.Project_Cost__c.getRecordTypeInfosByDeveloperName().get('Large_Grants_Actual_Delivery').getRecordTypeId();
            
            system.debug('devCostRTid - '+devCostRTid);
            system.debug('delCostRTid - '+delCostRTid);
            
            if(recordTypeId == lrgProjectRTidDev){
                
                delCostRTid = delPropCostRTid; 
                //Costs Headings for Development & Delivery
                list<string> devCostList = new list<string>{    'New staff', 
                                                                'Professional fees',
                                                                'Opening-up works / Surveys',
                                                                'Capacity Building Activity',
                                                                'Recruitment',
                                                                'Other costs (development phase)',
                                                                'Full Cost Recovery',
                                                                'Contingency',
                                                                'Non-cash contributions',
                                                                'Volunteer time'   
                                                                };
                                                                    
                //Create Costs Development & Delivery
                for(string costHeading: devCostList){
                    Project_Cost__c newCost = new Project_Cost__c(  Case__c=projId,
                                                                    recordTypeid=devCostRTid,
                                                                    Cost_heading__c=costHeading
                                                                    );
                    costList.add(newCost);
                    
                }
            }
            
            
            
            list<string> delCostCapitalList = new list<string>{ 'Purchase price of heritage items', 
                                                                'Preliminary works (e.g scaffolding, preliminaries, pre-construction archaeology)',
                                                                'Repair and conservation work',
                                                                'New building work',
                                                                'Other capital work',
                                                                'Digital outputs',
                                                                'Equipment and materials (capital)',
                                                                'Other costs (capital)',
                                                                'Professional fees (capital)'
                                                                };
            
            list<string> delCostActivityList = new list<string>{'New staff',
                                                                'Training for staff',
                                                                'Paid training placements',
                                                                'Training for volunteers',
                                                                'Travel and expenses for staff',
                                                                'Travel and expenses for volunteers',
                                                                'Event costs',
                                                                'Equipment and materials (activity)',
                                                                'Other costs (activity)',
                                                                'Professional fees (activity)'};
            
            list<string> delCostOtherList = new list<string>{   'Recruitment',
                                                                'Publicity and promotion',
                                                                'Evaluation',
                                                                'Other',
                                                                'Full Cost Recovery',
                                                                'Community grants',
                                                                'Contingency',
                                                                'Inflation',
                                                                'Increased management and maintenance costs (maximum five years)',
                                                                'Non-cash contributions',
                                                                'Volunteer time'
                                                                };
                                                                    
            if(recordTypeId == lrgProjectRTidDev){
            	
            }                                                    
                                                                    
                                                                    
           
            for(string costHeading: delCostCapitalList){
                Project_Cost__c newCost = new Project_Cost__c(  Case__c=projId,
                                                                recordTypeid=delCostRTid,
                                                                Cost_Type__c='Capital cost',
                                                                Cost_heading_Delivery__c=costHeading
                                                                );
                costList.add(newCost);
                
            }
            for(string costHeading: delCostActivityList){
                Project_Cost__c newCost = new Project_Cost__c(  Case__c=projId,
                                                                recordTypeid=delCostRTid,
                                                                Cost_Type__c='Activity cost',
                                                                Cost_heading_Delivery__c=costHeading
                                                                );
                costList.add(newCost);
                
            }
            for(string costHeading: delCostOtherList){
                Project_Cost__c newCost = new Project_Cost__c(  Case__c=projId,
                                                                recordTypeid=delCostRTid,
                                                                Cost_Type__c='Other cost',
                                                                Cost_heading_Delivery__c=costHeading
                                                                );
                costList.add(newCost);
                
            }
            //END Create Costs Development & Delivery

            system.debug('costList - '+costList);
            if(forInsert){
                insert costList;
            }
            return costList;
        }
        return null;
    }
    
    @AuraEnabled
    public static list<Project_Income__c> createIncome(string projId, boolean forInsert, string recordTypeId, string lrgProjectRTidDev){
        system.debug('projId --- '+ projId);
        if(projId!=null){
            
            list<Project_Income__c> incomeList = new list<Project_Income__c>();
            
            string devIncomeRTid = Schema.SobjectType.Project_Income__c.getRecordTypeInfosByDeveloperName().get('Large_Development').getRecordTypeId();
            string delPropIncomeRTid = Schema.SobjectType.Project_Income__c.getRecordTypeInfosByDeveloperName().get('Large_Grants_Delivery').getRecordTypeId();
            
            string delIncomeRTid = Schema.SobjectType.Project_Income__c.getRecordTypeInfosByDeveloperName().get('Large_Grants_Actual_Delivery').getRecordTypeId();
            
            system.debug('devIncomeRTid - '+devIncomeRTid);
            system.debug('delIncomeRTid - '+delIncomeRTid);
            
            if(recordTypeId == lrgProjectRTidDev){
                
                delIncomeRtid = delPropIncomeRTid; 
                
                //Income Source for Development & Delivery
                list<string>  devIncomeList = new list<string>{  'Local authority', 
                                                                'Other public sector',
                                                                'Central government',
                                                                'Private donation - Individual',
                                                                'Private donation - Trusts/Charities/Foundations',
                                                                'Private donations - corporate',
                                                                'Commercial/business',
                                                                'Own reserves',
                                                                'Other fundraising',
                                                                'Loan/Finance',
                                                                'Non cash contributions',
                                                                'Volunteer Time'
                                                                };
                                                                    
                 //Create Income Development & Delivery
                for(string incomeSource: devIncomeList){
                    Project_Income__c newIncome = new Project_Income__c(    Case__c=projId,
                                                                    recordTypeid=devIncomeRTid,
                                                                    Source_Of_Funding__c=incomeSource
                                                                    );
                    incomeList.add(newIncome);
                    
                }         
            }
            
            list<string> delIncomeList = new list<string>{  'Local authority', 
                                                            'Other public sector',
                                                            'Central government',
                                                            'Private donation - Individual',
                                                            'Private donation - Trusts/Charities/Foundations',
                                                            'Private donations - corporate',
                                                            'Commercial/business',
                                                            'Own reserves',
                                                            'Other fundraising',
                                                            'Loan/Finance',
                                                            'Increased management and maintenance costs (maximum five years)',
                                                            'Non cash contributions',
                                                            'Volunteer Time'
                                                            };
               
            
            for(string incomeSource: delIncomeList){
                Project_Income__c newIncome = new Project_Income__c(    Case__c=projId,
                                                                recordTypeid=delIncomeRTid,
                                                                Source_Of_Funding__c=incomeSource
                                                                );
                
                incomeList.add(newIncome);
                
            }
            //END Create Income Development & Delivery
            
            system.debug('incomeList - '+incomeList);
            if(forInsert){
                insert incomeList;
            }
            return incomeList;
        }
        return null;
    }

    @AuraEnabled
    public static void deleteBlankCostsIncome(string projId){
        
        system.debug('projId --- '+ projId);
        if(projId!=null){
            
            list<Project_Cost__c> costsToDelete = [SELECT id FROM Project_Cost__c
                                                    WHERE Case__c=:projId
                                                        AND (Costs__c=0 OR Costs__c=NULL)];
                                                        
            list<Project_Income__c> incomeToDelete = [SELECT id FROM Project_Income__c
                                                        WHERE Case__c=:projId
                                                            AND (Amount_you_have_received__c=0 OR Amount_you_have_received__c=NULL)];
            
            system.debug('costsToDelete - '+costsToDelete);
            system.debug('incomeToDelete - '+incomeToDelete);
            system.debug('costsToDelete.size - '+costsToDelete.size());
            system.debug('incomeToDelete.size - '+incomeToDelete.size());
            delete costsToDelete;
            delete incomeToDelete;
        }
    }
}