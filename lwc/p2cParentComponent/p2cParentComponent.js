import { LightningElement } from 'lwc';

export default class P2cParentComponent extends LightningElement {

    messageToChild
    
    handleClick(){
        this.messageToChild = "Message From Parent"
    }
}