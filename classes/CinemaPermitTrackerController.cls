public with sharing class CinemaPermitTrackerController {

    public class GrievanceRow {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String subject;
        @AuraEnabled public String description;
        @AuraEnabled public String status;
        @AuraEnabled public String resolutionNotes;
        @AuraEnabled public Date submittedDate;
    }

    public class PermitTrackerData {
        @AuraEnabled public Id permitId;
        @AuraEnabled public String permitNumber;
        @AuraEnabled public String permitType;
        @AuraEnabled public String applicationCategory;
        @AuraEnabled public String status;
        @AuraEnabled public Date submissionDate;
        @AuraEnabled public Date expiryDate;
        @AuraEnabled public Decimal feeAmount;
        @AuraEnabled public String rejectionReason;
        @AuraEnabled public String notes;
        @AuraEnabled public String applicantName;
        @AuraEnabled public String cinemaName;
        @AuraEnabled public List<GrievanceRow> grievances;
    }

    @AuraEnabled(cacheable=true)
    public static PermitTrackerData getPermitTracker(Id permitId) {

        Permit_Application__c permit;

        if (permitId != null) {

            List<Permit_Application__c> requestedPermits = [
                SELECT
                    Id,
                    Name,
                    Permit_Type__c,
                    Application_Category__c,
                    Status__c,
                    Submission_Date__c,
                    Expiry_Date__c,
                    Fee_Amount__c,
                    Rejection_Reason__c,
                    Notes__c,
                    Applicant_Contact__c,
                    Applicant_Contact__r.Name,
                    Cinema_Account__c,
                    Cinema_Account__r.Name
                FROM Permit_Application__c
                WHERE Id = :permitId
                WITH USER_MODE
                LIMIT 1
            ];

            if (!requestedPermits.isEmpty()) {
                permit = requestedPermits[0];
            }

        } else {

            List<Permit_Application__c> latestPermits = [
                SELECT
                    Id,
                    Name,
                    Permit_Type__c,
                    Application_Category__c,
                    Status__c,
                    Submission_Date__c,
                    Expiry_Date__c,
                    Fee_Amount__c,
                    Rejection_Reason__c,
                    Notes__c,
                    Applicant_Contact__c,
                    Applicant_Contact__r.Name,
                    Cinema_Account__c,
                    Cinema_Account__r.Name
                FROM Permit_Application__c
                WITH USER_MODE
                ORDER BY CreatedDate DESC
                LIMIT 1
            ];

            if (!latestPermits.isEmpty()) {
                permit = latestPermits[0];
            }
        }

        if (permit == null) {
            return null;
        }

        PermitTrackerData result = new PermitTrackerData();

        result.permitId = permit.Id;
        result.permitNumber = permit.Name;
        result.permitType = permit.Permit_Type__c;
        result.applicationCategory =
            permit.Application_Category__c;
        result.status = permit.Status__c;
        result.submissionDate =
            permit.Submission_Date__c;
        result.expiryDate =
            permit.Expiry_Date__c;
        result.feeAmount =
            permit.Fee_Amount__c;
        result.rejectionReason =
            permit.Rejection_Reason__c;
        result.notes =
            permit.Notes__c;

        if (permit.Applicant_Contact__c != null) {
            result.applicantName =
                permit.Applicant_Contact__r.Name;
        }

        if (permit.Cinema_Account__c != null) {
            result.cinemaName =
                permit.Cinema_Account__r.Name;
        }

        result.grievances = new List<GrievanceRow>();

        for (Grievance__c grievance : [
            SELECT
                Id,
                Name,
                Subject__c,
                Description__c,
                Status__c,
                Resolution_Notes__c,
                Submitted_Date__c
            FROM Grievance__c
            WHERE Permit_Application__c = :permit.Id
            WITH USER_MODE
            ORDER BY CreatedDate DESC
        ]) {

            GrievanceRow row = new GrievanceRow();

            row.id = grievance.Id;
            row.name = grievance.Name;
            row.subject = grievance.Subject__c;
            row.description =
                grievance.Description__c;
            row.status = grievance.Status__c;
            row.resolutionNotes =
                grievance.Resolution_Notes__c;
            row.submittedDate =
                grievance.Submitted_Date__c;

            result.grievances.add(row);
        }

        return result;
    }
}