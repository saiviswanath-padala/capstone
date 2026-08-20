import { LightningElement } from 'lwc';

export default class LwcToScreenFlow extends LightningElement {

    firstName = ''
    lastName = ''
    showFlow = false
    
    
    handleFirstNameChange(event){
        this.firstName = event.target.value
    }

    handleLastNameChange(event){
        this.lastName = event.target.value
    }

    hanldeClick(){
        this.showFlow =true
    }

    get flowInputVar(){
        return[{
            name:'firstName',
            type:'String',
            value:this.firstName
        },
                {

            name:'lastName',
            type:'String',
            value: this.lastName       

    }
    ]
    }
}