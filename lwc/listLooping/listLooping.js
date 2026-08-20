import { LightningElement } from 'lwc';

export default class ListLooping extends LightningElement {

    salesforceCourses = [
        {id:1, course:"Salesforce Admin",  type:"Configuration"},
        {id:2, course:"Salesforce Apex",  type:"Development"},
        {id:3, course:"Salesforce LWC",  type:"VS Development"},
        {id:4, course:"Salesforce Flows",  type:"Automation"},
    ]
}