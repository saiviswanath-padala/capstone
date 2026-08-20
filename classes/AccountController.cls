public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccount(String searchKey){

        return[
            SELECT Name, Type 
            FROM Account 
            WHERE Name 
            LIKE : ('%' +searchKey+ '%' ) 
            LIMIT 10
        ];

    } 
    
    @AuraEnabled(cacheable=true)
    public static Account getAccountDetail(Id accountId){
        return[
            SELECT Id, Name, BillingCity, BillingCountry, Industry, AnnualRevenue 
            FROM Account 
            WHERE Id =: accountId 
            LIMIT 1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAllAccounts() {

        return [
            SELECT Id,
                   Name,
                   Type,
                   Industry,
                   AnnualRevenue,
                   Rating
            FROM Account
        ];
    }

    @AuraEnabled
    public static List<Account> getHotAccounts() {

        return [
            SELECT Id,
                   Name,
                   Type,
                   Industry,
                   Rating
            FROM Account
            WHERE Rating = 'Hot'
        ];

    }

    @AuraEnabled
    public static List<Account> getHighRevenueAccounts() {

        return [
            SELECT Id,
                   Name,
                   Type,
                   Industry,
                   AnnualRevenue
            FROM Account
            WHERE AnnualRevenue > 1000000
        ];

    }
}