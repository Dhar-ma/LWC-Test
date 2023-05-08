/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 04-27-2023
 * @last modified by  :
 **/
import { LightningElement, api } from "lwc";
import getEventLocation from "@salesforce/apex/EventController.getEventLocation";
export default class LocationRedirection extends LightningElement {
  @api recordId;
  zoomLevel = 15;
  async connectedCallback() {
    console.log("recordId:" + this.recordId);
    try {
      let data = await getEventLocation({ eventId: this.recordId });
      console.log("data:" + JSON.stringify(data));
      this.mapMarkers = [
        {
          location: {
            Street: data.Street__c,
            City: data.City__c,
            Country: data.Country__c,
            PostalCode: data.Postal_Code__c,
            State: data.State__c
          },
          value: "location001",
          title: data.Street__c,
          description: `${data.Street__c}, ${data.City__c}, ${data.Postal_Code__c}, ${data.Country__c}, ${data.State__c}`
        }
      ];

      console.log("mapMarkers:" + JSON.stringify(this.mapMarkers));
    } catch (error) {
      console.error(error);
    }
  }
  mapMarkers = [];
}