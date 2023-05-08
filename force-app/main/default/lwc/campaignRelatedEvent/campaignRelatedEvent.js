import { api, LightningElement, track, wire } from 'lwc';
import getEvent from "@salesforce/apex/CampaignController.getEvent"
export default class CampaignRelatedEvent extends LightningElement {
    colunms = [
        
   {
    label: "Event",
    fieldName: "nameUrl",
    type: "url",
    typeAttributes: {
      label: {
        fieldName: "Event_Name__c"
      },
      target: "_self"
    }
    //label: "Event Name", fieldName: "Event_Name__c", type: "text" 
  },
  { label: "Event Id", fieldName: "Id", type: "text" }
    ];
    @api campaignId;
    @track recordId;
    @track campaign;
    @track eventList = [];
    @wire(getEvent,{campaignId : '$campaignId'}) eventDetail({
        data, error
    }){
        if(data){
            this.campaign = data;
            //this.campaign = response;
            if (this.campaign) {
              this.campaign.forEach((item) => {
                console.log("item.Id: "+item.Id);
                item = { ...item };
                item.nameUrl = "/lightning/r/Event__c/"+item.Id+"/view";
                this.recordId = item.Id;
                this.eventList.push(item);
                
              });
            }
        }
        if(error){
            console.log(error);
        }

    }
    // connectedCallback() {
    //     getEvent({ campaignId : this.campaignId })
    //       .then((response) => {
    //         console.log(response);
    //         this.campaign = response;
    //         if (this.campaign) {
    //           this.campaign.forEach((item) => {
    //             console.log("item.Id"+item.Id);
    //             item = { ...item };
    //             item.nameurl = "/lightning/r/Event__c/"+item.Id+"/view";
    //             this.recordId = item.Id;
    //             this.eventList.push(item);
                
    //           });
    //         }
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });
    //   }
}