({

    initialValues : function(component, response) {
        var state = response.getState();
		console.log("initialValues state - "+state);
		if (state === "SUCCESS") {
			var project = response.getReturnValue();
			console.log("project.Id - "+project.Id);
			component.set("v.recordId",project.Id);
			component.set("v.readOnly",project.Application_Submitted__c );
            
		}
        
    },

	devCosts : function(component, rid) {
        console.log("devCosts");
        console.log("rid - "+rid);
        var action = component.get("c.getDevCosts");
        action.setParams({
            "projId" : rid 
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("state - "+state);
            if(state === 'SUCCESS') {
                var costList = response.getReturnValue();
                component.set("v.devCostList",costList);
                console.log("Success - getDevCosts");
            }
            else {
                var errors = response.getError();
                if(errors){
                    if(errors[0] && errors[0].message){
                        console.log("Error Message: " + errors[0].message);
                    }else{
                        console.log("Unknown error");
                    }
                }
            }
        });       
        $A.enqueueAction(action);
    },
    
    delCosts : function(component,rid) {
        console.log("delCosts");
        console.log("rid - "+rid);
        var action = component.get("c.getDelCosts");
        action.setParams({
            "projId" : rid
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("state - "+state);
            if(state === 'SUCCESS') {
                var costList = response.getReturnValue();
                component.set("v.delCostList",costList);
                console.log("Success - getDelCosts");
            }
            else {
                var errors = response.getError();
                if(errors){
                    if(errors[0] && errors[0].message){
                        console.log("Error Message: " + errors[0].message);
                    }else{
                        console.log("Unknown error");
                    }
                }
            }
        });       
        $A.enqueueAction(action);
    },
    
    devIncome : function(component, rid) {
        console.log("devIncome");
        console.log("rid - "+rid);
        var action = component.get("c.getDevIncome");
        action.setParams({
            "projId" : rid
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("state - "+state);
            if(state === 'SUCCESS') {
                var incomeList = response.getReturnValue();
                component.set("v.devIncomeList",incomeList);
                console.log("Success - getDevIncome");
            }
            else {
                var errors = response.getError();
                if(errors){
                    if(errors[0] && errors[0].message){
                        console.log("Error Message: " + errors[0].message);
                    }else{
                        console.log("Unknown error");
                    }
                }
            }
        });       
        $A.enqueueAction(action);
    },
    
    delIncome : function(component, rid) {
        console.log("devIncome");
        console.log("rid - "+rid);
        var action = component.get("c.getDelIncome");
        action.setParams({
            "projId" : rid
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("state - "+state);
            if(state === 'SUCCESS') {
                var incomeList = response.getReturnValue();
                component.set("v.delIncomeList",incomeList);
                console.log("Success - getDelIncome");
            }
            else {
                var errors = response.getError();
                if(errors){
                    if(errors[0] && errors[0].message){
                        console.log("Error Message: " + errors[0].message);
                    }else{
                        console.log("Unknown error");
                    }
                }
            }
        });       
        $A.enqueueAction(action);
    },
    
    successRefresh : function(component, event, helper) {
        console.log("onSuccess");
        
        var title = $A.get("$Label.c.Success");
        var msg = $A.get("$Label.c.ChangesSaved");
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": "success",
            "title": title,
            "message": msg
        });
        toastEvent.fire();
        
        var refresh = component.get('c.doInit');
    	$A.enqueueAction(refresh);
        //$A.get("e.force:refreshView").fire();
        
	},
})