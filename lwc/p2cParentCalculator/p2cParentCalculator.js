import { LightningElement } from 'lwc';

export default class P2cParentCalculator extends LightningElement {

    val1
    val2
    sendData = false

    handleNum1Change(event){
        this.val1 = event.target.value
    }

    handleNum2Change(event){
        this.val2 = event.target.value
    }

    handleCalculate(){
        this.sendData = true
    }
}