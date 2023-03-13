({
	initialValues : function(component, response) {
		var state = response.getState();
		console.log("initialValues state - "+state);
		if (state === "SUCCESS") {
			var project = response.getReturnValue();
			console.log("project.Id - "+project.Id);
			component.set("v.recordId",project.Id);
			component.set("v.readOnly",project.Application_Submitted__c );
            
            component.set("v.hasTakeOnProjectOfScale",project.Project_of_scale_in_the_last_5_yrs__c );

		}
	}
})