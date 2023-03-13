({
	getProjectDetails : function(callerComponent, callerSuccessFunction, projId, component) {
        console.log('Utils Helper - getProjectDetails');
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        console.log('projId - '+projId);
        
        if(userId!=null && projId!=null){
            console.log('userId - '+ userId);
            component.set("v.userId",userId );
            
            var action = component.get('c.getProj');
            action.setParams({
                "uId" : userId,
                "projId" : projId,
                "rt" : 'Large_Development_250_500k'
            });
            console.log("Action - getProj");
            
            action.setCallback(this,function(response){
                var state = response.getState();
                console.log("state - "+state);
                callerSuccessFunction(callerComponent,response);

            });
            
            $A.enqueueAction(action);
        }
		
	}
})