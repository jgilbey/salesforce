({
	init : function(component, event, helper) {
		console.log('Utils init ');  
        var params = event.getParams().arguments;
        var currentProjId = params.projId;
        var callerComponent = params.component;
        var callerSuccessFunction = params.successFunction;

        helper.getProjectDetails(callerComponent, callerSuccessFunction, currentProjId, component);
	},    
    
})