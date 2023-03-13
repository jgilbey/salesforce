({
	initialValues : function(component, response) {
		var state = response.getState();
		console.log("initialValues state - "+state);
		if (state === "SUCCESS") {
			var project = response.getReturnValue();
			console.log("project.Id - "+project.Id);
			component.set("v.recordId",project.Id);
			component.set("v.readOnly",project.Application_Submitted__c );

			component.set("v.isConsideredRisk",project.Heritage_considered_to_be_at_risk__c );
			component.set("v.hasCapitalWork",project.Any_capital_work_as_part_of_this__c );
			component.set("v.capitalOwner",project.Capital_work_owner__c );
			component.set("v.hasLegalRestictions",project.Any_legal_restriction_which_may_impact__c );
			component.set("v.hasBuildingAcquisition",project.Project_involved_acquisition_picklist__c );

			var typesHeritage = [];
			typesHeritage.push({value:false, key:"DCMS funded Museum, Library, Gallery or Archive"});
			typesHeritage.push({value:false, key:"World Heritage Site"});
			typesHeritage.push({value:false, key:"Grade I or Grade A Listed Building"});
			typesHeritage.push({value:false, key:"Grade II* or Grade B listed Building"});
			typesHeritage.push({value:false, key:"Grade II* listed Park or Garden"});
			typesHeritage.push({value:false, key:"Grade II, Grade C or Grade C(S) Listed Building"});
			typesHeritage.push({value:false, key:"Local List"});
			typesHeritage.push({value:false, key:"Scheduled Ancient Monument"});
			typesHeritage.push({value:false, key:"Registered Historic ship"});
			typesHeritage.push({value:false, key:"Registered Battlefield"});
			typesHeritage.push({value:false, key:"National Park"});
			typesHeritage.push({value:false, key:"Ramsar Site"});
			typesHeritage.push({value:false, key:"Registered Park or Garden"});
			typesHeritage.push({value:false, key:"Grade I listed Park or Garden"});
			typesHeritage.push({value:false, key:"Grade II listed Park or Garden"});
			typesHeritage.push({value:false, key:"Protected Wreck Site"});
			typesHeritage.push({value:false, key:"National Historic Organ Register"});
			typesHeritage.push({value:false, key:"Site of Special Scientific Interest"});
			typesHeritage.push({value:false, key:"Other (please specify)"});

			console.log('typesHeritage - '+JSON.stringify(typesHeritage));

			var heritage = project.Heritage_Formal_designation__c;
			console.log('heritage - '+heritage);
			if(heritage!=null){
				var listHeritage = heritage.split(';');
				console.log('listHeritage - '+listHeritage);

				for(var item of typesHeritage){
					if(listHeritage.includes(item.key)){
						item.value=true;
					}
				}
			}
			console.log('typesHeritage - '+JSON.stringify(typesHeritage));

			component.set("v.heritage", typesHeritage);

		}
	}
})