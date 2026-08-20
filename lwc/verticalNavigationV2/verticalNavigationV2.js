import { LightningElement } from 'lwc';

export default class VerticalNavigationV2 extends LightningElement {

    selectedItem
    
    handleSelect(event){
        this.selectedItem = event.detail.name
        console.log("Selected Item is: ", this.selectedItem)
    }

}