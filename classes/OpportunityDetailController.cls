public with sharing class OpportunityDetailController {
    @AuraEnabled(cacheable=true)
    public static Opportunity getOpportunityDetail(Id recordId) {
        return [
            SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, Owner.Name
            FROM Opportunity
            WHERE Id = :recordId
            LIMIT 1
        ];
    }
}