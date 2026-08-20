import { LightningElement, api } from 'lwc';
import City from '@salesforce/schema/Asset.City';

export default class CandidateMap extends LightningElement {

    @api city
    @api street1
    @api street2
    @api state
    @api country

    get mapMarkers(){
        return [{
            location:{
                City:this.city,
                Street:this.street1 + ' ' + this.street2,
                State:this.state,
                Country:this.country
            },
            title: 'Candidate Location'
        }]
    }

}