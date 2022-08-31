import { LightningElement, track } from 'lwc';

export default class RegistrationForm extends LightningElement {
    // userData;
    @track contactInformation = {attributes: {type: 'Contact'}};
    @track organisationAccount = {attributes: {type: 'Account'}};
    phoneMinSize = 12;
    phoneMaxSize = 12;
}