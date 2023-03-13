({
    doInit : function(component, event, helper) {
        console.log('doInit ');      

        var urlParams = URLSearchParams(window.location.search);
        console.log('urlParams - '+urlParams);
        var Id = urlParams.get('id');
        
        component.find('Utils').getProject(Id, component, helper.initialValues);
        
    },
    
    submit : function(component, event, helper) {
        
        console.log('submit application ');
        
        var rid = component.get("v.recordId");
        console.log("rid - "+rid);
        
        var action = component.get('c.submitApplication');
        action.setParams({
            "projId" : rid
        });
        console.log("action");
        action.setCallback(this,function(response){
            console.log("setCallback");
            var state = response.getState();
            if (state === "SUCCESS") {
                
                console.log("Success");
                
                var title = $A.get("$Label.c.Success");
                var msg = $A.get("$Label.c.LrgDevGrant_ApplicationSubmitted");
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "success",
                    "title": title,
                    "message": msg
                });
                toastEvent.fire();
				location.reload();
            }
            else{
                console.log("Fail");
                
                var title = $A.get("$Label.c.Error");
                var msg = $A.get("$Label.c.LrgDevGrant_ApplicationSubmitError");
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "error",
                    "title": title,
                    "message": msg
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
                
	},

    back : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-development/supporting-documents?id="+projId
        });
        urlEvent.fire();
        
	},
    
    maxLen5000 : function(component, event, helper) {
        console.log("onChange");
        console.log(event.getSource().get("v.value"));
        
        var val = event.getSource().get("v.value");
        
        if(val.length>=5000){
            console.log(val);    
            
            var title = $A.get("$Label.c.Error");
            var msg = $A.get("$Label.c.InputTooLong") + ' 5000.';;
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "error",
                "title": title,
                "message": msg
            });
            toastEvent.fire();
        }
        
	},

})