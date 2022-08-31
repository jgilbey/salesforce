/**
    * PostCodeDataAPICtrl retrieves data from postcodes.io
    * Description - Projects need the Local Authority/Constituency/Ward information set to allow reporting (such as for FOI requests).

    History
     -------
    VERSION     AUTHOR          DATE            DETAIL                      Description
    1.0         Alicia          2021-03-30      Initial version             Tests PostCodeDataAPICtrl
*/

public with sharing class PostCodeDataAPICtrl{
    
    public static map<string,string> getPostCodeFullInfo(String postcode){
            
        postcode = postcode.replace(' ', '');
        
        //API Request - postcodes.io (hosted by ideal-postcodes)
            HttpRequest postCodeRequest = new HttpRequest();
            postCodeRequest.setHeader('accept','application/json');
            postCodeRequest.setHeader('cache-control','no-cache');
            postCodeRequest.setmethod('GET');
            postCodeRequest.setEndpoint('http://postcodes.io/postcodes/'+ postcode);
            //postCodeRequest.setTimeout(120000);
            HTTP getPostCodeInfo = new HTTP();
            HTTPResponse postCodeResponse = new HttpResponse();   
            string Request = String.valueof(postCodeRequest);
        
        	system.debug('Request - '+Request);
      
            if(!Test.isrunningtest())
                {postCodeResponse = getPostCodeInfo.send(postCodeRequest);}
            else{
                //Dummy response for UTs
                postCodeResponse.setHeader('Content-Type', 'application/json');
                postCodeResponse.setStatusCode(200);          
                postCodeResponse.setBody('{"status": 200, "result": {"postcode": "WD18 9RN","quality": 1,"eastings": 508939,"northings": 194666,"country": "England","nhs_ha": "East of England","longitude": -0.427101,"latitude": 51.640261,"european_electoral_region": "Eastern","primary_care_trust": "Hertfordshire","region": "East of England","lsoa": "Three Rivers 011C","msoa": "Three Rivers 011","incode": "9RN","outcode": "WD18","parliamentary_constituency": "South West Hertfordshire","admin_district": "Three Rivers","parish": "Batchworth","admin_county": "Hertfordshire","admin_ward": "Moor Park & Eastbury","ced": "Rickmansworth East & Oxhey Park","ccg": "NHS Herts Valleys","nuts": "Hertfordshire","codes": {"admin_district": "E07000102","admin_county": "E10000015","admin_ward": "E05009433","parish": "E04012658","parliamentary_constituency": "E14000951","ccg": "E38000079","ccg_id": "06N","ced": "E58000656","nuts": "UKH23","lsoa": "E01023841","msoa": "E02004966","lau2": "E05009433"} } }');
            }
            System.Debug ('Response [postCodeResponse.getbody()] --- ' + postCodeResponse.getbody());            
        //END API Request - - postcodes.io (hosted by ideal-postcodes)      

        //JSON response to Map
            Map<String, String> jsonFields = new Map<String, String> (); 
            
            string JSONContentPC = postCodeResponse.getbody();  
            string Response = JSONContentPC; 
            JSONParser parser = JSON.createParser(JSONContentPC);

            system.debug('Response Status --- ' + postCodeResponse.getStatus() );             
            while (parser.nextToken() != null) {                                          
                if (parser.getCurrentToken() == JSONToken.FIELD_NAME){                                                                      
                        string fieldname = parser.getText();
                        if(fieldname!='codes'){
                            parser.nextToken(); 
                            if(parser.getCurrentToken() != JSONToken.START_OBJECT){
                                jsonFields.put(fieldname, parser.getText());
                                system.debug(fieldname + '-'+ parser.getText());
                            }
                        }
                        else{
                            break;
                        }
                }
            }
            
            system.debug('jsonFields - '+jsonFields);
            
        //END JSON response to Map

        return jsonFields;
        
    }
    
    @future (callout = true) //Retrieve data from postcodes.io
    public static void setProjectAddrInfo(set<id> projectIdList, boolean isInsert){
        
        system.debug('CPU Time -'+Limits.getLimitCpuTime());
        system.debug('CPU Time Used -'+Limits.getCpuTime());
        
        list<case> pList = [SELECT id, Project_Post_Code__c FROM case WHERE id IN: projectIdList];
        
        for(case project: pList){
            if(project.Project_Post_Code__c!= null){
                map<string,string> addressData = getPostCodeFullInfo(project.Project_Post_Code__c);
                //Required values 
                    //Local Authority = admin_district
                    //Constituency = parliamentary_constituency
                    //Ward = admin_ward
                    //Region = region
                    
                if(addressData.get('admin_district')!=null){
                    project.Local_Authority__c =addressData.get('admin_district'); 
                    if(isInsert){
                        project.Original_Local_Authority__c =addressData.get('admin_district'); 
                    }
                }
                if(addressData.get('parliamentary_constituency')!=null){
                    project.Constituency__c =addressData.get('parliamentary_constituency');
                    if(isInsert){
                        project.Original_Constituency__c =addressData.get('parliamentary_constituency');
                    }
                }
                if(addressData.get('admin_ward')!=null){
                    project.Ward__c =addressData.get('admin_ward');
                    if(isInsert){
                        project.Original_Ward__c =addressData.get('admin_ward');
                    }
                }
                if(addressData.get('region')!=null){
                    project.Region_ONS__c =addressData.get('region');
                    if(isInsert){
                        project.Original_Region__c =addressData.get('region');
                    }
                }
            }
        }
        
        update pList;
        
    }

}