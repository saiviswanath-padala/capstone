import { LightningElement, wire } from 'lwc';
import getAllPosition from '@salesforce/apex/PositionController.getAllPosition'
import deletePosition from '@salesforce/apex/PositionController.deletePosition'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import {refreshApex} from '@salesforce/apex'

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Date Opened', fieldName: 'Date_Opened__c', type: 'Date' },
    { label: 'Date Closed', fieldName: 'Date_Closed__c', type: 'Date' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Department', fieldName: 'Department__c' },
    { label: 'Location', fieldName: 'Location__c' },
    
];

export default class PositionDataV3 extends LightningElement {

    columns = columns
    posList
    wirePos
    posId


    @wire(getAllPosition)
    posRec(result){
        this.wirePos = result 
        if(result.data){
            this.posList = result.data
        }
    }

    handleRowSelection(event){
        const selectedRow = event.detail.selectedRows
        if(selectedRow.length > 0){
            //0-> pos1 -> Dickson PLC, Phone
            this.posId = selectedRow[0].Id
        }
    }

    handleDelete(){
        if(!this.posId){
            this.showToast('Error', 'Please Select Record to delete', 'error')
            return
        }
        deletePosition({posId:this.posId})
        .then(()=>{
            this.showToast('Success', 'Position Record Successfully Deleted', 'success')
            this.posId = null
            return refreshApex(this.wirePos)
        })

        .catch(error=>{
            console.log(error)
        })
    }

    showToast(title, message, variant){
        this.dispatchEvent(new ShowToastEvent({title:title, message:message, variant:variant}))
    }   

}