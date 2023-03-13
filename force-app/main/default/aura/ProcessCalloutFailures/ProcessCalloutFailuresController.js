({

        apexExecute : function(component, event, helper) {
            //Call Your Apex Controller Method.
            component.set('v.isProcessing', true);
            var action = component.get("c.processErrorLog");
            
            action.setParams({
                'errorLogId': ''+component.get('v.recordId')+''
            });

            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log(state);
                
                    if (state === "SUCCESS") {
                        //after code
                        var result = response.getReturnValue();
            //alert(result);
            //window.location.reload();
                        component.set('v.isProcessing', false);
                        if(result == ''){
                            component.set('v.isSuccess', true);
                            //$A.get('e.force:refreshView').fire();

                          //$A.get("e.force:closeQuickAction").fire();
                        }else{
                          component.set('v.error', result);
                          component.set('v.isSuccess', false);
                        }
                        
                    } else {
                        
                    }
                    
            });
            
            $A.enqueueAction(action);
  }
})