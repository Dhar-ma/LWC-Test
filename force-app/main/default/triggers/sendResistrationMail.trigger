/**
 * @description       :
 * @author            : Dharmraj Baravkar
 * @group             :
 * @last modified on  : 11-23-2022
 * @last modified by  : Dharmraj Baravkar
 **/
trigger sendResistrationMail on Lead(after insert) {
  //get all email in the list
  List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage>();

  for (Lead lead : Trigger.new) {
    if (lead.Email != null && lead.FirstName != null) {
      // Step 1: Create a new Email
      Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

      // Step 2: Set list of people who should get the email
      List<String> sendTo = new List<String>();
      sendTo.add(lead.Email);
      mail.setToAddresses(sendTo);

      // Step 3. Set email contents - you can use variables!
      mail.setSubject('Congratulations...!'); //Subject of the mail and the body of the mail
      String body = 'Dear ' + lead.FirstName + ', ';
      body += 'According to your request ';
      body += 'your resistration is completed ';
      body += 'For the event ';
      body += 'Thank You ';
      mail.setHtmlBody(body);

      // Step 4. Add your email to the master list
      mails.add(mail);
    }
  }
  // Step 5: Send all emails in the master list
  Messaging.sendEmail(mails);
}