/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-04-2023
 * @last modified by  :
 **/
import { LightningElement, api } from "lwc";
import BOOTSTRAP from "@salesforce/resourceUrl/boVersion5";
import { loadStyle } from "lightning/platformResourceLoader";
import createFeedback from "@salesforce/apex/EventController.createFeedback";

export default class FeedBackForm extends LightningElement {
  @api recordId;
  @api eventId;
  Feedback__c = {};

  connectedCallback() {
    console.log("recordId:" + this.recordId);
    console.log("eventId:" + this.eventId);
  }

  async renderedCallback() {
    if (this.isCssLoaded) {
      return;
    }
    this.isCssLoaded = true;
    try {
      console.log("bootstrap:" + BOOTSTRAP);
      let response = await loadStyle(this, BOOTSTRAP);
      console.log('response":' + response);
      this.isLoaded = false;
    } catch (error) {
      console.log("Error:" + error);
      this.isLoaded = false;
    }
  }

  async handleFeedback() {
    let Feedback__c = JSON.parse(JSON.stringify(this.Feedback__c));
    this.template.querySelectorAll(".feedback").forEach((element) => {
      Feedback__c[element.dataset.field] = element.value;
    });
    Feedback__c.Campaign__c = this.eventId;
    Feedback__c.Lead__c = this.recordId;

    this.Feedback__c = Feedback__c;
    console.log("Feedback__c:" + JSON.stringify(this.Feedback__c));

    try {
      let createFeedbac = await createFeedback({
        Feedback: this.Feedback__c
      });
      console.log("createFeedback:" + createFeedbac);
      if (createFeedbac) {
        this.template
          .querySelector("c-common-toast")
          .showToast(
            "success",
            "<strong>Feedback Submited<strong/>",
            "utility:sucess",
            10000
          );
      } else {
        await this.template
          .querySelector("c-common-toast")
          .showToast(
            "error",
            `<strong> Error Occured<strong/>`,
            "utility:error",
            10000
          );
      }
    } catch (error) {
      await this.template
        .querySelector("c-common-toast")
        .showToast(
          "error",
          `<strong>${error}<strong/>`,
          "utility:error",
          10000
        );
      console.error(error);
    }
    window.close();
    window.history.back();
  }

  get options() {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ];
  }
  get organizedoptions() {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ];
  }
  get processoptions() {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ];
  }
  get futureoptions() {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ];
  }
  get convenientoptions() {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ];
  }

  get connectionsoptions() {
    return [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ];
  }

  get aboutOptions() {
    return [
      { label: "Relative", value: "Relative" },
      { label: "Social", value: "Social" },
      { label: "Website", value: "Website" }
    ];
  }

  star1 = false;
  star2 = false;
  star3 = false;
  star4 = false;

  handlesatr1() {
    this.star1 = true;
    this.star2 = false;
    this.star3 = false;
    this.star4 = false;
    this.Feedback__c.How_satisfied_were_you_with_the_event__c = "Low";
  }
  handlesatr2() {
    this.star2 = true;
    this.star1 = true;
    this.star3 = false;
    this.star4 = false;
    this.Feedback__c.How_satisfied_were_you_with_the_event__c = "Normal";
  }
  handlesatr3() {
    this.star3 = true;
    this.star1 = true;
    this.star2 = true;
    this.star4 = false;
    this.Feedback__c.How_satisfied_were_you_with_the_event__c = "Good";
  }
  handlesatr4() {
    this.star4 = true;
    this.star1 = true;
    this.star2 = true;
    this.star3 = true;
    this.Feedback__c.How_satisfied_were_you_with_the_event__c = "Excellent";
  }
}
