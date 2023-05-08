/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-05-2023
 * @last modified by  :
 **/
public class PDFController {
  public Campaign campaign { get; set; }
  public List<Opportunity> donorOpportunities { get; set; }
  public List<Opportunity> expenseOpportunities { get; set; }

  public PDFController() {
    // Get Campaign ID from query string
    String campaignId = ApexPages.currentPage().getParameters().get('id');

    System.debug('campaignId:' + campaignId);
    // Query Campaign record
    campaign = [
      SELECT
        Id,
        Name,
        NumberSent,
        AmountAllOpportunities,
        Total_Expensess__c,
        Total_Donations__c
      FROM Campaign
      WHERE Id = :campaignId
    ];
    System.debug('campaign:' + campaign);
    // fetch opportunities for Donor record type
    donorOpportunities = [
      SELECT Name, Amount, CloseDate, CampaignId
      FROM Opportunity
      WHERE RecordType.Name = 'Donation' AND CampaignId = :campaign.Id
    ];

    // fetch opportunities for Expense record type
    expenseOpportunities = [
      SELECT Name, Amount, CloseDate, CampaignId
      FROM Opportunity
      WHERE RecordType.Name = 'Expenses' AND CampaignId = :campaign.Id
    ];
  }
}
