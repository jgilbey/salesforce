/*Author : Kavita Pandey @Methods
 * Date : 15-01-20120
 * Description : This class is to Test class for ScheduleGrantExpiryNotification
 */
@isTest
public class ScheduleGrantExpiryNotification_test {
    
    public static testMethod void testschedule() {
        Test.StartTest();
            ScheduleGrantExpiryNotification sh1 = new ScheduleGrantExpiryNotification();
            String sch = '0 0 23 * * ?';
            system.schedule('Test Territory Check', sch, sh1);
        Test.stopTest(); 
    }
}