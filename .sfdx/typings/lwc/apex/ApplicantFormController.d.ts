declare module "@salesforce/apex/ApplicantFormController.createProjectEnquiry" {
  export default function createProjectEnquiry(): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.obtainDocumentList" {
  export default function obtainDocumentList(param: {entityId: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.obtainFormData" {
  export default function obtainFormData(param: {formId: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.obtainProjectCaseOptions" {
  export default function obtainProjectCaseOptions(): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.obtainNHMFRecordTypeIds" {
  export default function obtainNHMFRecordTypeIds(): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.obtainAllForms" {
  export default function obtainAllForms(): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.obtainMonitoringFormsData" {
  export default function obtainMonitoringFormsData(): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.obtainAllGrandTotalPaid" {
  export default function obtainAllGrandTotalPaid(param: {caseId: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.submitProjectEnquiry" {
  export default function submitProjectEnquiry(param: {projectEnquiry: any, isFinish: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.removeProjectEnquiry" {
  export default function removeProjectEnquiry(param: {porjectEnquiryId: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.submitApplicationForm" {
  export default function submitApplicationForm(param: {applicationRequestData: any, isFinish: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.updateFileTitlesOnApplicationForm" {
  export default function updateFileTitlesOnApplicationForm(param: {uploadedFilesIdsList: any, question: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.updatePermissionFormData" {
  export default function updatePermissionFormData(param: {formToUpdateJSON: any, bankAccountsDataJSON: any, ApprovedPurposesJSON: any, projectIncomeJSON: any, contactJSON: any, organisatinJSON: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.updateCompletionReportFormData" {
  export default function updateCompletionReportFormData(param: {request: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.updateFormRecord" {
  export default function updateFormRecord(param: {formToUpdate: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.upsertListRecords" {
  export default function upsertListRecords(param: {recordListJSON: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.deleteSpendingCostRecords" {
  export default function deleteSpendingCostRecords(param: {sObjectIdList: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.updateDocumentTitleWithPrefix" {
  export default function updateDocumentTitleWithPrefix(param: {prefix: any, documentIdList: any}): Promise<any>;
}
declare module "@salesforce/apex/ApplicantFormController.generateDocumentUrl" {
  export default function generateDocumentUrl(param: {formId: any, formType: any}): Promise<any>;
}
