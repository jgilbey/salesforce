({
    doInit : function(component, event, helper) {
        helper.checkStatus(component, event, helper);        
    },
    handleExit : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
    handleSubmit : function(component, event, helper) {
        component.set("v.disableSubmit", true);
        helper.createCase(component, event, helper);
    },
})