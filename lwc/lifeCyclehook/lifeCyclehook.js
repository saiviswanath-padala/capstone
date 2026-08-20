import { LightningElement } from 'lwc';

export default class LifeCyclehook extends LightningElement {

    
    count=0
    
    constructor(){
        super()
        console.log('1. Constructor Called')
    }

    connectedCallback(){
        console.log('2. connectedCallback Called')
    }

    renderedCallback(){
        console.log('3. renderedCallback Called')
    }

    handleClick(){
        console.log('4. Button Clicked')
        this.count++
    }

    disconnectedCallback(){
        console.log('5. DisconnectedCallback Called')
    }

    errorCallback(){
        console.log('6. errorCallback Called')
        console.error(error)
    }



}