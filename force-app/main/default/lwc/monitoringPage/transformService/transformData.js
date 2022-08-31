export const transformData =  (data) => {
  return data.map((el) => ({
    Id: el.caseObject.Id,
    number: el.caseObject.Project_Reference_Number__c,
    title: el.caseObject.Project_Title__c,
    status: el.caseObject.Status,
    forms: getFormsForCase(el.formsList)
  }));
};

const getFormsForCase = (forms) => {
  return forms.map((form) => ({
      Id: form.Id,
      status: form.Status__c || null,
      name: form.RecordType.Name
    }));
};