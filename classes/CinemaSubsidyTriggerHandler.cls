public without sharing class CinemaSubsidyTriggerHandler {

    private static Set<Id> processedSubsidyIds =
        new Set<Id>();


    /*
     * BEFORE INSERT / UPDATE
     *
     * Requirement:
     * Requested Amount > configured threshold
     *       ↓
     * Commissioner Notification Required = TRUE
     */
    public static void beforeSave(
        List<Subsidy_Assignment__c> newRecords,
        Map<Id, Subsidy_Assignment__c> oldMap,
        Boolean isInsert,
        Boolean isUpdate
    ) {

        if (newRecords == null || newRecords.isEmpty()) {
            return;
        }

        Cinema_Configuration__mdt config =
            Cinema_Configuration__mdt.getInstance(
                'Default_Cinema_Configuration'
            );

        Decimal threshold = 50000;

        if (
            config != null &&
            config.Subsidy_Notification_Threshold__c != null
        ) {
            threshold =
                config.Subsidy_Notification_Threshold__c;
        }

        for (Subsidy_Assignment__c subsidy : newRecords) {

            Decimal requestedAmount =
                subsidy.Requested_Amount__c == null
                ? 0
                : subsidy.Requested_Amount__c;

            subsidy.Commissioner_Notification_Required__c =
                requestedAmount > threshold;
        }
    }


    /*
     * AFTER INSERT / UPDATE
     *
     * Send notification only when the request crosses
     * the configured threshold.
     */
    public static void afterSave(
        List<Subsidy_Assignment__c> newRecords,
        Map<Id, Subsidy_Assignment__c> oldMap,
        Boolean isInsert,
        Boolean isUpdate
    ) {

        if (newRecords == null || newRecords.isEmpty()) {
            return;
        }

        Cinema_Configuration__mdt config =
            Cinema_Configuration__mdt.getInstance(
                'Default_Cinema_Configuration'
            );

        Decimal threshold = 50000;

        if (
            config != null &&
            config.Subsidy_Notification_Threshold__c != null
        ) {
            threshold =
                config.Subsidy_Notification_Threshold__c;
        }

        List<Subsidy_Assignment__c> notificationRecords =
            new List<Subsidy_Assignment__c>();

        for (Subsidy_Assignment__c subsidy : newRecords) {

            if (processedSubsidyIds.contains(subsidy.Id)) {
                continue;
            }

            Decimal newAmount =
                subsidy.Requested_Amount__c == null
                ? 0
                : subsidy.Requested_Amount__c;

            Boolean crossedThreshold = false;

            if (isInsert) {

                crossedThreshold =
                    newAmount > threshold;
            }
            else if (isUpdate) {

                Subsidy_Assignment__c oldSubsidy =
                    oldMap.get(subsidy.Id);

                Decimal oldAmount =
                    oldSubsidy == null ||
                    oldSubsidy.Requested_Amount__c == null
                    ? 0
                    : oldSubsidy.Requested_Amount__c;

                crossedThreshold =
                    newAmount > threshold &&
                    oldAmount <= threshold;
            }

            if (crossedThreshold) {

                notificationRecords.add(
                    subsidy
                );

                processedSubsidyIds.add(
                    subsidy.Id
                );
            }
        }

        if (notificationRecords.isEmpty()) {
            return;
        }

        /*
         * Find all active users with the City Commissioner role.
         */
        Set<String> commissionerIds =
            new Set<String>();

        for (User commissioner : [
            SELECT Id
            FROM User
            WHERE IsActive = true
            AND UserRole.Name = 'City Commissioner'
        ]) {

            commissionerIds.add(
                String.valueOf(commissioner.Id)
            );
        }

        if (commissionerIds.isEmpty()) {
            return;
        }

        /*
         * Get the Custom Notification Type created in Setup.
         */
        List<CustomNotificationType> notificationTypes = [
            SELECT Id, DeveloperName
            FROM CustomNotificationType
            WHERE DeveloperName = 'High_Subsidy_Review'
            LIMIT 1
        ];

        if (notificationTypes.isEmpty()) {
            return;
        }

        Id notificationTypeId =
            notificationTypes[0].Id;

        /*
         * Send one notification per subsidy record.
         */
        for (
            Subsidy_Assignment__c subsidy :
            notificationRecords
        ) {

            Messaging.CustomNotification notification =
                new Messaging.CustomNotification();

            notification.setTitle(
                'High-Value Cinema Subsidy'
            );

            notification.setBody(
                'Subsidy request ' +
                subsidy.Name +
                ' exceeds the configured threshold. ' +
                'Commissioner review is required.'
            );

            notification.setNotificationTypeId(
                notificationTypeId
            );

            notification.setTargetId(
                subsidy.Id
            );

            try {

                notification.send(
                    commissionerIds
                );

            } catch (Exception ex) {

                /*
                 * Do not block the subsidy transaction if
                 * notification delivery itself fails.
                 *
                 * The checkbox on the subsidy record remains
                 * TRUE and provides an audit indication.
                 */
                System.debug(
                    LoggingLevel.ERROR,
                    'Unable to send subsidy notification: ' +
                    ex.getMessage()
                );
            }
        }
    }
}