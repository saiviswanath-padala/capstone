import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import CANDIDATE from '@salesforce/messageChannel/candidateSearchChannel__c'
import getCandidateDetail from '@salesforce/apex/CandidateController.getCandidateDetail'
import {NavigationMixin} from 'lightning/navigation'

export default class CandidateDetail extends NavigationMixin(LightningElement) {

    subscription
    candidate

    @wire (MessageContext)
    messageContext 

    connectedCallback(){
        this.subscription =  subscribe(this.messageContext, CANDIDATE, (message) => this.loadCandidate(message.candidateId))

        
    }

    loadCandidate(candidateId){
        getCandidateDetail({candidateId: candidateId})

        .then(result=>{
            this.candidate = result
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
                recordId:this.candidate.Id,
                objectApiName: 'Candidate__c',
                actionName:'view'
            }
        })

    }

    handleEdit(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',

            attributes:{
                recordId:this.candidate.Id,
                objectApiName: 'Candidate__c',
                actionName:'edit'
            }
        })

    }
}