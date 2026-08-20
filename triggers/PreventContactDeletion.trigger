trigger PreventContactDeletion on Contact (before delete) {
    for (Contact con : Trigger.old) {
        con.addError('Contact records cannot be deleted.');
    }
}