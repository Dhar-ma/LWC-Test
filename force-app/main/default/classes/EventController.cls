/**
 * @description       :
 * @author            : Dharmraj Baravkar
 * @group             :
 * @last modified on  : 05-05-2023
 * @last modified by  :
 **/
public without sharing class EventController {
  @AuraEnabled(cacheable=true)
  public static Map<String, List<Campaign>> getEvent() {
    try {
      Map<String, List<Campaign>> campaignMap = new Map<String, List<Campaign>>();

      for (Campaign event : [
        SELECT
          Id,
          Name,
          Event_Type__c,
          Event_Poster__c,
          Description,
          EndDate,
          Postal_Code__c,
          State__c,
          Street__c,
          NumberSent,
          Campaign_Member_Count__c,
          City__c,
          Country__C,
          Event_Time__c,
          Event_Poster_Link__c,
          StartDate
        FROM Campaign
        WHERE Event_Type__c != NULL AND StartDate > TODAY
        ORDER BY Name
      ]) {
        if (!campaignMap.containsKey(event.Event_Type__c)) {
          campaignMap.put(event.Event_Type__c, new List<Campaign>());
        }
        if (campaignMap.containsKey(event.Event_Type__c)) {
          campaignMap.get(event.Event_Type__c).add(event);
        }
      }
      System.debug('campaignMap:' + campaignMap);
      return campaignMap;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Campaign getEventLocation(String eventId) {
    try {
      return [
        SELECT
          Id,
          Name,
          Street__c,
          State__c,
          Postal_Code__c,
          NumberSent,
          Campaign_Member_Count__c,
          Country__c,
          City__c
        FROM Campaign
        WHERE Id = :eventId AND StartDate > TODAY
        ORDER BY Name
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Campaign> getEventDetail(String eventId) {
    try {
      return [
        SELECT
          Id,
          Name,
          StartDate,
          EndDate,
          Description,
          NumberSent,
          Campaign_Member_Count__c
        FROM Campaign
        WHERE Id = :eventId AND StartDate > TODAY
        ORDER BY Name
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled(cacheable=true)
  public static Boolean isRecordAvailable(String eventId, String userEmailId) {
    Boolean isRegister;
    try {
      List<CampaignMember> campaignMemberList = [
        SELECT CampaignId, FirstName, Id, LeadId, Email
        FROM CampaignMember
        WHERE Email = :userEmailId AND CampaignId = :eventId
        ORDER BY Name
      ];
      if (campaignMemberList.size() > 0) {
        isRegister = true;
      } else {
        isRegister = false;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return isRegister;
  }

  @AuraEnabled
  public static void insertRecord(Lead lead, String campaignId) {
    try {
      insert lead;
      insertCampaignMember(lead, campaignId);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  private static void insertCampaignMember(Lead lead, String campaignId) {
    try {
      CampaignMember campaignMember = new CampaignMember();
      campaignMember.CampaignId = campaignId;
      campaignMember.LeadId = lead.Id;

      insert campaignMember;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled(cacheable=true)
  public static List<Campaign> getEventList(String searchStr) {
    try {
      String str = String.isNotEmpty(searchStr) ? '%' + searchStr + '%' : '';
      List<Campaign> eventList = [
        SELECT Name, Id, StartDate, NumberSent, Campaign_Member_Count__c
        FROM Campaign
        WHERE Name LIKE :str AND StartDate > TODAY
        ORDER BY Name
      ];
      System.debug('eventList:' + eventList);
      return eventList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Campaign> getUpcommingEvent() {
    try {
      // String str = String.isNotEmpty(searchStr) ? '%' + searchStr + '%' : '';
      List<Campaign> eventList = [
        SELECT Name, Id, StartDate, NumberSent, Campaign_Member_Count__c
        FROM Campaign
        WHERE StartDate > TODAY
        ORDER BY StartDate
        LIMIT 3
      ];
      System.debug('eventList:' + eventList);
      return eventList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<String> getUserPicklist(
    String strObjectName,
    String strPicklistField
  ) {
    List<String> options = new List<String>();
    Schema.SObjectType objSobjectType = Schema.getGlobalDescribe()
      .get(strObjectName);
    Schema.DescribeSObjectResult objDescribeSobject = objSobjectType.getDescribe();
    Map<String, Schema.SObjectField> mapFields = objDescribeSobject.fields.getMap();

    List<Schema.PicklistEntry> lstPickListValues = mapFields.get(
        strPicklistField
      )
      .getDescribe()
      .getPickListValues();

    for (Schema.PicklistEntry objPickList : lstPickListValues) {
      System.debug(
        'Value = ' +
        objPickList.getValue() +
        ' , Label = ' +
        objPickList.getLabel()
      );
      //mapPickListValues.put(objPickList.getLabel(),objPickList.getValue());
      options.add(objPickList.getLabel());
    }
    return options;
  }

  @AuraEnabled
  public static Boolean createFeedback(Feedback__c Feedback) {
    try {
      insert Feedback;
      if (Feedback.Id != null) {
        return true;
      }
      return false;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean createDonationRecord(
    String opprtunity,
    String contact
  ) {
    try {
      Opportunity opprtunityRecord = (Opportunity) Json.deserialize(
        opprtunity,
        Opportunity.class
      );

      Contact contactRecord = (Contact) Json.deserialize(
        contact,
        Contact.class
      );

      System.debug('Opportunity:' + opprtunityRecord);
      System.debug('Contact:' + contactRecord);

      insert contactRecord;

      opprtunityRecord.CloseDate = date.today().addMonths(2);
      opprtunityRecord.ContactId = contactRecord.Id;
      opprtunityRecord.Email__C = contactRecord.Email;

      insert opprtunityRecord;
      if (
        String.isNotEmpty(opprtunityRecord.Id) &&
        String.isNotEmpty(contactRecord.Id)
      ) {
        return true;
      }
      return false;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
