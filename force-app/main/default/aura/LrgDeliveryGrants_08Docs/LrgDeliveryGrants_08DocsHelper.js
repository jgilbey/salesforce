({
    initialValues : function(component, response) {
		var state = response.getState();
		console.log("initialValues state - "+state);
		if (state === "SUCCESS") {
			var project = response.getReturnValue();
			console.log("project.Id - "+project.Id);
			component.set("v.recordId",project.Id);
			component.set("v.readOnly",project.Application_Submitted__c );

		}
	},
    
    getFiles : function(component, Id){
        
        console.log("getFiles");
        console.log("Id - "+Id);
        if(Id==null){
            console.log("null");
            Id=component.get('v.recordId');
        }
        
        var action = component.get('c.getFiles');
        action.setParams({
            "projId" : Id
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
        
        
        //var refresh = component.get('c.doInit');
    	//$A.enqueueAction(refresh);
        
    },
    
})