public class utilitySendEmailToAdmin {

    public static void sendEmailToAdmin(String errorMessage) {
        Messaging.Singleemailmessage mail = new Messaging.Singleemailmessage();
        mail.setToAddresses(new String[]{Label.Admin_Email_Id});
        mail.setSenderDisplayName('Salesforce Error');
        mail.setSubject('Apex Error');
        mail.setBccSender(false);
        mail.setUseSignature(false);    
        mail.setPlainTextBody(errorMessage);        
        // Absorb errors where mass email is switched off in the org
        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{mail});
        } catch (EmailException e) {
            if (!e.getMessage().contains('NO_MASS_MAIL_PERMISSION')) throw e;
        }
    }
}