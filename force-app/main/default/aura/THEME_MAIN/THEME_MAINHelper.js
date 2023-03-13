({
	toggleNav: function(c, e, h) {
        c.set('v.navOpened', !c.get('v.navOpened'));
    },
    
    retrieveData: function(c, e, h) {
        var action = c.get('c.obtainUserInfo');

        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var dataResponse = response.getReturnValue();
                
                if(dataResponse.success) {
                    var result = dataResponse.result;
                    c.set("v.currentUserRecord", result.userInfo);
                    c.set("v.isGeneric", result.isGeneric);
                    if(result.isGeneric){
                        h.navigate(c, "personalinformation", null);
                    }
                } else {
                    console.log(JSON.stringify(dataResponse.message));
                }
            }else {
                console.log(JSON.stringify(response.getError()));
            }
        });
        $A.enqueueAction(action)
    },

    checkNavigationCondition: function(c, e, h) {
        var action = c.get('c.hasForms');

        action.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var dataResponse = response.getReturnValue();
                c.set("v.showMonitoring", dataResponse);
            }else {
                console.log(JSON.stringify(response.getError()));
            }
        });
        $A.enqueueAction(action)
        
    },
    
    checkIsGeneric :function(c) {
        return new Promise($A.getCallback(function(resolve, reject) {
            var action = c.get('c.obtainUserInfo');
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    var dataResponse = response.getReturnValue();
                    if(dataResponse.success) {
                        var result = dataResponse.result;
                        c.set("v.currentUserRecord", result.userInfo);
                        c.set("v.isGeneric", result.isGeneric);
                        resolve(result.isGeneric);
                    } else {
                        console.log(JSON.stringify(result.message));
                        reject("Error");
                    }
                }else {
                    console.log(JSON.stringify(dataResponse.getError()));
                    reject("Error");
                }
            });
            $A.enqueueAction(action);
        // return c.get("v.isGeneric");
        }));
    },
    
    handleNavigation :function(c, h, pageName, path) {
        h.checkIsGeneric(c).then(
            $A.getCallback(function(result) {
                var isGeneric = result;//c.get("v.isGeneric");
                if(isGeneric) {
                    pageName="personalinformation";
                    path="personalinformation";
                }
                h.navigate(c, pageName, null);
                c.set("v.path", path);
        }));
        /* var isGeneric = h.checkIsGeneric(c);//c.get("v.isGeneric");
        if(!isGeneric) {
            h.navigate(c, pageName, null);
            c.set("v.path", path);
        } */
    },
    
    navigate: function(component, pageName, pagePath) {
        var currentPageType = "standard__namedPage";
        var navService = component.find("navService");
        var pageReference = {
            type: currentPageType,
            attributes: {
              pageName: pageName
            }
          };
        component.set("v.path", pagePath);
        navService.navigate(pageReference);
    },
})