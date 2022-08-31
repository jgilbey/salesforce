/**
 * @description     invocable method for importing records against a given export record
 * @author          daniel@hyphen8.com
 * @date            18/04/2020
 * @group           Invocables
*/
public with sharing class CSVExport_ImportInvocable {

    /**
     * @description invocable method that will review the export record and pull in the appropriate meta data to perform a query and pull in the link the appropriate records
     *              to the export csv record
     */
    @InvocableMethod(label='Import records for Export' description='Invocable method to support importing of records against the csv export record being processed')
    public static void importRecordsForExport(List<CSVExport_Constants.ExportRecord> exportrecords){

        // loop through the export records presented to this invocable method
        for(CSVExport_Constants.ExportRecord exportrecord:exportrecords){
            // get the mapping based on he export recordtype
            List<CSV_Import_Mapping__mdt> mappings = CSVExport_ImportHelper.getMappings(exportrecord.developerName);
            // loop through the mappings and process them
            for(CSV_Import_Mapping__mdt cim:mappings){
                // pass export recordid and export mapping to mathod to process
                CSVExport_ImportHelper.processLinking(exportrecord.recordId, cim);
            }
        }
    }
}