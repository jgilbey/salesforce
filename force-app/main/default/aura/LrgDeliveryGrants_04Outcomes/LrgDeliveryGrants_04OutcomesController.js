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
          "url": "/apply-delivery/after-the-project-ends?id="+projId
        });
        urlEvent.fire();
        
	},
    
    back : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/managing-your-project?id="+projId
        });
        urlEvent.fire();
        
	},
    
    next : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/after-the-project-ends?id="+projId
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

	tickBox : function(component, event, helper) {
        console.log("onChange");
        console.log("tickBox");
        
        var target = event.target;
        console.log("target: " + target);
		var field = target.getAttribute("data-selected-id");
        console.log("Field: " + field);
        var details = component.get("v."+field+"Details");

        console.log("details: " + details);
        
        console.log("Component len: " + component.length);
		
        if(details.length>0){
           component.set("v."+field,true);
        }
        else{
            component.set("v."+field,false);
        }
    }
})