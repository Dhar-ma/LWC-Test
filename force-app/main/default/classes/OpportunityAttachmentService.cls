/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-05-2023
 * @last modified by  :
 **/
public class OpportunityAttachmentService {
  @Future(callout=true)
  public static void generatePDF(Id oppId) {
    // Retrieve the Opportunity record
    Opportunity opp = [
      SELECT Id, Email__c, Name, Owner.Name, OwnerId, CampaignId, Campaign.Name
      FROM Opportunity
      WHERE Id = :oppId
    ];

    // Create a new PDF document
    PageReference pdfPage = Page.donationPDF;
    System.debug('pdfPage:' + pdfPage);
    pdfPage.getParameters().put('id', opp.Id);
    Blob pdfBlob = pdfPage.getContentAsPDF();
    System.debug('pdfPage.getContentAsPDF():' + pdfPage.getContentAsPDF());
    // Create a new Attachment record
    Attachment attachment = new Attachment();
    attachment.Name = 'OpportunityPDF-' + opp.Name + '.pdf';
    attachment.Body = pdfBlob;
    attachment.ParentId = opp.Id;
    attachment.ContentType = 'application/pdf';

    // Save the Attachment record
    insert attachment;

    EmailTemplate emailTemplate = [
      SELECT Id, Subject, Description, HtmlValue, DeveloperName, Body
      FROM EmailTemplate
      WHERE DeveloperName = 'Donation_success_mail'
    ];

    Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
    message.setSenderDisplayName(opp.Owner.Name);
    message.setSubject('Donation');
    message.setReplyTo('no-reply@gmail.com');
    message.setUseSignature(false);
    message.setBccSender(false);
    message.setSaveAsActivity(true);
    message.setTemplateID(emailTemplate.Id);
    message.setWhatId(opp.Id);

    // Set the email body

    String emailBody = emailTemplate.HtmlValue;

    emailBody = emailBody.replace('{!Opportunity.Name}', opp.Name);
    emailBody = emailBody.replace(
      '{!Opportunity.OwnerFullName}',
      opp.Owner.Name
    );
    emailBody = emailBody.replace(
      '{!Opportunity.CampaignId}',
      opp.Campaign.Name
    );
    message.setHtmlBody(emailBody);
    // Create the email attachment
    Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
    efa.setFileName('attachment.pdf');
    efa.setBody(pdfBlob);
    message.setFileAttachments(new List<Messaging.EmailFileAttachment>{ efa });
    message.setToAddresses(new List<String>{ opp.Email__c });
    Messaging.SendEmailResult[] results = Messaging.sendEmail(
      new List<Messaging.SingleEmailMessage>{ message }
    );

    if (results[0].success) {
      System.debug('The email was sent successfully.');
    } else {
      System.debug('The email failed to send: ' + results[0].errors[0].message);
    }
    System.debug('attachment:' + attachment);
  }

  public static void countDotationAndExpensess(
    List<Opportunity> newOpportunity,
    List<Opportunity> oldOpportunity
  ) {
    Set<Id> campaignIds = new Set<Id>();
    for (Opportunity opp : newOpportunity) {
      campaignIds.add(opp.CampaignId);
    }
    // for (Opportunity opp : oldOpportunity) {
    //   if (
    //     opp.RecordType.Name == 'Donation' ||
    //     opp.RecordType.Name == 'Expenses'
    //   ) {
    //     campaignIds.add(opp.CampaignId);
    //   }
    // }

    // Query the Campaigns and update their fields based on the total donations and expenses
    Map<Id, Campaign> campaignsToUpdate = new Map<Id, Campaign>();
    List<Campaign> campaigns = [
      SELECT
        Id,
        Total_Donations__c,
        Total_Expensess__c,
        (
          SELECT Id, Amount, RecordType.Name
          FROM Opportunities
          WHERE RecordType.Name IN ('Donation', 'Expenses')
        )
      FROM Campaign
      WHERE Id IN :campaignIds
    ];
    System.debug('campaigns:' + campaigns);
    for (Campaign campaign : campaigns) {
      Decimal totalDonations = 0;
      Decimal totalExpensess = 0;
      for (Opportunity opp : campaign.Opportunities) {
        if (opp.RecordType.Name == 'Donation') {
          totalDonations += opp.Amount;
        } else if (opp.RecordType.Name == 'Expenses') {
          totalExpensess += opp.Amount;
        }
      }
      System.debug('totalDonations:' + totalDonations);
      System.debug('totalExpensess:' + totalExpensess);
      campaign.Total_Donations__c = String.valueOf(totalDonations);
      campaign.Total_Expensess__c = String.valueOf(totalExpensess);
      campaignsToUpdate.put(campaign.Id, campaign);
    }
    System.debug('campaignsToUpdate:' + campaignsToUpdate);
    update campaignsToUpdate.values();
  }
}
