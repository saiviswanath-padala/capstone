public with sharing class CinemaSubsidyDashboardController {

    public class SubsidyRow {

        @AuraEnabled public Id id;
        @AuraEnabled public String subsidyNumber;
        @AuraEnabled public Id permitApplicationId;
        @AuraEnabled public String permitApplicationNumber;
        @AuraEnabled public String category;
        @AuraEnabled public String requestType;
        @AuraEnabled public Decimal requestedAmount;
        @AuraEnabled public Date requestedDate;
        @AuraEnabled public Decimal approvedAmount;
        @AuraEnabled public Date approvedDate;
        @AuraEnabled public String eligibilityStatus;
        @AuraEnabled public String status;
        @AuraEnabled public Boolean commissionerNotificationRequired;
        @AuraEnabled public String notes;
    }


    public class PermitOption {

        @AuraEnabled public Id id;
        @AuraEnabled public String label;
    }


    public class DashboardData {

        @AuraEnabled public List<SubsidyRow> subsidies;
        @AuraEnabled public List<PermitOption> permits;
    }


    @AuraEnabled(cacheable=true)
    public static DashboardData getDashboard(
        Id permitId
    ) {

        DashboardData result =
            new DashboardData();

        result.subsidies =
            new List<SubsidyRow>();

        result.permits =
            new List<PermitOption>();


        List<Subsidy_Assignment__c> subsidyRecords;

        if (permitId != null) {

            subsidyRecords = [
                SELECT
                    Id,
                    Name,
                    Permit_Application__c,
                    Permit_Application__r.Name,
                    Category__c,
                    Request_Type__c,
                    Requested_Amount__c,
                    Requested_Date__c,
                    Approved_Amount__c,
                    Approved_Date__c,
                    Eligibility_Status__c,
                    Status__c,
                    Commissioner_Notification_Required__c,
                    Notes__c
                FROM Subsidy_Assignment__c
                WHERE Permit_Application__c = :permitId
                WITH USER_MODE
                ORDER BY Requested_Date__c DESC,
                         CreatedDate DESC
                LIMIT 200
            ];

        } else {

            subsidyRecords = [
                SELECT
                    Id,
                    Name,
                    Permit_Application__c,
                    Permit_Application__r.Name,
                    Category__c,
                    Request_Type__c,
                    Requested_Amount__c,
                    Requested_Date__c,
                    Approved_Amount__c,
                    Approved_Date__c,
                    Eligibility_Status__c,
                    Status__c,
                    Commissioner_Notification_Required__c,
                    Notes__c
                FROM Subsidy_Assignment__c
                WITH USER_MODE
                ORDER BY Requested_Date__c DESC,
                         CreatedDate DESC
                LIMIT 200
            ];
        }


        for (
            Subsidy_Assignment__c subsidy :
            subsidyRecords
        ) {

            SubsidyRow row =
                new SubsidyRow();

            row.id =
                subsidy.Id;

            row.subsidyNumber =
                subsidy.Name;

            row.permitApplicationId =
                subsidy.Permit_Application__c;

            if (
                subsidy.Permit_Application__c != null
            ) {

                row.permitApplicationNumber =
                    subsidy.Permit_Application__r.Name;
            }

            row.category =
                subsidy.Category__c;

            row.requestType =
                subsidy.Request_Type__c;

            row.requestedAmount =
                subsidy.Requested_Amount__c;

            row.requestedDate =
                subsidy.Requested_Date__c;

            row.approvedAmount =
                subsidy.Approved_Amount__c;

            row.approvedDate =
                subsidy.Approved_Date__c;

            row.eligibilityStatus =
                subsidy.Eligibility_Status__c;

            row.status =
                subsidy.Status__c;

            row.commissionerNotificationRequired =
                subsidy.Commissioner_Notification_Required__c;

            row.notes =
                subsidy.Notes__c;

            result.subsidies.add(row);
        }


        /*
         * Load permits accessible to the current user.
         * These become the selectable records when creating
         * a subsidy request.
         */
        for (
            Permit_Application__c permit :
            [
                SELECT
                    Id,
                    Name,
                    Status__c
                FROM Permit_Application__c
                WITH USER_MODE
                ORDER BY CreatedDate DESC
                LIMIT 100
            ]
        ) {

            PermitOption option =
                new PermitOption();

            option.id =
                permit.Id;

            option.label =
                permit.Name +
                ' - ' +
                permit.Status__c;

            result.permits.add(option);
        }

        return result;
    }
}