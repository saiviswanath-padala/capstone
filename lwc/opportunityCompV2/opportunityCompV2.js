import { LightningElement,wire } from 'lwc';
import getAllOpportunity from '@salesforce/apex/OpportunityController.getAllOpportunity'

export default class OpportunityCompV2 extends LightningElement {

    opportunities = []
    
    @wire (getAllOpportunity)
    oppList({data,error}){

        if(data){
            this.opportunities = data.map(opp=>{
                return{
                    ...opp,
                    comission:opp.Amount * 0.20
                }
            })
        }

        if(error){
            console.log("Error is", error)
        }
    }
}