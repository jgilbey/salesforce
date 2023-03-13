({
    getDevProjects : function(component, event, helper) {
        console.log('getDevProjects ');

		var userId = $A.get("$SObjectType.CurrentUser.Id");
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
        }
    },
    
    getDeliveryProjects : function(component, event, helper) {
        console.log('getDeliveryProjects ');

		var userId = $A.get("$SObjectType.CurrentUser.Id");
        if(userId!=null){
            console.log(userId);
            component.set("v.userId",userId );
            
            var action = component.get('c.getDeliveryProjList');
            action.setParams({
                "uId" : userId
            });
            
            action.setCallback(this,function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var projectList = response.getReturnValue();
                    if(projectList!=null){
                        component.set("v.ProjectList_Delivery",projectList);
                        console.log("Success - Projects Found");
                        console.log("projectList - "+projectList);
                    }
                    else{
                        console.log("Success - No Project Found");
                    }
    
                }
            });
            
            $A.enqueueAction(action);
        }
    },
})