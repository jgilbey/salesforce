export const obtainValidationMap = (isCapital) => {
  let validationMap = [
    {
      field: "spendingCosts",
      section: "Section 1",
      isList: true,
      fieldsToCheck: [
        "costHeading",
        "invoiceReferenceNumber",
        "invoiceDate",
        "supplierName",
        "description",
        "costToDate",
        "vat"
      ]
    }
  ];
  if (isCapital) {
    validationMap = [
      {
        field: "staturyPermissionInfo",
        dependedField: "hasStaturyPermissions",
        section: "Section 2"
      },
      {
        field: "projectIncomes",
        dependedField: "hasProjectIncomes",
        section: "Section 3",
        isList: true,
        fieldsToCheck: [
          "sourceOfFunding",
          "amountExpect",
          "amountReceived",
          "amountStillToCome",
          "expectedDate"
        ]
      },
      {
        field: "purchasedGoods",
        dependedField: "haveYouPurchasedGoods",
        section: "Section 4"
      },
      {
        field: "explainWhyVendorAppointed",
        dependedField: "isVendorLinked",
        section: "Section 4"
      },
      {
        field: "spendingCosts",
        section: "Section 5",
        isList: true,
        fieldsToCheck: [
          "costHeading",
          "invoiceReferenceNumber",
          "invoiceDate",
          "supplierName",
          "description",
          "costToDate",
          "vat"
        ]
      }
    ];
  }
  return validationMap;
};