({
	initialValues : function(component, response) {
		var state = response.getState();
		console.log("initialValues state - "+state);
		if (state === "SUCCESS") {
			var project = response.getReturnValue();
			console.log("project.Id - "+project.Id);
			component.set("v.recordId",project.Id);
			component.set("v.ProjectName",project.Project_Title__c );
			component.set("v.ProjectRef",project.Project_Reference_Number__c );
			component.set("v.readOnly",project.Application_Submitted__c );
            
            component.set("v.isFirstApplication",project.First_Application_to_NLHF__c );
			component.set("v.doesAttractedVisitors",project.Does_heritage_attract_visitors__c );
			component.set("v.isDeliveredByPartnership",project.Delivered_by_partnership__c );

		}
	}
})