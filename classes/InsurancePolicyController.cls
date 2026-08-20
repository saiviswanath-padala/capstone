public with sharing class InsurancePolicyController {

    @AuraEnabled(cacheable=true)
    public static List<Insurance_Policy__c> getPolicies(
        String searchKey
    ) {

        String searchText = '%' + searchKey + '%';

        return [
            SELECT
                Id,
                Name,
                Contact__c,
                Contact__r.Name,
                Insurance_Type__c,
                Policy_Start_Date__c,
                Policy_End_Date__c,
                Policy_Tenure__c,
                Premium_Amount__c,
                Total_Premium__c,
                Policy_Status__c
            FROM Insurance_Policy__c
            WHERE Contact__r.Name LIKE :searchText
            ORDER BY CreatedDate DESC
            LIMIT 100
        ];
    }
}