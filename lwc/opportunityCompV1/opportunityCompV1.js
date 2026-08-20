import { LightningElement, wire } from 'lwc';
import getAllOpportunity from '@salesforce/apex/OpportunityController.getAllOpportunity'

export default class OpportunityCompV1 extends LightningElement {

    @wire(getAllOpportunity)
    oppList
}