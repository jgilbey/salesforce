@isTest
public class utilitySendEmailToAdmin_test {
    
   public static testMethod void testAdminEmail() {
        Test.StartTest();           
            utilitySendEmailToAdmin.sendEmailToAdmin('Test Email Only');
        Test.stopTest(); 
    }  

}