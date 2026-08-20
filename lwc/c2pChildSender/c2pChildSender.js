import { LightningElement } from 'lwc';

export default class C2pChildSender extends LightningElement {

    handleClick(){
        const sendMessage =  new CustomEvent("send",{
            detail: "Hello!! this message is from child component"
        })

        this.dispatchEvent(sendMessage)
    }
}