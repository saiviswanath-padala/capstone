import { LightningElement } from 'lwc';

export default class SimpleCalculator extends LightningElement {

    
    firstNumber = ''
    secondNumber = ''
    result = ''
    
    /* Input Values */
    handleFirstChange(event){
        this.firstNumber = parseFloat(event.target.value)
    }

    handleSecondNumber(event){
        this.secondNumber = parseFloat(event.target.value)
    }

    /* Buttons FOr Calculation */

    handleAdd(){

        this.result = this.firstNumber + this.secondNumber

    }

    handleSub(){

        this.result = this.firstNumber - this.secondNumber
    }

    handleMultiply(){
        this.result = this.firstNumber * this.secondNumber
    }

    handleAddDivide(){
        this.result = this.firstNumber / this.secondNumber

    }
}