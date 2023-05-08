/* eslint-disable guard-for-in */
/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-07-2023
 * @last modified by  :
 **/
import { LightningElement, wire } from "lwc";
import getEvent from "@salesforce/apex/EventController.getEvent";
import getEventList from "@salesforce/apex/EventController.getEventList";
import getUpcommingEvent from "@salesforce/apex/EventController.getUpcommingEvent";
import createDonationRecord from "@salesforce/apex/EventController.createDonationRecord";
import getUserPicklist from "@salesforce/apex/EventController.getUserPicklist";
import BOOTSTRAP from "@salesforce/resourceUrl/boVersion5";
import lotusEvent from "@salesforce/resourceUrl/lotusEvent";
import insertRecord from "@salesforce/apex/EventController.insertRecord";
import isRecordAvailable from "@salesforce/apex/EventController.isRecordAvailable";
import { loadStyle } from "lightning/platformResourceLoader";
import { NavigationMixin } from "lightning/navigation";

export default class CampaignPage extends NavigationMixin(LightningElement) {
  evntId;
  lotusEvent = lotusEvent;
  isCssLoaded = false;
  eventName;
  eventList = [];
  isEventId = false;
  isLoad = false;
  searchStr;
  serchEventList = [];
  UpcommingEvent = [];
  isServices = false;
  isHome = true;
  eventType = [];
  isLoaded = false;
  isUpcomminfEvent = false;
  registerPerson = {};
  lead = {};
  isDonation = false;

  isRegistration = false;
  // isserchEventList = true;

  get getHome() {
    return this.isHome && !this.isServices;
  }

  get isDonationOrRegistration() {
    return this.isRegistration || this.isDonation;
  }

  get getServices() {
    return this.isServices && !this.isHome;
  }

  get isserchEventList() {
    return this.serchEventList.length === 0 ? false : true;
  }

  get isError() {
    return this.error;
  }

  @wire(getEventList, { searchStr: "$searchStr" })
  wiredData({ error, data }) {
    if (data) {
      this.isLoaded = true;
      //console.log("Data", JSON.stringify(data));
      this.serchEventList = data;
      this.isLoaded = false;
    } else if (error) {
      this.isLoaded = false;
      console.error("Error:", error);
    }
  }
  @wire(getUpcommingEvent)
  getUpcommingEvent({ error, data }) {
    if (data) {
      this.isLoaded = true;
      //console.log("getUpcommingEvent", JSON.stringify(data));
      data.forEach((item) => {
        const d = item.StartDate;
        const date = new Date(d);
        const month = date.toLocaleString("default", { month: "long" });
        const dayOfMonth = date.getDate();
        //console.log(month); // "April"
        this.UpcommingEvent.push({
          Id: item.Id,
          day: dayOfMonth,
          month: month
        });
      });
      //console.log("UpcommingEvent:" + JSON.stringify(this.UpcommingEvent));
      this.isUpcomminfEvent = true;
      this.isLoaded = false;
    } else if (error) {
      console.error("Error:", error);
      this.isLoaded = false;
    }
  }
  eventNameList = [];

  handleChange(event) {
    this.eventId = event.target.value;
  }

  isModal = false;
  handleCancel() {
    this.isModal = false;
  }

  handelRegistrationNext() {
    this.isRegistration = true;
    this.isModal = false;
  }

  @wire(getEvent) EventData({ data, error }) {
    if (data) {
      this.isLoaded = true;
      this.eventList = data;
      for (let key in data) {
        this.eventList[key].forEach((element) => {
          this.eventNameList.push({
            label: element.Name,
            value: element.Id
          });
        });
      }
      //console.log("this.eventList:" + JSON.stringify(this.eventList));
      //console.log("eventNameList:" + JSON.stringify(this.eventNameList));

      this.isLoaded = false;
    }
    if (error) {
      console.error(error);
      this.isLoaded = false;
    }
  }
  get isEventEmpty() {
    return this.activeTabValueList.length === 0;
  }

  @wire(getUserPicklist, {
    strPicklistField: "Event_Type__c",
    strObjectName: "Campaign"
  })
  getUserPicklist({ error, data }) {
    if (data) {
      this.isLoaded = true;
      // //console.log("getUserPicklistd:", JSON.stringify(data));
      data.forEach((element) => {
        this.eventType.push(element);
      });
      //console.log("this.eventTypeL", JSON.stringify(this.eventType));
      this.isLoaded = false;
    } else if (error) {
      console.error("Error:", error);
      this.isLoaded = false;
    }
  }

  activeTabValueList = [];

