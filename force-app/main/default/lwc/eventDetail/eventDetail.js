import { LightningElement, api, wire } from "lwc";
import getEventDetail from "@salesforce/apex/EventController.getEventDetail";

import { NavigationMixin } from "lightning/navigation";
export default class EventDetail extends NavigationMixin(LightningElement) {
  @api eventId;
  @api eventName;
  eventDetails;
  isDetail = false;
  isLoaded;
  isDonate = false;
  @wire(getEventDetail, { eventId: "$eventId" }) EventDetail({ data, error }) {
    this.isLoaded = true;
    if (data) {
      console.log(data);
      this.eventDetails = data;
    }
    if (error) {
      console.error(error);
    }
    this.isLoaded = false;
  }
  handelRegistration() {
    this.isLoaded = true;
    this.isDetail = true;
    this.isLoaded = false;
  }
  handelDonation() {
    this.isLoaded = true;
    this.isDonate = true;
    this.isLoaded = false;
  }
}