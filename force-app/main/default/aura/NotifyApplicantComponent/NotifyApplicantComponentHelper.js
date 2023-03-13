({
    helperMethod : function() {

    },
    checkStatus : function(component, event, helper) {
        var action = component.get("c.checkProjectEnquiryStatus");
        action.setParams({
            'projectEnquiryId': ''+component.get('v.recordId')+''
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    if(result == false) {
                        helper.showToast('Unavailable', $A.get("$Label.c.Cannot_notify"), 'info');
                    }
                    component.set("v.notify", result);
                } else {
                    helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                }
        });
        $A.enqueueAction(action);
        helper.getStatus(component, event, helper);
    },
    getStatus : function(component, event, helper) {
        var action = component.get("c.getProjectEnquiryStatus");
        action.setParams({
            'projectEnquiryId': ''+component.get('v.recordId')+''
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    component.set("v.status", result);
                } else {
                    helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                }
        });
        $A.enqueueAction(action);
    },
    getName : function(component, event, helper) {
        var action = component.get("c.getContactName");
        action.setParams({
            'projectEnquiryId': ''+component.get('v.recordId')+''
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    component.set("v.contactName", result);
                } else {
                    helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                }
        });
        $A.enqueueAction(action);
    },
    showToast : function(title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type" : type
        });
        toastEvent.fire();
    }
})