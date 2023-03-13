({

        apexExecute : function(component, event, helper) {
            //Call Your Apex Controller Method.
            var action = component.get("c.generatePONumber");
            
            action.setParams({
                'sobjectRecordId': ''+component.get('v.recordId')+''
            });

            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log(state);
                
                    if (state === "SUCCESS") {
                        //after code
                        var result = response.getReturnValue();
            //alert(result);
            //window.location.reload();
            $A.get('e.force:refreshView').fire();

                        $A.get("e.force:closeQuickAction").fire();
                    } else {
                        
                    }
                    
            });
            
            $A.enqueueAction(action);
  }
})