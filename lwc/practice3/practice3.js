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
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'currency'
    }
];

export default class Practice3 extends LightningElement {

    columns = COLUMNS;

    accounts = [];

    totalRevenue = 0;

    gstAmount = 0;

    revenueWithGST = 0;

    @wire(getAllAccounts)
    wiredAccounts({ data, error }) {

        if (data) {

            this.accounts = data;

            this.totalRevenue = this.accounts.reduce(
                (sum, acc) => sum + (acc.AnnualRevenue || 0),
                0
            );

            this.gstAmount = this.totalRevenue * 0.18;

            this.revenueWithGST = this.totalRevenue + this.gstAmount;

        } else if (error) {

            console.error(error);

        }

    }

}