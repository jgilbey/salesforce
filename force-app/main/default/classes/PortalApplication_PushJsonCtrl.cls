public class PortalApplication_PushJsonCtrl {
    
    public class Response{
        public String status;
        public String statusCode;
        public String accountId;
        public String caseId;
        public String caseNumber;
        public String projectRefNumber;
        public String ProjectCostRefID;
        public String Costheading;
        public String Costs;
    }
    
    public static object parseData(String fieldType,Object data){
        
        if(data == null){
            return null;
        }
        if(fieldType =='STRING' || fieldType =='TEXTAREA' || fieldType =='PICKLIST'){
            return (String)data;
        }else if(fieldType == 'BOOLEAN'){
            return Boolean.valueOf(data);
        }else if(fieldType == 'CURRENCY' || fieldType == 'DOUBLE'){
            return (Double)data;
        }else if(fieldType == 'DATE'){
            return Date.valueOf((String)data);
        }
        
        return null;
    }
    
    
	public static void uploadJson(){
        try{
            StaticResource sr = [SELECT Id, Body FROM StaticResource WHERE Name = 'FFEjson' LIMIT 1];
            String response = sr.Body.toString();
            
            System.debug(response);
            Map<String, Object> respMap = (Map<String, Object>)JSON.deserializeUntyped(response);
            Map<String, Object> meta = (Map<String, Object>)respMap.get('meta');
            Map<String, Object> application = (Map<String, Object>)respMap.get('application');
                        
                // Dynamic field mapping are stored on portal application custom metadata 
                Map<String,Map<String,String>> mapDynamic=new Map<String,Map<String,String>>();
                for(Portal_Application__mdt applicatio:[Select Object__c,Label,DeveloperName,Name__c from Portal_Application__mdt]){
                    Map<String,String> mapfields=new Map<String,String>();
                    mapfields.put(applicatio.Name__c,applicatio.DeveloperName);
                    if(mapDynamic.containsKey(applicatio.Object__c)){
                        mapfields.putAll(mapDynamic.get(applicatio.Object__c));    
                    }
                    mapDynamic.put(applicatio.Object__c,mapfields);
                }
                
                // Portal Mapping is used to store picklist between portal and sf
                Map<String,Map<String,List<Map<String,String>>>> mapDynamicFields=new Map<String,Map<String,List<Map<String,String>>>>();
                Map<String,List<Map<String,String>>> mapfieldList=new Map<String,List<Map<String,String>>>();
                for(Portal_Mappings__mdt mapping:[Select Object__c,Portal_Value__c,DeveloperName,Task_Category_Value__c,FieldName__c from Portal_Mappings__mdt]){
                    Map<String,List<Map<String,String>>> mapfields=new Map<String,List<Map<String,String>>>();
                    Map<String,String> mapfieldsValues=new Map<String,String>();
                    List<Map<String,String>> lst=new List<Map<String,String>>();
                    if(mapfieldList.containsKey(mapping.FieldName__c)){
                        lst.addAll(mapfieldList.get(mapping.FieldName__c));
                    }
                    Map<String,String> mapFieldMapping=new Map<String,String>();
                    mapFieldMapping.put(mapping.Portal_Value__c,mapping.Task_Category_Value__c);
                    lst.add(mapFieldMapping);
                    mapfieldList.put(mapping.FieldName__c,lst);
                    
                    if(mapDynamicFields.containsKey(mapping.Object__c)){
                        mapfieldList.putAll(mapDynamicFields.get(mapping.Object__c));    
                    }
                    mapDynamicFields.put(mapping.Object__c,mapfieldList);
                }
                
                
                // Create a new account 
                Account acc=new Account();
                //acc.Name =(String)application.get('organisationName');
                Map<String, Object> organisationAddress = (Map<String, Object>)application.get('organisationAddress');
                acc.BillingStreet =(String)organisationAddress.get('line1');
                acc.Billingcity =(String)organisationAddress.get('townCity');
                acc.BillingCountry =(String)organisationAddress.get('county');
                acc.BillingPostalCode =(String)organisationAddress.get('postcode');
                
                
                if(mapDynamic.containskey('Account')){
                    Map<String,String> mapfields=mapDynamic.get('Account');
                    for(String sfField:mapfields.keySet()){
                        if(sfField !='Organisation_s_Mission_and_Objectives__c'){
                            acc.put(sfField,(String)application.get(mapfields.get(sfField)));
                        }
                    }
                }
                
                // Dynamic field mapping for picklist options
                Map<String,Schema.SObjectField> mapAccountfields=Schema.sobjecttype.Account.fields.getMap();
                if(mapDynamic.containskey('Account')){
                    Map<String,String> mapfields=mapDynamic.get('Account');            
                    for(String sfField:mapfields.keySet()){
                        if(mapDynamicFields.containsKey('Account')){
                            Map<String,List<Map<String,String>>> mapdynfields=mapDynamicFields.get('Account');
                            if(mapdynfields.containskey(sfField)){
                                List<Map<String,String>> lstpickMapping=mapdynfields.get(sfField);
                                string picklistvalue='';
                                for(integer i=0;i<lstpickMapping.size();i++){
                                    Map<String,String> mappickVal=lstpickMapping[i];
                                    if(sfField =='Organisation_s_Mission_and_Objectives__c'){
                                        for(Object obj:(List<Object>)application.get(mapfields.get(sfField))){
                                            if(mappickVal.containsKey((String)obj)){
                                                picklistvalue +=mappickVal.get((String)obj) +';';
                                                System.debug(picklistvalue);
                                            }        
                                        }
                                    }else{
                                        if(mappickVal.containsKey((String)application.get(mapfields.get(sfField)))){
                                            picklistvalue +=mappickVal.get((string)application.get(mapfields.get(sfField))) +';';
                                        }
                                    }
                                    //System.debug(approvals.get(mapfields.get(sfField)));
                                }
                                System.debug(picklistvalue);
                                picklistvalue =picklistvalue.removeEnd(';');
                                acc.put(sfField,picklistvalue);
                            }else{
                                String fieldType=String.valueOf(mapAccountfields.get(sfField).getDescribe().getType());                    
                                System.debug(application.get(mapfields.get(sfField)));
                                acc.put(sfField,parseData(fieldType,application.get(mapfields.get(sfField))));
                            }
                        }
                        
                    }
                }
                
                
                upsert acc Account_External_ID__c;
                
                
                // Create new contact 
                List<Contact> lstcontact=new List<Contact>();
                contact con=new contact();
                con.lastName=(String)application.get('mainContactName');
                con.Birthdate =Date.valueOf((String)application.get('mainContactDateOfBirth'));
                con.Email=(String)application.get('mainContactEmail');
                con.Email__c =con.Email;
                con.phone=(String)application.get('mainContactPhone');
                Map<String, Object> mainContactAddress = (Map<String, Object>)application.get('mainContactAddress');
                
                // Main Contact
                con.MailingStreet =(String)mainContactAddress.get('line1');
                con.Mailingcity =(String)mainContactAddress.get('townCity');
                con.MailingCountry =(String)mainContactAddress.get('county');
                con.MailingPostalCode =(String)mainContactAddress.get('postcode');
                con.AccountId=acc.Id;
                //con.Type__c = 'Primary';
                con.SignatoryRole__c = 'Primary';
                
                contact con1=new Contact();
                con1.AccountId=acc.Id;
                
                // Trustee contact
                con1.SignatoryRole__c = 'Trustee';
                if(mapDynamic.containskey('Contact')){
                    Map<String,String> mapfields=mapDynamic.get('Contact');
                    for(String sfField:mapfields.keySet()){
                        con1.put(sfField,(String)application.get(mapfields.get(sfField)));
                    }
                }
                
                // Authorised signatory one
                lstcontact.add(con);
                Map<String,Object> map1Details=(Map<String,Object>)application.get('authorisedSignatoryOneDetails');
                contact con2=new Contact();
                con2.AccountId=acc.Id;
                //con2.Type__c=(String)map1Details.get('role');
                con2.Email__c=(String)map1Details.get('email');
                boolean isSignatoryOneAlsoApplicant =  Boolean.valueOf(map1Details.get('isAlsoApplicant'));
                if(con.Email__c == con2.Email__c && isSignatoryOneAlsoApplicant){
                    con.Is_Authorised_Signatory__c = true;
                }else{
                    con2.SignatoryRole__c =(String)map1Details.get('role');
                    con2.Lastname=(String)map1Details.get('name');
                    con2.phone=(String)map1Details.get('phone');
                    con2.Email=con2.Email__c;
                    con2.Is_Authorised_Signatory__c = true;
                    lstcontact.add(con2);
                }
                
                
                // Authorised signatory two
                if(application.containsKey('authorisedSignatoryTwoDetails')){
                    Map<String,Object> map2Details=(Map<String,Object>)application.get('authorisedSignatoryTwoDetails');
                    contact con3=new Contact();
                    con3.AccountId=acc.Id;
                    // con3.Type__c=(String)map2Details.get('role');
                    con3.Email__c=(String)map2Details.get('email');
                    boolean isSignatoryTwoAlsoApplicant =  Boolean.valueOf(map2Details.get('isAlsoApplicant'));
                    if(con.Email__c == con3.Email__c && isSignatoryTwoAlsoApplicant){
                        con.Is_Authorised_Signatory__c = true;
                    }else{
                        con3.SignatoryRole__c =(String)map2Details.get('role');
                        con3.Lastname=(String)map2Details.get('name');
                        con3.phone=(String)map2Details.get('phone');
                        con3.Email=con3.Email__c;
                        con3.Is_Authorised_Signatory__c = true;
                        lstcontact.add(con3);
                    }
                    
                }
                
                
                
                upsert lstcontact Email__c;
                
                // Case is created with RT Small or medium
                Map<String,Schema.SObjectField> mapCasefields=Schema.sobjecttype.Case.fields.getMap();
                Case cas=new Case();
                if(meta.get('form') != null){
                    if(meta.get('form') == '10-250k-grant'){
                        cas.recordTypeId =Schema.sobjectType.case.getRecordTypeInfosByDeveloperName().get('Medium').getRecordtypeId();
                    }else{
                        cas.recordTypeId =Schema.sobjectType.case.getRecordTypeInfosByDeveloperName().get('Small_Grant_3_10k').getRecordtypeId();
                    }
                }
                
                // Mapping on case fields
                cas.Project_Title__c =(String)application.get('projectName');
                Map<String, Object> projectDateRange = (Map<String, Object>)application.get('projectDateRange');
                cas.Project_Start_Date__c =Date.valueOf((String)projectDateRange.get('startDate'));
                cas.Project_End_Date__c =Date.valueOf((String)projectDateRange.get('endDate'));
                //cas.Project_Description__c =(String)application.get('yourIdeaProject');
                Map<String, Object> projectAddress = (Map<String, Object>)application.get('projectAddress');
                cas.Project_Post_Code__c =((String)projectAddress.get('projectPostcode'));
                cas.Project_Street__c =((String)projectAddress.get('line1'));
                cas.Project_City__c =((String)projectAddress.get('townCity'));
                cas.Project_County__c =((String)projectAddress.get('county'));
                //cas.Project_End_Date__c =Date.valueOf((String)projectAddress.get('endDate'));
                cas.ContactId =con.Id;
                cas.AccountId =acc.Id;
                cas.Information_not_publically_available__c = (String)application.get('informationNotPubliclyAvailableRequest');
                cas.Keep_Informed__c= (Boolean)application.get('keepInformed');
                cas.Involve_in_research__c= (Boolean)application.get('involveInResearch');
                cas.Delivered_by_partnership__c= (Boolean)application.get('isPartnership');
                cas.Delivery_partner_details__c = (String)application.get('partnershipDetails');
                cas.ApplicationId__c =(String)meta.get('applicationId');
                if(mapDynamic.containskey('Case')){
                    Map<String,String> mapfields=mapDynamic.get('Case');
                    for(String sfField:mapfields.keySet()){
                        String fieldType=String.valueOf(mapCasefields.get(sfField).getDescribe().getType());
                        cas.put(sfField,parseData(fieldType,application.get(mapfields.get(sfField))));
                    }
                }
                
                if(mapDynamic.containskey('Case')){
                    Map<String,String> mapfields=mapDynamic.get('Case');
                    Map<String,List<Map<String,String>>> mapdynfields=mapDynamicFields.get('Case');
                    for(String sfField:mapfields.keySet()){
                        if(mapdynfields.containskey(sfField)){
                            List<Map<String,String>> lstpickMapping=mapdynfields.get(sfField);
                            
                            for(integer i=0;i<lstpickMapping.size();i++){
                                Map<String,String> mappickVal=lstpickMapping[i];
                                
                                if(mappickVal.containsKey((String)application.get(mapfields.get(sfField)))){
                                    cas.put(sfField,mappickVal.get((string)application.get(mapfields.get(sfField))));
                                }
                                //System.debug(approvals.get(mapfields.get(sfField)));
                            }
                        }
                    }
                }
                
                upsert cas ApplicationId__c;
                
                // Mapping with project cost coming from application
                List<Project_Cost__c> lstProjectcost=new List<Project_Cost__c>();
                for(Object obj:(List<Object>)application.get('projectCosts')){
                    Project_Cost__c cost=new Project_Cost__c();
                    cost.Case__c =cas.Id;
                    Map<String,Object> projectCosts =(Map<String, Object>)obj;
                    //cost.Cost_heading__c =String.valueOf(projectCosts.get('costType'));
                    cost.ProjectCost_Ref_ID__c =String.valueOf(projectCosts.get('costId'));
                    cost.Project_Cost_Description__c =String.valueOf(projectCosts.get('costDescription'));
                    cost.Costs__c = Integer.valueOf(String.valueOf(projectCosts.get('costAmount')));
                    if(mapDynamic.containskey('Project_Cost__c')){
                        Map<String,String> mapfields=mapDynamic.get('Project_Cost__c');
                        Map<String,List<Map<String,String>>> mapdynfields=mapDynamicFields.get('Project_Cost__c');
                        for(String sfField:mapfields.keySet()){
                            if(mapdynfields.containskey(sfField)){
                                List<Map<String,String>> lstpickMapping=mapdynfields.get(sfField);
                                
                                for(integer i=0;i<lstpickMapping.size();i++){
                                    Map<String,String> mappickVal=lstpickMapping[i];
                                    if(mappickVal.containsKey((String)projectCosts.get(mapfields.get(sfField)))){
                                        cost.put(sfField,mappickVal.get((string)projectCosts.get(mapfields.get(sfField))));
                                    }
                                    //System.debug(approvals.get(mapfields.get(sfField)));
                                }
                            }
                        }
                    }
                    lstProjectcost.add(cost);
                }
                
                
                upsert lstProjectcost ProjectCost_Ref_ID__c;
                
                
                // Mapping to Volunteer_Non_Cash_Contributions__c with volunteers RT
                List<Volunteer_Non_Cash_Contributions__c> lstVolunteers=new List<Volunteer_Non_Cash_Contributions__c>();
                Id volunteerrecordtypeId=Schema.sobjecttype.Volunteer_Non_Cash_Contributions__c.getRecordTypeInfosByDeveloperName().get('Volunteers').recordTypeId;
                for(Object obj:(List<Object>)application.get('projectVolunteers')){
                    Volunteer_Non_Cash_Contributions__c cost=new Volunteer_Non_Cash_Contributions__c();
                    cost.RecordtypeId =volunteerrecordtypeId;
                    cost.Case__c =cas.Id;
                    Map<String,Object> projectCosts =(Map<String, Object>)obj;
                    cost.Description__c =String.valueOf(projectCosts.get('description'));
                    cost.Hours__c= Integer.valueOf(String.valueOf(projectCosts.get('hours')));
                    lstVolunteers.add(cost);
                }
                // Mapping to Volunteer_Non_Cash_Contributions__c with non cash contributions RT
                Id nonCashrecordtypeId=Schema.sobjecttype.Volunteer_Non_Cash_Contributions__c.getRecordTypeInfosByDeveloperName().get('NonCash_Contributions').recordTypeId;
                for(Object obj:(List<Object>)application.get('nonCashContributions')){
                    Volunteer_Non_Cash_Contributions__c cost=new Volunteer_Non_Cash_Contributions__c();
                    cost.RecordtypeId =nonCashrecordtypeId;
                    cost.Case__c =cas.Id;
                    Map<String,Object> projectCosts =(Map<String, Object>)obj;
                    cost.Description__c =String.valueOf(projectCosts.get('description'));
                    cost.Estimated_Value__c= Integer.valueOf(String.valueOf(projectCosts.get('estimatedValue')));
                    if(mapDynamic.containskey('Volunteer_Non_Cash_Contributions__c')){
                        Map<String,String> mapfields=mapDynamic.get('Volunteer_Non_Cash_Contributions__c');
                        Map<String,List<Map<String,String>>> mapdynfields=mapDynamicFields.get('Volunteer_Non_Cash_Contributions__c');
                        for(String sfField:mapfields.keySet()){
                            if(mapdynfields.containskey(sfField)){
                                List<Map<String,String>> lstpickMapping=mapdynfields.get(sfField);
                                
                                for(integer i=0;i<lstpickMapping.size();i++){
                                    Map<String,String> mappickVal=lstpickMapping[i];
                                    
                                    if(mappickVal.containsKey((String)projectCosts.get(mapfields.get(sfField)))){
                                        cost.put(sfField,mappickVal.get((string)projectCosts.get(mapfields.get(sfField))));
                                    }
                                    //System.debug(approvals.get(mapfields.get(sfField)));
                                }
                            }
                        }
                    }
                    lstVolunteers.add(cost);
                }
                
                insert lstVolunteers;
                
                
                // Mapping with Project Income 
                List<Project_Income__c> lstProjectIncome=new List<Project_Income__c>();
                for(Object obj:(List<Object>)application.get('cashContributions')){
                    Project_Income__c cost=new Project_Income__c();
                    cost.Case__c =cas.Id;
                    Map<String,Object> projectCosts =(Map<String, Object>)obj;
                    cost.Description_for_cash_contributions__c =String.valueOf(projectCosts.get('description'));
                    cost.Contributions_ID__c=String.valueOf(projectCosts.get('id'));
                    cost.Amount_you_have_received__c = Integer.valueOf(String.valueOf(projectCosts.get('amount')));
                    if(mapDynamic.containskey('Project_Income__c')){
                        Map<String,String> mapfields=mapDynamic.get('Project_Income__c');
                        Map<String,List<Map<String,String>>> mapdynfields=mapDynamicFields.get('Project_Income__c');
                        for(String sfField:mapfields.keySet()){
                            if(mapdynfields.containskey(sfField)){
                                List<Map<String,String>> lstpickMapping=mapdynfields.get(sfField);
                                
                                for(integer i=0;i<lstpickMapping.size();i++){
                                    Map<String,String> mappickVal=lstpickMapping[i];
                                    if(mappickVal.containsKey((String)projectCosts.get(mapfields.get(sfField)))){
                                        cost.put(sfField,mappickVal.get((string)projectCosts.get(mapfields.get(sfField))));
                                    }
                                }
                            }
                        }
                    }
                    lstProjectIncome.add(cost);
                }
                
                upsert lstProjectIncome Contributions_ID__c;
    
    	}    
        catch(exception e){
            system.debug('Valid Json - not found');
            system.debug('Error -'+ e);
        }
    }

}