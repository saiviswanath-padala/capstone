trigger CinemaSubsidyTrigger on Subsidy_Assignment__c (
    before insert,
    before update,
    after insert,
    after update
) {

    if (Trigger.isBefore) {

        CinemaSubsidyTriggerHandler.beforeSave(
            Trigger.new,
            Trigger.oldMap,
            Trigger.isInsert,
            Trigger.isUpdate
        );
    }

    if (Trigger.isAfter) {

        CinemaSubsidyTriggerHandler.afterSave(
            Trigger.new,
            Trigger.oldMap,
            Trigger.isInsert,
            Trigger.isUpdate
        );
    }
}