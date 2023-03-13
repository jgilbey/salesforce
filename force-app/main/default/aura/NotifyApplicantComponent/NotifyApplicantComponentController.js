({
    doInit : function(component, event, helper) {
        helper.checkStatus(component, event, helper);
        helper.getName(component, event, helper);
    },
    handleExit : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
        
    },
    sendEmail : function(component, event, helper) {
        var action = component.get("c.sendEmailToContact");
        action.setParams({
            'projectEnquiryId': ''+component.get('v.recordId')+''
        });
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result == true) { 
                    helper.showToast('Success', $A.get("$Label.c.Email_was_sent_successfully"), 'success');
                    //component.set("v.disableSendEmail", true);
                    $A.get("e.force:closeQuickAction").fire();
                }
                else {
                    helper.showToast('Error', $A.get("$Label.c.Cannot_notify"), 'error');
                }
            } else {
                helper.showToast('Error', $A.get("$Label.c.Cannot_notify"), 'error');
            }
        });
        $A.enqueueAction(action);
    }
})