public without sharing class CinemaInspectionTriggerHandler {

    private static Set<Id> processedInspectionIds =
        new Set<Id>();


    /*
     * BEFORE UPDATE
     *
     * Requirement:
     * Inspection Outcome = Fail
     *       ↓
     * Status = Remediation Required
     */
    public static void beforeUpdate(
        List<Inspection__c> newRecords,
        Map<Id, Inspection__c> oldMap
    ) {

        if (newRecords == null || newRecords.isEmpty()) {
            return;
        }

        for (Inspection__c inspection : newRecords) {

            Inspection__c oldInspection =
                oldMap.get(inspection.Id);

            if (oldInspection == null) {
                continue;
            }

            Boolean newlyFailed =
                inspection.Outcome__c == 'Fail' &&
                oldInspection.Outcome__c != 'Fail';

            if (newlyFailed) {

                inspection.Status__c =
                    'Remediation Required';

                if (inspection.Completed_Date__c == null) {
                    inspection.Completed_Date__c =
                        System.now();
                }
            }
        }
    }


    /*
     * AFTER UPDATE
     *
     * Requirement:
     * Inspection Outcome = Fail
     *       ↓
     * Automatically create PSS Action Plan
     * using Cinema Fire Safety Remediation template.
     */
    public static void afterUpdate(
        List<Inspection__c> newRecords,
        Map<Id, Inspection__c> oldMap
    ) {

        if (newRecords == null || newRecords.isEmpty()) {
            return;
        }

        Set<Id> failedInspectionIds =
            new Set<Id>();

        for (Inspection__c inspection : newRecords) {

            if (processedInspectionIds.contains(inspection.Id)) {
                continue;
            }

            Inspection__c oldInspection =
                oldMap.get(inspection.Id);

            if (oldInspection == null) {
                continue;
            }

            Boolean newlyFailed =
                inspection.Outcome__c == 'Fail' &&
                oldInspection.Outcome__c != 'Fail';

            if (newlyFailed) {

                failedInspectionIds.add(
                    inspection.Id
                );

                processedInspectionIds.add(
                    inspection.Id
                );
            }
        }

        if (failedInspectionIds.isEmpty()) {
            return;
        }

        /*
         * We need the Visit because the PSS Action Plan Template
         * created in Stage 3 targets Visit.
         */
        Map<Id, Inspection__c> inspections = new Map<Id, Inspection__c>(
            [
                SELECT
                    Id,
                    Name,
                    Outcome__c,
                    Status__c,
                    Failure_Reason__c,
                    Findings__c,
                    Inspector__c,
                    Permit_Application__c,
                    Visit__c
                FROM Inspection__c
                WHERE Id IN :failedInspectionIds
            ]
        );

        Set<Id> visitIds = new Set<Id>();

        for (Inspection__c inspection : inspections.values()) {

            if (inspection.Visit__c != null) {
                visitIds.add(inspection.Visit__c);
            }
        }

        if (visitIds.isEmpty()) {
            return;
        }

        /*
         * Find the published Cinema Fire Safety Remediation template.
         */
        List<ActionPlanTemplate> templates = [
            SELECT
                Id,
                Name,
                ActionPlanType,
                TargetEntityType
            FROM ActionPlanTemplate
            WHERE Name = 'Cinema Fire Safety Remediations'
            LIMIT 1
        ];

        if (templates.isEmpty()) {
            return;
        }

        ActionPlanTemplate template = templates[0];

        /*
         * Find the published template version.
         */
        List<ActionPlanTemplateVersion> versions = [
            SELECT
                Id,
                ActionPlanTemplateId,
                Status,
                Version
            FROM ActionPlanTemplateVersion
            WHERE ActionPlanTemplateId = :template.Id
            AND Status = 'Final'
            ORDER BY Version DESC
            LIMIT 1
        ];

        if (versions.isEmpty()) {
            return;
        }

        ActionPlanTemplateVersion templateVersion =
            versions[0];

        /*
         * Prevent duplicate Action Plans for the same Visit
         * using this template version.
         */
        Map<Id, ActionPlan> existingPlansByVisit =
            new Map<Id, ActionPlan>();

        for (ActionPlan plan : [
            SELECT
                Id,
                Name,
                TargetId,
                ActionPlanTemplateVersionId
            FROM ActionPlan
            WHERE TargetId IN :visitIds
            AND ActionPlanTemplateVersionId =
                :templateVersion.Id
        ]) {

            existingPlansByVisit.put(
                plan.TargetId,
                plan
            );
        }

        List<ActionPlan> plansToCreate =
            new List<ActionPlan>();

        for (Inspection__c inspection :
            inspections.values()) {

            if (inspection.Visit__c == null) {
                continue;
            }

            if (
                existingPlansByVisit.containsKey(
                    inspection.Visit__c
                )
            ) {
                continue;
            }

            ActionPlan remediationPlan =
                new ActionPlan();

            remediationPlan.Name =
                'Cinema Fire Safety Remediation - ' +
                inspection.Name;

            remediationPlan.ActionPlanTemplateVersionId =
                templateVersion.Id;

            remediationPlan.ActionPlanType =
                template.ActionPlanType;

            remediationPlan.ActionPlanState =
                'In Progress';

            remediationPlan.StartDate =
                System.today();

            remediationPlan.TargetId =
                inspection.Visit__c;

            plansToCreate.add(remediationPlan);
        }

        if (!plansToCreate.isEmpty()) {

            Database.insert(
                plansToCreate,
                false
            );
        }
    }
}