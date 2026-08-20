import { LightningElement, track } from 'lwc';

export default class HelloAccenturite extends LightningElement {
    message = 'Hello, Accenturite , Welcome to Salesforce LWC!';

    name = '';
    handleTextChange(event) {
        this.name = event.target.value;
    }

    course = 'Salesforce Apex';
    anotherCourse = '';
    handleCourseChange(event) {
        this.anotherCourse = event.target.value;
    }

    @track companyDetails = {
        name: 'Accenture',
        location: 'Coimbatore',
        age : 70
    };

    handleObjectChange(event) {
        
        this.companyDetails.location = event.target.value;
    }
}