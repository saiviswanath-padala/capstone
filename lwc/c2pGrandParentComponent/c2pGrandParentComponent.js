import { LightningElement } from 'lwc';

export default class C2pGrandParentComponent extends LightningElement {

    message
    
    handleMessage(event){
        this.message = event.detail
    }
}