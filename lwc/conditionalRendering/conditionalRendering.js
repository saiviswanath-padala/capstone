import { LightningElement } from 'lwc';

export default class ConditionalRendering extends LightningElement {

    message = ''
    showData = false
    
    handleInputChange(event){
        this.message = event.target.value
    }

    get helloMessage(){
        return this.message === 'Hello'
    }

    /* Button Rendering */

    handleShowData(){
        this.showData = true
    }
}