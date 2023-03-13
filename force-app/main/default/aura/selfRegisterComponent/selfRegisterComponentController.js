({
  initialize: function (component, event, helper) {
    $A.get("e.siteforce:registerQueryEventMap")
      .setParams({ qsToEvent: helper.qsToEventMap })
      .fire();
    $A.get("e.siteforce:registerQueryEventMap")
      .setParams({ qsToEvent: helper.qsToEventMap2 })
      .fire();
    component.set(
      "v.extraFields",
      helper.getExtraFields(component, event, helper)
    );
    helper.obtainCommunityLanguages(component);
    var params = helper.getJsonFromUrl();
    if (params.language) {
      component.set("v.selectedLanguage", params.language);
    }

    var languageList = [];
    languageList.push({ label: "English (US)", value: "en_US" });
    languageList.push({ label: "Welsh", value: "cy" });
    //component.set("v.languageList", languageList);

   

    let vfURL = "https://nhmfdev-lottery.cs87.force.com";
    window.addEventListener(
      "message",
      $A.getCallback(function (event) {
        if (event.origin !== vfURL) {
          return;
        }
        if (event.data !== null) {
          let action = component.get("c.reCaptchaVerify");
          action.setParams({ response: event.data });

          action.setCallback(this, function (res) {
            if (res.getReturnValue()) {
              component.set("v.isDisable", false);
              component.set("v.isCaptchaChecked", true);
            }
          });
          $A.enqueueAction(action);
        }
      }, false)
    );

    document.addEventListener(
      "grecaptchaVerified",
      $A.getCallback(function (e) {
        let action = component.get("c.reCaptchaVerify");
        action.setParams({ response: e.detail.response });

        action.setCallback(this, function (res) {
          if (res.getReturnValue()) {
            component.set("v.isDisable", false);
            component.set("v.isCaptchaChecked", true);
          }
        });
        $A.enqueueAction(action);
      }, false)
    );

    document.addEventListener("grecaptchaExpired", function () {
      component.set("v.isDisable", true);
      component.set("v.isCaptchaChecked", false);
    });
  },
  onRender: function (component, event, helper) {
    document.dispatchEvent(
      new CustomEvent("grecaptchaRender", {
        detail: { element: "recaptchaCheckbox" }
      })
    );
  },

  handleSelfRegister: function (component, event, helper) {
    if (component.get("v.isCaptchaChecked")) {
      helper.handleSelfRegister(component, event, helper);
    } else {
      helper.showError(component, "Before registration you need pass CAPTHCA");
    }
  },

  setStartUrl: function (component, event, helper) {
    var startUrl = event.getParam("startURL");
    if (startUrl) {
      component.set("v.startUrl", startUrl);
    }
  },

  setExpId: function (component, event, helper) {
    var expId = event.getParam("expid");
    if (expId) {
      component.set("v.expid", expId);
    }
    helper.setBrandingCookie(component, event, helper);
  },

  onKeyUp: function (component, event, helpler) {
    //checks for "enter" key
    if (event.getParam("keyCode") === 13) {
      helper.handleSelfRegister(component, event, helper);
    }
  },

  nextHandel: function (component, event, helper) {
    component.set("v.showContactInfo", false);
    component.set("v.showorganisationInfo", true);
  },

  backHandel: function (component, event, helper) {
    component.set("v.showorganisationInfo", false);
    component.set("v.showContactInfo", true);
  },

  refreshAfterChangeLanguage: function(component, event, helper){
    window.location.href = '/getheritagememorialfunding/s/login/SelfRegister?language=' + component.get("v.selectedLanguage");
  }
});