import { LightningElement, wire } from 'lwc';

import getPolicies
    from '@salesforce/apex/InsurancePolicyController.getPolicies';

const COLUMNS = [

    {
        label: 'Policy Number',
        fieldName: 'Name'
    },

    {
        label: 'Contact',
        fieldName: 'ContactName'
    },

    {
        label: 'Insurance Type',
        fieldName: 'Insurance_Type__c'
    },

    {
        label: 'Start Date',
        fieldName: 'Policy_Start_Date__c',
        type: 'date'
    },

    {
        label: 'End Date',
        fieldName: 'Policy_End_Date__c',
        type: 'date'
    },

    {
        label: 'Tenure',
        fieldName: 'Policy_Tenure__c',
        type: 'number'
    },

    {
        label: 'Premium',
        fieldName: 'Premium_Amount__c',
        type: 'currency'
    },

    {
        label: 'Status',
        fieldName: 'Policy_Status__c'
    }

];

export default class InsurancePolicyViewer
    extends LightningElement {

    searchKey = '';

    policies;

    error;

    columns = COLUMNS;

    @wire(getPolicies, {
        searchKey: '$searchKey'
    })

    wiredPolicies({ data, error }) {

        if (data) {

            this.policies = data.map(policy => ({

                ...policy,

                ContactName:
                    policy.Contact__r
                        ? policy.Contact__r.Name
                        : ''

            }));

            this.error = undefined;

        }
        else if (error) {

            this.error = error;

            this.policies = undefined;

        }

    }

    handleSearch(event) {

        this.searchKey =
            event.target.value;

    }

}