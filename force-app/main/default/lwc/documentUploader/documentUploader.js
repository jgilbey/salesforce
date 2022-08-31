import { LightningElement, api, track
} from 'lwc';
import constants from "c/constants";

const { DOCUMENT_UPLOADER_DEFAULT_COLUMNS } = constants.columnsConstants;

export default class DocumentUploader extends LightningElement {
   @api name = "";
   @api doscData = {};
   @api acceptedFormats = [];
   @api isBlocked = false;
   @api isRequired = false;
   @api tableColumns = [];
   @api uploadedFiles = [];
   @api recordId;

   connectedCallback() {
       console.log("recordId: " + this.recordId);
   }
   get columns() {
       // let columnsData = (this.tableColumns) ? this.tableColumns : DOCUMENT_UPLOADER_DEFAULT_COLUMNS;
       return (this.tableColumns && this.tableColumns.length > 0) ? this.tableColumns : DOCUMENT_UPLOADER_DEFAULT_COLUMNS;;
   }

   get isFilesUploaded() {
       return this.uploadedFiles.length > 0;
   }

   handleUploadFinished(event) {
       this.fireEvent({
         eventName: "uploadfinished",
         details: {
           name: this.name,
           files: event.detail.files
         }
       });
   }

   handleRowAction(event) {
       this.fireEvent({
         eventName: "rowaction",
         details: {
           name: this.name,
           rowId: event.detail.row.Id
         }
       });
   }

   fireEvent({ eventName, details }) {
       this.dispatchEvent(new CustomEvent(eventName, { detail: details, bubbles: true, composed: true }));
   }
}