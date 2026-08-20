import { LightningElement, wire } from 'lwc';
import getAllOpportunity from '@salesforce/apex/OpportunityController.getAllOpportunity'
import deleteOpportunity from '@salesforce/apex/OpportunityController.deleteOpportunity'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import {refreshApex} from '@salesforce/apex'

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Stage', fieldName: 'StageName'},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'Date' },
    { label: 'Amount', fieldName: 'Amount'},
    
];

export default class OpportunityCompV4 extends LightningElement {

    columns = columns
    oppList
    wireOpp
    opId

    @wire(getAllOpportunity)
    oppRec(result){
        this.wireOpp = result
        if(result.data){
            this.oppList = result.data
        }
    }

    handleRowSelection(event){
        const selectedRow = event.detail.selectedRows
        if(selectedRow.length > 0){
            //0-> opp1 -> Dickson PLC, Phone
            this.opId = selectedRow[0].Id
        }
    }

    handleDelete(){
        if(!this.opId){
            this.showToast('Error', 'Please Select Record to delete', 'error')
            return
        }
        deleteOpportunity({oppId:this.opId})
        .then(()=>{
            this.showToast('Success', 'Opportunity Record Successfully Deleted', 'success')
            this.opId = null
            return refreshApex(this.wireOpp)
        })

        .catch(error=>{
            console.log(error)
        })
    }

    showToast(title, message, variant){
        this.dispatchEvent(new ShowToastEvent({title:title, message:message, variant:variant}))
    }

}