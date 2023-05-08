import { api, LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import insertRecord from "@salesforce/apex/EventController.insertRecord";
import isRecordAvailable from "@salesforce/apex/EventController.isRecordAvailable";
export default class EventResistrationPage extends NavigationMixin(
  LightningElement
) {
  lead = {};
  isLoaded;
  isResistrationSuccess = false;
  isEmptyFieldError = false;
  FirstName = "";
  LastName = "";
  Email = "";
  Phone = "";
  emptyFieldError = "Please fill the Empty field..";
  emailValidationmsg = "Incorrect Email(abc@gmail.com) check in this formate.";
  isEmailValidationmsg = false;
  isEmailValid = false;
  phoneValidationmsg = "Phone Number should be 10 digit.";
  isPhoneValid = false;
  isRegister;
  isNumberValidate = false;
  @api eventName;
  @api eventId;
  // alreadyRegisterError =
  //   "Your already register for ( " + eventName + " ) this event.";

  FirstNameSave(event) {
    this.FirstName = event.target.value;
    this.lead.FirstName = this.FirstName;
  }
  LastNameSave(event) {
    this.LastName = event.target.value;
    this.lead.LastName = this.LastName;
  }
  EmailSave(event) {
    this.Email = event.target.value;
    this.lead.Email = this.Email;
  }
  PhoneSave(event) {
    this.Phone = event.target.value;
    this.lead.Phone = this.Phone;
    this.lead.Company = "Drizzle";
    this.lead.CreatedById = "0055g00000FKrz5AAD";
    this.lead.OwnerId = "0055g00000FKrz5AAD";
    this.lead.LastModifiedById = "0055g00000FKrz5AAD";
    this.lead.Status = "Open - Not Contacted";
  }
  async saveRecord() {
    if (
      this.FirstName !== "" &&
      this.LastName !== "" &&
      this.Phone !== "" &&
      this.Email !== ""
    ) {
      if (this.Phone.length === 10) {
        console.log("Number should be 10 digits");
        this.isNumberValidate = false;
        let result = await isRecordAvailable({
          eventId: this.eventId,
          userEmailId: this.Email
        });
        {
          console.log("result:", result);
          this.isRegister = result;
        }
        if (!this.isRegister) {
          try {
            this.isEmailValidationmsg = false;
            await insertRecord({
              lead: this.lead,
              campaignId: this.eventId,
              isRegister: this.isRegister
            });
            {
              this.isResistrationSuccess = true;
            }
          } catch (error) {
            this.isEmailValidationmsg = true;
          }
        } else {
          console.log("isRgsister:", this.isRegister);
        }
      } else {
        this.isNumberValidate = true;
      }
    } else {
      this.isEmptyFieldError = true;
    }
  }

  cancelRecordd() {
    window.location.reload();
  }
  handelOkay() {
    this.isResistrationSuccess = false;
  }
}