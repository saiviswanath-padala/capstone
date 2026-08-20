import { LightningElement, wire } from 'lwc';
import getAllPosition from '@salesforce/apex/PositionController.getAllPosition';

export default class PositionData extends LightningElement {

    positions;
    error;

    @wire(getAllPosition)
    posList({ error, data }) {

        if (data) {
            this.positions = data.map(pos => {
                return {
                    ...pos,
                    Location__c: pos.Location__c
                        ? pos.Location__c.toUpperCase()
                        : ''
                };
            });
        } 
        
        else if (error) {
            this.error = error;
            console.log("Error is", error)
            this.positions = undefined;
        }
    }
}

