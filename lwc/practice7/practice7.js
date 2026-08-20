import { LightningElement, wire } from 'lwc';
import getAllStudents from '@salesforce/apex/StudentController.getAllStudents';

const COLUMNS = [
    {
        label: 'Student Name',
        fieldName: 'Name',
        type: 'text'
    },
    {
        label: 'Marks',
        fieldName: 'Marks__c',
        type: 'number'
    }
];

export default class Practice7 extends LightningElement {

    columns = COLUMNS;

    students = [];

    totalStudents = 0;
    averageMarks = 0;
    studentsAbove75 = 0;

    @wire(getAllStudents)
    wiredStudents({ data, error }) {

        if (data) {

            this.students = data;

            this.totalStudents = data.length;

            const totalMarks = data.reduce(
                (sum, student) => sum + (student.Marks__c || 0),
                0
            );

            this.averageMarks = this.totalStudents
                ? (totalMarks / this.totalStudents).toFixed(2)
                : 0;

            this.studentsAbove75 = data.filter(
                student => (student.Marks__c || 0) > 75
            ).length;

        }
        else if (error) {

            console.error(error);

        }

    }

}