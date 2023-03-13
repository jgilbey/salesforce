({
    doInit : function(component, event, helper) {
        console.log('doInit ');      

        var urlParams = URLSearchParams(window.location.search);
        console.log('urlParams - '+urlParams);
        var Id = urlParams.get('id');
        
        component.find('Utils').getProject(Id, component, helper.initialValues);
        helper.getFiles(component, Id);
        
    },

    deleteDoc : function(component, event, helper) {
        
        var target = event.target;
        var documentId = target.getAttribute("data-selected-id");
        
        var action = component.get('c.deleteFile');
        action.setParams({
            "fileId": documentId 
        });
        
        action.setCallback(this, function(response) {
            
            if (response.getState() === "SUCCESS") {
                console.log("Deleted");
                helper.getFiles(component);

                var title = $A.get("$Label.c.Success");
                var msg = $A.get("$Label.c.FileDeleted");
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type": "success",
                    "title": title,
                    "message": msg
                });
                toastEvent.fire();
                    }
            
        });
        
        $A.enqueueAction(action);
        
	},
    
    refreshDocList : function(component, event, helper) {
        console.log("refreshDocList");
        
        helper.getFiles(component);
        
	},

    
	next : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/declaration?id="+projId
        });
        urlEvent.fire();
        
	},

    
    back : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/your-organisation?id="+projId
        });
        urlEvent.fire();
        
	},

})