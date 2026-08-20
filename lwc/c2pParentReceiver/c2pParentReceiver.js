import { LightningElement } from 'lwc';

export default class C2pParentReceiver extends LightningElement {

    message

    handleMessage(event){
        this.message = event.detail
    }
}