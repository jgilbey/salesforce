// export const mapSpendingCosts = (
//   spendingCostsArray,
//   headingOptions,
//   textHandler,
//   checkboxHandler,
//   handleDeleteCost
// ) => {
//   console.log("HANDLER: ", { textHandler, checkboxHandler });
//   let headingOptionList = headingOptions.map((el, index) => {
//     return { label: el, value: el };
//   });
//   console.log("headingOptionList: ", headingOptionList);
//   return spendingCostsArray.map((el, index) => {
//     return {
//       id: el.id,
//       idgen: Math.floor(Math.random() * 100) + 10,
//       columns: [
//         {
//           name: "costHeading",
//           typeCombobox: true,
//           options: headingOptionList,
//           handler: textHandler,
//           value: el.costHeading,
//           disabled: false,
//           required: true,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "invoiceReferenceNumber",
//           typeText: true,
//           handler: textHandler,
//           value: el.invoiceReferenceNumber,
//           disabled: false,
//           required: true,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "invoiceDate",
//           typeDate: true,
//           handler: textHandler,
//           value: el.invoiceDate,
//           disabled: false,
//           required: true,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "supplierName",
//           typeText: true,
//           handler: textHandler,
//           value: el.supplierName,
//           disabled: false,
//           required: true,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "description",
//           typeText: true,
//           handler: textHandler,
//           value: el.description,
//           disabled: false,
//           required: true,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "costToDate",
//           typeNumber: true,
//           formatter: "currency",
//           handler: textHandler,
//           value: el.costToDate,
//           disabled: false,
//           id: name + (Math.floor(Math.random() * 100) + 10),
//           required: true
//         },
//         {
//           name: "vat",
//           typeNumber: true,
//           formatter: "currency",
//           handler: textHandler,
//           value: el.vat,
//           disabled: false,
//           required: true,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "total",
//           typeNumber: true,
//           formatter: "currency",
//           handler: textHandler,
//           value: el.total,
//           disabled: true,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "attachExpenditureProof",
//           typeCheckbox: true,
//           handler: checkboxHandler,
//           value: el.attachExpenditureProof,
//           disabled: false,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         },
//         {
//           name: "deleteCost",
//           typeDelete: true,
//           handler: handleDeleteCost,
//           id: name + (Math.floor(Math.random() * 100) + 10)
//         }
//       ]
//     };
//   });
// };

import LABELS from "../imports/labels";
export const viewColumns = (
  handleDeleteCost,
  handleEditCost,
  isBlocked
) => {
  let idGen = () => {
    let S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };
//   "Cost heading"
// "INVOICE REFERENCE"
// "INVOICE DATE"
  let columnList = [ 
    { label: LABELS.Cost_heading, fieldName: "costHeading", type: "text" },
    { label: LABELS.Invoice_Reference, fieldName: "invoiceReferenceNumber", type: "text" },
    { label: LABELS.Invoice_Date, fieldName: "invoiceDate", type: "date", typeAttributes : [
        {
          year: "numeric",
          month: "short",
          day: "2-digit"
        }
      ] 
    },
    { label: LABELS.Name_of_Supplier, fieldName: "supplierName", type: "text" },
    { label: LABELS.Spending_Cost_Description, fieldName: "description", type: "text" },
    { label: LABELS.Cost_To_Date, fieldName: "costToDate", type: "currency" },
    { label: LABELS.Spending_Cost_VAT, fieldName: "vat", type: "currency" },
    { label: LABELS.Spending_cost_Total, fieldName: "total", type: "currency" },
    { 
      label: LABELS.Expenditure_Proof, 
      fieldName: "attachExpenditureProof", 
      type: "checkboxInputType",
      typeAttributes: {
        fieldName: "attachExpenditureProof",
        isDisabled: true
      },
    },
    { label: LABELS.Spending_cost_Actions, type: "buttonListType", 
      typeAttributes: {
        index: { fieldName: "index" },
        buttonList : [
          {
            label: "Edit",
            type: "iconType",
            id: idGen(),
            typeAttributes: {
              icon: "action:edit",
              handler: handleEditCost,
              isDisabled: isBlocked
            },
            wrapText: true
          },
          {
            label: LABELS.Spending_cost_Delete,
            type: "iconType",
            id: idGen(),
            typeAttributes: {
              icon: "action:delete",
              handler: handleDeleteCost,
              isDisabled: isBlocked
            },
            wrapText: true
          }
        ]
      }
    },
    
  ];
  return columnList;
}
export const setupColumns = (
  picklistData,
  handleTextChangeInList,
  isBlocked
) => {
  let idGen = () => {
    let S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };
  let columnList = [
    {
      value: '',
      label: LABELS.Cost_heading,
      fieldName: "costHeading",
      type: "comboboxType",
      id: idGen(),
      typeAttributes: {
        isRequired: true,
        options: picklistData,
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "costHeading",
        isDisabled: isBlocked
      },
      wrapText: true
    },
    {
      value: '',
      label: LABELS.Invoice_Reference,
      fieldName: "invoiceReferenceNumber",
      type: "textInputType",
      id: idGen(),
      typeAttributes: {
        isRequired: true,
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "invoiceReferenceNumber",
        isDisabled: isBlocked,
        maxLength: 20
      },
      wrapText: true
    },
    {
      value: '',
      label: LABELS.Invoice_Date,
      fieldName: "invoiceDate",
      type: "dateInputType",
      id: idGen(),
      typeAttributes: {
        isRequired: true,
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "invoiceDate",
        isDisabled: isBlocked
      },
      wrapText: true
    },
    {
      value: '',
      label: LABELS.Name_of_Supplier,
      fieldName: "supplierName",
      type: "textInputType",
      id: idGen(),
      typeAttributes: {
        isRequired: true,
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "supplierName",
        isDisabled: isBlocked,
        maxLength: 255
      },
      wrapText: true
    },
    {
      value: '',
      label: LABELS.Spending_Cost_Description,
      fieldName: "description",
      type: "textInputType",
      id: idGen(),
      typeAttributes: {
        isRequired: true,
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "description",
        isDisabled: isBlocked,
        maxLength: 2000
      },
      wrapText: true
    },
    {
      value: '',
      label: LABELS.Cost_To_Date,
      fieldName: "costToDate",
      type: "numberInputType",
      id: idGen(),
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "costToDate",
        isDisabled: isBlocked
      },
      wrapText: true
    },
    {
      value: '',
      label: LABELS.Spending_Cost_VAT,
      fieldName: "vat",
      type: "numberInputType",
      id: idGen(),
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "vat",
        isDisabled: isBlocked,
        maxLength: 999999999
      },
      wrapText: true
    },
    { label: LABELS.Spending_cost_Total, fieldName: "total", type: "currency" },
    {
      label: LABELS.Expenditure_Proof,
      value: false,
      fieldName: "attachExpenditureProof",
      type: "checkboxInputType",
      id: idGen(),
      typeAttributes: {
        isRequired: false,
        handler: handleTextChangeInList,
        index: { fieldName: "index" },
        fieldName: "attachExpenditureProof",
        isDisabled: isBlocked
      },
      wrapText: true
    }
  ];
  return columnList;
};