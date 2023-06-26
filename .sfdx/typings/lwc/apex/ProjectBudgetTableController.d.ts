declare module "@salesforce/apex/ProjectBudgetTableController.getProject" {
  export default function getProject(param: {projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.getProjectCosts2" {
  export default function getProjectCosts2(param: {projectId: any, recordType: any, variation: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.getCashContributions2" {
  export default function getCashContributions2(param: {projectId: any, recordType: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.saveCosts" {
  export default function saveCosts(param: {draftCosts: any, existingCostsValues: any, cashContributions: any, projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.saveCashContributions" {
  export default function saveCashContributions(param: {draftCash: any, existingCash: any, existingCosts: any, projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.deleteCosts" {
  export default function deleteCosts(param: {pCostsToDelete: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.deleteCash" {
  export default function deleteCash(param: {cashToDelete: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.getRecordTypeMapping" {
  export default function getRecordTypeMapping(param: {projectDeveloperName: any, variation: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectBudgetTableController.checkGrantReviewsPending" {
  export default function checkGrantReviewsPending(param: {projectId: any}): Promise<any>;
}
