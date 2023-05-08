/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-06-2023
 * @last modified by  :
 **/
import { api, LightningElement } from "lwc";
import markAttendes from "@salesforce/apex/CampaignMemberController.markAttendes";
import labelName from "@salesforce/label/c.Admin_Passcode";
import successLogo from "@salesforce/resourceUrl/successLogo";

export default class RegistrationConirmation extends LightningElement {
  @api recordId;
  isAdmin = false;
  labelName = labelName;
  successLogo = successLogo;
  data;
  inputValue;
  inputChange(event) {
    this.inputValue = event.target.value;
  }
  async onSubmit() {
    if (this.inputValue === labelName) {
      const now = new Date();
      console.log("Date.now():" + now);
      let result = await markAttendes({
        campaignMemberId: this.recordId,
        dateTime: JSON.stringify(now)
      });
      this.data = result;
      this.isAdmin = true;
    }
  }
  handelBack() {
    this.isAdmin = false;
  }

  get idmismatchedd() {
    return this.data === "Event date is mismatched";
  }
}
