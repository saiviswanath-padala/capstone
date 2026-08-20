
trigger CinemaPermitTrigger on Permit_Application__c (
    after insert,
    after update
) {
    if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)) {
        CinemaPermitTriggerHandler.handle(
            Trigger.new,
            Trigger.oldMap,
            Trigger.isInsert,
            Trigger.isUpdate
        );
    }
}