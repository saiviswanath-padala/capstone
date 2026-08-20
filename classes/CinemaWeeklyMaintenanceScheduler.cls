global without sharing class CinemaWeeklyMaintenanceScheduler
    implements Schedulable {

    global void execute(
        SchedulableContext sc
    ) {

        Database.executeBatch(
            new CinemaPermitExpiryBatch(),
            200
        );

        Database.executeBatch(
            new CinemaInspectionArchiveBatch(),
            200
        );
    }
}