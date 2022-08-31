import { LightningElement, api} from 'lwc';

import Form_Title from "@salesforce/label/c.Form_Title";
import Status from "@salesforce/label/c.Status";

export default class MonitoringPageForms extends LightningElement {
    @api forms = [];

    labels = { 
        Status,
        Form_Title
    }
}