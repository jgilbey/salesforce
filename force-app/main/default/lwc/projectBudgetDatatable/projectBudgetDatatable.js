import LightningDatatable from 'lightning/datatable';
import picklistColumn from './picklistColumn.html';
import picklistStatic from './picklistStatic.html';
import textAreaColumn from './textAreaColumn.html';
import textAreaColumnStatic from './textAreaColumnStatic.html';

export default class ProjectBudgetDatatable extends LightningDatatable
{
    static customTypes = 
    {
        picklistColumn: 
        {
            template: picklistStatic,
            editTemplate: picklistColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'options', 'value', 'context', 'variant','name']
        },
        textAreaColumn:
        {
            template: textAreaColumnStatic,
            editTemplate: textAreaColumn,
            standardCellLayout: true,
            typeAttributes: ['label', 'placeholder', 'value', 'context', 'variant','name']
        }
    };
}