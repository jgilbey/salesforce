import Approved_Purposes from "@salesforce/label/c.Approved_Purposes";
import Summary_of_progress from "@salesforce/label/c.Summary_of_progress";
import Source_of_funding from "@salesforce/label/c.Source_of_funding";
import Amount_you_expect from "@salesforce/label/c.Amount_you_expect";
import Amount_received_so_far from "@salesforce/label/c.Amount_received_so_far";
import Amount_still_to_come from "@salesforce/label/c.Amount_still_to_come";
import Date_you_expect_this_amount from "@salesforce/label/c.Date_you_expect_this_amount";

export const obtainApprovedPuprosesColums = (handler, isBlocked,keypresshandler) => {
  let columnList = [
    {
      label: Approved_Purposes,
      fieldName: "purpose",
      type: "text",
      wrapText: true,
      hideDefaultActions: true
    },
    {
      label: Summary_of_progress,
      fieldName: "summary",
      type: "richTextInputType",
      typeAttributes: {
        handler: handler,
        index: { fieldName: "id" },
        fieldName: "summary",
        isRequired: true,
        isDisabled: isBlocked,
        maxLength: 5000,
        keypresshandler: keypresshandler
      },
      wrapText: true,
      hideDefaultActions: true
    }
  ];

  return columnList;
};

export const obtainProjectComesColumns = (
  handler,
  handleDelete,
  picklistData,
  isBlocked
) => {
  let columnList = [
    {
      label: Source_of_funding,
      fieldName: "sourceOfFunding",
      type: "comboboxType",
      typeAttributes: {
        isRequired: true,
        options: picklistData,
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "sourceOfFunding",
        isDisabled: isBlocked
      },
      wrapText: true,
      hideDefaultActions: true
    },
    {
      label: Amount_you_expect,
      fieldName: "amountExpect",
      type: "numberInputType",
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "amountExpect",
        isDisabled: isBlocked
      },
      wrapText: true,
      hideDefaultActions: true
    },
    {
      label: Amount_received_so_far,
      fieldName: "amountReceived",
      type: "numberInputType",
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "amountReceived",
        isDisabled: isBlocked
      },
      wrapText: true,
      hideDefaultActions: true
    },
    {
      label: Amount_still_to_come,
      fieldName: "amountStillToCome",
      type: "numberInputType",
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "amountStillToCome",
        isDisabled: isBlocked
      },
      wrapText: true,
      hideDefaultActions: true
    },
    {
      label: Date_you_expect_this_amount,
      fieldName: "expectedDate",
      type: "dateInputType",
      typeAttributes: {
        isRequired: true,
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "expectedDate",
        isDisabled: isBlocked
      },
      wrapText: true,
      hideDefaultActions: true
    },
    {
      label: "Delete",
      type: "iconType",
      typeAttributes: {
        icon: "action:delete",
        handler: handleDelete,
        index: { fieldName: "index" }
      },
      wrapText: true
    }
  ];

  return columnList;
};


export const viewColumns = (
  handleDelete,
  handleEdit,
  isBlocked
  
) => {
  let idGen = () => {
    let S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };
  let columnList = [ 
    {label: Source_of_funding, fieldName: "sourceOfFunding", type: "text" },
    {label: Amount_you_expect, fieldName: "amountExpect", type: "currency" },
    {label: Amount_received_so_far, fieldName: "amountReceived", type: "currency" },
    {label: Amount_still_to_come, fieldName: "amountStillToCome", type: "currency" },
    {label: Date_you_expect_this_amount, fieldName: "expectedDate", type: "date", typeAttributes : [
        {
          year: "numeric",
          month: "short",
          day: "2-digit"
        }
      ] 
    },

    { label: "Actions", type: "buttonListType", 
      typeAttributes: {
        index: { fieldName: "index" },
        buttonList : [
          {
            label: "Edit",
            type: "iconType",
            id: idGen(),
            typeAttributes: {
              icon: "action:edit",
              handler: handleEdit,
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


export const columns = (
  handler,
  picklistData,
  isBlocked
) => {
  let idGen = () => {
    let S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };
  let columnList = [
    {label: Source_of_funding, fieldName: "sourceOfFunding", type: "text" },
    {label: Amount_you_expect, fieldName: "amountExpect", type: "currency" },
    {
      value: '',
      label: Amount_received_so_far,
      id: idGen(),
      fieldName: "amountReceived",
      type: "numberInputType",
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "amountReceived",
        isDisabled: isBlocked,
        maxLength: 99999999
      },
      wrapText: true,
      hideDefaultActions: true
    },
    {
      value: '',
      label: Amount_still_to_come,
      fieldName: "amountStillToCome",
      id: idGen(),
      type: "numberInputType",
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "amountStillToCome",
        isDisabled: isBlocked,
        maxLength: 99999999
      },
      wrapText: true,
      hideDefaultActions: true
    },
    {
      value: '',
      label: Date_you_expect_this_amount,
      fieldName: "expectedDate",
      id: idGen(),
      type: "dateInputType",
      typeAttributes: {
        isRequired: true,
        handler: handler,
        index: { fieldName: "index" },
        fieldName: "expectedDate",
        isDisabled: isBlocked
      },
      wrapText: true,
      hideDefaultActions: true
    }
  ];
  return columnList;
};