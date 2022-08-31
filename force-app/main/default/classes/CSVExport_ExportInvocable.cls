/**
 * @description     Invocable method to be used when processing the export of a file or files from a CSV Export record
 * @author          daniel@hyphen8.com
 * @date            19/04/2020
 * @group           Invocables
*/
public with sharing class CSVExport_ExportInvocable {
    
    /**
     * @description invocable method that will review the export record and pull in the appropriate meta data to perform a query and pull in the link the appropriate records
     *              to the export csv record
     */
    @InvocableMethod(label='Generate export files' description='Invocable method to support the export of files from the Export record')
    public static void generateExportFiles(List<CSVExport_Constants.ExportRecord> exportrecords){
        system.debug('exportrecords > ' + exportrecords);

        // loop through the export records presented to this invocable method
        for(CSVExport_Constants.ExportRecord exportrecord:exportrecords){

            CSVExport_ExportHelper.processinfuture(exportrecord.recordId, exportrecord.developerName);

        }
    }
}