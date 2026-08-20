import { LightningElement } from 'lwc';
import getNewPositions from '@salesforce/apex/PositionController.getNewPositions'
import getOpenPositions from '@salesforce/apex/PositionController.getOpenPositions'
import getClosedPositions from '@salesforce/apex/PositionController.getClosedPositions'



export default class PositionDataV2 extends LightningElement {

    positions;

    handleNewPosition(){
        getNewPositions()
        .then(result=>{
            this.positions = result
        })
        .catch(error=>{
            console.log(error)
        })
    }

    handleOpenPositions(){
        getOpenPositions()
        .then(result=>{
            this.positions = result
        })
        .catch(error=>{
            console.log(error)
        })
    }

    handleClosedPositions(){
        getClosedPositions()
        .then(result=>{
            this.positions = result
        })
        .catch(error=>{
            console.log(error)
        })
    }

}