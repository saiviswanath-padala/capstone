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
    },
    {
        label: 'Commission (20%)',
        fieldName: 'Commission',
        type: 'currency'
    }
];

export default class Practice1 extends LightningElement {

    columns = COLUMNS;

    opportunities = [];

    totalOpportunities = 0;

    totalAmount = 0;

    @wire(getAllOpportunity)
    wiredOpportunities({ data, error }) {

        if (data) {

            this.opportunities = data.map(opp => {

                return {
                    ...opp,
                    Commission: (opp.Amount || 0) * 0.20
                };

            });

            this.totalOpportunities = this.opportunities.length;

            this.totalAmount = this.opportunities.reduce(
                (sum, opp) => sum + (opp.Amount || 0),
                0
            );

        } else if (error) {

            console.error(error);

        }

    }

}