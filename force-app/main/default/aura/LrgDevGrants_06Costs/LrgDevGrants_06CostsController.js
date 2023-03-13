({
    doInit : function(component, event, helper) {
        console.log('doInit ');      

        var urlParams = URLSearchParams(window.location.search);
        console.log('urlParams - '+urlParams);
        var Id = urlParams.get('id');
        
        component.find('Utils').getProject(Id, component, helper.initialValues);
        helper.devCosts(component, Id);
        helper.delCosts(component, Id);
        helper.devIncome(component, Id);
        helper.delIncome(component, Id);
        
    },
    
	saveDevCosts : function(component, event, helper) {
        console.log('saveDevCosts ');
        
        var devCosts = component.get("v.devCostList"); 
        
        var action = component.get('c.updateCosts');
        action.setParams({
            "costList" : devCosts
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var costList = response.getReturnValue();
                component.set("v.devCostList",costList);
                console.log("Success - save dev costs");
                
                helper.successRefresh(component);                        
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
    
    saveDevIncome : function(component, event, helper) {
        console.log('saveDevIncome ');
        
        var income = component.get("v.devIncomeList"); 
        
        var action = component.get('c.updateIncome');
        action.setParams({
            "incomeList" : income
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var incomeList = response.getReturnValue();
                component.set("v.devIncomeList",incomeList);
                console.log("Success - save dev income");
                
                helper.successRefresh(component);                        
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
    
    saveDelCosts : function(component, event, helper) {
        console.log('saveDelCosts ');
        
        var Costs = component.get("v.delCostList"); 
        
        var action = component.get('c.updateCosts');
        action.setParams({
            "costList" : Costs
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var costList = response.getReturnValue();
                component.set("v.delCostList",costList);
                console.log("Success - save del costs");
                
                helper.successRefresh(component);                        
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
    
    saveDelIncome : function(component, event, helper) {
        console.log('saveDelIncome');
        
        var income = component.get("v.delIncomeList"); 
        
        var action = component.get('c.updateIncome');
        action.setParams({
            "incomeList" : income
        });
        
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var incomeList = response.getReturnValue();
                component.set("v.delIncomeList",incomeList);
                console.log("Success - save dev income");
                
                helper.successRefresh(component);                        
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
    
    back : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-development/after-the-project-ends?id="+projId
        });
        urlEvent.fire();
        
	},
    
    next : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-development/your-organisation?id="+projId
        });
        urlEvent.fire();
        
	},

    maxLen5000 : function(component, event, helper) {
        console.log("onChange");
        console.log(event.getSource().get("v.value"));
        
        var val = event.getSource().get("v.value");
        
        if(val.length>=5000){
            console.log(val);    
            
            var title = $A.get("$Label.c.Error");
            var msg = $A.get("$Label.c.InputTooLong") + ' 5000.';;
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "error",
                "title": title,
                "message": msg
            });
            toastEvent.fire();
        }
        
	},

    
    refresh : function(component, event, helper) {
    	location.reload();
        
    },
})