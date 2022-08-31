/*Author : Kavita Pandey @Methods
 * Date : 15-11-2019
 * Description : This class is to schedule SetGrantExpiryNotification through Apex scheduling
 */
global class ScheduleGrantExpiryNotification implements Schedulable{
   global void execute(SchedulableContext sc) {
      SetGrantExpiryNotification b = new SetGrantExpiryNotification(); 
      database.executebatch(b, 10);  //This can be setup upto 2000 records
   }
}