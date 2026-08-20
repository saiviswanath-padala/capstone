import { LightningElement, wire } from 'lwc';
import getAllLeads from '@salesforce/apex/LeadController.getAllLeads';

const COLUMNS = [
    {
        label: 'Lead Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Company',
        fieldName: 'Company',
        type: 'text'
    },
    {
        label: 'Status',
        fieldName: 'Status',
        type: 'text'
    },
    {
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'currency'
    }
];

export default class Practice4 extends LightningElement {

    columns = COLUMNS;

    leads = [];

    totalLeadValue = 0;

    bonusAmount = 0;

    finalValue = 0;

    @wire(getAllLeads)
    wiredLeads({ data, error }) {

        if (data) {

            this.leads = data;

            this.totalLeadValue = this.leads.reduce(
                (sum, lead) => sum + (lead.AnnualRevenue || 0),
                0
            );

            this.bonusAmount = this.totalLeadValue * 0.08;

            this.finalValue = this.totalLeadValue + this.bonusAmount;

        } else if (error) {

            console.error(error);

        }

    }

}