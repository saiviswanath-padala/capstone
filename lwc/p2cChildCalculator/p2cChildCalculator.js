import { LightningElement, api } from 'lwc';

export default class P2cChildCalculator extends LightningElement {

    @api num1
    @api num2

    get summation(){
        return Number(this.num1) + Number(this.num2)
    }
}