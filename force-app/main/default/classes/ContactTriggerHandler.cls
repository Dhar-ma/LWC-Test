/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-02-2023
 * @last modified by  :
 **/
public with sharing class ContactTriggerHandler {
  public static void sendEmail(List<Contact> contactList) {
    List<Messaging.SingleEmailMessage> messageList = new List<Messaging.SingleEmailMessage>();
    EmailTemplate emailTemplate = [
      SELECT Id, Subject, Description, HtmlValue, DeveloperName, Body
      FROM EmailTemplate
      WHERE Name = 'Donation_success_mail'
    ];

    for (Contact contact : contactList) {
      Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
      message.setSenderDisplayName(contact.Owner.Name);
      message.setReplyTo('no-reply@gmail.com');
      message.setUseSignature(false);
      message.setBccSender(false);
      message.setSaveAsActivity(true);

      message.setTemplateID(emailTemplate.Id);
      message.setTargetObjectId(contact.CampaignId);
      message.setWhatId(contact.Id);

      // Set the email body
      String emailBody = emailTemplate.HtmlValue;
      message.setHtmlBody(emailBody);
      System.debug('Email Body: ' + emailBody);

      // Create the email attachment
      Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
      efa.setFileName('attachment.pdf');
      efa.setBody(pdfBlob);

      message.setFileAttachments(
        new List<Messaging.EmailFileAttachment>{ efa }
      );

      message.setToAddresses(new List<String>{ contact.Email });
      messageList.add(message);
    }

    Messaging.SendEmailResult[] results = Messaging.sendEmail(messageList);

    if (results[0].success) {
      System.debug('The email was sent successfully.');
    } else {
      System.debug('The email failed to send: ' + results[0].errors[0].message);
    }
  }
}
