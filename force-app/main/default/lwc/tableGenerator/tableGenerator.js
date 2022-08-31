import { LightningElement, api } from "lwc";

export default class TableGenerator extends LightningElement {
  @api columns = [];
  @api tableData = [];

  // renderedCallback(){
  //   console.log('tableData', JSON.parse(JSON.stringify(this.tableData)))
  // }
}