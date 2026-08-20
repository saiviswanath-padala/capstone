public with sharing class StudentController {

    @AuraEnabled(cacheable=true)
    public static List<Student__c> getAllStudents() {

        return [
            SELECT Id,
                   Name,
                   Marks__c
            FROM Student__c
        ];
    }

}