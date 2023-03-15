declare module "@salesforce/apex/ProjectCostFormController.getProject" {
  export default function getProject(param: {projectId: any}): Promise<any>;
}
declare module "@salesforce/apex/ProjectCostFormController.getProjectCosts" {
  export default function getProjectCosts(param: {projectId: any}): Promise<any>;
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
