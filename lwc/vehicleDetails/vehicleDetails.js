import { LightningElement } from 'lwc';
import getVehicles  from '@salesforce/apex/VehicleController.getVehicles';
import { wire } from 'lwc';

    const COLUMNS = [
        {
            label: 'Vehicle Number',
            fieldName: 'Vehicle_Number__c'
        },
        {
            label: 'Vehicle Name',
            fieldName: 'Vehicle_Name__c'
        },
        {
            label: 'Vehicle Type',
            fieldName: 'Vehicle_Type__c'
        },
        {
            label: 'Status',
            fieldName: 'Status__c'
        },
        {
            label: 'Available Vehicles',
            fieldName: 'Number_of_Available_Vehicles__c'
        },
        {
            label: 'Per Day Rent',
            fieldName: 'Per_Day_Rent__c'
        }
    ];

    export default class VehicleDetails extends LightningElement {

        vehicles;
        error;
        columns = COLUMNS;

        @wire(getVehicles) 
        wiredVehicles({data,error}) {
            if(data) {
                this.vehicles = data;
                this.error = undefined;
            } else if(error) {
                this.error = error;
                this.vehicles = undefined;
            }
        }
    }



    