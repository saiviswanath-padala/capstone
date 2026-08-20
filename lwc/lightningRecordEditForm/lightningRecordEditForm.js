import { LightningElement, api } from 'lwc'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
 
export default class LightningRecordFormDemo extends LightningElement {
 
    @api recordId
 
    handleSubmit(event){
        const fields = event.detail.fields
 
        /* Creating a related contact for current account */
 
        fields.AccountId = this.recordId
 
    }
 
    handleSuccess() {
        this.dispatchEvent(new ShowToastEvent({title:'Success', message:'Contact created successfully', variant:'success'}))
    }
 
    handleError(event) {
        this.dispatchEvent(new ShowToastEvent({title:'Error', message:event.detail.message, variant:'error'}))
    }
}