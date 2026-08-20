import City from '@salesforce/schema/Asset.City';
import { LightningElement, api } from 'lwc';

export default class AccountMap extends LightningElement {

    @api city
    @api state
    @api country

    get mapMarkers(){
        return [{
            location:{
                City:this.city,
                State:this.state,
                Country:this.country
            },
            title: 'Account Location'
        }]
    }
}