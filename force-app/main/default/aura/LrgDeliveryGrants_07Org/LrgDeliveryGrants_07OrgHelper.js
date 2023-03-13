({
	initialValues : function(component, response) {
		var state = response.getState();
		console.log("initialValues state - "+state);
		if (state === "SUCCESS") {
			var project = response.getReturnValue();
			console.log("project.Id - "+project.Id);
			component.set("v.recordId",project.Id);
			component.set("v.readOnly",project.Application_Submitted__c );
			component.set("v.orgId",project.AccountId );
            
            component.set("v.isVatRegistered",project.Account.Are_you_VAT_registered_picklist__c );
            component.set("v.hasReview",project.Undertaking_Governance_review__c );
            
            var typesMission = [];
			typesMission.push({value:false, key:"Black or minority ethnic-led"});
            typesMission.push({value:false, key:"Disability-led"});
            typesMission.push({value:false, key:"LGBT+-led"});
            typesMission.push({value:false, key:"Female-led"});
            typesMission.push({value:false, key:"Young people-led"});
            typesMission.push({value:false, key:"Mainly led by people from Catholic communities"});
            typesMission.push({value:false, key:"Mainly led by people from Protestant communities"});
            typesMission.push({value:false, key:"None of the above"});

			console.log('typesMission - '+JSON.stringify(typesMission));

			var mission = project.Account.Organisation_s_Mission_and_Objectives__c;
			console.log('mission - '+mission);
			if(mission!=null){
				var listMission = mission.split(';');
				console.log('listMission - '+listMission);

				for(var item of typesMission){
					if(listMission.includes(item.key)){
						item.value=true;
					}
				}
			}
			console.log('typesMission - '+JSON.stringify(typesMission));

			component.set("v.mission", typesMission);

		}
	}
})