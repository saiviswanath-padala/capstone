import { LightningElement } from 'lwc';
import getHighRevenueAccounts from '@salesforce/apex/AccountController.getHighRevenueAccounts';

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
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'currency'
    }
];

export default class Practice11 extends LightningElement {

    columns = COLUMNS;

    accounts = [];

    showHighRevenueAccounts() {

        getHighRevenueAccounts()
            .then(result => {

                this.accounts = result;

            })
            .catch(error => {

                console.error(error);

            });

    }

}