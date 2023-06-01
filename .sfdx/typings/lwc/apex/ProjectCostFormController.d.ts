declare module "@salesforce/apex/ProjectCostFormController.getProject" {
  export default function getProject(param: {projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.getProjectCosts" {
  export default function getProjectCosts(param: {projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.getProjectCosts2" {
  export default function getProjectCosts2(param: {projectId: any, recordType: any, variation: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.deleteProjectCostsAndContributions" {
  export default function deleteProjectCostsAndContributions(param: {cashContributions: any, projectCosts: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.saveProjectCosts" {
  export default function saveProjectCosts(param: {projectId: any, totalCost: any, grantRequested: any, cashContributions: any, projectCosts: any, removedCashContributions: any, removedProjectCosts: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.getCashContributions" {
  export default function getCashContributions(param: {projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.getCashContributions2" {
  export default function getCashContributions2(param: {projectId: any, recordType: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.saveCosts" {
  export default function saveCosts(param: {draftCosts: any, existingCostsValues: any, cashContributions: any, projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.saveCashContributions" {
  export default function saveCashContributions(param: {draftCash: any, existingCash: any, existingCosts: any, projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.deleteCosts" {
  export default function deleteCosts(param: {pCostsToDelete: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.deleteCash" {
  export default function deleteCash(param: {cashToDelete: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.getRecordTypeMapping" {
  export default function getRecordTypeMapping(param: {projectDeveloperName: any, variation: any}): Promise<any>;
}
