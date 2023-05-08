/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-05-2023
 * @last modified by  :
 **/
trigger OpportunityAttachment on Opportunity(
  after insert,
  after update,
  after delete
) {
  Boolean isopp = true;
  if (Trigger.isInsert) {
    for (Opportunity opp : Trigger.new) {
      if (isopp == true) {
        if (opp.RecordTypeId == '0125g000000f8v9AAA') {
          // OpportunityAttachmentService.generatePDF(opp.Id);
          CatchOpportunityIDs__e opppe = new CatchOpportunityIDs__e();
          opppe.Opportunity_Id__c = opp.Id;
          Database.SaveResult results = EventBus.publish(opppe);
          System.debug(results);
        } else {
          if (opp.Amount > 500) {
            Approval.ProcessSubmitRequest req1 = new Approval.ProcessSubmitRequest();
            req1.setComments('Submitting request for approval.');
            req1.setObjectId(opp.Id);
            Approval.ProcessResult result = Approval.process(req1);
            if (result.isSuccess()) {
              System.debug('Record submitted for approval successfully');
            } else {
              System.debug(
                'Error submitting record for approval: ' +
                result.getErrors()[0].getMessage()
              );
            }
          }
        }
      }
      isopp = false;
      // Call a future method to generate the PDF asynchronously
    }
  }

  if (Trigger.isUpdate || Trigger.isDelete || Trigger.isInsert) {
    OpportunityAttachmentService.countDotationAndExpensess(
      Trigger.new,
      Trigger.old
    );
  }

}
