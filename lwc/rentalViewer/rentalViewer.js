import { LightningElement, wire } from 'lwc';

import getRentals
    from '@salesforce/apex/RentalController.getRentals';

const COLUMNS = [

    {
        label: 'Rental',
        fieldName: 'Name'
    },

    {
        label: 'Contact',
        fieldName: 'ContactName'
    },

    {
        label: 'Property',
        fieldName: 'PropertyName'
    },

    {
        label: 'Start Date',
        fieldName: 'Rental_Start_Date__c',
        type: 'date'
    },

    {
        label: 'End Date',
        fieldName: 'Rental_End_Date__c',
        type: 'date'
    },

    {
        label: 'Days',
        fieldName: 'Number_of_Days__c',
        type: 'number'
    },

    {
        label: 'Daily Rate',
        fieldName: 'Daily_Rental_Rate__c',
        type: 'currency'
    },

    {
        label: 'Total',
        fieldName: 'Total_Amount__c',
        type: 'currency'
    },

    {
        label: 'Security Deposit',
        fieldName: 'Security_Deposit__c',
        type: 'currency'
    },

    {
        label: 'Status',
        fieldName: 'Rental_Status__c'
    }

];

export default class RentalViewer extends LightningElement {

    searchKey = '';

    rentals;

    columns = COLUMNS;

    @wire(getRentals, {
        searchKey: '$searchKey'
    })
    wiredRentals({ data, error }) {

        if (data) {

            this.rentals = data.map(record => ({
                ...record,

                ContactName:
                    record.Contact__r
                        ? record.Contact__r.Name
                        : '',

                PropertyName:
                    record.Property__r
                        ? record.Property__r.Name
                        : ''
            }));

        }
        else if (error) {

            console.error(error);

        }
    }

    handleSearch(event) {

        this.searchKey =
            event.target.value;

    }
}