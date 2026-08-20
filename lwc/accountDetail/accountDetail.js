import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT from '@salesforce/messageChannel/accountSearchChannel__c'
import getAccountDetail from '@salesforce/apex/AccountController.getAccountDetail'
import {NavigationMixin} from 'lightning/navigation'

export default class AccountDetail extends NavigationMixin(LightningElement) {

    subscription
    account

@wire (MessageContext)
messageContext 

    connectedCallback(){
        this.subscription =  subscribe(this.messageContext, ACCOUNT, (message) => this.loadAccount(message.accountId))

        
    }

    loadAccount(accountId){
        getAccountDetail({accountId: accountId})

        .then(result=>{
            this.account = result
        })

        .catch(error=>{
            console.log(error)
        })
    }

    /* Button Logic */

    handleView(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',

            attributes:{
                recordId:this.account.Id,
                objectApiName: 'Account',
                actionName:'view'
            }
        })

    }

    handleEdit(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',

            attributes:{
                recordId:this.account.Id,
                objectApiName: 'Account',
                actionName:'edit'
            }
        })

    }
}