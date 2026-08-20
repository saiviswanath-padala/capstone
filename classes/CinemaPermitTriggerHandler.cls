public without sharing class CinemaPermitTriggerHandler {

    /*
     * Prevent duplicate processing if the same records are encountered
     * more than once during the transaction.
     */
    private static Set<Id> processedPermitIds = new Set<Id>();

    public static void handle(
        List<Permit_Application__c> newRecords,
        Map<Id, Permit_Application__c> oldMap,
        Boolean isInsert,
        Boolean isUpdate
    ) {

        if (newRecords == null || newRecords.isEmpty()) {
            return;
        }

        Set<Id> permitIdsToShare = new Set<Id>();

        /*
         * Requirement:
         * On Permit Application insert/update when Status = Submitted,
         * automatically share the Permit Application with the Inspector.
         */
        for (Permit_Application__c permit : newRecords) {

            if (permit.Id == null) {
                continue;
            }

            if (processedPermitIds.contains(permit.Id)) {
                continue;
            }

            Boolean becameSubmitted = false;

            if (isInsert) {
                becameSubmitted =
                    permit.Status__c == 'Submitted';
            }
            else if (isUpdate) {

                Permit_Application__c oldPermit =
                    oldMap.get(permit.Id);

                becameSubmitted =
                    permit.Status__c == 'Submitted' &&
                    oldPermit != null &&
                    oldPermit.Status__c != 'Submitted';
            }

            /*
             * Also handle the case where the Inspector is assigned
             * after the permit has already become Submitted.
             */
            Boolean inspectorChangedOnSubmitted = false;

            if (isUpdate) {

                Permit_Application__c oldPermit =
                    oldMap.get(permit.Id);

                inspectorChangedOnSubmitted =
                    permit.Status__c == 'Submitted' &&
                    oldPermit != null &&
                    permit.Assigned_Inspector__c !=
                    oldPermit.Assigned_Inspector__c &&
                    permit.Assigned_Inspector__c != null;
            }

            if (becameSubmitted || inspectorChangedOnSubmitted) {
                permitIdsToShare.add(permit.Id);
                processedPermitIds.add(permit.Id);
            }
        }

        if (permitIdsToShare.isEmpty()) {
            return;
        }

        /*
         * Query the permit records so we have OwnerId and
         * Assigned Inspector information available.
         */
        Map<Id, Permit_Application__c> permitMap =
            new Map<Id, Permit_Application__c>(
                [
                    SELECT
                        Id,
                        OwnerId,
                        Name,
                        Status__c,
                        Assigned_Inspector__c
                    FROM Permit_Application__c
                    WHERE Id IN :permitIdsToShare
                ]
            );

        /*
         * Determine the inspectors.
         *
         * If Assigned Inspector exists, use that user.
         * Otherwise, find active users whose role is Inspector.
         */
        Set<Id> inspectorIds = new Set<Id>();

        for (Permit_Application__c permit : permitMap.values()) {

            if (permit.Assigned_Inspector__c != null) {
                inspectorIds.add(
                    permit.Assigned_Inspector__c
                );
            }
        }

        /*
         * If no Inspector was explicitly assigned,
         * find active users in the Inspector role.
         */
        if (inspectorIds.isEmpty()) {

            for (User inspector : [
                SELECT Id
                FROM User
                WHERE IsActive = true
                AND UserRole.Name = 'Inspector'
            ]) {
                inspectorIds.add(inspector.Id);
            }
        }

        if (inspectorIds.isEmpty()) {
            return;
        }

        /*
         * Query existing manual shares so we don't create duplicates.
         */
        Map<String, Boolean> existingShares =
            new Map<String, Boolean>();

        for (Permit_Application__Share share : [
            SELECT
                ParentId,
                UserOrGroupId,
                RowCause
            FROM Permit_Application__Share
            WHERE ParentId IN :permitIdsToShare
            AND UserOrGroupId IN :inspectorIds
            AND RowCause = 'Manual'
        ]) {

            String key =
                String.valueOf(share.ParentId) +
                '-' +
                String.valueOf(share.UserOrGroupId);

            existingShares.put(key, true);
        }

        List<Permit_Application__Share> sharesToCreate =
            new List<Permit_Application__Share>();

        for (Permit_Application__c permit : permitMap.values()) {

            for (Id inspectorId : inspectorIds) {

                /*
                 * Do not create a redundant share to the owner.
                 */
                if (permit.OwnerId == inspectorId) {
                    continue;
                }

                String key =
                    String.valueOf(permit.Id) +
                    '-' +
                    String.valueOf(inspectorId);

                if (existingShares.containsKey(key)) {
                    continue;
                }

                Permit_Application__Share permitShare =
                    new Permit_Application__Share();

                permitShare.ParentId = permit.Id;
                permitShare.UserOrGroupId = inspectorId;
                permitShare.AccessLevel = 'Read';
                permitShare.RowCause =
                    Schema.Permit_Application__Share.RowCause.Manual;

                sharesToCreate.add(permitShare);
            }
        }

        if (!sharesToCreate.isEmpty()) {

            /*
             * Use partial success so one invalid share doesn't
             * prevent all valid shares from being created.
             */
            Database.insert(sharesToCreate, false);
        }
    }
}