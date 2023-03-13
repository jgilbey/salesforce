({
    doInit : function(component, event, helper) {
        console.log('doInit ');      

        var urlParams = URLSearchParams(window.location.search);
        console.log('urlParams - '+urlParams);
        var Id = urlParams.get('id');
        
        component.find('Utils').getProject(Id, component, helper.initialValues);
        
    },

    goToDeliveryProject : function(component, event, helper) {
        console.log("go to project page");
        var projId = component.get("v.recordId");
        console.log("ID: "+projId)
        
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/the-project?id="+projId
        });
        urlEvent.fire(); 
	},
})