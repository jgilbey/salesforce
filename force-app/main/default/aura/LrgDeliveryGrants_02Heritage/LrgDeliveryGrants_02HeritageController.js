({
    doInit : function(component, event, helper) {
        console.log('doInit ');      

        var urlParams = URLSearchParams(window.location.search);
        console.log('urlParams - '+urlParams);
        var Id = urlParams.get('id');
        
        component.find('Utils').getProject(Id, component, helper.initialValues);
    },
    
    onSuccess : function(component, event, helper) {
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
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/managing-your-project?id="+projId
        });
        urlEvent.fire();
        
	},
    
    back : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/the-project?id="+projId
        });
        urlEvent.fire();
        
	},
    
    next : function(component, event, helper) {
        console.log("onSuccess");
        
        var projId = component.get('v.recordId');
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/apply-delivery/managing-your-project?id="+projId
        });
        urlEvent.fire();
        
	},

    maxLen100 : function(component, event, helper) {
        console.log("onChange");
        console.log(event.getSource().get("v.value"));
        
        var val = event.getSource().get("v.value");
        
        if(val.length>=100){
            console.log(val);    
            
            var title = $A.get("$Label.c.Error");
            var msg = $A.get("$Label.c.InputTooLong") + ' 100.';;
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "error",
                "title": title,
                "message": msg
            });
            toastEvent.fire();
        }
        
	},

    maxLen255 : function(component, event, helper) {
        console.log("onChange");
        console.log(event.getSource().get("v.value"));
        
        var val = event.getSource().get("v.value");
        
        if(val.length>=255){
            console.log(val);    
            
            var title = $A.get("$Label.c.Error");
            var msg = $A.get("$Label.c.InputTooLong") + ' 255.';;
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "error",
                "title": title,
                "message": msg
            });
            toastEvent.fire();
        }
        
	},

    maxLen5000 : function(component, event, helper) {
        console.log("onChange");
        console.log(event.getSource().get("v.value"));
        
        var val = event.getSource().get("v.value");
        
        if(val.length>=5000){
            console.log(val);    
            
            var title = $A.get("$Label.c.Error");
            var msg = $A.get("$Label.c.InputTooLong") + ' 5000.';
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "error",
                "title": title,
                "message": msg
            });
            toastEvent.fire();
        }
        
	},

    checkToPicklist : function(component, event, helper) {
    	
        console.log('checkToPicklist');
        
        var target = event.target;
        var value = target.getAttribute("value");
        var field = target.getAttribute("data-selected-id");
        
        console.log('target - '+target);
        console.log('value - '+value);
        console.log('field - '+field);
        
        component.set("v."+field,value);
        
	},
    
    checkToBoolean : function(component, event, helper) {
    	
        console.log('checkToBoolean');
        
        var target = event.target;
        var field = target.getAttribute("data-selected-id");
        
        console.log('target - '+target);
        console.log('field - '+field);
        
        var value = component.get("v."+field);
        console.log('value - '+value);
        
        component.set("v."+field, !value);
        
	},

    checkboxToMultiPicklist : function(component, event, helper) {
    	
        console.log('checkboxToMultiPicklist');
        var target = event.target;
        var checkboxValue = target.getAttribute("value");
        var field = target.getAttribute("data-selected-id");
        console.log('target - '+target);
        console.log('checkboxValue - '+checkboxValue);
        console.log('field - '+field);

        var ListItems = component.get("v."+field);
        var answer = '';
        for (var item of ListItems){
            console.log('item.key - '+item.key +item.value);
            if(item.key==checkboxValue){
                item.value= !item.value;
            }
            if(item.value==true){
                answer=answer+item.key+';';
            }
        }
        
        console.log('answer - '+answer);

        component.set("v."+field+'Answer',answer);
        
	}

})