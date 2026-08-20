public with sharing class LeadController {

    @AuraEnabled(cacheable=true)
    public static List<Lead> getAllLeads() {

        return [
            SELECT Id,
                   Name,
                   Company,
                   Status,
                   AnnualRevenue
            FROM Lead
        ];
    }

}