  activeTabValue(event) {
    this.isLoaded = true;
    this.activeValue = event.target.dataset.key;
    //console.log("event:" + event.target.dataset.key);
    // console.log("this.eventList:" + JSON.stringify(this.eventList));
    let activeTabValueList = this.eventList[event.target.dataset.key]
      ? JSON.parse(JSON.stringify(this.eventList[event.target.dataset.key]))
      : [];
    let activeTabValueListList = [];
    // console.log(activeTabValueList.length);
    if (activeTabValueList.length > 0) {
      activeTabValueList.forEach((element) => {
        let obj = JSON.parse(JSON.stringify(element));
        // console.log("obj:", JSON.stringify(obj));
        let startdate = new Date(obj.StartDate ? obj.StartDate : Date.now);
        let enddate = new Date(obj.EndDate ? obj.EndDate : startdate + 5);

        const endMonth = enddate.toLocaleString("default", { month: "long" });
        const startday = startdate.getDate();
        const endday = enddate.getDate();
        obj.endMonth = endMonth;
        obj.startday = startday;
        obj.endday = endday;

        let address = obj.Street__c ? obj.Street__c + ", " : ", ";
        address += obj.City__c ? obj.City__c + ", " : ", ";
        address += obj.Postal_Code__c ? obj.Postal_Code__c + ", " : ", ";
        address += obj.State__c ? obj.State__c + ", " : ", ";
        address += obj.Country__c ? obj.Country__c : " ";
        let time = obj.Event_Time__c ? obj.Event_Time__c : new Date();
        const formattedTime = new Date(time).toLocaleTimeString();
        obj.formattedTime = formattedTime;

        obj.address = address;
        // obj.addresslink = "https://www.google.com/search?q=" + address;
        obj.addresslink =
          "https://event-management-dev-ed.develop.my.salesforce-sites.com/eventlist/locationRef?Id=" +
          obj.Id;

        activeTabValueListList.push(obj);
      });
    } else {
      this.activeTabValueList = [];
    }

    if (activeTabValueListList.length > 0) {
      this.activeTabValueList = activeTabValueListList;
    }

    this.isLoad = true;
    this.isLoaded = false;
    //console.log("activeTabValueList:", JSON.stringify(this.activeTabValueList));
  }

  async renderedCallback() {
    if (this.isCssLoaded) {
      return;
    }
    this.isCssLoaded = true;
    try {
      //console.log("bootstrap:" + BOOTSTRAP);
      await loadStyle(this, BOOTSTRAP);
      //console.log('response":' + response);
      this.isLoaded = false;
    } catch (error) {
      //console.log("Error:" + error);
      this.isLoaded = false;
    }
  }

  handelClick(event) {
    this.isLoaded = true;
    event.preventDefault();
    this.evntId = event.target.dataset.id;
    this.isEventId = true;
    this.eventName = event.target.dataset.name;
    this.isLoaded = false;
  }

  handleOnChange(event) {
    this.isLoaded = true;
    this.searchStr = event.target.value;
    //console.log("Detail:" + event.target.value);
    this.isLoaded = false;
  }

  handleSelect() {
    // console.log("handleSelect:" + event.currentTarget.dataset.id);
    this.isServices = true;
    this.isHome = false;
    this.searchStr = "";
    this.serchEventList = [];
  }
  handleDivClick() {
    this.serchEventList = [];
  }
  handleBlur() {
    this.serchEventList = [];
  }

  handleHome() {
    this.isHome = true;
    this.isServices = false;
  }

  handleServises() {
    this.isServices = true;
    this.isHome = false;
  }

  handelRegistration() {
    this.isModal = true;
  }
  handelBack() {
    this.isRegistration = false;
    this.isDonation = false;
  }

  onchangeRegistration(event) {
    let lead = JSON.parse(JSON.stringify(this.lead));
    lead[event.target.name] = event.target.value;
    lead.Status = "Open - Not Contacted";
    lead.Company = "Drizzle";
    this.lead = lead;

    //console.log("lead:" + JSON.stringify(this.lead));
  }
  eventId;
  handleCreateRegistration(event) {
    this.isRegistration = true;
    this.error = "";
    this.eventId = event.currentTarget.dataset.id;
    //console.log("eventId:" + this.eventId);
  }

