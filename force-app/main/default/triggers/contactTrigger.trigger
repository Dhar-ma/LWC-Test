/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-02-2023
 * @last modified by  :
 **/
trigger contactTrigger on Contact(after insert) {
  if (Trigger.isAfter) {
    ContactTriggerHandler.sendEmail(Trigger.new);
  }

}
