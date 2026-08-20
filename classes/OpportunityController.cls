public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getAllOpportunity(){
        return[
            SELECT Id, Name, StageName, CloseDate, Amount
            FROM Opportunity 
            LIMIT 15
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getWonOpportunity(){
        return[
            SELECT Name, StageName, CloseDate, Amount 
            FROM Opportunity 
            WHERE StageName = 'Closed Won'
        ];
    }

     @AuraEnabled(cacheable=true)
    public static List<Opportunity> getLostOpportunity(){
        return[
            SELECT Name, StageName, CloseDate, Amount 
            FROM Opportunity 
            WHERE StageName = 'Closed Lost'
        ];
    }

    @AuraEnabled
    public static void deleteOpportunity(Id oppId){
        opportunity opp =[
            SELECT Id FROM Opportunity WHERE Id =: oppId
        ];
        delete opp;
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityWithAmount(){
        return[
            SELECT Name, Amount FROM Opportunity WHERE Amount != null
        ];
    }

    @AuraEnabled
    public static List<Opportunity> getThisMonthOpportunities() {

        return [
            SELECT Id,
                   Name,
                   StageName,
                   CloseDate,
                   Amount
            FROM Opportunity
            WHERE CloseDate = THIS_MONTH
        ];

    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        return [
            SELECT Id, Name, StageName, CloseDate, Amount
            FROM Opportunity
            LIMIT 20
        ];
    }

}