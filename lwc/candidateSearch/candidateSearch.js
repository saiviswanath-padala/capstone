import { LightningElement, wire } from 'lwc';
import searchCandidate from '@salesforce/apex/CandidateController.searchCandidate'
import CANDIDATE from '@salesforce/messageChannel/candidateSearchChannel__c'
import {publish, MessageContext} from 'lightning/messageService'

const columns =[
    {label:'First Name', fieldName:'First_Name__c'},
    {label:'Last Name', fieldName:'Last_Name__c'},
    {label:'Email', fieldName:'Email__c'},
    {label:'Phone', fieldName:'Phone__c'},
    {label:'Years of Experience', fieldName:'Years_of_Experience__c'}
]

export default class CandidateSearch extends LightningElement {

    searchKeys
    candidateList
    columns = columns
    selectedRecord

    @wire(MessageContext)
    messageContext
    
    handleInputChange(event){
        this.searchKeys = event.target.value

        if(this.searchKeys.length >= 2){
            searchCandidate({searchKey: this.searchKeys})

            .then(result =>{
                this.candidateList = result
            })

            .catch(error=>{
                console.log(error)
            })
        }
    }

    handleRowSelection(event){
        this.selectedRecord = event.detail.selectedRows;

        if(this.selectedRecord.length > 0){
            /* publish(messageContext, messageChannel, payLoad) */
            publish(this.messageContext, CANDIDATE,  {candidateId:this.selectedRecord[0].Id});
        }
    }

}