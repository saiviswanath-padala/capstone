import { LightningElement } from 'lwc';

export default class P2cParentProduct extends LightningElement {

    selectedItem
    products=[
        {label: "Laptop", value: "laptop"},
        {label: "Mobile", value: "mobile"},
        {label: "Tab", value: "tab"},

    ]
    
    handleChage(event){
        this.selectedItem = event.target.value

    }

}