/**
 * @description     helper class for the CSVExport_ImportInvocable class
 * @author          daniel@hyphen8.com
 * @date            18/04/2020
 * @group           Helper
*/
public with sharing class CSVExport_ImportHelper {

    /**
     * @description     method to return the CSV Import Mapping and their child filters
     * @param           string developerName - this is the recordType of the CSV Export
     * @return          List<CSV_Import_Mapping__mdt> mapping for query
     */
    public static List<CSV_Import_Mapping__mdt> getMappings(string developerName){
        return [SELECT Allow_re_imports__c, CSV_Import_RecordType__c, Filter_Type__c, Import_Object__c, Import_Object__r.QualifiedAPIName, Mapping_Field__r.QualifiedApiName, (SELECT Field_API_Name__c, Filter_type__c, Value__c FROM CSV_Import_Mapping_Filters__r) FROM CSV_Import_Mapping__mdt WHERE CSV_Import_RecordType__c=:developerName];
    }

    /**
     * @description     method to generate our soql query for pulling in records
     * @param           string recordId - export recordId
     * @param           CSV_Import_Mapping__mdt importMappingRecord
    */
    public static void processLinking(string recordId, CSV_Import_Mapping__mdt importMappingRecord){

        // list of filters
        List<CSV_Import_Mapping_Filter__mdt> listOfFilters = importMappingRecord.CSV_Import_Mapping_Filters__r;
        system.debug('listOfFilters - '+listOfFilters);

        // get the object type based on the object selected to pull in
        SObjectType objectType = Schema.getGlobalDescribe().get(importMappingRecord.Import_Object__r.QualifiedAPIName);
        system.debug('objectType > ' + importMappingRecord.Import_Object__c);
        system.debug('QualifiedAPIName > ' + importMappingRecord.Import_Object__r.QualifiedAPIName);
        system.debug('importMappingRecord > ' + importMappingRecord);

        // list for storing the where queries in to reduce the need for another loop later on
        List<String> whereQueryList = new List<String>();

        // set for storing the field API Names in for pulling back
        Set<String> setOfFieldAPINames = new Set<String>();

        // simple loop count to ensure we put our and or in the right place
        integer loopcount = 1;

        // loop through the mappings
        for(CSV_Import_Mapping_Filter__mdt cimf:listOfFilters){
            system.debug('cimf > ' + cimf);
            
            // add field API Name to a set to ensure we only query it once
            setOfFieldAPINames.add(cimf.Field_API_Name__c);

            // get the filter type for the check
            string filterType = filterTypeHandling(cimf.Filter_type__c);

            // get the display type for the field we are processing
            DisplayType fieldType = getSObjectFieldType(objectType, cimf.Field_API_Name__c);
            system.debug('fieldType > ' + fieldType);
            
            // generate our where clause for this filter
            string whereQueryFilter = cimf.Field_API_Name__c + ' ' + filterType;

            // list of field types that should not have quotes put around them
            Map<String,String> mapOfFieldTypes = new Map<String, String>{'DOUBLE'=>'DOUBLE', 'BOOLEAN'=>'BOOLEAN', 'DATE'=>'DATE', 'INTEGER'=>'INTEGER','CURRENCY'=>'CURRENCY', 'DATETIME'=>'DATETIME', 'PERCENT'=>'PERCENT'};

            // check to see if fieldtype is in the list of field types
            if(mapOfFieldTypes.containsKey(string.valueOf(fieldType))){
                string processingType = mapOfFieldTypes.get(string.valueOf(fieldType));
                if(processingType == 'DATE'){
                    List<String> dateSplit = cimf.Value__c.split('-');
                    Date valueDate = date.newinstance(Integer.valueOf(dateSplit[2]),Integer.valueOf(dateSplit[1]),Integer.valueOf(dateSplit[0]));
                    string fullvalueDate = string.valueof(valueDate);
                    whereQueryFilter = whereQueryFilter + fullvalueDate;
                } else {
                    whereQueryFilter = whereQueryFilter + cimf.Value__c;
                }
            } else {
                whereQueryFilter = whereQueryFilter + ' \'' + cimf.Value__c + '\'';
            } 

            // confirm if this is the last record or not and ensure we don't add the soqlFilterType incorrectly
            if(loopcount < listOfFilters.size()){
                whereQueryFilter = whereQueryFilter + ' ' + importMappingRecord.Filter_Type__c + ' ';
            }

            // increment our loop count
            loopcount = loopcount + 1;

            // add the clause to our list for use later
            whereQueryList.add(whereQueryFilter);
        }

        // start generating our soql query
        string query = 'SELECT ID, ';

        // loop through field API names
        for(String fieldAPI:setOfFieldAPINames){
            query = query + ' ' + fieldAPI + ',';
        }

        // extend our query to include the export mapping field and the object we are going to query against
        query = query + ' ' + importMappingRecord.Mapping_Field__r.QualifiedApiName + ' FROM ' + importMappingRecord.Import_Object__r.QualifiedAPIName + ' WHERE ';
        
        // set string for the where query
        string whereQuery = '';

        // loop through our where query list and append to the query
        for(string whereClause:whereQueryList){
            whereQuery = whereQuery + whereClause;
        }

        // add where query to overall query
        query = query + whereQuery;

        if(!importMappingRecord.Allow_re_imports__c){
            query = query + ' AND ' + importMappingRecord.Mapping_Field__r.QualifiedApiName + '=null';
        }

        system.debug('query > ' + query);
        // list of records to process pull back from the query
        List<SObject> recordsProcessList = Database.query(query);
        system.debug('recordsProcessList > ' + recordsProcessList);

        // list of records to link to the export run
        List<SObject> updateList = new List<SObject>();

        // loop through the list of records and add to update list
        for(SObject record:recordsProcessList){
            string mappingfield = importMappingRecord.Mapping_Field__r.QualifiedApiName;
            record.put(mappingfield, recordId);
            updateList.add(record);
        }

        // perform update
        Database.update(updateList);
    }


    /**
     * @description     filter type handling
     * @param           string filterType
     * @return          string filterSQOL
    */
    public static string filterTypeHandling(string filterType){
        if(filterType==CSVExport_Constants.FIELD_OPERATOR_EQUALS){
            return '=';
        } else if(filterType==CSVExport_Constants.FIELD_OPERATOR_NOT_EQUALS){
            return '!=';
        } else if(filterType==CSVExport_Constants.FIELD_OPERATOR_GREATER_THAN){
            return '>';
        } else if(filterType==CSVExport_Constants.FIELD_OPERATOR_GREATER_THAN_EQUALS){
            return '>=';
        } else if(filterType==CSVExport_Constants.FIELD_OPERATOR_LESS_THAN){
            return '<';
        } else {
            return '<=';
        }
    }

    /**
    * @description  getSObjectFieldType - Will take in a field name and confirm what type of field it is
    * @param        string SOQLField - confirms the SOQL API Name of the field
    * @param        SObjectType objectType - confirms what objecttype we are working with
    * @return       DisplayType - confirmed what or how we are going to display the field
    */
    public static DisplayType getSObjectFieldType(SObjectType objectType, string sOQLField) {        
        
        // set the display type
        DisplayType fieldType = null;
        
        // check to see if the field exists and if it does return the type
        if(objectType.getDescribe().fields.getMap().containsKey(sOQLField)) {
            fieldType = objectType.getDescribe().fields.getMap().get(sOQLField).getDescribe().getType();    
        }

        // return our fieldtype
        return fieldType;
    }
}