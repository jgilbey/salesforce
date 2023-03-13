({
    helperMethod : function() {

    },
    checkStatus : function(component, event, helper) {
        var action = component.get("c.checkProjectEnquiryStatusAndCases");
        action.setParams({
            'projectEnquiryId': ''+component.get('v.recordId')+''
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    if(result.encouraged == true) {
                        component.set("v.encouraged", true);
                        helper.getName(component, event, helper);
                        if(result.casesDoNotExist == true) {
                            component.set("v.createCase", true);
                        }
                        else {
                            helper.showToast('Unavailable', $A.get("$Label.c.Cannot_create_case_and_notify_applicant"), 'info');
                            component.set("v.createCase", false);
                        }
                    }
                    else {
                        helper.showToast('Unavailable', $A.get("$Label.c.Cannot_create_case_and_notify_applicant"), 'info');
                        component.set("v.encouraged", false);
                    }
                } else {
                    helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                }
        });
        $A.enqueueAction(action);
    },
    createCase : function(component, event, helper) {
        var action = component.get("c.createCaseForPE");
        action.setParams({
            'projectEnquiryId': ''+component.get('v.recordId')+''
        });
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                if(result == 'true') { 
                    helper.showToast('Success', $A.get("$Label.c.Case_was_created_successfully"), 'success');
                    $A.get("e.force:closeQuickAction").fire();
                }
                else if(result == 'false'){
                    helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                    $A.get("e.force:closeQuickAction").fire();
                }
                else{
                    helper.showToast('Error', result, 'error');
                    $A.get("e.force:closeQuickAction").fire();
                }
            } else {
                helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                $A.get("e.force:closeQuickAction").fire();
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
                    $A.get("e.force:closeQuickAction").fire();
                }
                else {
                    helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                    $A.get("e.force:closeQuickAction").fire();
                }
            } else {
                helper.showToast('Error', $A.get("$Label.c.Error_occured"), 'error');
                $A.get("e.force:closeQuickAction").fire();
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