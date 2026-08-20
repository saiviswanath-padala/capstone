import { LightningElement, wire } from 'lwc';
import getAllOpportunity from '@salesforce/apex/OpportunityController.getAllOpportunity';

const COLUMNS = [
    {
        label: 'Opportunity Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Stage',
        fieldName: 'StageName',
        type: 'text'
    },
    {
        label: 'Close Date',
        fieldName: 'CloseDate',
        type: 'date'
    },
    {
        label: 'Amount',
        fieldName: 'Amount',
        type: 'currency'
    }
];

export default class Practice2 extends LightningElement {

    columns = COLUMNS;

    opportunities = [];

    totalAmount = 0;

    discountAmount = 0;

    finalAmount = 0;

    @wire(getAllOpportunity)
    wiredOpportunities({ data, error }) {

        if (data) {

            this.opportunities = data;

            this.totalAmount = this.opportunities.reduce(
                (sum, opp) => sum + (opp.Amount || 0),
                0
            );

            this.discountAmount = this.totalAmount * 0.10;

            this.finalAmount = this.totalAmount - this.discountAmount;

        } else if (error) {

            console.error(error);

        }

    }

}