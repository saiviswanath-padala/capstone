public with sharing class VehicleController {

    @AuraEnabled(cacheable=true)
    public static List<Vehicle__c> getVehicles() {
        return [
            SELECT Id,
                   Name,
                   Vehicle_Name__c,
                   Vehicle_Type__c,
                   Status__c,
                   Number_Of_Available_Vehicle__c,
                   Per_Day_Rent__c
            FROM Vehicle__c
        ];
    }
}