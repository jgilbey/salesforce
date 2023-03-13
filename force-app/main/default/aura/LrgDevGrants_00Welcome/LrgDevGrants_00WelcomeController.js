({
	doInit : function(component, event, helper) {
        console.log('doInit ');

		/*var userId = $A.get("$SObjectType.CurrentUser.Id");
        if(userId!=null){
            console.log(userId);
            component.set("v.userId",userId );
            
            var action = component.get('c.getDevProjList');
            action.setParams({
                "uId" : userId
            });
            
            action.setCallback(this,function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var projectList = response.getReturnValue();
                    if(projectList!=null){
                        component.set("v.ProjectList_Development",projectList);
                        console.log("Success - Projects Found");
                        console.log("projectList - "+projectList);
                    }
                    else{
                        console.log("Success - No Project Found");
                    }
    
                }
            });
            
            $A.enqueueAction(action);
        }*/
        
        //get Projects
        helper.getDevProjects(component);
        helper.getDeliveryProjects(component);
        helper.getAwardedProjects(component);

    },

    goToProject : function(component, event, helper) {
        console.log("goToProject");
        var target = event.target;
        console.log("target - "+target);
        var projId = target.getAttribute("data-selected-id");
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-development/the-project?id="+projId
        });
        urlEvent.fire();
        
	},
    
    goToDeliveryProject : function(component, event, helper) {
        console.log("goToProject");
        var target = event.target;
        console.log("target - "+target);
        var projId = target.getAttribute("data-selected-id");
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-development/the-project-delivery?id="+projId
        });
        urlEvent.fire();
        
	},

})