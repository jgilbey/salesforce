declare module "@salesforce/apex/LrgDevGrantCtrl.getProj" {
  export default function getProj(param: {uId: any, projId: any, rt: any}): Promise<any>;
}
declare module "@salesforce/apex/LrgDevGrantCtrl.getDevProjList" {
  export default function getDevProjList(param: {uId: any}): Promise<any>;
}
declare module "@salesforce/apex/LrgDevGrantCtrl.getDeliveryProjList" {
  export default function getDeliveryProjList(param: {uId: any}): Promise<any>;
}
declare module "@salesforce/apex/LrgDevGrantCtrl.isSubmitted" {
  export default function isSubmitted(param: {projId: any}): Promise<any>;
}
declare module "@salesforce/apex/LrgDevGrantCtrl.submitApplication" {
  export default function submitApplication(param: {projId: any}): Promise<any>;
}
