/**
 * @description       :
 * @author            :
 * @group             :
 * @last modified on  : 05-05-2023
 * @last modified by  :
 **/
import { LightningElement } from "lwc";

export default class TestComponant extends LightningElement {
  ismodal = false;
  handleClick(event) {
    console.log("event.target.dataset.modal:" + event.target.dataset.modal);
    if (event.target.dataset.modal) {
      this.ismodal = true;
    }
  }

  handleClick2(event) {
    console.log("event.target.dataset.modal:" + event.target.dataset.modal);
    if (event.target.dataset.modal) {
      this.ismodal = true;
    } else {
      this.ismodal = false;
    }
  }
}
