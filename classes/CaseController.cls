public with sharing class CaseController {

    @AuraEnabled
    public static List<Case> getOpenCases() {

        return [
            SELECT Id,
                   CaseNumber,
                   Subject,
                   Status,
                   Priority
            FROM Case
            WHERE Status = 'New'
        ];

    }

    @AuraEnabled
    public static List<Case> getWorkingCases() {

        return [
            SELECT Id,
                   CaseNumber,
                   Subject,
                   Status,
                   Priority
            FROM Case
            WHERE Status = 'Working'
        ];

    }

}