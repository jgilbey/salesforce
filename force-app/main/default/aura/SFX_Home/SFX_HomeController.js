({
	doInit : function(component, event, helper) {
        console.log('doInit ');
        
        //get Projects
        helper.getDevProjects(component);
        helper.getDeliveryProjects(component);

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
    
    goToDeliveryStart : function(component, event, helper) {
        console.log("goToStartPage");
        var target = event.target;
        console.log("target - "+target);
        var projId = target.getAttribute("data-selected-id");
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/start-page?id="+projId
        });
        urlEvent.fire(); 
	},

  goToSubmittedDelivery: function(component, event, helper) {
        console.log("goToReadOnly");
        var target = event.target;
        console.log("target - "+target);
        var projId = target.getAttribute("data-selected-id");
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/the-project?id="+projId
        });
        urlEvent.fire(); 
	},
})