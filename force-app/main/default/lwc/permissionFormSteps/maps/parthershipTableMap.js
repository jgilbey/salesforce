import description_of_funding from "@salesforce/label/c.description_of_funding";
import amount from "@salesforce/label/c.amount";
import amount_secured from "@salesforce/label/c.amount_secured";
import we_are_attaching_confirmation from "@salesforce/label/c.we_are_attaching_confirmation";

export const mapPartnership = (
  partnershipArray,
  textHandler,
  checkboxHandler
) => {
  return partnershipArray.map((el, index) => {
    return {
      id: el.id,
      columns: [
        {
          name: "description",
          typeText: true,
          handler: textHandler,
          value: el.description,
          disabled: true
        },
        {
          name: "amount",
          typeText: true,
          handler: textHandler,
          value: el.amount,
          disabled: true
        },
        {
          name: "amountSecured",
          typeNumber: true,
          formatter: "currency",
          handler: textHandler,
          value: el.amountSecured,
          disabled: false,
          id: el.id
        },
        {
          name: "attachingConfirmation",
          typeCheckbox: true,
          handler: checkboxHandler,
          value: el.attachingConfirmation,
          disabled: false,
          id: el.id
        }
      ]
    };
  });
};

export const obtainPartnerShipColumns = (handler, isBlocked) => {
  let columnList = [
    {
      label: description_of_funding,
      fieldName: "description",
      type: "text",
      hideDefaultActions: true,
      typeAttributes:{
        isDisabled: true
      }
    },
    {
      label: amount,
      fieldName: "amount",
      type: "currency",
      hideDefaultActions: true,
      typeAttributes:{
        isDisabled: true
      },
      resizable: false,
      fixedWidth: 130
    },
    {
      label: amount_secured,
      fieldName: "amountSecured",
      type: "numberInputType",
      typeAttributes: {
        isRequired: true,
        formatter: "currency",
        handler: handler,
        index: { fieldName: "id" },
        fieldName: "amountSecured",
        isDisabled: isBlocked,
        maxLength: 99999999
      },
      wrapText: true,
      hideDefaultActions: true,
      resizable: false,
      fixedWidth: 200
    },
    {
      label: we_are_attaching_confirmation,
      fieldName: "attachingConfirmation",
      type: "checkboxInputType",
      typeAttributes: {
        handler: handler,
        index: { fieldName: "id" },
        fieldName: "attachingConfirmation",
        isDisabled: isBlocked
      },
      wrapText: false,
      hideDefaultActions: true,
      resizable: false,
      fixedWidth: 160
    }
  ];

  return columnList;
};