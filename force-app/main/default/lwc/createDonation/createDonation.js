import { LightningElement } from "lwc";

export default class CreateDonation extends LightningElement {
  city;
  handleChange(event) {
    this.city = event.target.city;
    console.log(this.city);
  }
}