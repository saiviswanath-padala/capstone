import { LightningElement } from 'lwc';
import getWonOpportunity from '@salesforce/apex/OpportunityController.getWonOpportunity'
import getLostOpportunity from '@salesforce/apex/OpportunityController.getLostOpportunity'

export default class OpportunityCompV3 extends LightningElement {

    oppList;
    
    
    handleWonDeals(){
        getWonOpportunity()
        .then(result=>{
            this.oppList = result
        })

        .catch(error=>{
            console.log(error)
        })

    }


    handleLostDeals(){
        getLostOpportunity()
        .then(result=>{
            this.oppList = result
        })
        .catch(error=>{
            console.log(error)
        })
    }
}