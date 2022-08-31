import { LightningElement, track } from "lwc";
import retrievePersonalInformation from "@salesforce/apex/PersonalInformationComponentController.retrievePersonalInformation";
import savePersonalInformation from "@salesforce/apex/PersonalInformationComponentController.savePersonalInformation";
import obtainCommunityLanguages from "@salesforce/apex/PersonalInformationComponentController.obtainCommunityLanguages";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import Contact_information_header from "@salesforce/label/c.Contact_information_header";
import Contact_First_Name from "@salesforce/label/c.Contact_First_Name";
import Contact_Last_Name from "@salesforce/label/c.Contact_Last_Name";
import Contact_Title from "@salesforce/label/c.Contact_Position";
import Contact_Street_Address from "@salesforce/label/c.Contact_Street_Address";
import Contact_City from "@salesforce/label/c.Contact_City";
import Contact_Country from "@salesforce/label/c.Contact_Country";
import Contact_Postcode from "@salesforce/label/c.Contact_Postcode";
import Contact_Phone from "@salesforce/label/c.Contact_Phone";
import Contact_Other_Phone from "@salesforce/label/c.Contact_Other_Phone";
import Contact_Email from "@salesforce/label/c.Contact_Email";
import Contact_Birthdate from "@salesforce/label/c.Contact_Birthdate";

import Organisation_information_header from "@salesforce/label/c.Organisation_information_header";
import Organisation_Name from "@salesforce/label/c.Organisation_Name";
import Organisation_Street_Address from "@salesforce/label/c.Organisation_Street_Address";
import Organisation_City from "@salesforce/label/c.Organisation_City";
import Organisation_Country from "@salesforce/label/c.Organisation_Country";
import Organisation_Postcode from "@salesforce/label/c.Organisation_Postcode";
import Language from "@salesforce/label/c.Language";

import Modal_Title from "@salesforce/label/c.Modal_Title";
import Modal_message from "@salesforce/label/c.Modal_message";
import Modal_Yes from "@salesforce/label/c.Modal_Yes";
import Modal_No from "@salesforce/label/c.Modal_No";
import LANG from "@salesforce/i18n/lang";
import utils from "c/utils";
const ValidationUtils = utils.validation;

