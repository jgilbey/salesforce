({
  qsToEventMap: {
    startURL: "e.c:setStartUrl"
  },

  qsToEventMap2: {
    expid: "e.c:setExpId"
  },

  handleSelfRegister: function (component, event, helper) {
    var accountId = component.get("v.accountId");
    var regConfirmUrl = component.get("v.regConfirmUrl");
    var firstname = component.find("firstname").get("v.value");
    var lastname = component.find("lastname").get("v.value");
    var email = component.find("email").get("v.value");
    // var organisationName = component.find("organisationName").get("v.value");
    var includePassword = component.get("v.includePasswordField");
    var password = component.find("password").get("v.value");
    var confirmPassword = component.find("confirmPassword").get("v.value");
    var action = component.get("c.selfRegister");
    var extraFields = component.get("v.extraFields");
    extraFields.push({fieldPath:"LanguageLocaleKey", value: component.get("v.selectedLanguage")});
    var extraFields = JSON.stringify(extraFields);  // somehow apex controllers refuse to deal with list of maps
    var startUrl = component.get("v.startUrl");

    startUrl = decodeURIComponent(startUrl);

    action.setParams({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      accountId: accountId,
      regConfirmUrl: regConfirmUrl,
      extraFields: extraFields,
      startUrl: startUrl,
      includePassword: includePassword
    });
    // , organisationName:organisationName
    action.setCallback(this, function (a) {
      var rtnValue = a.getReturnValue();
      if (rtnValue !== null) {
        helper.showError(component, rtnValue);
      }
    });
    $A.enqueueAction(action);
  },

  handleSelfRegisterTest: function (component, event, helper) {
    var accountId = component.get("v.accountId");
    var regConfirmUrl = component.get("v.regConfirmUrl");
    /*  var firstname = component.find("firstname").get("v.value");
        var lastname = component.find("lastname").get("v.value");
        var email = component.find("email").get("v.value"); */
    var contactInfo = component.get("v.contactInfo");
    var organisationInfo = component.get("v.organisationInfo");
    var includePassword = component.get("v.includePasswordField");
    var password = component.find("password").get("v.value");
    var confirmPassword = component.find("confirmPassword").get("v.value");
    var action = component.get("c.selfRegisterTest");
    var extraFields = component.get("v.extraFields");
    extraFields.push({fieldPath:"LanguageLocaleKey", value: component.get("v.selectedLanguage")});
    var extraFields = JSON.stringify(extraFields); // somehow apex controllers refuse to deal with list of maps
    var startUrl = component.get("v.startUrl");

    startUrl = decodeURIComponent(startUrl);

    action.setParams({
      contactJSON: JSON.stringify(contactInfo),
      organisationJSON: JSON.stringify(organisationInfo),
      password: password,
      confirmPassword: confirmPassword,
      accountId: accountId,
      regConfirmUrl: regConfirmUrl,
      extraFields: extraFields,
      startUrl: startUrl,
      includePassword: includePassword
    });
    action.setCallback(this, function (a) {
      var rtnValue = a.getReturnValue();
      if (rtnValue !== null) {
        component.set("v.errorMessage", rtnValue);
        component.set("v.showError", true);
      }
    });
    $A.enqueueAction(action);
  },

  getExtraFields: function (component, event, helper) {
    var action = component.get("c.getExtraFields");
    action.setParam(
      "extraFieldsFieldSet",
      component.get("v.extraFieldsFieldSet")
    );
    action.setCallback(this, function (a) {
      var rtnValue = a.getReturnValue();
      if (rtnValue !== null) {
        component.set("v.extraFields", rtnValue);
      }
    });
    $A.enqueueAction(action);
  },

  obtainCommunityLanguages: function (component) {
    var action = component.get("c.obtainCommunityLanguages");
    action.setCallback(this, function (a) {
      var rtnValue = a.getReturnValue();
      rtnValue = JSON.parse(rtnValue);
      if (rtnValue !== null) {
        component.set("v.languageList", rtnValue);
      }
    });
    $A.enqueueAction(action);
  },

  setBrandingCookie: function (component, event, helper) {
    var expId = component.get("v.expid");
    if (expId) {
      var action = component.get("c.setExperienceId");
      action.setParams({ expId: expId });
      action.setCallback(this, function (a) {});
      $A.enqueueAction(action);
    }
  },

  showError: function (component, errorMessage) {
    component.set("v.errorMessage", errorMessage);
    component.set("v.showError", true);
  },

  getJsonFromUrl: function () {
    var query = location.search.substr(1);
    var result = {};
    query.split("&").forEach(function (part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }
});