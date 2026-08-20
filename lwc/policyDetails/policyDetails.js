import { LightningElement } from 'lwc';
import getPolicyDetails from '@salesforce/apex/PolicyDetailsController.getPolicyDetails';

export default class PolicyDetails extends LightningElement {

    policies = [];
    showPolicies = false;

    columns = [
        {
            label: 'Policy ID',
            fieldName: 'Name',
            type: 'text'
        },
        {
            label: 'Policy Name',
            fieldName: 'Policy_Name__c',
            type: 'text'
        },
        {
            label: 'Base Amount',
            fieldName: 'Base_Amount__c',
            type: 'currency'
        },
        {
            label: 'Cover Amount',
            fieldName: 'Cover_Amount__c',
            type: 'currency'
        },
        {
            label: 'Policy Duration',
            fieldName: 'Policy_Duration__c',
            type: 'number'
        },
        {
            label: 'Premium Amount',
            fieldName: 'Premium_Amount__c',
            type: 'currency'
        }
    ];

    handleGetPolicies() {

        getPolicyDetails()
            .then(result => {
                this.policies = result;
                this.showPolicies = true;
            })
            .catch(error => {
                console.error(error);
            });
    }
}