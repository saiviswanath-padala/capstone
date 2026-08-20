public with sharing class RentalController {

    @AuraEnabled(cacheable=true)
    public static List<Rentall_Number__c> getRentals(String searchKey) {

        String searchText = '%' + searchKey + '%';

        return [
            SELECT
                Id,
                Name,
                Contact__c,
                Contact__r.Name,
                Property__c,
                Property__r.Name,
                Rental_Start_Date__c,
                Rental_End_Date__c,
                Number_of_Days__c,
                Daily_Rental_Rate__c,
                Total_Amount__c,
                Security_Deposit__c,
                Rental_Status__c
            FROM Rentall_Number__c
            WHERE Contact__r.Name LIKE :searchText
            ORDER BY CreatedDate DESC
            LIMIT 100
        ];
    }
}