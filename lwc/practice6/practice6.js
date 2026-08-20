import { LightningElement, wire } from 'lwc';
import getAllAccounts from '@salesforce/apex/AccountController.getAllAccounts';

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

export default class Practice6 extends LightningElement {

    columns = COLUMNS;

    accounts = [];

    totalAccounts = 0;
    hotAccounts = 0;
    warmAccounts = 0;
    coldAccounts = 0;

    @wire(getAllAccounts)
    wiredAccounts({ data, error }) {

        if (data) {

            this.accounts = data;

            this.totalAccounts = data.length;

            this.hotAccounts = data.filter(
                account => account.Rating === 'Hot'
            ).length;

            this.warmAccounts = data.filter(
                account => account.Rating === 'Warm'
            ).length;

            this.coldAccounts = data.filter(
                account => account.Rating === 'Cold'
            ).length;

        } 
        else if (error) {

            console.error(error);

        }

    }

}