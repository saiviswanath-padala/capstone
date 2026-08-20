import { LightningElement } from 'lwc';

export default class VerticalNavigation extends LightningElement {

    selectedItem
    
    handleSelect(event){
        this.selectedItem = event.detail.name
        console.log("Selected Item is: ", this.selectedItem)
    }
}