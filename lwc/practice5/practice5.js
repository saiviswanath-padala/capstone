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
        label: 'Profit (25%)',
        fieldName: 'Profit',
        type: 'currency'
    },
    {
        label: 'Tax (10%)',
        fieldName: 'Tax',
        type: 'currency'
    },
    {
        label: 'Net Profit',
        fieldName: 'NetProfit',
        type: 'currency'
    }
];

export default class Practice5 extends LightningElement {

    columns = COLUMNS;

    opportunities = [];

    totalAmount = 0;
    totalProfit = 0;
    taxOnProfit = 0;
    netProfit = 0;

    @wire(getAllOpportunity)
    wiredOpportunities({ data, error }) {

        if (data) {

            this.opportunities = data.map(opp => {

                const amount = opp.Amount || 0;
                const profit = amount * 0.25;
                const tax = profit * 0.10;
                const netProfit = profit - tax;

                return {
                    ...opp,
                    Profit: profit,
                    Tax: tax,
                    NetProfit: netProfit
                };

            });

            this.totalAmount = this.opportunities.reduce(
                (sum, opp) => sum + (opp.Amount || 0),
                0
            );

            this.totalProfit = this.opportunities.reduce(
                (sum, opp) => sum + opp.Profit,
                0
            );

            this.taxOnProfit = this.opportunities.reduce(
                (sum, opp) => sum + opp.Tax,
                0
            );

            this.netProfit = this.opportunities.reduce(
                (sum, opp) => sum + opp.NetProfit,
                0
            );

        } else if (error) {

            console.error(error);

        }

    }

}