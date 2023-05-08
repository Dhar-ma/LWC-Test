public class CampaignController {
    @AuraEnabled(cacheable=true)
    public static List<Campaign> getCampaign(){
        List<Campaign> campaignList = [SELECT Id, Name From Campaign];
        
        return campaignList;
    }
    @AuraEnabled(cacheable=true)
    public static List<Event__c> getEvent(String campaignId){
        return [SELECT Id, Campaign__c, Event_Name__c FROM Event__c ];
    }

}