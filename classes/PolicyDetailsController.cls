public with sharing class PolicyDetailsController {

    @AuraEnabled(cacheable=true)
    public static List<Policy_Detail__c> getPolicyDetails() {
        return [
            SELECT Id,
                   Name,
                   Policy_Name__c,
                   Base_Amount__c,
                   Cover_Amount__c,
                   Policy_Benefits__c,
                   Policy_Duration__c,
                   Premium_Amount__c
            FROM Policy_Detail__c
        ];
    }
}