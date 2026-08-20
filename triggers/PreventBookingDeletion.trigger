trigger PreventBookingDeletion on Booking__c (before delete) {
    for (Booking__c booking : Trigger.old) {
        booking.addError('Booking records cannot be deleted.');
    }
}