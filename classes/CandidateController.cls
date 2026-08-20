public with sharing class CandidateController {
    @AuraEnabled(cacheable=true)
    public static List<Candidate__c> searchCandidate(String searchKey){

        return[
            SELECT First_Name__c, Last_Name__c, Email__c, Phone__c, Years_of_Experience__c
            FROM Candidate__c 
            WHERE First_Name__c 
            LIKE : ('%' +searchKey+ '%' ) 
            LIMIT 10
        ];
    } 
    
    @AuraEnabled(cacheable=true)
    public static Candidate__c getCandidateDetail(Id candidateId){
        return[
            SELECT First_Name__c, Last_Name__c, Email__c, Mobile__c, Street_Address_1__c, Street_Address_2__c, State_Province__c
            FROM Candidate__c 
            WHERE Id =: candidateId 
            LIMIT 1
        ];
    }
}