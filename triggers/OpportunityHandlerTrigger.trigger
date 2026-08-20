trigger OpportunityHandlerTrigger on Opportunity (before delete) {
    if(trigger.isBefore){
        OpportunityHandler.wonOpp(trigger.old);
    }
}