export default class PersonalInformationComponent extends NavigationMixin(
  LightningElement
) {
  // labels
  label = {
    Contact_information_header,
    Contact_First_Name,
    Contact_Last_Name,
    Contact_Title,
    Contact_Street_Address,
    Contact_City,
    Contact_Country,
    Contact_Postcode,
    Contact_Phone,
    Contact_Other_Phone,
    Contact_Email,
    Contact_Birthdate,
    Organisation_information_header,
    Organisation_Name,
    Organisation_Street_Address,
    Organisation_City,
    Organisation_Country,
    Organisation_Postcode,
    Modal_Title,
    Modal_message,
    Modal_Yes,
    Modal_No,
    Language
  };

  @track contactInformation = { attributes: { type: "Contact" } };
  @track organisationAccount = { attributes: { type: "Account" } };

  //varialbes for input settings
  //phone format settings -- start
  PHONE_MIN_SIZE;
  PHONE_MAX_SIZE;
  PHONE_PATTERN; //'\\([0-9]{3}\\) [0-9]{3} [0-9]{4}';
  //phone format settings -- end

  // allow save settings -- start
  @track inProcessingFlag = true;
  @track blockSavingFlag = false;
  @track selectedLangluage = "";
  langluageList = [];

  isDialogVisible = false;

  get isBlockedSaving() {
    return this.blockSavingFlag || this.inProcessingFlag;
  }

  get showSpinner() {
    return this.inProcessingFlag;
  }
  // allow save settings -- start

  //on component load
  connectedCallback() {
    this.selectedLangluage = LANG.replace('-','_');  
    this.retrieveData();
  }

  contactChangeHanlder(event) {
    this.recordChangeHandler(event, "contactInformation");
  }

  accountChangeHandler(event) {
    this.recordChangeHandler(event, "organisationAccount");
  }

  recordChangeHandler(event, recordName) {
    let fieldType = event.currentTarget.type;
    this[recordName][event.currentTarget.dataset.field] =
      /* fieldType == "tel" ? this.phoneNumberFormatter(event.currentTarget.value) : */ event.currentTarget.value;
    // let value = fieldType == "tel" ? this.phoneNumberFormatter(event.currentTarget.value) : event.currentTarget.value;
    // event.currentTarget.value = value;
  }

  phoneNumberFormatter(phoneNumber) {
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    let newnumber = "";
    let index = 0;
    if (phoneNumber.length >= 3) {
      newnumber += "(" + phoneNumber.substring(index, (index += 3)) + ") ";
    }
    if (phoneNumber.length >= 6) {
      newnumber += phoneNumber.substring(index, (index += 3)) + " ";
    }
    if (phoneNumber.length >= 10) {
      newnumber += phoneNumber.substring(index, (index += 3));
    }
    newnumber += phoneNumber.substring(index);
    return newnumber;
  }

  //validation functions -- start
  validateForm() {
    return this.validateSection("main-section"); //this.validateSection('contact-section') && this.validateSection('organisation-section');
  }

  handleValidation(event){
    ValidationUtils.validateInput(event,this);
  }

  validateSection(sectionName) {
    return (
      this.fieldValidator(sectionName, "lightning-input") &&
      this.fieldValidator(sectionName, "lightning-textarea")
    );
  }

  fieldValidator(sectionName, fieldType) {
    let isValid = true;
    this.template
      .querySelectorAll("." + sectionName + " " + fieldType)
      .forEach((element) => {
        element.setCustomValidity("");
        if (!element.checkValidity()) {
          isValid = false;
          // element.setCustomValidity("Field not valid");
          element.reportValidity();
        }
      });
    return isValid;
  }
  //validation functions -- end

  //call backend functions --start

  //retrieve data for current user
  retrieveData() {
    obtainCommunityLanguages().then((response) => {
      var rtnValue = response;
      rtnValue = JSON.parse(rtnValue);
      if (rtnValue !== null) {
       this.langluageList = rtnValue;
      }
    }).catch(e=>{})
    retrievePersonalInformation()
      .then((response) => {
        let result = JSON.parse(response);
        this.contactInformation = result.contactInfo;
        this.organisationAccount = result.organisationInfo;
        this.selectedLangluage = result.currentUser.LanguageLocaleKey;
        this.inProcessingFlag = false;
      })
      .catch((error) => console.log(JSON.stringify(error)));
  }

  handleDialogClick(event) {
    if (event.target.name === "openConfirmation") {
      this.isDialogVisible = true;
    } else {
      if (event.target.name === "confirmModal") {
        if (event.detail.status === "confirm") {
          this.savePersonalInformation();
        }
      }

      this.isDialogVisible = false;
    }
  }

  savePersonalInformation() {
    this.inProcessingFlag = true;
    savePersonalInformation({
      userContactJSON: JSON.stringify(this.contactInformation),
      organisationAccountJSON: JSON.stringify(this.organisationAccount),
      langluage: this.selectedLangluage
    })
      .then((response) => {
        this.inProcessingFlag = false;
        this.navigateToHome();
      })
      .catch((error) => {
        this.inProcessingFlag = false;
        console.log(JSON.stringify(error));
        this.showToast(
          "Warning",
          "Something went wrong. Notify the administrator"
        );
      });
  }

  //send changes to back
  submitPersonalInformation() {
    if (!this.validateForm()) {
      return;
    }
    this.isDialogVisible = true;
    /* .then(response=>{
            console.log("saving was successful");
        }) */
  }

  //call backend functions --end

  //notification functions --start
  showToast(toastTitle, toastMessage) {
    const event = new ShowToastEvent({
      title: toastTitle,
      message: toastMessage
    });
    this.dispatchEvent(event);
  }
  //notification functions --start

  //navigation functions --start
  navigateToHome() {
    this.navigateHandler("Home");
  }

  navigateHandler(pageName) {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: pageName
      }
    });
  }
  //navigation functions --end

  

  handleLangluage(event){
    this.selectedLangluage = event.detail.value;
  }
}