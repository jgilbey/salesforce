//Object to communicate between functions and callouts
global class ResponseWrapper {

	@AuraEnabled
	global Boolean success { get; set; }
	@AuraEnabled
    global Object result { get; set; }
	@AuraEnabled
    global String message { get; set; }
	@AuraEnabled
	global Integer responseCode { get; set; }

	global ResponseWrapper(){
		this.success = false;
	}
}