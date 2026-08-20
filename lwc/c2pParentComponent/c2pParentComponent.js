import { LightningElement } from 'lwc';

export default class C2pParentComponent extends LightningElement {
    message
    
    handleMessage(event){
        this.message = event.detail
    }
}