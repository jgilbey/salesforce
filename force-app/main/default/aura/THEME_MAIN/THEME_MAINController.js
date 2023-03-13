({
  doInit: function (c, e, h) {
    c.set("v.path", window.location.pathname);
    // c.set("v.userId", $A.get("$SObjectType.CurrentUser.Id"));
    h.retrieveData(c, e, h);
    h.checkNavigationCondition(c, e, h);
  },

  handleNav: function (c, e, h) {
    /* h.checkIsGeneric(c);
    var isGeneric = c.get("v.isGeneric");
    if(isGeneric) {
      h.navigate(c, "personalinformation", "/s/personalinformation");
    } else { */
    window.matchMedia("(max-width: 500px)").matches && h.toggleNav(c, e, h);
    c.set("v.path", e.target.getAttribute("path"));
    h.navigate(c, e.target.getAttribute("target"), null);
    // }
  },

  navigateToHome: function (c, e, h) {
    // h.navigate(c, "home", "/s/");
    // c.set("v.path", "/s/");
    h.handleNavigation(c, h, "home", "/s/");
  },

  navigateToAccessibility: function (c, e, h) {
    // h.navigate(c, "Accessibility__c", "/s/accessibility");
    // c.set("v.path", "/s/accessibility");
    h.handleNavigation(c, h, "accessibility", "/s/accessibility");
  },
  navigateToMonitoring: function (c, e, h) {
    h.handleNavigation(c, h, "Monitoring", "/s/Monitoring");
  },

  toggleNav: function (c, e, h) {
    h.toggleNav(c, e, h);
  },

  updateUrl: function (c, e, h) {
    h.checkIsGeneric(c).then(
      $A.getCallback(function (result) {
        if (result && !window.location.pathname.includes("personalinformation"))
          h.navigate(c, "personalinformation", "/s/personalinformation");
      })
    );
    c.set("v.path", window.location.pathname);
  },
  handleMenuClick: function (c, e, h) {
    var label = e.getParam("selectedItem").get("v.label");
    // var navService = c.find("navService");
    if (label == $A.get("$Label.c.Logout")) {
      $A.get("e.force:logout").fire();
    }

    if (label == $A.get("$Label.c.Personal_Info")) {
      h.handleNavigation(c, h, "personalinformation", "/s/personalinformation");
      navService.navigate(pageReference);
    }
    if (label == $A.get("$Label.c.Contact_Us")) {
      h.handleNavigation(c, h, "contact-us", "contact-us");
    }
    if (label == "Chatter") {
      h.handleNavigation(c, h, "chatter", "chatter");
    }
  }
});