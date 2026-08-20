import { LightningElement } from 'lwc';
import getThisMonthOpportunities from '@salesforce/apex/OpportunityController.getThisMonthOpportunities';

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

export default class Practice12 extends LightningElement {

    columns = COLUMNS;

    opportunities = [];

    showThisMonthOpportunities() {

        getThisMonthOpportunities()
            .then(result => {

                this.opportunities = result;

            })
            .catch(error => {

                console.error(error);

            });

    }

}