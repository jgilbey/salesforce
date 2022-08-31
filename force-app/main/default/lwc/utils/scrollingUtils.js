const scrollTo =  function (scrollElement) {

  if (typeof scrollElement === "string"){
    scrollElement = this.template.querySelector(scrollElement);
  }

  if (scrollElement) {
    scrollElement.scrollIntoView();
  }
};

export { scrollTo };