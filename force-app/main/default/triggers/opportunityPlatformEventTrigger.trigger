/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-03-2023
 * @last modified by  :
 **/
trigger opportunityPlatformEventTrigger on CatchOpportunityIDs__e(
  after insert
) {
  Boolean isFlaf = true;
  system.debug(' Trigger.new:' + Trigger.new);
  for (CatchOpportunityIDs__e opp : Trigger.new) {
    if (isFlaf == true) {
      OpportunityAttachmentService.generatePDF(opp.Opportunity_Id__c);
    }

    isFlaf = false;
  }

}