  async createRegistrationLead() {
    let eventList = [];

    let eventList2 = JSON.parse(JSON.stringify(this.eventList));

    for (let key in eventList2) {
      eventList2[key].forEach((element) => {
        eventList.push(element);
        // console.log(element);
      });
    }

    // console.log("eventList:" + JSON.stringify(eventList));

    let filteredEvents = JSON.parse(
      JSON.stringify(eventList.filter((event) => event.Id === this.eventId))
    );

    //console.log(JSON.stringify(filteredEvent["0"]));
    // console.log(
    //   "Campaign_Member_Count__c:" + filteredEvent["0"].Campaign_Member_Count__c
    // );
    // console.log("NumberSent:" + filteredEvent["0"].NumberSent);
    if (
      filteredEvents["0"].Campaign_Member_Count__c <
      filteredEvents["0"].NumberSent
    ) {
      if (this.isInputValid()) {
        if (this.lead.Phone.length !== 10) {
          this.error = "Phone Number Should be 10 digit.";
          this.template
            .querySelector("c-common-toast")
            .showToast(
              "error",
              "<strong>Phone Number Should be 10 digit.<strong/>",
              "utility:warning",
              10000
            );

          return;
        }
        try {
          let result = await isRecordAvailable({
            eventId: this.eventId,
            userEmailId: this.lead.Email
          });

          //console.log("result:", result);
          this.isRegister = result;
          if (this.isRegister) {
            this.template
              .querySelector("c-common-toast")
              .showToast(
                "success",
                "<strong>You are alredy register for this event. No nedd to repeat registration.<strong/>",
                "utility:warning",
                10000
              );
            this.error =
              "You are alredy register for this event. No nedd to repeat registration.";
            this.isRegistration = false;
          } else {
            try {
              this.isEmailValidationmsg = false;
              await insertRecord({
                lead: this.lead,
                campaignId: this.eventId
              });
              {
                this.isResistrationSuccess = true;
                this.template
                  .querySelector("c-common-toast")
                  .showToast(
                    "success",
                    "<strong>Registration sucessfully.<strong/>",
                    "utility:success",
                    10000
                  );
                this.isRegistration = false;
              }
            } catch (error) {
              this.isEmailValidationmsg = true;
            }
          }
        } catch (error) {
          console.error(error);
        }

        //console.log("sucess");
      } else {
        this.template
          .querySelector("c-common-toast")
          .showToast(
            "error",
            "<strong>Please Fill Reqiured field<strong/>",
            "utility:error",
            10000
          );
        this.isRegistration = false;
      }
    } else {
      this.template
        .querySelector("c-common-toast")
        .showToast(
          "sucess",
          "<strong>Event Registration is full<strong/>",
          "utility:sucess",
          10000
        );
    }
  }
  address = {};
  handelAddressChange(event) {
    let lead = JSON.parse(JSON.stringify(this.lead));
    lead.Street = event.detail.street;
    lead.City = event.detail.city;
    lead.Country = event.detail.country;
    lead.State = event.detail.province;
    lead.PostalCode = event.detail.postalCode;
    this.lead = lead;
  }

  isInputValid() {
    let isValid = true;
    let inputFields = this.template.querySelectorAll(".validate");
    inputFields.forEach((inputField) => {
      if (!inputField.checkValidity()) {
        inputField.reportValidity();
        isValid = false;
      }
    });
    return isValid;
  }

  Opportunity = {};
  Contact = {};

  handleCreateDonation(event) {
    this.isDonation = true;
    this.eventId = event.currentTarget.dataset.id;
  }

  onchangeDonation(event) {
    //console.log(event.target.name);
    //console.log(event.target.value);

    let contact = JSON.parse(JSON.stringify(this.Contact));
    let Opportunity = JSON.parse(JSON.stringify(this.Opportunity));
    contact[event.target.name] = event.target.value;
    Opportunity[event.target.name] = event.target.value;
    this.Contact = contact;
    this.Opportunity = Opportunity;
  }

  handelAddressChangeDonation(event) {
    let Contact = JSON.parse(JSON.stringify(this.Contact));
    Contact.MailingStreet = event.detail.street;
    Contact.MailingCity = event.detail.city;
    Contact.MailingCountry = event.detail.country;
    Contact.MailingState = event.detail.province;
    Contact.MailingPostalCode = event.detail.postalCode;
    this.Contact = Contact;
  }

  async createDonationRecord() {
    if (this.isInputValid()) {
      if (this.Contact.Phone.length !== 10) {
        this.error = "Phone Number Should be 10 digit.";
        this.template
          .querySelector("c-common-toast")
          .showToast(
            "error",
            "<strong>Phone Number Should be 10 digit.<strong/>",
            "utility:warning",
            10000
          );

        return;
      }
      try {
        let contact = JSON.parse(JSON.stringify(this.Contact));
        let Opportunity = JSON.parse(JSON.stringify(this.Opportunity));
        contact.RecordTypeId = "0125g000000f8cEAAQ";
        Opportunity.RecordTypeId = "0125g000000f8v9AAA";
        Opportunity.CampaignId = this.eventId;
        Opportunity.Name =
          Opportunity.FirstName + " " + this.Opportunity.LastName;
        Opportunity.StageName = "Prospecting";

        //console.log("Contact: +" + JSON.stringify(contact));
        //console.log("Opportunity: +" + JSON.stringify(Opportunity));
        let response = await createDonationRecord({
          opprtunity: JSON.stringify(Opportunity),
          contact: JSON.stringify(contact)
        });
        if (response) {
          this.template
            .querySelector("c-common-toast")
            .showToast(
              "success",
              "<strong>Donation sucessfully.<strong/>",
              "utility:success",
              10000
            );

          this.isDonation = false;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      this.template
        .querySelector("c-common-toast")
        .showToast(
          "error",
          "<strong>Please Fill Reqiured field<strong/>",
          "utility:error",
          10000
        );
    }
  }
}