@isTest
global class reCaptchaMockup implements HttpCalloutMock {
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody(JSON.serialize(new Map<String, Object>{'success'=>true}));
        res.setStatusCode(200);
        return res;
    }
}