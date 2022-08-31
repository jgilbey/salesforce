import Approved_Purposes from "@salesforce/label/c.Approved_Purposes";
export const mapApprovedPurposes = (approvedPurposespArray, textHandlex) => {
  return approvedPurposespArray.map((el, index) => {
    return {
      id: index,
      columns: [
        {
          name: "purpose",
          typeText: true,
          handler: textHandlex,
          value: el.purpose,
          disabled: true
        }
      ]
    };
  });
};

export const obtainApprovedPuprosesColums = (handler, isBlocked) => {
  let columnList = [
    /*{
      label: Approved_Purposes,
      fieldName: "purpose",
      type: "textInputType",
      typeAttributes: {
        handler: handler,
        index: { fieldName: "id" },
        fieldName: "purpose",
        isRequired: true,
        isDisabled: isBlocked
      },
      wrapText: true,
      hideDefaultActions: true
    }*/
    {
      label: Approved_Purposes,
      fieldName: "purpose",
      type: "text",
      wrapText: true,
      hideDefaultActions: true,
      resizable: false
    }
  ];

  return columnList;
}