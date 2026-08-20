import { LightningElement } from 'lwc';
import getOpenCases from '@salesforce/apex/CaseController.getOpenCases';

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

export default class Practice9 extends LightningElement {

    columns = COLUMNS;

    cases = [];

    showOpenCases() {

        getOpenCases()
            .then(result => {

                this.cases = result;

            })
            .catch(error => {

                console.error(error);

            });

    }

}