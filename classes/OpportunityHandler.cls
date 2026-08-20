public with sharing class OpportunityHandler {
    public static void wonOpp(List<Opportunity>oppRec){
        for(opportunity opp: oppRec){
            if(opp.StageName == 'Closed Won'){
                opp.addError('You cannot delete opporutnity record with the stage as Closed Won');
            }
        }
    }
}