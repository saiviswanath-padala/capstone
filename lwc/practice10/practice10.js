import { LightningElement } from 'lwc';
import getWorkingCases from '@salesforce/apex/CaseController.getWorkingCases';

const COLUMNS = [
    {
        label: 'Case Number',
        fieldName: 'CaseNumber',
        type: 'text'
    },
    {
        label: 'Subject',
        fieldName: 'Subject',
        type: 'text'
    },
    {
        label: 'Status',
        fieldName: 'Status',
        type: 'text'
    },
    {
        label: 'Priority',
        fieldName: 'Priority',
        type: 'text'
    }
];

export default class Practice10 extends LightningElement {

    columns = COLUMNS;

    cases = [];

    showWorkingCases() {

        getWorkingCases()
            .then(result => {

                this.cases = result;

            })
            .catch(error => {

                console.error(error);

            });

    }

}