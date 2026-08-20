import { LightningElement } from 'lwc';

export default class C2pChildComponent extends LightningElement {


    handleClick(){
        const sendHello =  new CustomEvent("message",{
            detail: "Hello",

            /* Moving upward direction */
            bubbles:true,
            /* This is used to cross shadow DOM Boundary */
            composed:true
        })

        this.dispatchEvent(sendHello)
    }
}