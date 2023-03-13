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
		}
	}
})