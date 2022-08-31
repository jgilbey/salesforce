/**
 * @description     helper class for the CSVExport_ExportInvocable class
 * @author          daniel@hyphen8.com
 * @date            19/04/2020
 * @group           Helper
*/
public with sharing class CSVExport_ExportHelper {
	
	
    
    /**
     * @description     method to return the CSV Export Mapping
     * @param           string developerName - this is the recordType of the CSV Export
     * @return          List<CSV_Import_Mapping__mdt> mapping for query
     */
    public static List<CSV_Export_File__mdt> getMappings(string developerName){
        return [SELECT ID, CSV_Header__c, Export_Object__c, Export_Object__r.QualifiedApiName, Use_Versioning__c, FileName__c, Export_Related_Field__r.QualifiedApiName, (SELECT Line__c, Output_Field_API_Name__c, Order__c FROM CSV_Export_File_Lines__r ORDER BY Order__c ASC) FROM CSV_Export_File__mdt WHERE CSV_Export_RecordType_Name__c=:developerName];
    }

    /**
     * @description     method to return the CSV Export Mapping Lines Items - temp because inner queries on MetaData fail or order correctly
     * @param           string metaDataID - this is the recordType of the CSV Export
     * @return          List<CSV_Export_File_Line__mdt> mapping for query
     */
    public static List<CSV_Export_File_Line__mdt> getMappingsLines(string metaDataID){
        return [SELECT Line__c, Output_Field_API_Name__c, Order__c, CSV_Export_File__c FROM CSV_Export_File_Line__mdt WHERE CSV_Export_File__c=:metaDataID ORDER BY Order__c ASC];
    }

    /**
     * @description     simple future method that is being used to ensure we get increased CPU Limits for bulk processing of the export files
     * @param           string recordId
     * @param           string developerName
     */
    @Future(callout=true)
    public static void processinfuture(string recordId, string developerName){
        // get the mapping based on he export recordtype
        List<CSV_Export_File__mdt> mappings = getMappings(developerName);
        // loop through the mappings and process them
        for(CSV_Export_File__mdt cef:mappings){
            // pass export recordid and export mapping to mathod to process
            generateFile(recordId, cef);
        }
    }

	/**
     * @description     method to get record for pdf
    */
    public List<forms__c> getPaymentRecords(){
		string recordId = ApexPages.currentPage().getParameters().get('id');
        List<CSV_Export_File__mdt> mappings = getMappings('Payment');
        CSV_Export_File__mdt exportMappingRecord = mappings[0];
        
        ID contentDocumentID = getExistingContentDocumentID(recordId, exportMappingRecord.FileName__c);
        List<CSV_Export_File_Line__mdt> listOfLineMappings = getMappingsLines(exportMappingRecord.Id);
        string fieldSetQuery = getSOQLFieldQuery(listOfLineMappings);
        Map<String, List<String>> lineFieldMappings = getLineFieldMapping(listOfLineMappings);
        List<SObject> listOfRecords = getRecordsToProcess(exportMappingRecord, fieldSetQuery, recordId);
        system.debug('***preloop getCpuTime()***'+Limits.getCpuTime());
		system.debug('contentDocumentID - '+contentDocumentID);
		system.debug('listOfLineMappings - '+listOfLineMappings);
		system.debug('fieldSetQuery - '+fieldSetQuery);
		system.debug('lineFieldMappings - '+lineFieldMappings);
		system.debug('listOfRecords - '+listOfRecords);
		system.debug('exportMappingRecord - '+exportMappingRecord);
        system.debug('***complete loop getCpuTime()***'+Limits.getCpuTime());
        List<forms__c> paymentRecords = (List<forms__c>)listOfRecords;
        
        return paymentRecords;
        
    }

    /**
     * @description     method to actually generate the file
     * @param           string recordId - this is the recordId for the export record being processed
     * @param           CSV_Export_File__mdt exportMappingRecord this is one of the export mapping records
    */
    public static void generateFile(string recordId, CSV_Export_File__mdt exportMappingRecord){
        ID contentDocumentID = getExistingContentDocumentID(recordId, exportMappingRecord.FileName__c);
        List<CSV_Export_File_Line__mdt> listOfLineMappings = getMappingsLines(exportMappingRecord.Id);
        string fieldSetQuery = getSOQLFieldQuery(listOfLineMappings);
        Map<String, List<String>> lineFieldMappings = getLineFieldMapping(listOfLineMappings);
        List<SObject> listOfRecords = getRecordsToProcess(exportMappingRecord, fieldSetQuery, recordId);
        system.debug('***preloop getCpuTime()***'+Limits.getCpuTime());
		system.debug('contentDocumentID - '+contentDocumentID);
		system.debug('listOfLineMappings - '+listOfLineMappings);
		system.debug('fieldSetQuery - '+fieldSetQuery);
		system.debug('lineFieldMappings - '+lineFieldMappings);
		system.debug('listOfRecords - '+listOfRecords);
		system.debug('exportMappingRecord - '+exportMappingRecord);
        string csv = exportMappingRecord.CSV_Header__c + '\n';
        for(SObject record:listOfRecords){
            system.debug('record > ' + record);
            system.debug('lineFieldMappings > ' + lineFieldMappings);
            string recordlines = getLineValues(record, lineFieldMappings);
            csv = csv + recordlines;
        }
        system.debug('***complete loop getCpuTime()***'+Limits.getCpuTime());
        generateContentFile(csv, recordId, contentDocumentID, exportMappingRecord.Use_Versioning__c, exportMappingRecord.FileName__c);
        system.debug('***end of game getCpuTime()***'+Limits.getCpuTime());
    }

    /**
     * @description     method to get an existing ContentDocumentId
     * @param           string recordId this is the current CSV Export Record ID
     * @param           string fileName this is the expected name of the file
     * @return          ID contentDocumentID
    */
    public static ID getExistingContentDocumentID(string recordId, string fileName){

        // set contentDocument ID for return
        ID contentDocumentID;
        // try and find our existing contentDocument record so we can insert a new version of the file
        try{
            // query for the record
            contentDocumentID = [Select ContentDocument.Title, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId=:recordId AND ContentDocument.Title=:fileName LIMIT 1].ContentDocumentID;
        } catch (Exception e){
            // no file found so assign null
            contentDocumentID = null;
        }
        // return our contentDocumentID
        return contentDocumentID;
    }

    /**
     * @description     method to return a string for the query to pull in the records
     * @param           List<CSV_Export_File_Line__mdt> listOfFilterLines file line mappings
     * @return          string soqlQueryFields
    */
    public static string getSOQLFieldQuery(List<CSV_Export_File_Line__mdt> listOfFilterLines){

        // set for storing our field api names in
        Set<String> fieldSet = new Set<String>();

        // loop through CSV Export File Lines and add to set
        for(CSV_Export_File_Line__mdt cefl:listOfFilterLines){
            fieldSet.add(cefl.Output_Field_API_Name__c);
        }

        if(!fieldSet.contains('Id') && !fieldSet.contains('ID') && !fieldSet.contains('id')){
            fieldset.add('Id');
        }

        // convert set into single string
        string soqlQueryFields = String.join((Iterable<String>)fieldSet, ',');

        // return string
        return soqlQueryFields;
    }

    /**
     * @description     method to query and pull in a list of records for mapping into the export file
     * @param           CSV_Export_File__mdt exportMappingRecord
     * @param           string fieldSetQuery
     * @param           string recordId
     * @return          List<Sobject> listofrecords
    */
    public static List<SObject> getRecordsToProcess(CSV_Export_File__mdt exportMappingRecord, string fieldSetQuery, string recordId){
        // start building our query
        string query = 'SELECT ' + fieldSetQuery + ',' + exportMappingRecord.Export_Related_Field__r.QualifiedApiName + ' FROM ' + exportMappingRecord.Export_Object__r.QualifiedApiName + ' WHERE ' + exportMappingRecord.Export_Related_Field__r.QualifiedApiName + '=\'' + recordId + '\'';
        List<SObject> returnrecords = Database.query(query);
		system.debug('query - '+query);
		system.debug('returnrecords - '+returnrecords);
        return returnrecords;
    }

    /**
     * @description     method to return a string for the query to pull in the records
     * @param           List<CSV_Export_File_Line__mdt> listOfFilterLines file line mappings
     * @return          Map<String, Set<String>>
    */
    public static Map<String, List<String>> getLineFieldMapping(List<CSV_Export_File_Line__mdt> listOfFilterLines){

        // set for storing our field api names in
        Map<String, List<String>> returnMap = new Map<String, List<String>>();

        // loop through CSV Export File Lines and add to set
        for(CSV_Export_File_Line__mdt cefl:listOfFilterLines){
            // generate a line number
            string lineNumber = 'Line ' + Integer.valueOf(cefl.Line__c);
            // create a set for adding our line fields to - using a set because the same field might get queries multiple times in an output
            List<String> lineFields;

            // check if the map contains the number number and if it does pull in the existing fields
            if(returnMap.containsKey(lineNumber)){
                lineFields = returnMap.get(lineNumber);
            } else {
                lineFields = new List<String>();
            }
            lineFields.add(cefl.Output_Field_API_Name__c);
            returnMap.put(lineNumber,lineFields);
        }

        // return map of lines and fields
        return returnMap;
    }

    /**
    * @description  getSObjectFieldType - Will take in a field name which can be a referenced field e.g Object.RecordType.DeveloperName and parse the object dynamically and return the fieldType of the final field
    * @param        string SOQLField - confirms the SOQL API Name of the field
    * @param        SObjectType objectType - confirms what objecttype we are working with
    * @return       DisplayType - confirmed what or how we are going to display the field
    */
    public static DisplayType getSObjectFieldType(SObjectType objectType, string sOQLField) {        
        
        DisplayType fieldType = null;
        List<String> sOQLFields = sOQLField.Split('\\.');
        if(sOQLFields.size() == 1) {
            if(objectType.getDescribe().fields.getMap().containsKey(sOQLField)) {
                fieldType = objectType.getDescribe().fields.getMap().get(sOQLField).getDescribe().getType();    
            }
        } else {
            fieldtype = getSObjectFieldTypeRelationship(objectType, sOQLFields);
        }
        return fieldType;
    }

    /**
    * @description  Will take in a field name which can be a referenced field e.g Object.RecordType.DeveloperName 
    *               and parse the object dynamically and return the value of that field from the record supplied
    * @param        Sobject record this is the record that we are reviewing
    * @param        string sOQLField this is the field on the record that we need to review
    * @return       Object this is the object with the value in it
    */
    public static Object getSObjectField(sObject record, string sOQLField) {
        
        Object result = null;
        if (sOQLField != null) {
            List<String> sOQLFields = sOQLField.Split('\\.');
            
            if(sOQLFields.size() == 1) {
                try {
                    result = record.get(sOQLFields[0]);
                } catch (Exception ex) {
                    result = null;
                }                
            } else {
                string sOQLRelationship = sOQLFields.remove(0);
                result = getSObjectField(record.getSobject(sOQLRelationship), String.join(sOQLFields, '.'));        
            }
        }        
        return result;        
    }

    /**
     * @description     getSObjectFieldTypeRelationship Helper to process getting field types on relationships
     * @param           SObjectType objecttype - the object we are checking the field on
     * @param           List<String> sOQLFields - list of field relationship
     * @return          DisplayType a list of record messages to return
    */
    public static DisplayType getSObjectFieldTypeRelationship(SObjectType objectType, List<String> sOQLFields){
        // setup return fieldtype
        DisplayType fieldType = null;

        //Need to identify which object this refernce relates to so remove from SOQLFields into SOQLRelationship
        string sOQLRelationship = sOQLFields.remove(0);
        
        //For each field find out the relationship name and if this matches then get the SObjectType of this and iterate
        Map<String, Schema.SObjectField> fsMap =  objectType.getDescribe().fields.getMap();
        for(Schema.SObjectField fld : fsMap.values()) {
            DescribeFieldResult dfr = fld.getDescribe();
            if(dfr.getRelationshipName()==sOQLRelationship) {
                //if isNamePointing then this field can hold multiple types of objects and skip as we would need to query actual value to find type - for now!
                if(!dfr.isNamePointing()) {
                    List<Schema.sObjectType> rels = dfr.getReferenceTo();
                    fieldType = getSObjectFieldType(rels[0], String.join(sOQLFields, '.'));
                }
                // break out now as no need to carry on
                break;
            }
        }
        return fieldType;
    }

    /**
     * @description method to generate individual lines based on the records being processed
     * @param       sObject record
     * @param       Map<String, Set<String>> lineFieldMappings
     * @return      string line
    */
    public static string getLineValues(sObject record, Map<String, List<String>> lineFieldMappings){
        
        // set up our record lines for the record being processed
        string recordlines = '';
        // loop through the lines provided in the mappings
        for(String line:lineFieldMappings.keySet()){

            // get the individual fields within the mapping
            List<String> fields = lineFieldMappings.get(line);

            // list for storing the returned values in
            List<String> values = new List<String>();

            // loop through the fields to get their values
            for(String field:fields){

                // get what the field type is so we can convert it correctly
                DisplayType fieldType = getSObjectFieldType(record.getSObjectType(), field);
                system.debug('fieldType > ' + fieldType);

                // get the value of field
                Object getValue = getSObjectField(record, field);

                // string value to return
                string fieldValue;

                // handle different types of fields
                if(string.valueof(fieldType)=='Decimal' || string.valueof(fieldType)=='Currency' || string.valueof(fieldType)=='Percent' || string.valueof(fieldType)=='Double'){
                    Decimal decimalvalue = (decimal)getvalue;
                    fieldValue = string.valueof(decimalvalue);
                } else if(string.valueof(fieldType)=='Date'){
                    Date datevalue = (date)getValue;
                    fieldValue = datevalue.format();
                } else {
                    fieldValue = (string)getValue;
                }
                values.add(fieldValue);
            }
            // convert list of values to single string
            string recordline = string.join(values, ',');
            // add to master recordlines and put a new line on the end
            recordlines = recordlines + recordline + '\n';
        }
        // return the lines
        return recordlines;
    }

    /**
     * @description method to insert a contentversion
     * @param       string csv
     * @param       string recordId
     * @param       string contentDocumentID
     * @param       boolean useVersioning
     * @param       string fileName
    */
    public static void generateContentFile(string csv, string recordId, string contentDocumentID, boolean useVersioning, string fileName){

		if(contentDocumentID==null){
			//csv
			ContentVersion contentVersion = new ContentVersion();
				/*if(useVersioning && contentDocumentID!=null){
					contentVersion.ContentDocumentID=contentDocumentID;
					contentVersion.ReasonForChange = 'Export regenerated';
				} else {
					contentVersion.FirstPublishLocationId = recordId;
				}*/
				contentVersion.FirstPublishLocationId = recordId;
				contentVersion.PathOnClient = fileName + '.csv';
				contentVersion.Origin = 'H';
				contentVersion.Title = fileName;
				contentVersion.VersionData = Blob.valueof(csv);
			insert contentVersion;
			
			//pdf
			PageReference pdf = Page.PaymentExportPDF;
			pdf.getParameters().put('id',recordId);
            blob pdfBody = blob.valueOf('pdf content');
            if(!test.isRunningTest()){
                pdfBody = pdf.getContent();
            }	
             
			
			ContentVersion contentVersionPDF = new ContentVersion();
				
				contentVersionPDF.FirstPublishLocationId = recordId;
				contentVersionPDF.PathOnClient = fileName + '.pdf';
				contentVersionPDF.Origin = 'H';
				contentVersionPDF.Title = fileName;
				contentVersionPDF.VersionData = pdfBody;
			insert contentVersionPDF;
           
		}
    }
}