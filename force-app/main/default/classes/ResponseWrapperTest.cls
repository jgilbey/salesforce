@isTest
public  class ResponseWrapperTest {
	@isTest
	public static void testFillReponseWrapperClass(){
		ResponseWrapper wrap = new ResponseWrapper();
		wrap.message = 'test';
		wrap.responseCode = 100;
		wrap.result = 'test';
		wrap.success = false;

		System.assertEquals('test', wrap.message);
		System.assertEquals(100, wrap.responseCode);
		System.assertEquals('test', String.valueOf(wrap.result));
		System.assertEquals(false, wrap.success);

	}
}