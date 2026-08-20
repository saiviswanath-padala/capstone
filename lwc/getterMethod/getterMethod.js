import { LightningElement } from 'lwc';

export default class GetterMethod extends LightningElement {

    users = ["Jack", "Emma", "John"]

    get systemUser(){
        return this.users[0]
    }

    val1 = 10
    val2 = 5

    get multiply(){
        return this.val1 * this.val2
    }
}