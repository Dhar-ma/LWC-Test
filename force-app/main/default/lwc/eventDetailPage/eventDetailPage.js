import { LightningElement, track } from 'lwc';
import getCampaign from "@salesforce/apex/CampaignController.getCampaign"


export default class EventDetailPage extends LightningElement {
    @track campaign = [];
    @track value;
  
    connectedCallback() {
        getCampaign()
        .then((result) => {
          var i;
          let arr = [];
          for (i = 0; i < result.length; i++) {
            console.log(arr[i]);
            arr.push({
              label: result[i].Name,
              value: result[i].Id
            });
          }
          this.campaign = arr;
          console.log("campaign:" + this.campaign);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    handleChange(event) {
      this.value = event.target.value;
      console.log("this.value:" + this.value);
    }

}