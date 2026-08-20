public with sharing class PositionController {
    @AuraEnabled(cacheable=true)
    public static List<Position__c> getAllPosition(){
        return[
            SELECT Name, Date_Opened__c, Date_Closed__c, Department__c, Location__c, Status__c
            FROM Position__c
            LIMIT 15
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Position__c> getNewPositions(){
        return[
            SELECT Name, Date_Opened__c, Date_Closed__c, Department__c, Location__c, Status__c
            FROM Position__c
            WHERE Status__c = 'New'
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Position__c> getOpenPositions(){
        return[
            SELECT Name, Date_Opened__c, Date_Closed__c, Department__c, Location__c, Status__c
            FROM Position__c
            WHERE Status__c = 'Open'
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Position__c> getClosedPositions(){
        return[
            SELECT Name, Date_Opened__c, Date_Closed__c, Department__c, Location__c, Status__c
            FROM Position__c
            WHERE Status__c = 'Closed'
        ];
    }

    @AuraEnabled
    public static void deletePosition(Id posId){
        Position__c pos =[
            SELECT Id FROM Position__c WHERE Id =: posId
        ];
        delete pos;
    }

}