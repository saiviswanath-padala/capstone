import { LightningElement, wire } from 'lwc';
import searchAccount from '@salesforce/apex/AccountController.searchAccount'
import ACCOUNT from '@salesforce/messageChannel/accountSearchChannel__c'
import {publish, MessageContext} from 'lightning/messageService'

const columns =[
    {label:'Name', fieldName:'Name'},
    {label:'Type', fieldName:'Type'}
]

export default class AccountSearch extends LightningElement {

    searchKeys
    accounts
    columns = columns
    selectedRecord

    @wire(MessageContext)
    messageContext
    
    handleInputChange(event){
        this.searchKeys = event.target.value

        if(this.searchKeys.length >= 2){
            searchAccount({searchKey: this.searchKeys})

            .then(result =>{
                this.accounts = result
            })

            .catch(error=>{
                console.log(error)
            })
        }
    }

    handleRowSelection(event){
        this.selectedRecord = event.detail.selectedRows

        if(this.selectedRecord.length > 0){
        /* publish(messageContext, messageChannel, payLoad) */
        publish(this.messageContext, ACCOUNT,  {accountId:this.selectedRecord[0].Id})
        }
    } 
}