import { LightningElement } from 'lwc';
import FIRST_NAME from '@salesforce/schema/Contact.FirstName'
import LAST_NAME from '@salesforce/schema/Contact.LastName'
import PHONE from '@salesforce/schema/Contact.Phone'
import EMAIL from '@salesforce/schema/Contact.Email'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'


export default class LightningRecordForm extends LightningElement {

    contactFields=[FIRST_NAME, LAST_NAME, PHONE, EMAIL]

    handleSuccess(){
        this.dispatchEvent(new ShowToastEvent({title:"Success", message:"Contact record is successfully Created", variant:"success"}))
    }
}