import { LightningElement } from 'lwc';
import getHotAccounts from '@salesforce/apex/AccountController.getHotAccounts';

const COLUMNS = [
    {
        label: 'Account Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Type',
        fieldName: 'Type',
        type: 'text'
    },
    {
        label: 'Industry',
        fieldName: 'Industry',
        type: 'text'
    },
    {
        label: 'Rating',
        fieldName: 'Rating',
        type: 'text'
    }
];

export default class Practice8 extends LightningElement {

    columns = COLUMNS;

    accounts = [];

    showHotAccounts() {

        getHotAccounts()
            .then(result => {

                this.accounts = result;

            })
            .catch(error => {

                console.error(error);

            });

    }

}