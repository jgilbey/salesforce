({
    getFiles : function(component, event, helper){
        
        console.log("getFiles");
        var rid = component.get("v.recordId");  
        console.log("rid - "+rid);
        
        var action = component.get('c.getFiles');
        action.setParams({
            "projId" : rid
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var fileList = response.getReturnValue();
                component.set("v.uploadedDocs",fileList );
                console.log("Success");
                
            }
        });
        
        $A.enqueueAction(action);
        
    },
})