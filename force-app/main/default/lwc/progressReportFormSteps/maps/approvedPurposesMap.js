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