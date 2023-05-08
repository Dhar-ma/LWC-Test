/**
 * @description       : This batch class is used to set dormant date, null dormant date and inactive the contact using dormant criteria
 * @author            :
 * @group             :
 * @last modified on  : 05-05-2023
 * @last modified by  :
 **/
public class cmapaignAndFeedbackController implements Database.Batchable<sObject>, Schedulable {
  public Database.QueryLocator start(Database.BatchableContext BC) {
    return Database.getQueryLocator(
      [
        SELECT
          Id,
          Name,
          EndDate,
          (
            SELECT Id, LastName, Name, FirstName, LeadId, CampaignID, Lead.Email
            FROM CampaignMembers
          )
        FROM Campaign
        WHERE EndDate = YESTERDAY
      ]
    );
  }

  public void execute(
    Database.BatchableContext BC,
    List<Campaign> campaignRecordList
  ) {
    List<Messaging.SingleEmailMessage> meassageList = new List<Messaging.SingleEmailMessage>();
    List<Attachment> attachmnetList = new List<Attachment>();
    for (Campaign campaign : campaignRecordList) {
      for (CampaignMember camMember : campaign.CampaignMembers) {
        String link =
          'https://event-management-dev-ed.develop.my.salesforce-sites.com/eventlist/feedBackForm?id=' +
          camMember.LeadId +
          '&eventId=' +
          campaign.Id;

        string htmlBody =
          '<div> <p>Dear ' +
          camMember.FirstName +
          ' ' +
          camMember.LastName +
          ' ,</p> <p>I hope this email finds you well. We would like to take this opportunity to thank you for using our Event Management System, built using Salesforce. We hope the system has made event planning and management much easier for you and your team.</p> <p>As part of our ongoing commitment to providing the best possible service, we would like to ask for your feedback on the system. We value your input and believe it will help us improve the system and make it more user-friendly for our clients.</p> <p>To share your feedback, we have created a short survey that will take no more than 5 minutes to complete. Your responses will be kept anonymous and will only be used for internal purposes. Please click on the link below to access the survey:</p> <p><a href="' +
          link +
          '">' +
          link +
          '</a></p> <p>We appreciate your time and thank you in advance for sharing your thoughts with us. If you have any questions or concerns, please do not hesitate to reach out to us.</p> <p>Best regards,</p> <p> ' +
          camMember.CreatedBy.Name +
          ' </p> </div>';

        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.setSenderDisplayName(camMember.CreatedBy.Name);
        message.setSubject('Feedbacck');
        message.setReplyTo('no-reply@gmail.com');
        message.setUseSignature(false);
        message.setBccSender(false);
        message.setSaveAsActivity(true);
        message.setHtmlBody(htmlBody);
        message.setToAddresses(new List<String>{ camMember.Lead.Email });
        meassageList.add(message);

        PageReference pdfPage = Page.InvoicePdf;
        System.debug('pdfPage:' + pdfPage);
        pdfPage.getParameters().put('id', campaign.Id);

        Blob pdfBlob = pdfPage.getContentAsPDF();
        System.debug('pdfPage.getContentAsPDF():' + pdfPage.getContentAsPDF());
        // Create a new Attachment record
        Attachment attachment = new Attachment();
        attachment.Name = 'InvoicePDF-' + campaign.Name + '.pdf';
        attachment.Body = pdfBlob;
        attachment.ParentId = campaign.Id;
        attachment.ContentType = 'application/pdf';

        // Save the Attachment record
        attachmnetList.add(attachment);

        Messaging.SingleEmailMessage message2 = new Messaging.SingleEmailMessage();
        message2.setSenderDisplayName(camMember.CreatedBy.Name);
        message2.setSubject('Invoice');
        message2.setReplyTo('no-reply@gmail.com');
        message2.setUseSignature(false);
        message2.setBccSender(false);
        message2.setSaveAsActivity(true);
        String emailBody =
          '<html><body><p>Dear ' +
          camMember.Name +
          ',</p><p>We are pleased to provide you with the invoice for the event management services we provided to you using our Salesforce-based Event Management System.</p><p>Please find the details of the services provided and the associated costs in the tables below:</p> </html>';

        message2.setHtmlBody(emailBody);
        // Create the email attachment
        Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
        efa.setFileName('Invoice.pdf');
        efa.setBody(pdfBlob);
        message2.setFileAttachments(
          new List<Messaging.EmailFileAttachment>{ efa }
        );
        message2.setToAddresses(new List<String>{ camMember.Lead.Email });
        meassageList.add(message2);
      }
    }

    insert attachmnetList;

    Messaging.SendEmailResult[] results = Messaging.sendEmail(meassageList);

    if (results[0].success) {
      System.debug('The email was sent successfully.');
    } else {
      System.debug('The email failed to send: ' + results[0].errors[0].message);
    }
  }

  public void finish(Database.BatchableContext BC) {
    // finish code
  }

  public void execute(SchedulableContext SC) {
    database.executebatch(new cmapaignAndFeedbackController());
  }
}
