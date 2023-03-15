declare module "@salesforce/apex/SelfRegisterComponentController.obtainCommunityLanguages" {
  export default function obtainCommunityLanguages(): Promise<any>;
}
declare module "@salesforce/apex/SelfRegisterComponentController.selfRegister" {
  export default function selfRegister(param: {firstname: any, lastname: any, email: any, password: any, confirmPassword: any, accountId: any, regConfirmUrl: any, extraFields: any, startUrl: any, includePassword: any}): Promise<any>;
}
declare module "@salesforce/apex/SelfRegisterComponentController.reCaptchaVerify" {
  export default function reCaptchaVerify(param: {response: any}): Promise<any>;
}
declare module "@salesforce/apex/SelfRegisterComponentController.getExtraFields" {
  export default function getExtraFields(param: {extraFieldsFieldSet: any}): Promise<any>;
}
declare module "@salesforce/apex/SelfRegisterComponentController.setExperienceId" {
  export default function setExperienceId(param: {expId: any}): Promise<any>;
}
