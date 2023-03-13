({
    doInit : function(component, event, helper) {
        console.log('doInit ');      

        var urlParams = URLSearchParams(window.location.search);
        console.log('urlParams - '+urlParams);
        var Id = urlParams.get('id');
        
        component.find('Utils').getProject(Id, component, helper.initialValues);
            
    },
    
    onSuccess : function(component, event, helper) {
        console.log("onSuccess");
        
        var title = $A.get("$Label.c.Success");
        var msg = $A.get("$Label.c.ChangesSaved");
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": "success",
            "title": title,
            "message": msg
        });
        toastEvent.fire();
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/project-outcomes?id="+projId
        });
        urlEvent.fire();
        
	},
    
    back : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/the-heritage?id="+projId
        });
        urlEvent.fire();
        
	},
    
    next : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/project-outcomes?id="+projId
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
    
    checkToBoolean : function(component, event, helper) {
    	
        console.log('checkToBoolean');
        
        var target = event.target;
        var field = target.getAttribute("data-selected-id");
        
        console.log('target - '+target);
        console.log('field - '+field);
        
        var value = component.get("v."+field);
        console.log('value - '+value);
        
        component.set("v."+field, !value);
        
	},


})