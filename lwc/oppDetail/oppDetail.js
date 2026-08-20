import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getOpportunityDetail from '@salesforce/apex/OpportunityDetailController.getOpportunityDetail';
export default class OppDetail extends LightningElement {
    recordId;
    opportunity;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.recordId = currentPageReference.state.recordId;
        }
    }

    @wire(getOpportunityDetail, { recordId: '$recordId' })
    wiredOpp({ error, data }) {
        if (data) {
            this.opportunity = data;
        } else if (error) {
            console.error(error);
        }
    }
}