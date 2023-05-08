/**
 * @description       :
 * @author            : Dharmraj Baravkar
 * @group             :
 * @last modified on  : 05-06-2023
 * @last modified by  :
 **/
public without sharing class CampaignMemberController {
  @AuraEnabled
  public static String markAttendes(String campaignMemberId) {
    Boolean isRegister;

    System.debug('now:' + Date.today());

    Lead lead = [
      SELECT Id, Name, Attendees__c, Chec_In_Time__c
      FROM Lead
      WHERE Id = :campaignMemberId
      LIMIT 1
    ];

    Campaign event = [
      SELECT Id, Name, StartDate, EndDate
      FROM Campaign
      WHERE
        Id IN (
          SELECT CampaignId
          FROM CampaignMember
          WHERE LeadId = :campaignMemberId
        )
      LIMIT 1
    ];

    if (event.StartDate != Date.today()) {
      return 'Event date is mismatched';
    }

    if (lead.Attendees__c) {
      return 'You Attendance is already mark You can not repeat mark the attendance.';
    }

    System.debug('Campaign:' + event.StartDate);

    try {
      lead.Attendees__c = true;
      lead.Chec_In_Time__c = Datetime.now();

      update lead;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return lead.Name;
  }
}
